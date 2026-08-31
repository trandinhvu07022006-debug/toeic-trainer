import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import { BookOpen, Headphones, Mic, FileText, BarChart3, Clock, Flame, Home, Sun, Moon, Search, NotebookPen } from "lucide-react";

import { useDarkMode, theme } from "./ui/theme.js";
import { useTTS } from "./lib/tts.js";
import * as store from "./lib/storage.js";
import { review, dayKey, streakOf } from "./lib/srs.js";
import { HomeScreen } from "./features/Home.jsx";

/* Lazy-load từng màn: mỗi tab thành một chunk riêng, chỉ tải khi mở.
   Trang đầu nhờ vậy nhẹ hơn nhiều khi đưa lên web. */
const VocabScreen = lazy(() => import("./features/Vocab.jsx").then((m) => ({ default: m.VocabScreen })));
const ListenScreen = lazy(() => import("./features/Listening.jsx").then((m) => ({ default: m.ListenScreen })));
const SpeakScreen = lazy(() => import("./features/Speaking.jsx").then((m) => ({ default: m.SpeakScreen })));
const ReadingScreen = lazy(() => import("./features/Reading.jsx").then((m) => ({ default: m.ReadingScreen })));
const ExamScreen = lazy(() => import("./features/Exam.jsx").then((m) => ({ default: m.ExamScreen })));
const ProgressScreen = lazy(() => import("./features/Progress.jsx").then((m) => ({ default: m.ProgressScreen })));
const DictionaryScreen = lazy(() => import("./features/Dictionary.jsx").then((m) => ({ default: m.DictionaryScreen })));
const MistakeBookScreen = lazy(() => import("./features/MistakeBook.jsx").then((m) => ({ default: m.MistakeBookScreen })));

