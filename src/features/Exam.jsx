import React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, FileText, Grid3x3, Headphones, Lightbulb, RefreshCw, Trophy, Volume2 } from "lucide-react";
import { ALL_Q, GRAMMAR, PACE_GUIDE, PASSAGE_BY_ID } from "../data/reading.js";
import { LISTEN_P1, LISTEN_P2, LISTEN_P3, LISTEN_P4 } from "../data/listening.js";
import { LETTERS } from "../lib/utils.js";
import { estimateLC, estimateRC, cefrOf, mmss, pct } from "../lib/scoring.js";
import { buildListeningExam, buildTest, examQuestionCount, unitQuestionCount } from "../lib/exam.js";
import { Bar, Ghost, Primary, SectionTitle, PageHeader, ChoiceBadge } from "../ui/index.jsx";
import { SceneArt } from "../ui/art.jsx";
import { PassageBox, QuestionCard } from "./Reading.jsx";
import { MarkedLine } from "./Listening.jsx";

/* ═══════════════════════════════════════════════════════════════════
   9. THI THỬ — tách theo kỹ năng và mức độ
   ═══════════════════════════════════════════════════════════════════ */

/* Số câu Part 3 và Part 4 còn thiếu để mở khoá đề Full Listening */
export const LC_FULL_NEED = { p3: 13 - LISTEN_P3.length, p4: 10 - LISTEN_P4.length };
/* Đủ dữ liệu Part 3 và Part 4 thì mở khoá đề Full Listening và Full test */
export const LC_FULL_READY = LC_FULL_NEED.p3 <= 0 && LC_FULL_NEED.p4 <= 0;

export const EXAM_FORMATS = [
  /* ---- Listening ---- */
  { key: "lc-mini", skill: "LC", level: "Khởi động", name: "Mini Listening", minutes: 10,
    note: "Chạy một mạch, không nghe lại — làm quen áp lực phòng thi.",
    spec: { p1: 3, p2: 8, p3: 2, p4: 1 } },
  { key: "lc-half", skill: "LC", level: "Trung bình", name: "Nửa đề Listening", minutes: 20,
    note: "Đủ cả bốn part, dùng trọn ngân hàng Part 3 và Part 4 hiện có.",
    spec: { p1: 6, p2: 16, p3: 3, p4: 3 } },
  { key: "lc-full", skill: "LC", level: "Chuẩn đề thật", name: "Full Listening 100 câu", minutes: 45,
    note: LC_FULL_READY
      ? "Đúng cấu trúc và thời gian phòng thi: 6 + 25 + 39 + 30."
      : "Cần thêm " + LC_FULL_NEED.p3 + " đoạn Part 3 và " + LC_FULL_NEED.p4 + " bài Part 4 trong ngân hàng.",
    locked: !LC_FULL_READY, spec: { p1: 6, p2: 25, p3: 13, p4: 10 } },
  /* ---- Reading ---- */
  { key: "rc-mini", skill: "RC", level: "Khởi động", name: "Mini Reading", minutes: 30,
    note: "40 câu, đủ để kiểm tra tốc độ Part 5.",
    spec: { p5: 16, p6: 8, p7: { single: 16, double: 0, triple: 0 } } },
  { key: "rc-half", skill: "RC", level: "Trung bình", name: "Nửa đề Reading", minutes: 38,
    note: "Có đủ single, double và triple passage.",
    spec: { p5: 16, p6: 8, p7: { single: 16, double: 5, triple: 5 } } },
  { key: "rc-full", skill: "RC", level: "Chuẩn đề thật", name: "Full Reading 100 câu", minutes: 75,
    note: "Đúng cấu trúc và thời gian phòng thi: 30 + 16 + 54.",
    spec: { p5: 30, p6: 16, p7: { single: 24, double: 15, triple: 15 } } },
  /* ---- Full test ---- */
  { key: "full", skill: "ALL", level: "Chuẩn đề thật", name: "Full test 200 câu", minutes: 120,
    note: LC_FULL_READY
      ? "Chạy liền mạch: Listening 45 phút, rồi Reading 75 phút. Điểm tổng kèm bậc CEFR."
      : "Mở khoá cùng lúc với đề Full Listening.",
    locked: !LC_FULL_READY, spec: null },
];

export const SKILL_TABS = [
  { key: "LC", label: "Nghe", Icon: Headphones },
  { key: "RC", label: "Đọc", Icon: FileText },
  { key: "ALL", label: "Full", Icon: Trophy },
];

