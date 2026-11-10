import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import {
  BookOpen,
  Headphones,
  Mic,
  FileText,
  BarChart3,
  Clock,
  Flame,
  Home,
  Sun,
  Moon,
  Search,
  NotebookPen,
  Layers,
  Crown,
  Gem,
  Target,
  Bell,
  Globe,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  Sparkles,
  X,
} from "lucide-react";

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
  { key: "read", label: "Đọc hiểu", Icon: FileText },
  { key: "listen", label: "Nghe", Icon: Headphones },
  { key: "exam", label: "Thi thử", Icon: Clock },
  { key: "progress", label: "Tiến độ", Icon: BarChart3 },
];

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const T = useMemo(() => theme(dark), [dark]);
  const tts = useTTS();

  const [tab, setTab] = useState("home");
  const [showPromoBanner, setShowPromoBanner] = useState(true);
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

  /* ---- Thêm / Xoá từ vào danh sách ôn tập SRS từ bài đọc hoặc tra từ điển ---- */
  const saveWordToSRS = useCallback((id) => patch((s) => {
    if (!id) return s;
    const cur = s.srs || {};
    if (cur[id]) return s;
    return {
      ...s,
      srs: {
        ...cur,
        [id]: { box: 0, due: Date.now(), seen: 0, right: 0, fromReading: true, addedAt: Date.now() },
      },
    };
  }), [patch]);

  const removeWordFromSRS = useCallback((id) => patch((s) => {
    if (!id || !s.srs || !s.srs[id]) return s;
    const nextSrs = { ...s.srs };
    delete nextSrs[id];
    return { ...s, srs: nextSrs };
  }), [patch]);

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
  const dueCount = useMemo(
    () => Object.values(state.srs || {}).filter((c) => c && c.due <= Date.now()).length,
    [state.srs]
  );

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
          <DictionaryScreen T={T} dark={dark} tts={tts} onBack={() => setTab("home")}
            srs={state.srs} onSaveWord={saveWordToSRS} onRemoveWord={removeWordFromSRS} />
        )}
        {tab === "mistakes" && (
          <MistakeBookScreen T={T} dark={dark} tts={tts} mistakes={state.mistakes}
            onClear={clearMistake} onBack={() => setTab("home")} />
        )}
        {tab === "vocab" && (
          <VocabScreen T={T} dark={dark} tts={tts} srs={state.srs} onGrade={gradeWord} />
        )}
        {tab === "read" && (
          <ReadingScreen T={T} dark={dark} stats={state.stats} grammarStats={state.grammarStats}
            onAnswer={onAnswer} onGrammarAnswer={onGrammarAnswer}
            saved={state.saved} onToggleSave={toggleSave}
            srs={state.srs} onSaveWord={saveWordToSRS} onRemoveWord={removeWordFromSRS}
            tts={tts} />
        )}
        {tab === "listen" && (
          <ListenScreen T={T} dark={dark} tts={tts} stats={state.stats} onAnswer={onListenAnswer} />
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

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={"min-h-screen w-full " + (dark ? "bg-[#0b0f15] text-[#f8fafc] " : "bg-[#f8fafc] text-[#0f172a] ") + T.app}>
      {/* ===== SIDEBAR CHUẨN PARROTO (THEO TONE MÀU LOGO KMG) ===== */}
      <aside
        className={
          "hidden lg:flex fixed top-0 left-0 bottom-0 flex-col border-r z-30 transition-all duration-300 " +
          (collapsed ? "w-20 " : "w-64 ") +
          (dark ? "bg-[#0c1017] border-[#1d2636]" : "bg-white border-gray-200")
        }
      >
        {/* Logo & Brand Header */}
        <div className={"px-4 pt-5 pb-4 border-b flex items-center justify-between " + (dark ? "border-white/5" : "border-gray-100")}>
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setTab("home")}>
            <img
              src="/kmg_logo.jpg"
              alt="KMG Logo"
              className="h-10 w-10 rounded-xl object-contain shadow-md bg-black border border-white/10 shrink-0"
            />
            {!collapsed && (
              <div className="leading-tight truncate">
                <p className="font-extrabold text-base tracking-wide text-white">KMG CLUB</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">English Training</p>
              </div>
            )}
          </div>
        </div>

        {/* Danh mục menu chính */}
        <nav aria-label="Điều hướng chính" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <NavRow t={{ key: "home", label: "Trang chủ", Icon: Home }} active={tab === "home"} onClick={() => setTab("home")} T={T} collapsed={collapsed} />
          <NavRow t={{ key: "topics", label: "Chủ đề", Icon: Layers }} active={tab === "vocab"} onClick={() => setTab("vocab")} T={T} collapsed={collapsed} />
          <NavRow t={{ key: "listen", label: "Luyện nghe", Icon: Headphones }} active={tab === "listen"} onClick={() => setTab("listen")} T={T} collapsed={collapsed} />
          <NavRow t={{ key: "read", label: "Đọc hiểu", Icon: FileText }} active={tab === "read"} onClick={() => setTab("read")} T={T} collapsed={collapsed} />
          <NavRow
            t={{ key: "vocab", label: "Từ vựng", Icon: BookOpen }}
            active={tab === "vocab"}
            onClick={() => setTab("vocab")}
            T={T}
            collapsed={collapsed}
            badge="100"
            badgeColor="accent"
          />

          {/* NÚT MỞ KHÓA PRO PARROTO (RED GRADIENT KMG) */}
          <div className="pt-3 pb-2">
            {!collapsed ? (
              <button
                onClick={() => setTab("exam")}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <Crown size={16} className="text-amber-200" />
                <span>MỞ KHÓA PRO</span>
              </button>
            ) : (
              <button
                onClick={() => setTab("exam")}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md active:scale-95"
                title="MỞ KHÓA PRO"
              >
                <Crown size={18} className="text-amber-200" />
              </button>
            )}
          </div>

          <div className={"my-2 border-t " + (dark ? "border-white/5" : "border-gray-100")} />

          {/* Các mục bổ trợ phía dưới */}
          <NavRow t={{ key: "saved", label: "Ghi chú của tôi", Icon: BookmarkCheck }} active={tab === "saved"} onClick={() => setTab("read")} T={T} collapsed={collapsed} />
          <NavRow t={{ key: "dict", label: "Từ vựng của tôi", Icon: Sparkles }} active={tab === "dict"} onClick={() => setTab("dict")} T={T} collapsed={collapsed} />
          <NavRow t={{ key: "mistakes", label: "Sổ tay lỗi sai", Icon: NotebookPen }} active={tab === "mistakes"} onClick={() => setTab("mistakes")} T={T} collapsed={collapsed} badge={(state.mistakes || []).length || null} badgeColor="amber" />
          <NavRow t={{ key: "logout", label: "Đăng xuất", Icon: LogOut }} active={false} onClick={() => setState(store.reset())} T={T} collapsed={collapsed} isDanger={true} />
        </nav>

        {/* User Profile Card ở chân Sidebar */}
        <div className={"p-3 border-t " + (dark ? "border-white/5 bg-[#0a0d14]" : "border-gray-100 bg-gray-50")}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/kmg_logo.jpg"
                  alt="Avatar"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-accent"
                />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-accent text-white rounded-full px-1 py-0.2 leading-none">
                  Lv.2
                </span>
              </div>
              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-bold truncate">Vũ Trần Đình</p>
                  <p className={"text-[10px] " + T.sub}>Hồ sơ học viên</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={() => setTab("progress")}
                aria-label="Cài đặt"
                className={"p-1.5 rounded-lg hover:bg-white/10 transition-colors " + T.sub}
              >
                <Settings size={15} />
              </button>
            )}
          </div>

          {/* Nút thu gọn / mở rộng Sidebar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={"w-full mt-2.5 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-opacity " + T.sub}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            <span>{!collapsed && "Thu gọn"}</span>
          </button>
        </div>
      </aside>

      {/* ===== HEADER DÀNH CHO ĐIỆN THOẠI ===== */}
      <header
        className={"lg:hidden sticky top-0 z-20 border-b backdrop-blur-2xl " + (dark ? "bg-[#0b0f15]/90 border-white/10" : "bg-white/90 border-gray-200")}
      >
        <div className="mx-auto w-full max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setTab("home")}>
            <img src="/kmg_logo.jpg" alt="Logo" className="h-8 w-8 rounded-lg object-contain bg-black border border-white/10" />
            <span className="font-extrabold text-sm tracking-wide">KMG TOEIC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={"flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold " + T.soft}>
              <Flame size={14} className="text-amber-500" />
              <span>{streak}</span>
            </div>
            <ThemeToggle dark={dark} onToggle={toggleDark} T={T} />
          </div>
        </div>
      </header>

      {/* ===== VÙNG NỘI DUNG CHÍNH (CÓ TOP BAR CHUẨN PARROTO) ===== */}
      <div className={"transition-all duration-300 " + (collapsed ? "lg:pl-20" : "lg:pl-64")}>
        {/* BANNER THÔNG BÁO PARROTO (TÔNG MÀU ĐỎ KMG) */}
        {showPromoBanner && (
          <div
            className={
              "border-b px-4 sm:px-6 py-2 flex items-center justify-between text-xs transition-all " +
              (dark
                ? "bg-gradient-to-r from-red-950/70 via-[#150a0e] to-[#0c1017] border-red-500/20 text-white"
                : "bg-gradient-to-r from-red-50 via-rose-50 to-white border-red-200 text-gray-800")
            }
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/kmg_logo.jpg"
                alt="KMG"
                className="h-6 w-6 rounded-lg object-contain bg-black border border-white/10 shrink-0"
              />
              <p className="font-medium truncate">
                <span className="font-extrabold text-accent">KMG TOEIC:</span> Ôn luyện chuyên sâu 4.500 từ vựng và bài đọc hiểu Part 5, 6, 7
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setTab("vocab")}
                className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Học từ vựng
              </button>
              <button
                onClick={() => setTab("read")}
                className={
                  "hidden md:inline-flex px-3 py-1 rounded-full font-bold text-[11px] border transition-all " +
                  (dark ? "bg-white/10 border-white/15 text-white hover:bg-white/20" : "bg-gray-100 border-gray-300 text-gray-800")
                }
              >
                Đọc hiểu Part 7
              </button>
              <button
                onClick={() => setShowPromoBanner(false)}
                className={"p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity ml-1 " + T.sub}
                aria-label="Đóng thông báo"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* PARROTO TOP BAR TRÊN DESKTOP */}
        <header
          className={
            "hidden lg:flex sticky top-0 z-20 h-16 items-center justify-between px-6 sm:px-8 border-b backdrop-blur-xl " +
            (dark ? "bg-[#0b0f15]/85 border-[#1d2636]" : "bg-white/85 border-gray-200")
          }
        >
          {/* Vùng bên trái: Ô tìm kiếm + Link cộng đồng */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTab("dict")}
              style={{ minHeight: 38 }}
              className={
                "flex items-center gap-2.5 px-4 rounded-full border text-xs font-semibold transition-all " +
                (dark
                  ? "bg-[#141923] hover:bg-[#1a212f] border-[#222b3d] text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700")
              }
            >
              <Search size={14} className={T.sub} />
              <span>Tra từ điển</span>
            </button>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{ minHeight: 38 }}
              className="flex items-center gap-1.5 px-3.5 rounded-full bg-[#1877f2]/15 text-[#1877f2] hover:bg-[#1877f2]/25 border border-[#1877f2]/30 text-xs font-bold transition-all"
            >
              <span className="font-black text-sm leading-none">f</span>
              <span>Facebook Community</span>
            </a>
          </div>

          {/* Vùng bên phải: Cài đặt, Dark mode, Cờ ngôn ngữ, Chuông, Kim cương, Mục tiêu, PRO, Lửa streak */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTab("progress")}
              aria-label="Cài đặt"
              className={"p-2 rounded-full transition-colors " + T.soft + " " + T.sub}
            >
              <Settings size={16} />
            </button>

            <ThemeToggle dark={dark} onToggle={toggleDark} T={T} />

            {/* Ngôn ngữ */}
            <div className={"flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border " + T.soft + " " + T.line}>
              <span>🇻🇳</span>
              <span className="hidden xl:inline text-[11px]">Tiếng Việt</span>
            </div>

            {/* Chuông thông báo */}
            <button
              aria-label="Thông báo"
              className={"relative p-2 rounded-full transition-colors " + T.soft + " " + T.sub}
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-[#0b0f15]" />
            </button>

            {/* Kim cương (Diamonds) */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Gem size={14} />
              <span className="tnum">268</span>
            </div>

            {/* Mục tiêu ngày (Coins / Target) */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Target size={14} />
              <span className="tnum">0/3</span>
            </div>

            {/* Badge PRO (KMG Red / Crimson Gradient) */}
            <button
              onClick={() => setTab("exam")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md shadow-red-600/30 active:scale-95 transition-all"
            >
              <Crown size={13} className="text-amber-200" />
              <span>PRO</span>
            </button>

            {/* Lửa Streak */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Flame size={15} />
              <span className="tnum">{streak}</span>
            </div>
          </div>
        </header>

        {/* Nội dung từng màn hình */}
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pb-28 lg:pb-12 pt-4">
          {content}
        </div>
      </div>

      {/* ===== BOTTOM NAV CHO ĐIỆN THOẠI (FLOATING BAR) ===== */}
      <nav aria-label="Điều hướng di động" className="lg:hidden fixed bottom-0 left-0 right-0 z-20 px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)", paddingTop: 8 }}
      >
        <div
          className={
            "mx-auto max-w-[380px] rounded-[24px] grid grid-cols-5 p-1.5 backdrop-blur-xl border shadow-xl " +
            (dark ? "bg-[#0c1017]/95 border-white/10" : "bg-white/90 border-gray-200")
          }
          style={{ boxShadow: dark ? "0 10px 40px rgba(0,0,0,0.8)" : "0 10px 30px rgba(0,0,0,0.1)" }}
        >
          {[
            { key: "home", label: "Trang chủ", Icon: Home },
            { key: "vocab", label: "Từ vựng", Icon: BookOpen, badge: "100" },
            { key: "read", label: "Đọc hiểu", Icon: FileText },
            { key: "dict", label: "Tra từ", Icon: Search },
            { key: "mistakes", label: "Sổ lỗi", Icon: NotebookPen, badge: (state.mistakes || []).length || null },
          ].map((t) => {
            const active = tab === t.key;
            const Icon = t.Icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-current={active ? "page" : undefined}
                aria-label={t.label}
                style={{ minHeight: 52 }}
                className={
                  "relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-[18px] transition-all " +
                  (active
                    ? dark
                      ? "bg-white/15 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] text-accent"
                      : "bg-black text-white"
                    : "hover:bg-white/5")
                }
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={active ? (dark ? T.accentText : "text-white") : T.sub}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {t.badge && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center bg-accent text-white leading-none">
                      {t.badge}
                    </span>
                  )}
                </div>
                <span
                  className={
                    "text-[10px] font-semibold mt-0.5 leading-none " +
                    (active ? (dark ? T.accentText : "text-white") : T.sub)
                  }
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* Chữ hiệu (wordmark): Hiện đại, chuẩn trọng tâm Từ vựng & Đọc hiểu */
function Wordmark({ T, compact }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-accent to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-accent/25 shrink-0">
        <BookOpen size={20} />
      </div>
      <div className="leading-tight min-w-0">
        <p className={"font-display tracking-wider font-bold " + (compact ? "text-base" : "text-lg")}>
          TOEIC MASTER
        </p>
        <p className={"text-[10px] font-bold uppercase tracking-widest text-accent"}>
          Vocab & Reading Hub
        </p>
      </div>
    </div>
  );
}

/* Một dòng điều hướng trong sidebar */
function NavRow({ t, active, onClick, T, badge, badgeColor, isDanger }) {
  const Icon = t.Icon;
  const badgeCls =
    badgeColor === "accent"
      ? "bg-accent text-white"
      : badgeColor === "amber"
      ? "bg-amber-500 text-white"
      : T.soft + " " + T.sub;

  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={{ minHeight: 44 }}
      className={
        "relative w-full flex items-center gap-3 rounded-xl px-3.5 text-left transition-all " +
        (active
          ? "bg-accent/15 text-accent font-bold shadow-sm"
          : isDanger
          ? "text-red-500 hover:text-red-400 hover:bg-red-500/10 font-medium"
          : T.softText + " hover:" + T.soft + " font-medium")
      }
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-accent" />
      )}
      <Icon
        size={18}
        strokeWidth={active ? 2.4 : 1.8}
        className={active ? "text-accent" : isDanger ? "text-red-500" : T.sub}
      />
      <span className="text-[14px] flex-1 truncate">{t.label}</span>
      {badge && (
        <span className={"text-[11px] font-bold tnum rounded-full px-2 py-0.5 " + badgeCls}>
          {badge}
        </span>
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