const TABS = [
  { key: "home", label: "Trang chủ", Icon: Home },
  { key: "vocab", label: "Từ vựng", Icon: BookOpen },
  { key: "listen", label: "Nghe", Icon: Headphones },
  { key: "read", label: "Đọc", Icon: FileText },
  { key: "exam", label: "Thi thử", Icon: Clock },
  { key: "progress", label: "Tiến độ", Icon: BarChart3 },
];

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const T = useMemo(() => theme(dark), [dark]);
  const tts = useTTS();

  const [tab, setTab] = useState("home");
  const [state, setState] = useState(() => store.load());
  const first = useRef(true);

  /* Ghi xuống localStorage sau mỗi thay đổi, bỏ qua lần dựng đầu tiên */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    store.save(state);
  }, [state]);

  /* Dừng đọc khi rời tab */
  useEffect(() => { tts.stop(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => tts.stop(), []);   // eslint-disable-line react-hooks/exhaustive-deps

  const patch = useCallback((fn) => setState((s) => {
    const next = fn(s);
    const today = dayKey();
    const days = next.days.includes(today) ? next.days : [...next.days, today];
    return { ...next, days };
  }), []);

  /* ---- Từ vựng: spaced repetition thật, tính theo ngày ---- */
  const gradeWord = useCallback((id, grade) => patch((s) => ({
    ...s,
    srs: { ...s.srs, [id]: review(s.srs[id], grade) },
    vocabDrill: { done: s.vocabDrill.done + 1, correct: s.vocabDrill.correct + (grade === 2 ? 1 : 0) },
  })), [patch]);

  /* ---- Chấm câu hỏi (id tùy chọn: nếu sai và có id thì lưu vào sổ lỗi) ---- */
  const onAnswer = useCallback((part, ok, id) => patch((s) => {
    let mistakes = s.mistakes || [];
    if (!ok && id && !mistakes.some((m) => m.id === id)) {
      mistakes = [...mistakes, { id, skill: "RC", part, at: Date.now() }];
    } else if (ok && id) {
      mistakes = mistakes.filter((m) => m.id !== id); // làm đúng lại thì xóa khỏi sổ
    }
    return { ...s, stats: { ...s.stats, reading: bump(s.stats.reading, part, ok) }, mistakes };
  }), [patch]);

  const onListenAnswer = useCallback((part, ok, id) => patch((s) => {
    let mistakes = s.mistakes || [];
    if (!ok && id && !mistakes.some((m) => m.id === id)) {
      mistakes = [...mistakes, { id, skill: "LC", part, at: Date.now() }];
    } else if (ok && id) {
      mistakes = mistakes.filter((m) => m.id !== id);
    }
    return { ...s, stats: { ...s.stats, listening: bump(s.stats.listening, part, ok) }, mistakes };
  }), [patch]);

  const onGrammarAnswer = useCallback((gid, ok, id) => patch((s) => {
    const cur = s.grammarStats[gid] || { c: 0, t: 0 };
    let mistakes = s.mistakes || [];
    if (!ok && id && !mistakes.some((m) => m.id === id)) {
      mistakes = [...mistakes, { id, skill: "GR", part: 5, at: Date.now() }];
    } else if (ok && id) {
      mistakes = mistakes.filter((m) => m.id !== id);
    }
    return {
      ...s,
      grammarStats: { ...s.grammarStats, [gid]: { c: cur.c + (ok ? 1 : 0), t: cur.t + 1 } },
      stats: { ...s.stats, reading: bump(s.stats.reading, 5, ok) },
      mistakes,
    };
  }), [patch]);

  const onSpeakScore = useCallback((id, scores) => patch((s) => ({
    ...s, speakScores: { ...s.speakScores, [id]: scores },
  })), [patch]);

  /* ---- Sổ tay lỗi sai: lưu câu làm sai để ôn lại ---- */
  const logMistake = useCallback((id, skill, part) => patch((s) => {
    if (!id || (s.mistakes || []).some((m) => m.id === id)) return s; // không trùng
    return { ...s, mistakes: [...(s.mistakes || []), { id, skill, part, at: Date.now() }] };
  }), [patch]);

  const clearMistake = useCallback((id) => patch((s) => ({
    ...s, mistakes: (s.mistakes || []).filter((m) => m.id !== id),
  })), [patch]);

  const toggleSave = useCallback((id) => patch((s) => ({
    ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
  })), [patch]);

  const onTestDone = useCallback((r) => patch((s) => {
    // Đề full 200 câu: gộp thống kê cả hai kỹ năng và lưu lastResults cho LC, RC, ALL
    if (r.skill === "ALL") {
      const applyParts = (group, res, parts) => {
        let g = group;
        for (const p of parts) g = { ...g, [p]: { c: g[p].c + res.byPart[p].c, t: g[p].t + res.byPart[p].t } };
        return g;
      };
      const listening = applyParts(s.stats.listening, r.lc, [1, 2, 3, 4]);
      const reading = applyParts(s.stats.reading, r.rc, [5, 6, 7]);
      return {
        ...s,
        stats: { ...s.stats, listening, reading },
        lastResults: { ...s.lastResults, LC: r.lc, RC: r.rc, ALL: r },
        history: [...s.history,
        { at: Date.now(), skill: "ALL", score: r.score, correct: r.correct, total: r.total, format: r.formatName }
        ].slice(-50),
      };
    }
    const key = r.skill === "LC" ? "listening" : "reading";
    const parts = r.skill === "LC" ? [1, 2, 3, 4] : [5, 6, 7];
    let group = s.stats[key];
    for (const p of parts) {
      group = { ...group, [p]: { c: group[p].c + r.byPart[p].c, t: group[p].t + r.byPart[p].t } };
    }
    return {
      ...s,
      stats: { ...s.stats, [key]: group },
      lastResults: { ...s.lastResults, [r.skill]: r },
      history: [...s.history, { at: Date.now(), skill: r.skill, score: r.score, correct: r.correct, total: r.total, format: r.formatName }].slice(-50),
    };
  }), [patch]);

  const streak = useMemo(() => streakOf(state.days), [state.days]);

  /* Nhiệm vụ hằng ngày đã xong hôm nay (tự reset khi sang ngày mới) */
  const todayKey = dayKey();
  const doneToday = state.dailyDone && state.dailyDone.date === todayKey ? state.dailyDone.tasks : {};
  const markTaskDone = useCallback((taskId) => patch((s) => {
    const tk = dayKey();
    const cur = s.dailyDone && s.dailyDone.date === tk ? s.dailyDone.tasks : {};
    return { ...s, dailyDone: { date: tk, tasks: { ...cur, [taskId]: true } } };
  }), [patch]);

  const content = (
    <Suspense fallback={<ScreenLoader T={T} />}>
      <div key={tab} className="animate-fade">
        {tab === "home" && (
          <HomeScreen T={T} dark={dark} streak={streak} history={state.history}
            lastResults={state.lastResults} onGo={setTab}
            srs={state.srs} stats={state.stats} doneToday={doneToday}
            mistakeCount={(state.mistakes || []).length}
            onStartTask={(taskId, targetTab) => { markTaskDone(taskId); setTab(targetTab); }} />
        )}
        {tab === "dict" && (
          <DictionaryScreen T={T} dark={dark} tts={tts} onBack={() => setTab("home")} />
        )}
        {tab === "mistakes" && (
          <MistakeBookScreen T={T} dark={dark} tts={tts} mistakes={state.mistakes}
            onClear={clearMistake} onBack={() => setTab("home")} />
        )}
        {tab === "vocab" && (
          <VocabScreen T={T} dark={dark} tts={tts} srs={state.srs} onGrade={gradeWord} />
        )}
        {tab === "listen" && (
          <ListenScreen T={T} dark={dark} tts={tts} stats={state.stats} onAnswer={onListenAnswer} />
        )}
        {tab === "speak" && (
          <SpeakScreen T={T} dark={dark} tts={tts} speakScores={state.speakScores} onScore={onSpeakScore} />
        )}
        {tab === "read" && (
          <ReadingScreen T={T} dark={dark} stats={state.stats} grammarStats={state.grammarStats}
            onAnswer={onAnswer} onGrammarAnswer={onGrammarAnswer}
            saved={state.saved} onToggleSave={toggleSave} />
        )}
        {tab === "exam" && (
          <ExamScreen T={T} dark={dark} tts={tts} onTestDone={onTestDone} lastResults={state.lastResults}
            saved={state.saved} onToggleSave={toggleSave} />
        )}
        {tab === "progress" && (
          <ProgressScreen T={T} dark={dark} stats={state.stats} srs={state.srs} streak={streak}
            vocabDrill={state.vocabDrill} grammarStats={state.grammarStats}
            speakScores={state.speakScores} lastResults={state.lastResults}
            history={state.history} onReset={() => setState(store.reset())} />
        )}
      </div>
    </Suspense>
  );

  return (
    <div className={"min-h-screen w-full " + (dark ? "paper-grain-dark " : "paper-grain ") + T.app}>
      {/* ===== SIDEBAR cho màn hình lớn (máy tính) ===== */}
      <aside className={"hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col border-r z-30 " + T.bar + " " + T.line}>
        <div className="px-5 pt-6 pb-5">
          <Wordmark T={T} />
        </div>

        <nav aria-label="Điều hướng chính" className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {TABS.map((t) => <NavRow key={t.key} t={t} active={tab === t.key} onClick={() => setTab(t.key)} T={T} />)}
          <div className={"my-3 mx-3 border-t " + T.line} />
          <NavRow t={{ key: "dict", label: "Tra từ điển", Icon: Search }} active={tab === "dict"} onClick={() => setTab("dict")} T={T} />
          <NavRow t={{ key: "mistakes", label: "Sổ tay lỗi sai", Icon: NotebookPen }} active={tab === "mistakes"} onClick={() => setTab("mistakes")} T={T} badge={(state.mistakes || []).length} />
        </nav>

        <div className={"px-4 py-4 border-t " + T.line + " flex items-center justify-between"}>
          <StreakChip streak={streak} T={T} />
          <ThemeToggle dark={dark} onToggle={toggleDark} T={T} />
        </div>
      </aside>

      {/* ===== HEADER cho điện thoại (ẩn trên máy tính) ===== */}
      <header className="lg:hidden sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{
          background: dark ? "rgba(20,32,29,0.82)" : "rgba(250,247,240,0.85)",
          borderColor: dark ? "#2c3e39" : "#e7e0d3"
        }}>
        <div className="mx-auto w-full max-w-2xl px-4 py-3 flex items-center justify-between">
          <Wordmark T={T} compact />
          <div className="flex items-center gap-2">
            <StreakChip streak={streak} T={T} compact />
            <ThemeToggle dark={dark} onToggle={toggleDark} T={T} />
          </div>
        </div>
      </header>

      {/* ===== NỘI DUNG: hẹp trên điện thoại, rộng và lệch phải trên máy tính ===== */}
      <div className="lg:pl-64">
        <div className="mx-auto w-full max-w-2xl lg:max-w-4xl px-0 lg:px-10 pb-28 lg:pb-12 lg:pt-6">
          {content}
        </div>
      </div>

      {/* ===== BOTTOM NAV cho điện thoại (ẩn trên máy tính) ===== */}
      <nav aria-label="Điều hướng chính" className="lg:hidden fixed bottom-0 left-0 right-0 z-20 px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)", paddingTop: 8 }}>
        <div className={"mx-auto max-w-[360px] rounded-[28px] border-2 grid grid-cols-6 p-1.5 " + (dark ? "bg-gray-800 border-gray-900" : "bg-white border-gray-100")}
          style={{ boxShadow: dark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 16px 40px rgba(88,204,2,0.18)" }}>
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.Icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} aria-current={active ? "page" : undefined} aria-label={t.label} style={{ minHeight: 56 }}
                className={"relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-colors " + (active ? "bg-accent-tint" : "")}>
                <Icon size={22} className={active ? T.accentText : T.sub} strokeWidth={active ? 2.5 : 2} />
                <span className={"text-[10px] font-bold leading-none " + (active ? T.accentText : T.sub)}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* Chữ hiệu (wordmark): một ô vuông màu nhấn có chữ "T" serif + tên đặt bằng
   font hiển thị. Thay cho icon Sparkles gradient của bản cũ. */
function Wordmark({ T, compact }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex items-center justify-center rounded-lg font-display font-semibold text-white shrink-0"
        style={{
          width: compact ? 32 : 38, height: compact ? 32 : 38, background: "var(--accent)",
          fontSize: compact ? 18 : 21, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.18)"
        }}>T</span>
      <div className="leading-tight">
        <p className={"font-display font-semibold " + (compact ? "text-[15px]" : "text-lg")}>TOEIC Trainer</p>
        <p className={"text-[11px] " + T.sub}>Bạn đồng hành luyện thi</p>
      </div>
    </div>
  );
}