/* ---------- Bài thi Listening ---------- */
export function ListeningTest({ T, dark, tts, units, minutes, onExit, onFinish }) {
  const total = examQuestionCount(units);
  const [ui, setUi] = useState(0);
  const [phase, setPhase] = useState("play");
  const [wait, setWait] = useState(0);
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(minutes * 60);
  const [confirm, setConfirm] = useState(false);
  const unit = units[ui];
  const noAudio = !tts.supported || !tts.hasEnVoice;

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const ansRef = useRef(answers);
  ansRef.current = answers;
  const leftRef = useRef(left);
  leftRef.current = left;

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  /* đồng hồ tổng */
  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { clearInterval(t); finishRef.current(ansRef.current, minutes * 60); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [minutes]);

  const answerWindow = unit.kind === "single" ? 6 : unit.item.questions.length * 8;

  /* phát audio của unit hiện tại */
  useEffect(() => {
    tts.stop();
    if (noAudio) { setPhase("answer"); setWait(answerWindow); return; }
    setPhase("play");
    const items = unit.kind === "single"
      ? (unit.part === 1
        ? unit.item.options.map((o, n) => ({ text: LETTERS[n] + ". " + o, gap: 500 }))
        : [{ text: unit.item.q, gap: 800 }].concat(unit.item.options.map((o, n) => ({ text: LETTERS[n] + ". " + o, gap: 500 }))))
      : unit.item.lines.map((l) => ({ text: l.en, v: unit.part === 3 ? l.sp : 0, gap: 350 }));
    tts.speakMany(items, 1, { onDone: () => { setPhase("answer"); setWait(answerWindow); } });
  }, [ui]); // eslint-disable-line react-hooks/exhaustive-deps

  /* cửa sổ trả lời rồi tự sang unit sau */
  useEffect(() => {
    if (phase !== "answer") return;
    if (wait <= 0) { advance(); return; }
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    tts.stop();
    if (ui + 1 >= units.length) { onFinish(ansRef.current, minutes * 60 - leftRef.current); return; }
    setUi(ui + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };
  const pick = (qid, idx) => setAnswers((a) => Object.assign({}, a, { [qid]: idx }));

  const answered = Object.keys(answers).length;
  const doneBefore = units.slice(0, ui).reduce((n, u) => n + unitQuestionCount(u), 0);

  const optButtons = (qid, count) => (
    <div className={"grid gap-2 " + (count === 4 ? "grid-cols-4" : "grid-cols-3")}>
      {LETTERS.slice(0, count).map((L, n) => (
        <button key={L} onClick={() => pick(qid, n)} style={{ minHeight: 60 }}
          className={"rounded-2xl border text-xl font-bold transition-colors " +
            (answers[qid] === n ? "bg-accent text-white border-accent" : T.card + " " + T.line)}>{L}</button>
      ))}
    </div>
  );

  return (
    <div className="px-4 pt-4">
      <div className={"flex items-center justify-between rounded-2xl border px-4 py-3 mb-4 " + T.card + " " + T.line}>
        <button onClick={() => setConfirm(true)} className={"text-base font-medium " + T.sub}>Thoát</button>
        <span className={"flex items-center gap-2 text-lg font-bold " + (left < 120 ? T.noText : "")}>
          <Clock size={18} /> {mmss(left)}
        </span>
        <span className={"text-base font-medium " + T.accentText}>{answered}/{total}</span>
      </div>
      <div className="mb-4"><Bar value={(doneBefore / total) * 100} T={T} /></div>

      <div className={"rounded-2xl border p-3 mb-4 flex items-center gap-3 " + T.card + " " + T.line}>
        <span className={"h-3 w-3 rounded-full " + (phase === "play" ? "bg-rose-500" : T.track)} />
        <span className={"text-base flex-1 " + T.softText}>
          {noAudio ? "Không có giọng đọc — đọc transcript bên dưới"
            : phase === "play" ? "Đang phát Part " + unit.part + " — audio chỉ chạy một lần"
              : "Thời gian trả lời: " + wait + "s"}
        </span>
        <span className={"text-xs px-2 py-1 rounded-full " + T.accentSoft}>Part {unit.part}</span>
      </div>

      <div key={unit.item.id} className="animate-fade">
        {unit.part === 1 && (
          <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
            <SceneArt name={unit.item.scene} dark={dark} />
          </div>
        )}

        {noAudio && unit.kind === "single" && (
          <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
            {unit.part === 2 && <p className="text-base font-semibold mb-2">{unit.item.q}</p>}
            {unit.item.options.map((o, n) => (
              <p key={n} className={"text-base mb-1 " + T.softText}>{LETTERS[n]}. {o}</p>
            ))}
          </div>
        )}
        {noAudio && unit.kind === "talk" && (
          <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
            {unit.item.lines.map((l, n) => <p key={n} className="text-base mb-2">{l.en}</p>)}
          </div>
        )}

        {unit.kind === "single" ? (
          <div className="mb-4">{optButtons(unit.item.id, unit.item.options.length)}</div>
        ) : (
          <div className="space-y-5 mb-4">
            {unit.item.questions.map((q, n) => (
              <div key={q.id}>
                <p className="text-base font-medium leading-relaxed mb-2">
                  <span className={"font-bold mr-2 " + T.accentText}>{n + 1}.</span>{q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((o, m) => (
                    <button key={m} onClick={() => pick(q.id, m)} style={{ minHeight: 52 }}
                      className={"w-full text-left rounded-xl border px-3.5 py-3 flex items-center gap-3 transition-all hover:shadow-sm active:scale-[0.995] " +
                        (answers[q.id] === m ? "bg-accent-tint border-accent" : T.card + " " + T.line)}>
                      <ChoiceBadge letter={LETTERS[m]} state={answers[q.id] === m ? "chosen" : "default"} T={T} />
                      <span className="text-[15px] flex-1">{o}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Ghost onClick={advance} T={T}>{ui + 1 >= units.length ? "Nộp bài" : "Sang câu sau"}</Ghost>
          <Ghost onClick={() => setConfirm(true)} T={T}>Nộp bài luôn</Ghost>
        </div>
        <p className={"text-sm text-center mb-4 " + T.sub}>
          Như phòng thi thật: audio phát một lần, không quay lại câu trước.
        </p>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4">
          <div className={"w-full max-w-sm rounded-2xl p-5 mb-4 " + T.card}>
            <p className="text-lg font-bold mb-2">Nộp bài bây giờ?</p>
            <p className={"text-base mb-5 " + T.sub}>Bạn đã trả lời {answered}/{total} câu. Câu bỏ trống tính là sai.</p>
            <div className="space-y-2">
              <Primary onClick={() => onFinish(answers, minutes * 60 - left)}>Nộp bài</Primary>
              <Ghost onClick={() => setConfirm(false)} T={T} className="w-full">Quay lại làm tiếp</Ghost>
              <button onClick={onExit} style={{ minHeight: 48 }} className={"w-full text-base " + T.sub}>Huỷ bài thi này</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Kết quả bài thi Listening ---------- */
export function ListeningResult({ T, dark, tts, result, units, onBack, onRetry }) {
  const [open, setOpen] = useState(null);
  const flat = [];
  units.forEach((u) => {
    if (u.kind === "single") flat.push({ q: u.item, part: u.part, unit: u, single: true });
    else u.item.questions.forEach((q) => flat.push({ q: q, part: u.part, unit: u, single: false }));
  });
  const wrong = flat.filter((f) => result.answers[f.q.id] !== (f.single ? f.q.ans : f.q.ans));

  return (
    <div className="px-4 pt-4">
      <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
        <Trophy className={"mx-auto mb-3 " + T.accentText} size={36} />
        <p className={"text-sm uppercase tracking-wide font-semibold mb-1 " + T.sub}>Điểm Listening ước lượng</p>
        <p className="font-display text-5xl font-semibold tnum mb-2">{result.score}</p>
        <p className={"text-base " + T.sub}>Đúng {result.correct}/{result.total} câu · {pct(result.correct, result.total)}%</p>
        <p className={"text-sm mt-2 " + T.sub}>{result.formatName} · dùng {mmss(result.usedSec)}</p>
        <p className={"text-sm mt-3 pt-3 border-t " + T.line + " " + T.sub}>
          Điểm ước lượng. ETS quy đổi riêng cho từng đề và không công bố bảng, nên con số thật có thể lệch vài chục điểm.
        </p>
      </div>

      <SectionTitle T={T}>Kết quả theo Part</SectionTitle>
      <div className="space-y-3 mb-5">
        {[1, 2, 3, 4].map((p) => {
          const s = result.byPart[p];
          if (!s || !s.t) return null;
          return (
            <div key={p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-base font-semibold">Part {p}</span>
                <span className={"text-base " + T.sub}>{s.c}/{s.t} · {pct(s.c, s.t)}%</span>
              </div>
              <Bar value={pct(s.c, s.t)} T={T} />
            </div>
          );
        })}
      </div>

      <SectionTitle T={T}>Câu sai ({wrong.length}) — mở ra có transcript</SectionTitle>
      <div className="space-y-2 mb-5">
        {wrong.map((f, n) => {
          const isOpen = open === n;
          const label = f.single ? (f.part === 1 ? f.q.caption : f.q.q) : f.q.text;
          return (
            <div key={f.q.id} className={"rounded-2xl border " + T.card + " " + T.line}>
              <button onClick={() => setOpen(isOpen ? null : n)} style={{ minHeight: 52 }} className="w-full text-left px-4 py-3 flex items-center gap-3">
                <span className={"text-xs font-semibold px-2 py-1 rounded-full shrink-0 " + T.accentSoft}>P{f.part}</span>
                <span className="text-base flex-1">{label.length > 46 ? label.slice(0, 46) + "…" : label}</span>
                <ChevronRight size={18} className={"shrink-0 transition-transform " + (isOpen ? "rotate-90" : "")} />
              </button>
              {isOpen && (
                <div className={"px-4 pb-4 border-t pt-3 " + T.line}>
                  {f.part === 2 && <p className="text-base font-semibold mb-2">{f.q.q}</p>}
                  {!f.single && <p className="text-base font-semibold mb-2">{f.q.text}</p>}
                  {f.q.options.map((o, m) => (
                    <p key={m} className={"text-base mb-1 " + (m === f.q.ans ? "font-semibold " + T.okText : (result.answers[f.q.id] === m ? T.noText : T.softText))}>
                      {LETTERS[m]}. {o}
                    </p>
                  ))}
                  <div className={"rounded-2xl p-3 mt-3 mb-3 " + T.soft}>
                    <p className={"text-base leading-relaxed " + T.softText}>{f.q.exp}</p>
                  </div>
                  {!f.single && (
                    <div className={"rounded-2xl p-3 mb-3 " + T.soft}>
                      <p className={"text-xs font-semibold uppercase tracking-wide mb-2 " + T.sub}>Transcript</p>
                      {f.unit.item.lines.map((l, m) => (
                        <div key={m} className="mb-2">
                          <p className="text-base leading-relaxed"><MarkedLine text={l.en} hard={l.hard} dark={dark} /></p>
                          <p className={"text-sm " + T.sub}>{l.vi}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Ghost onClick={() => tts.speak(f.single ? (f.part === 2 ? f.q.q : f.q.options[f.q.ans]) : f.unit.item.lines.map((l) => l.en).join(" "), 0.85)} T={T} className="w-full">
                    <span className="flex items-center justify-center gap-2"><Volume2 size={16} /> Nghe lại</span>
                  </Ghost>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mb-4">
        <Primary onClick={onRetry}><span className="flex items-center justify-center gap-2"><RefreshCw size={18} /> Thi đề mới</span></Primary>
        <Ghost onClick={onBack} T={T} className="w-full">Về danh sách đề</Ghost>
      </div>
    </div>
  );
}

export function TestScreen({ T, dark, questions, minutes, onExit, onFinish }) {
  const total = questions.length;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState(() => new Array(total).fill(null));
  const [left, setLeft] = useState(minutes * 60);
  const [showGrid, setShowGrid] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { clearInterval(t); finishRef.current(answersRef.current, minutes * 60); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const q = questions[i];
  const passage = q.passageId ? PASSAGE_BY_ID[q.passageId] : null;
  const prevSame = i > 0 && questions[i - 1].passageId === q.passageId;
  const answered = answers.filter((a) => a !== null).length;

  const pick = (idx) => setAnswers((a) => { const n = a.slice(); n[i] = idx; return n; });
  const go = (n) => {
    setI(Math.max(0, Math.min(total - 1, n)));
    setShowGrid(false);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };

  return (
    <div className="px-4 pt-4">
      <div className={"flex items-center justify-between rounded-2xl border px-4 py-3 mb-4 " + T.card + " " + T.line}>
        <button onClick={() => setConfirm(true)} className={"text-base font-medium " + T.sub}>Thoát</button>
        <span className={"flex items-center gap-2 text-lg font-bold " + (left < 300 ? T.noText : "")}>
          <Clock size={18} /> {mmss(left)}
        </span>
        <button onClick={() => setShowGrid((g) => !g)} style={{ minHeight: 44 }} className={"flex items-center gap-1 text-base font-medium " + T.accentText}>
          <Grid3x3 size={18} /> {answered}/{total}
        </button>
      </div>

      <div className="mb-4"><Bar value={((i + 1) / total) * 100} T={T} /></div>

      {showGrid && (
        <div className={"rounded-2xl border p-3 mb-4 " + T.card + " " + T.line}>
          <div className="grid grid-cols-8 gap-2">
            {questions.map((tq, n) => (
              <button key={tq.id + "-" + n} onClick={() => go(n)} style={{ minHeight: 40 }}
                className={"rounded-lg text-sm font-semibold " +
                  (n === i ? "bg-accent text-white" : answers[n] !== null ? T.accentSoft : T.soft + " " + T.sub)}>
                {n + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {passage && <PassageBox key={passage.id + "-" + i} passage={passage} T={T} defaultOpen={!prevSame} />}

      <QuestionCard q={q} index={i} total={total} chosen={answers[i]} reveal={false} onPick={pick} T={T} dark={dark} showSave={false} />

      <div className="grid grid-cols-2 gap-2 mt-5 mb-3">
        <Ghost onClick={() => go(i - 1)} T={T} className="flex items-center justify-center gap-1">
          <ChevronLeft size={18} /> Câu trước
        </Ghost>
        <Ghost onClick={() => go(i + 1)} T={T} className="flex items-center justify-center gap-1">
          Câu sau <ChevronRight size={18} />
        </Ghost>
      </div>
      <div className="mb-4"><Primary onClick={() => setConfirm(true)}>Nộp bài</Primary></div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4">
          <div className={"w-full max-w-sm rounded-2xl p-5 mb-4 " + T.card}>
            <p className="text-lg font-bold mb-2">Nộp bài bây giờ?</p>
            <p className={"text-base mb-5 " + T.sub}>
              Bạn đã trả lời {answered}/{total} câu. Câu bỏ trống tính là sai — trong phòng thi thật, hãy luôn tô hết mọi ô.
            </p>
            <div className="space-y-2">
              <Primary onClick={() => onFinish(answers, minutes * 60 - left)}>Nộp bài</Primary>
              <Ghost onClick={() => setConfirm(false)} T={T} className="w-full">Quay lại làm tiếp</Ghost>
              <button onClick={onExit} style={{ minHeight: 48 }} className={"w-full text-base " + T.sub}>Huỷ bài thi này</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TestResultScreen({ T, dark, result, questions, onBack, onRetry, saved, onToggleSave }) {
  const [reviewIdx, setReviewIdx] = useState(null);
  const wrongList = result.wrong;

  if (reviewIdx !== null) {
    const item = wrongList[reviewIdx];
    const q = questions[item.index];
    return (
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setReviewIdx(null)} aria-label="Đóng xem lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-lg font-bold">Xem lại câu {item.index + 1}</p>
            <p className={"text-sm " + T.sub}>Part {q.part} · sai {reviewIdx + 1}/{wrongList.length}</p>
          </div>
        </div>
        {q.passageId && <PassageBox passage={PASSAGE_BY_ID[q.passageId]} T={T} defaultOpen={false} />}
        <QuestionCard q={q} index={item.index} chosen={item.chosen} reveal onPick={() => {}} T={T} dark={dark}
          saved={saved.indexOf(q.id) !== -1} onToggleSave={onToggleSave} showSave />
        <div className="grid grid-cols-2 gap-2 mt-5 mb-4">
          <Ghost onClick={() => setReviewIdx(Math.max(0, reviewIdx - 1))} T={T}>Câu sai trước</Ghost>
          <Ghost onClick={() => setReviewIdx(Math.min(wrongList.length - 1, reviewIdx + 1))} T={T}>Câu sai sau</Ghost>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
        <Trophy className={"mx-auto mb-3 " + T.accentText} size={36} />
        <p className={"text-sm uppercase tracking-wide font-semibold mb-1 " + T.sub}>Điểm Reading ước lượng</p>
        <p className="font-display text-5xl font-semibold tnum mb-2">{result.score}</p>
        <p className={"text-base " + T.sub}>Đúng {result.correct}/{result.total} câu · {pct(result.correct, result.total)}%</p>
        <p className={"text-sm mt-2 " + T.sub}>{result.formatName} · dùng {mmss(result.usedSec)}</p>
        <p className={"text-sm mt-3 pt-3 border-t " + T.line + " " + T.sub}>
          Điểm ước lượng. ETS quy đổi riêng cho từng đề và không công bố bảng, nên con số thật có thể lệch vài chục điểm.
        </p>
      </div>

      <SectionTitle T={T}>Kết quả theo Part</SectionTitle>
      <div className="space-y-3 mb-5">
        {[5, 6, 7].map((p) => {
          const s = result.byPart[p];
          if (!s || !s.t) return null;
          return (
            <div key={p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-base font-semibold">Part {p}</span>
                <span className={"text-base " + T.sub}>{s.c}/{s.t} · {pct(s.c, s.t)}%</span>
              </div>
              <Bar value={pct(s.c, s.t)} T={T} />
            </div>
          );
        })}
      </div>

      {result.byTopic.length > 0 && (
        <>
          <SectionTitle T={T}>Chuyên đề ngữ pháp sai nhiều</SectionTitle>
          <div className="space-y-2 mb-5">
            {result.byTopic.map((t) => (
              <div key={t.id} className={"rounded-2xl border px-4 py-3 flex justify-between items-center " + T.card + " " + T.line}>
                <span className="text-base">{t.name}</span>
                <span className={"text-base " + T.noText}>sai {t.wrong}/{t.total}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle T={T}>Câu sai ({wrongList.length})</SectionTitle>
      {wrongList.length === 0 ? (
        <p className={"text-base mb-5 " + T.sub}>Không sai câu nào. Hãy chuyển sang dạng đề dài hơn.</p>
      ) : (
        <div className="space-y-2 mb-5">
          {wrongList.map((item, n) => {
            const q = questions[item.index];
            return (
              <button key={q.id + "-" + n} onClick={() => setReviewIdx(n)} style={{ minHeight: 52 }}
                className={"w-full text-left rounded-2xl border px-4 py-3 flex items-center gap-3 " + T.card + " " + T.line}>
                <span className={"text-sm font-bold shrink-0 " + T.noText}>{item.index + 1}</span>
                <span className="text-base flex-1">{q.text.length > 50 ? q.text.slice(0, 50) + "…" : q.text}</span>
                <ChevronRight size={18} className={T.sub} />
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <Primary onClick={onRetry}><span className="flex items-center justify-center gap-2"><RefreshCw size={18} /> Thi đề mới</span></Primary>
        <Ghost onClick={onBack} T={T} className="w-full">Về màn hình Đọc</Ghost>
      </div>
    </div>
  );
}

/* ---------- Màn chuyển tiếp giữa Listening và Reading (đề 200 câu) ---------- */
function FullTransition({ T, dark, lc, onContinue, onExit }) {
  return (
    <div className="px-4 pt-4">
      <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
        <Headphones className={"mx-auto mb-3 " + T.accentText} size={36} />
        <p className="text-xl font-bold mb-1">Xong phần Listening!</p>
        <p className={"text-base mb-4 " + T.sub}>
          Bạn vừa hoàn thành 100 câu nghe{lc ? " · đúng " + lc.correct + "/" + lc.total : ""}.
        </p>
        <div className={"rounded-2xl p-4 mb-5 text-left flex gap-3 " + T.soft}>
          <Lightbulb size={18} className={"shrink-0 mt-1 " + T.accentText} />
          <p className={"text-base leading-relaxed " + T.softText}>
            Tiếp theo là phần Reading gồm 100 câu trong 75 phút. Trong phòng thi thật, hai phần chạy liền nhau không nghỉ — hãy giữ nhịp và bắt đầu ngay khi sẵn sàng. Điểm tổng và bậc CEFR sẽ hiện sau khi làm xong Reading.
          </p>
        </div>
        <Primary onClick={onContinue}>
          <span className="flex items-center justify-center gap-2">Bắt đầu phần Reading <ChevronRight size={18} /></span>
        </Primary>
        <button onClick={onExit} style={{ minHeight: 44 }} className={"w-full mt-2 text-sm " + T.sub}>
          Thoát và huỷ đề
        </button>
      </div>
    </div>
  );
}

/* ---------- Màn kết quả tổng đề 200 câu (LC + RC + CEFR) ---------- */
function FullResultScreen({ T, dark, result, onBack, onRetry, saved, onToggleSave }) {
  const lc = result.lc, rc = result.rc;
  return (
    <div className="px-4 pt-4">
      <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
        <Trophy className={"mx-auto mb-3 " + T.accentText} size={38} />
        <p className={"text-sm uppercase tracking-wide font-semibold mb-1 " + T.sub}>Tổng điểm TOEIC ước lượng</p>
        <p className="text-6xl font-bold mb-1">{result.score}</p>
        <p className={"text-lg font-semibold mb-2 " + T.accentText}>Bậc CEFR: {result.cefr}</p>
        <p className={"text-base " + T.sub}>Đúng {result.correct}/{result.total} câu · {pct(result.correct, result.total)}%</p>
        <p className={"text-sm mt-2 " + T.sub}>{result.formatName} · dùng {mmss(result.usedSec)}</p>
        <p className={"text-sm mt-3 pt-3 border-t " + T.line + " " + T.sub}>
          Điểm ước lượng. ETS quy đổi riêng cho từng đề và không công bố bảng, nên con số thật có thể lệch vài chục điểm. Bậc CEFR áp cho điểm tổng.
        </p>
      </div>

      <SectionTitle T={T}>Điểm hai kỹ năng</SectionTitle>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
          <div className="flex items-center gap-2 mb-1">
            <Headphones size={16} className={T.accentText} />
            <span className="text-base font-semibold">Listening</span>
          </div>
          <p className="font-display text-3xl font-semibold tnum">{lc.score}</p>
          <p className={"text-sm " + T.sub}>{lc.correct}/{lc.total} · {pct(lc.correct, lc.total)}%</p>
        </div>
        <div className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className={T.accentText} />
            <span className="text-base font-semibold">Reading</span>
          </div>
          <p className="font-display text-3xl font-semibold tnum">{rc.score}</p>
          <p className={"text-sm " + T.sub}>{rc.correct}/{rc.total} · {pct(rc.correct, rc.total)}%</p>
        </div>
      </div>

      <SectionTitle T={T}>Chi tiết theo Part</SectionTitle>
      <div className="space-y-3 mb-5">
        {[1, 2, 3, 4].map((p) => {
          const s = lc.byPart[p]; if (!s || !s.t) return null;
          return (
            <div key={"lc" + p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-base font-semibold">Listening · Part {p}</span>
                <span className={"text-base " + T.sub}>{s.c}/{s.t} · {pct(s.c, s.t)}%</span>
              </div>
              <Bar value={pct(s.c, s.t)} T={T} />
            </div>
          );
        })}
        {[5, 6, 7].map((p) => {
          const s = rc.byPart[p]; if (!s || !s.t) return null;
          return (
            <div key={"rc" + p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-base font-semibold">Reading · Part {p}</span>
                <span className={"text-base " + T.sub}>{s.c}/{s.t} · {pct(s.c, s.t)}%</span>
              </div>
              <Bar value={pct(s.c, s.t)} T={T} />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Ghost onClick={onBack} T={T}>Về menu</Ghost>
        <Primary onClick={onRetry}>Làm đề mới</Primary>
      </div>
    </div>
  );
}

/* ---------- Màn hình chính mục Thi thử ---------- */
export function ExamScreen({ T, dark, tts, onTestDone, saved, onToggleSave, lastResults }) {
  const [skill, setSkill] = useState("LC");
  const [view, setView] = useState("menu");
  const [format, setFormat] = useState(null);
  const [rcSet, setRcSet] = useState(null);
  const [lcUnits, setLcUnits] = useState(null);
  const [result, setResult] = useState(null);
  const [showPace, setShowPace] = useState(false);
  const [fullPhase, setFullPhase] = useState(null);   // null | "lc" | "rc" — nửa nào của đề 200 câu
  const [fullLcResult, setFullLcResult] = useState(null); // giữ kết quả LC trong khi làm RC

  /* Spec chuẩn cho hai nửa của đề Full test 200 câu */
  const FULL_LC_SPEC = { p1: 6, p2: 25, p3: 13, p4: 10 };
  const FULL_RC_SPEC = { p5: 30, p6: 16, p7: { single: 24, double: 15, triple: 15 } };

  const start = (f) => {
    if (f.locked) return;
    setFormat(f);
    if (f.skill === "ALL") {
      // Đề 200 câu: bắt đầu bằng nửa Listening
      setFullPhase("lc"); setFullLcResult(null);
      setLcUnits(buildListeningExam(FULL_LC_SPEC)); setRcSet(null);
      setView("test");
      return;
    }
    setFullPhase(null); setFullLcResult(null);
    if (f.skill === "LC") { setLcUnits(buildListeningExam(f.spec)); setRcSet(null); }
    else { setRcSet(buildTest(f.spec)); setLcUnits(null); }
    setView("test");
  };

  const finishRC = (answers, usedSec) => {
    const qs = rcSet;
    const byPart = { 5: { c: 0, t: 0 }, 6: { c: 0, t: 0 }, 7: { c: 0, t: 0 } };
    const topicMap = {};
    const wrong = [];
    let correct = 0;
    qs.forEach((q, idx) => {
      byPart[q.part].t += 1;
      const ok = answers[idx] === q.ans;
      if (ok) { correct += 1; byPart[q.part].c += 1; }
      else wrong.push({ index: idx, chosen: answers[idx] });
      if (q.gid) {
        if (!topicMap[q.gid]) topicMap[q.gid] = { id: q.gid, wrong: 0, total: 0 };
        topicMap[q.gid].total += 1;
        if (!ok) topicMap[q.gid].wrong += 1;
      }
    });
    const byTopic = Object.keys(topicMap)
      .map((k) => Object.assign({}, topicMap[k], { name: GRAMMAR.filter((g) => g.id === k)[0].name }))
      .filter((t) => t.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 4);
    const r = {
      skill: "RC", correct: correct, total: qs.length, byPart: byPart, byTopic: byTopic, wrong: wrong,
      score: estimateRC(correct, qs.length), formatName: format.name, usedSec: usedSec || 0,
    };
    if (fullPhase === "rc" && fullLcResult) {
      // Đề 200 câu: xong nửa Reading → gộp điểm hai kỹ năng
      const lc = fullLcResult;
      const full = {
        skill: "ALL",
        lc: lc, rc: r,
        correct: lc.correct + correct, total: lc.total + qs.length,
        lcScore: lc.score, rcScore: r.score, score: lc.score + r.score,
        cefr: cefrOf(lc.score + r.score),
        usedSec: (lc.usedSec || 0) + (usedSec || 0),
        formatName: format.name,
      };
      setResult(full); onTestDone(full);
      setFullPhase(null);
      setView("result");
      return;
    }
    setResult(r); onTestDone(r); setView("result");
  };

  const finishLC = (answers, usedSec) => {
    const byPart = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 }, 4: { c: 0, t: 0 } };
    let correct = 0, total = 0;
    lcUnits.forEach((u) => {
      const qs = u.kind === "single" ? [u.item] : u.item.questions;
      qs.forEach((q) => {
        total += 1; byPart[u.part].t += 1;
        if (answers[q.id] === q.ans) { correct += 1; byPart[u.part].c += 1; }
      });
    });
    const r = {
      skill: "LC", correct: correct, total: total, byPart: byPart, answers: answers,
      score: estimateLC(correct, total), formatName: format.name, usedSec: usedSec || 0,
    };
    if (fullPhase === "lc") {
      // Đề 200 câu: xong nửa Listening → chuẩn bị nửa Reading, hiện màn chuyển tiếp
      setFullLcResult(r);
      setRcSet(buildTest(FULL_RC_SPEC)); setLcUnits(null);
      setFullPhase("rc");
      setView("transition");
      return;
    }
    setResult(r); onTestDone(r); setView("result");
  };

  // Thời gian cho màn test: đề full dùng 45 phút cho nửa LC, 75 phút cho nửa RC
  const testMinutes = fullPhase === "lc" ? 45 : fullPhase === "rc" ? 75 : format ? format.minutes : 0;
  const toMenu = () => { setFullPhase(null); setFullLcResult(null); setView("menu"); };

  if (view === "test" && lcUnits) {
    return <ListeningTest T={T} dark={dark} tts={tts} units={lcUnits} minutes={testMinutes}
      onExit={toMenu} onFinish={finishLC} />;
  }
  if (view === "transition") {
    return <FullTransition T={T} dark={dark} lc={fullLcResult}
      onContinue={() => setView("test")} onExit={toMenu} />;
  }
  if (view === "test" && rcSet) {
    return <TestScreen T={T} dark={dark} questions={rcSet} minutes={testMinutes}
      onExit={toMenu} onFinish={finishRC} />;
  }
  if (view === "result" && result && result.skill === "ALL") {
    return <FullResultScreen T={T} dark={dark} result={result} saved={saved}
      onToggleSave={onToggleSave} onBack={() => setView("menu")} onRetry={() => start(format)} />;
  }
  if (view === "result" && result && result.skill === "LC") {
    return <ListeningResult T={T} dark={dark} tts={tts} result={result} units={lcUnits}
      onBack={() => setView("menu")} onRetry={() => start(format)} />;
  }
  if (view === "result" && result) {
    return <TestResultScreen T={T} dark={dark} result={result} questions={rcSet} saved={saved}
      onToggleSave={onToggleSave} onBack={() => setView("menu")} onRetry={() => start(format)} />;
  }

  const list = EXAM_FORMATS.filter((f) => f.skill === skill);
  const bankLine = skill === "LC"
    ? "Ngân hàng nghe: " + (LISTEN_P1.length + LISTEN_P2.length + LISTEN_P3.length * 3 + LISTEN_P4.length * 3) + " câu"
    : skill === "RC" ? "Ngân hàng đọc: " + ALL_Q.length + " câu" : "Cần đủ cả hai kỹ năng";

  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow="Bấm giờ như thi thật"
        title="Thi thử"
        sub={bankLine + " · đề bốc ngẫu nhiên mỗi lần"} />

      <div className={"grid grid-cols-3 gap-1 rounded-2xl p-1 mb-5 " + T.soft}>
        {SKILL_TABS.map((s) => {
          const Icon = s.Icon;
          return (
            <button key={s.key} onClick={() => setSkill(s.key)} style={{ minHeight: 48 }}
              className={"rounded-xl flex items-center justify-center gap-2 text-base font-medium transition-colors " +
                (skill === s.key ? "bg-accent text-white" : T.softText)}>
              <Icon size={17} /> {s.label}
            </button>
          );
        })}
      </div>

      {lastResults[skill] && (
        <div className={"rounded-2xl border p-4 mb-5 " + T.card + " " + T.line}>
          <div className="flex justify-between items-baseline">
            <span className={"text-sm " + T.sub}>Lần thi gần nhất</span>
            <span className="font-display text-2xl font-semibold tnum">{lastResults[skill].score}</span>
          </div>
          <p className={"text-sm mt-1 " + T.sub}>
            {lastResults[skill].formatName} · đúng {lastResults[skill].correct}/{lastResults[skill].total}
          </p>
        </div>
      )}

      <SectionTitle T={T}>Chọn mức độ</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        {list.map((f) => {
          const n = f.spec ? (f.skill === "LC"
            ? f.spec.p1 + f.spec.p2 + f.spec.p3 * 3 + f.spec.p4 * 3
            : f.spec.p5 + f.spec.p6 + f.spec.p7.single + f.spec.p7.double + f.spec.p7.triple) : 200;
          return (
            <button key={f.key} onClick={() => start(f)} disabled={f.locked}
              className={"w-full text-left rounded-2xl border p-4 " + T.card + " " + T.line + (f.locked ? " opacity-50" : "")}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="text-base font-semibold">{f.name}</span>
                <span className={"text-xs shrink-0 px-2 py-1 rounded-full " + T.accentSoft}>{f.level}</span>
              </div>
              <p className={"text-base mb-3 " + T.sub}>{f.note}</p>
              <div className="flex flex-wrap gap-2">
                <span className={"text-sm px-2 py-1 rounded-lg " + T.soft + " " + T.softText}>{n} câu</span>
                <span className={"text-sm px-2 py-1 rounded-lg " + T.soft + " " + T.softText}>{f.minutes} phút</span>
                {f.locked && <span className={"text-sm px-2 py-1 rounded-lg " + (dark ? "bg-amber-950 text-amber-300" : "bg-amber-50 text-amber-700")}>chưa đủ dữ liệu</span>}
              </div>
            </button>
          );
        })}
      </div>

      {skill === "LC" && (
        <div className={"rounded-2xl p-4 mb-5 flex gap-3 " + T.soft}>
          <Headphones size={18} className={"shrink-0 mt-1 " + T.accentText} />
          <p className={"text-base leading-relaxed " + T.softText}>
            Bài thi nghe chạy một mạch: audio phát đúng một lần, không có nút nghe lại, không xem transcript, không quay lại câu trước. Nghe hụt câu nào thì bỏ luôn câu đó.
          </p>
        </div>
      )}

      {skill === "RC" && (
        <>
          <button onClick={() => setShowPace((s) => !s)} style={{ minHeight: 52 }}
            className={"w-full rounded-2xl border px-4 py-3 flex items-center justify-between mb-3 " + T.card + " " + T.line}>
            <span className="flex items-center gap-2 text-base font-medium">
              <Clock size={18} className={T.accentText} /> Mốc đồng hồ khi thi thật
            </span>
            <ChevronRight size={18} className={"transition-transform " + (showPace ? "rotate-90" : "")} />
          </button>
          {showPace && (
            <div className={"rounded-2xl border p-4 mb-5 animate-fade " + T.card + " " + T.line}>
              {PACE_GUIDE.map((p, n) => {
                const done = PACE_GUIDE.slice(0, n + 1).reduce((s, x) => s + x.min, 0);
                return (
                  <div key={p.part} className={"flex justify-between items-baseline py-2 " + (n ? "border-t " + T.line : "")}>
                    <span className="text-base">{p.part} <span className={T.sub}>({p.n} câu)</span></span>
                    <span className={"text-base " + T.sub}>{p.min} phút → phút {done}</span>
                  </div>
                );
              })}
              <p className={"text-sm mt-3 pt-3 border-t " + T.line + " " + T.sub}>
                Hai phút cuối dừng làm bài và tô hết ô còn trống — TOEIC không trừ điểm câu sai.
              </p>
            </div>
          )}
        </>
      )}

      {skill === "ALL" && (
        <div className={"rounded-2xl p-4 mb-5 flex gap-3 " + T.soft}>
          <Lightbulb size={18} className={"shrink-0 mt-1 " + T.accentText} />
          <p className={"text-base leading-relaxed " + T.softText}>
            Ngân hàng đã đủ 200 câu (100 Listening + 100 Reading). Để mô phỏng trọn đề, hãy chạy lần lượt <b>Full Listening 100 câu</b> rồi <b>Full Reading 100 câu</b>; điểm tổng bằng tổng điểm hai phần.
          </p>
        </div>
      )}
    </div>
  );
}