/* Một dòng điều hướng trong sidebar: gạch nhấn bên trái khi đang mở,
   thay cho khối gradient tô kín. */
function NavRow({ t, active, onClick, T, badge }) {
  const Icon = t.Icon;
  return (
    <button onClick={onClick} aria-current={active ? "page" : undefined} style={{ minHeight: 46 }}
      className={"relative w-full flex items-center gap-3 rounded-lg pl-4 pr-3 text-left transition-colors " +
        (active ? T.soft + " " + T.accentText : T.softText + " hover:" + T.soft)}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full" style={{ background: "var(--accent)" }} />}
      <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
      <span className="text-[15px] font-semibold flex-1">{t.label}</span>
      {badge > 0 && (
        <span className="text-[11px] font-bold tnum rounded-full px-1.5 py-0.5 text-white" style={{ background: "var(--amber)" }}>{badge}</span>
      )}
    </button>
  );
}

function StreakChip({ streak, T, compact }) {
  return (
    <div className={"flex items-center gap-1.5 rounded-full px-3 py-1.5 " + T.soft}>
      <Flame size={15} className={streak > 0 ? "text-[#c8791f]" : T.sub} strokeWidth={2.2} />
      <span className="text-sm font-bold tnum">{streak}{compact ? "" : " ngày"}</span>
    </div>
  );
}

function ThemeToggle({ dark, onToggle, T }) {
  return (
    <button onClick={onToggle} aria-label="Đổi nền sáng/tối"
      style={{ minHeight: 40, minWidth: 40 }}
      className={"flex items-center justify-center rounded-full " + T.soft}>
      {dark ? <Sun size={17} className="text-amber-300" /> : <Moon size={17} className="text-[#6b7d76]" />}
    </button>
  );
}

function bump(group, part, ok) {
  const cur = group[part];
  return { ...group, [part]: { c: cur.c + (ok ? 1 : 0), t: cur.t + 1 } };
}

/* Màn chờ hiển thị trong lúc chunk của một tab đang tải (lazy-load) */
function ScreenLoader({ T }) {
  return (
    <div className="px-4 pt-16 flex flex-col items-center justify-center gap-3" style={{ minHeight: "50vh" }}>
      <div className="h-9 w-9 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: "var(--accent)", borderRightColor: "var(--accent-soft)" }} />
      <p className={"text-sm " + T.sub}>Đang tải…</p>
    </div>
  );
}
