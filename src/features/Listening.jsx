import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Lightbulb, Play, RotateCcw, Square, Volume2, X, PenLine } from "lucide-react";
import { DICTATION, LISTEN_P1, LISTEN_P2, LISTEN_P3, LISTEN_P4 } from "../data/listening.js";
import { LETTERS, normText } from "../lib/utils.js";
import { pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary, SectionTitle, PageHeader, PartMark, ChoiceBadge } from "../ui/index.jsx";
import { SceneArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   11. TAB LUYỆN NGHE
   ═══════════════════════════════════════════════════════════════════ */

export const LISTEN_MODES = [
  { key: "p1", part: 1, name: "Tả tranh", desc: "6 tranh, nghe 4 câu mô tả và chọn câu đúng nhất", n: LISTEN_P1.length + " tranh" },
  { key: "p2", part: 2, name: "Hỏi đáp", desc: "40 câu, ẩn chữ cho tới khi trả lời xong", n: LISTEN_P2.length + " câu" },
  { key: "p3", part: 3, name: "Hội thoại", desc: "2–3 người nói, xem trước câu hỏi", n: LISTEN_P3.length * 3 + " câu" },
  { key: "p4", part: 4, name: "Bài nói ngắn", desc: "Thông báo, tin nhắn thoại, họp nội bộ", n: LISTEN_P4.length * 3 + " câu" },
  { key: "dict", part: 0, name: "Chép chính tả", desc: "Nghe một câu, gõ lại, app tô đỏ từ nghe sai", n: DICTATION.length + " câu" },
];

export const P2_TYPES = [
  { key: "ALL", label: "Tất cả" },
  { key: "WH", label: "WH-question" },
  { key: "YN", label: "Yes/No & đuôi" },
  { key: "CHOICE", label: "Lựa chọn" },
  { key: "REQUEST", label: "Đề nghị" },
  { key: "STATEMENT", label: "Trần thuật" },
];
export const P2_TYPE_LABEL = { WH: "WH-question", YN: "Yes/No & câu hỏi đuôi", CHOICE: "Câu lựa chọn", REQUEST: "Đề nghị / yêu cầu", STATEMENT: "Câu trần thuật" };

export const RATES = [0.75, 1, 1.25];

/* Thanh điều khiển audio tự dựng */
export function AudioBar({ T, playing, onPlay, onStop, onReplay, rate, setRate, onTranscript, showTranscript, disabled }) {
  return (
    <div className={"rounded-2xl border p-3 " + T.card + " " + T.line}>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={playing ? onStop : onPlay} disabled={disabled} aria-label={playing ? "Dừng phát" : "Phát audio"} style={{ minHeight: 52, minWidth: 52 }}
          className="rounded-full bg-accent text-white p-4 active:brightness-95 transition-colors disabled:opacity-40">
          {playing ? <Square size={20} /> : <Play size={20} />}
        </button>
        <button onClick={onReplay} disabled={disabled} style={{ minHeight: 48 }}
          className={"flex-1 rounded-2xl px-3 flex items-center justify-center gap-2 text-base font-medium " + T.soft + " " + T.softText}>
          <RotateCcw size={17} /> Nghe lại
        </button>
        {onTranscript && (
          <button onClick={onTranscript} aria-label={showTranscript ? "Ẩn lời thoại" : "Hiện lời thoại"} aria-pressed={showTranscript} style={{ minHeight: 48, minWidth: 48 }}
            className={"rounded-2xl p-3 " + (showTranscript ? "bg-accent text-white" : T.soft + " " + T.softText)}>
            {showTranscript ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={"text-sm " + T.sub}>Tốc độ</span>
        {RATES.map((r) => (
          <button key={r} onClick={() => setRate(r)} aria-label={"Tốc độ " + r + " lần"} aria-pressed={rate === r} style={{ minHeight: 40 }}
            className={"px-3 rounded-full text-sm font-semibold " +
              (rate === r ? "bg-accent text-white" : T.soft + " " + T.softText)}>{r}x</button>
        ))}
      </div>
    </div>
  );
}

/* Tô sáng chỗ nghe khó ngay trong transcript */
export function MarkedLine({ text, hard, dark }) {
  if (!hard || !hard.length) return <span>{text}</span>;
  let parts = [text];
  hard.forEach((h) => {
    const next = [];
    parts.forEach((p) => {
      if (typeof p !== "string") { next.push(p); return; }
      const i = p.toLowerCase().indexOf(h.p.toLowerCase());
      if (i === -1) { next.push(p); return; }
      next.push(p.slice(0, i));
      next.push({ mark: p.slice(i, i + h.p.length) });
      next.push(p.slice(i + h.p.length));
    });
    parts = next;
  });
  return (
    <span>
      {parts.map((p, i) => typeof p === "string"
        ? <span key={i}>{p}</span>
        : <span key={i} className={"px-1 rounded font-semibold " + (dark ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-900")}>{p.mark}</span>)}
    </span>
  );
}

export function ListenHeader({ T, onBack, title, sub }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
        <ArrowLeft size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold truncate">{title}</p>
        <p className={"text-sm " + T.sub}>{sub}</p>
      </div>
    </div>
  );
}

export function NoVoiceNote({ T, tts }) {
  if (tts.supported && tts.hasEnVoice) return null;
  return (
    <div className={"rounded-2xl p-4 mb-4 flex gap-3 " + T.soft}>
      <Volume2 size={18} className={"shrink-0 mt-1 " + T.accentText} />
      <p className={"text-base leading-relaxed " + T.softText}>
        {tts.supported
          ? "Máy chưa có giọng tiếng Anh nào. Bạn vẫn làm bài được bằng cách bật transcript để đọc thay."
          : "Trình duyệt này không hỗ trợ đọc tự động. Hãy bật transcript để đọc thay phần audio."}
      </p>
    </div>
  );
}

/* ---------- Part 1 ---------- */
export function ListenP1({ T, dark, tts, onBack, onAnswer }) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [rate, setRate] = useState(1);
  const [showT, setShowT] = useState(false);
  const item = LISTEN_P1[i];

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { tts.stop(); setPlaying(false); setStep(-1); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = () => {
    setPlaying(true);
    tts.speakMany(item.options.map((o, n) => ({ text: LETTERS[n] + ". " + o, gap: 600 })), rate,
      { onStep: setStep, onDone: () => { setPlaying(false); setStep(-1); } });
  };
  const stop = () => { tts.stop(); setPlaying(false); setStep(-1); };
  const pick = (idx) => {
    if (reveal) return;
    stop(); setChosen(idx); setReveal(true); onAnswer(1, idx === item.ans, item.id);
  };
  const next = () => {
    if (i + 1 >= LISTEN_P1.length) { onBack(); return; }
    setI(i + 1); setChosen(null); setReveal(false); setShowT(false);
  };

  return (
    <div className="px-4 pt-4">
      <ListenHeader T={T} onBack={onBack} title="Part 1 — Tả tranh" sub={"Tranh " + (i + 1) + " / " + LISTEN_P1.length} />
      <div className="mb-4"><Bar value={((i + (reveal ? 1 : 0)) / LISTEN_P1.length) * 100} T={T} /></div>
      <NoVoiceNote T={T} tts={tts} />

      <div key={item.id} className="animate-fade">
        <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
          <SceneArt name={item.scene} dark={dark} />
          <p className={"text-sm text-center mt-2 " + T.sub}>{item.caption}</p>
        </div>

        <div className="mb-4">
          <AudioBar T={T} playing={playing} onPlay={play} onStop={stop} onReplay={play}
            rate={rate} setRate={setRate} onTranscript={() => setShowT((s) => !s)} showTranscript={showT} />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {item.options.map((o, n) => {
            let cls = T.card + " " + T.line;
            if (reveal) {
              if (n === item.ans) cls = T.okBox;
              else if (n === chosen) cls = T.noBox;
              else cls = T.card + " " + T.line + " opacity-60";
            } else if (step === n) cls = "bg-accent-tint border-accent";
            return (
              <button key={n} onClick={() => pick(n)} disabled={reveal} style={{ minHeight: 56 }}
                className={"rounded-2xl border text-lg font-bold transition-colors " + cls}>{LETTERS[n]}</button>
            );
          })}
        </div>

        {(reveal || showT) && (
          <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
            {item.options.map((o, n) => (
              <p key={n} className={"text-base mb-1 " + (n === item.ans ? "font-semibold " + T.okText : T.softText)}>
                {LETTERS[n]}. {o}
              </p>
            ))}
          </div>
        )}

        {reveal && (
          <>
            <div className={"rounded-2xl border p-4 mb-4 " + T.soft + " " + T.line}>
              <p className={"flex items-center gap-2 text-sm font-semibold mb-2 " + (chosen === item.ans ? T.okText : T.noText)}>
                {chosen === item.ans ? <Check size={16} /> : <X size={16} />}
                {chosen === item.ans ? "Chính xác" : "Đáp án đúng: " + LETTERS[item.ans]}
              </p>
              <p className={"text-base leading-relaxed " + T.softText}>{item.exp}</p>
            </div>
            <div className="mb-4"><Primary onClick={next}>{i + 1 >= LISTEN_P1.length ? "Hoàn thành" : "Tranh tiếp theo"}</Primary></div>
          </>
        )}
        {!reveal && <p className={"text-sm text-center mb-4 " + T.sub}>Bấm phát, nghe 4 câu rồi chọn A, B, C hoặc D</p>}
      </div>
    </div>
  );
}

/* ---------- Part 2 ---------- */
export function ListenP2({ T, dark, tts, onBack, onAnswer }) {
  const [type, setType] = useState("ALL");
  const list = useMemo(() => type === "ALL" ? LISTEN_P2 : LISTEN_P2.filter((q) => q.type === type), [type]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [rate, setRate] = useState(1);
  const [showT, setShowT] = useState(false);
  const item = list[Math.min(i, list.length - 1)];

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { tts.stop(); setPlaying(false); setStep(-1); setI(0); setChosen(null); setReveal(false); setShowT(false); }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = () => {
    if (!item) return;
    setPlaying(true);
    const items = [{ text: item.q, gap: 900 }].concat(
      item.options.map((o, n) => ({ text: LETTERS[n] + ". " + o, gap: 600 })));
    tts.speakMany(items, rate, { onStep: (n) => setStep(n - 1), onDone: () => { setPlaying(false); setStep(-1); } });
  };
  const stop = () => { tts.stop(); setPlaying(false); setStep(-1); };
  const pick = (idx) => {
    if (reveal || !item) return;
    stop(); setChosen(idx); setReveal(true); onAnswer(2, idx === item.ans, item.id);
  };
  const next = () => {
    if (i + 1 >= list.length) { onBack(); return; }
    setI(i + 1); setChosen(null); setReveal(false); setShowT(false);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };
  if (!item) return null;

  return (
    <div className="px-4 pt-4">
      <ListenHeader T={T} onBack={onBack} title="Part 2 — Hỏi đáp" sub={"Câu " + (i + 1) + " / " + list.length} />

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
        {P2_TYPES.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)} style={{ minHeight: 40 }}
            className={"shrink-0 px-3 rounded-full text-sm font-medium border " +
              (t.key === type ? "bg-accent text-white border-accent" : T.card + " " + T.line + " " + T.softText)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4"><Bar value={((i + (reveal ? 1 : 0)) / list.length) * 100} T={T} /></div>
      <NoVoiceNote T={T} tts={tts} />

      <div key={item.id} className="animate-fade">
        <div className="mb-4">
          <AudioBar T={T} playing={playing} onPlay={play} onStop={stop} onReplay={play}
            rate={rate} setRate={setRate} onTranscript={() => setShowT((s) => !s)} showTranscript={showT} />
        </div>

        {(reveal || showT) ? (
          <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
            <p className="text-base font-semibold mb-3">{item.q}</p>
            {item.options.map((o, n) => (
              <p key={n} className={"text-base mb-1 " + (n === item.ans ? "font-semibold " + T.okText : T.softText)}>
                {LETTERS[n]}. {o}
              </p>
            ))}
          </div>
        ) : (
          <div className={"rounded-2xl border p-6 mb-3 text-center " + T.card + " " + T.line}>
            <p className={"text-base " + T.sub}>Chữ được ẩn cho tới khi bạn trả lời — hãy nghe rồi chọn.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3">
          {item.options.map((o, n) => {
            let cls = T.card + " " + T.line;
            if (reveal) {
              if (n === item.ans) cls = T.okBox;
              else if (n === chosen) cls = T.noBox;
              else cls = T.card + " " + T.line + " opacity-60";
            } else if (step === n) cls = "bg-accent-tint border-accent";
            return (
              <button key={n} onClick={() => pick(n)} disabled={reveal} style={{ minHeight: 60 }}
                className={"rounded-2xl border text-xl font-bold transition-colors " + cls}>{LETTERS[n]}</button>
            );
          })}
        </div>

        {reveal && (
          <>
            <div className={"rounded-2xl border p-4 mb-4 " + T.soft + " " + T.line}>
              <p className={"flex items-center gap-2 text-sm font-semibold mb-2 " + (chosen === item.ans ? T.okText : T.noText)}>
                {chosen === item.ans ? <Check size={16} /> : <X size={16} />}
                {chosen === item.ans ? "Chính xác" : "Đáp án đúng: " + LETTERS[item.ans]}
                <span className={"ml-auto text-xs px-2 py-1 rounded-full " + T.accentSoft}>{P2_TYPE_LABEL[item.type]}</span>
              </p>
              <p className={"text-base leading-relaxed " + T.softText}>{item.exp}</p>
            </div>
            <div className="mb-4"><Primary onClick={next}>{i + 1 >= list.length ? "Hoàn thành" : "Câu tiếp theo"}</Primary></div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Part 3 và Part 4 ---------- */
export function ListenTalk({ part, T, dark, tts, onBack, onAnswer }) {
  const set = part === 3 ? LISTEN_P3 : LISTEN_P4;
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState("preview");
  const [countdown, setCountdown] = useState(5);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [rate, setRate] = useState(1);
  const [showT, setShowT] = useState(false);
  const [answers, setAnswers] = useState({});
  const item = set[i];
  const rateRef = useRef(rate);
  rateRef.current = rate;

  const speakItems = useMemo(() => item.lines.map((l) => ({
    text: l.en, v: part === 3 ? l.sp : 0, gap: part === 3 ? 420 : 300,
  })), [item, part]);

  const play = useCallback(() => {
    setPlaying(true);
    tts.speakMany(speakItems, rateRef.current, { onStep: setStep, onDone: () => { setPlaying(false); setStep(-1); } });
  }, [speakItems, tts]);

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { tts.stop(); setPlaying(false); setStep(-1); setPhase("preview"); setCountdown(5); setShowT(false); setAnswers({}); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "preview") return;
    if (countdown <= 0) { setPhase("listen"); play(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown, play]);

  const stop = () => { tts.stop(); setPlaying(false); setStep(-1); };
  const pick = (qid, idx, ans) => {
    if (answers[qid] !== undefined) return;
    setAnswers((a) => Object.assign({}, a, { [qid]: idx }));
    onAnswer(part, idx === ans, qid);
  };
  const next = () => {
    if (i + 1 >= set.length) { onBack(); return; }
    setI(i + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };
  const answeredAll = item.questions.every((q) => answers[q.id] !== undefined);
  const allHard = item.lines.reduce((acc, l) => acc.concat(l.hard || []), []);

  return (
    <div className="px-4 pt-4">
      <ListenHeader T={T} onBack={onBack}
        title={"Part " + part + (part === 3 ? " — Hội thoại" : " — Bài nói ngắn")}
        sub={item.title + " · bài " + (i + 1) + "/" + set.length} />
      <div className="mb-4"><Bar value={(i / set.length) * 100} T={T} /></div>
      <NoVoiceNote T={T} tts={tts} />

      {phase === "preview" ? (
        <div key={"prev" + item.id} className="animate-fade">
          <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
            <p className={"text-sm uppercase tracking-wide font-semibold mb-2 " + T.sub}>Đọc trước câu hỏi</p>
            <p className="font-display text-5xl font-semibold tnum mb-2">{countdown}</p>
            <p className={"text-base " + T.sub}>Audio sẽ tự phát khi hết giờ</p>
          </div>
          <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
            {item.questions.map((q, n) => (
              <p key={q.id} className={"text-base mb-2 " + T.softText}>{n + 1}. {q.text}</p>
            ))}
          </div>
          <div className="mb-4"><Ghost onClick={() => { setCountdown(0); }} T={T} className="w-full">Bỏ qua, phát ngay</Ghost></div>
        </div>
      ) : (
        <div key={item.id} className="animate-fade">
          <div className="mb-4">
            <AudioBar T={T} playing={playing} onPlay={play} onStop={stop} onReplay={play}
              rate={rate} setRate={setRate} onTranscript={() => setShowT((s) => !s)} showTranscript={showT} />
          </div>

          {showT && (
            <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
              {item.lines.map((l, n) => (
                <div key={n} className={"mb-3 " + (step === n ? "opacity-100" : "")}>
                  {part === 3 && <p className={"text-xs font-semibold uppercase " + T.accentText}>{item.who[l.sp]}</p>}
                  <p className="text-base leading-relaxed"><MarkedLine text={l.en} hard={l.hard} dark={dark} /></p>
                  <p className={"text-sm " + T.sub}>{l.vi}</p>
                </div>
              ))}
              {allHard.length > 0 && (
                <div className={"mt-3 pt-3 border-t " + T.line}>
                  <p className={"text-xs font-semibold uppercase tracking-wide mb-2 " + T.sub}>Chỗ nghe khó</p>
                  {allHard.map((h, n) => (
                    <p key={n} className={"text-sm mb-1 " + T.softText}>
                      <span className="font-semibold">{h.p}</span> — {h.n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-5 mb-4">
            {item.questions.map((q, n) => {
              const chosen = answers[q.id];
              const done = chosen !== undefined;
              return (
                <div key={q.id}>
                  <p className="text-base font-medium leading-relaxed mb-3">
                    <span className={"font-bold mr-2 " + T.accentText}>{n + 1}.</span>{q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((o, m) => {
                      let cls = T.card + " " + T.line;
                      let badge = "default";
                      if (done) {
                        if (m === q.ans) { cls = T.okBox; badge = "correct"; }
                        else if (m === chosen) { cls = T.noBox; badge = "wrong"; }
                        else cls = T.card + " " + T.line + " opacity-55";
                      }
                      return (
                        <button key={m} onClick={() => pick(q.id, m, q.ans)} disabled={done} style={{ minHeight: 52 }}
                          className={"w-full text-left rounded-xl border px-3.5 py-3 flex items-center gap-3 transition-all " + (done ? "" : "hover:shadow-sm active:scale-[0.995] ") + cls}>
                          <ChoiceBadge letter={LETTERS[m]} state={badge} T={T} />
                          <span className="text-[15px] flex-1">{o}</span>
                        </button>
                      );
                    })}
                  </div>
                  {done && (
                    <div className={"mt-2 rounded-xl border p-3 " + T.soft + " " + T.line}>
                      <p className={"flex items-center gap-2 text-[13px] font-semibold mb-1.5 " + (chosen === q.ans ? T.okText : T.noText)}>
                        {chosen === q.ans ? <Check size={15} /> : <X size={15} />}
                        {chosen === q.ans ? "Chính xác" : "Đáp án đúng: " + LETTERS[q.ans]}
                      </p>
                      <p className={"text-[15px] leading-relaxed " + T.softText}>{q.exp}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {answeredAll && (
            <div className="mb-4"><Primary onClick={next}>{i + 1 >= set.length ? "Hoàn thành" : "Bài tiếp theo"}</Primary></div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Chép chính tả ---------- */
function tokenize(s) { return (s || "").trim().split(/\s+/).filter(Boolean); }
function bareWord(w) { return normText(w); }

function diffWords(target, typed) {
  const A = tokenize(target), B = tokenize(typed);
  const m = A.length, n = B.length;
  const dp = [];
  for (let x = 0; x <= m; x++) dp.push(new Array(n + 1).fill(0));
  for (let x = m - 1; x >= 0; x--) {
    for (let y = n - 1; y >= 0; y--) {
      dp[x][y] = bareWord(A[x]) === bareWord(B[y]) ? dp[x + 1][y + 1] + 1 : Math.max(dp[x + 1][y], dp[x][y + 1]);
    }
  }
  const mark = new Array(m).fill(false);
  let x = 0, y = 0;
  while (x < m && y < n) {
    if (bareWord(A[x]) === bareWord(B[y])) { mark[x] = true; x++; y++; }
    else if (dp[x + 1][y] >= dp[x][y + 1]) x++;
    else y++;
  }
  return { words: A, mark: mark, hit: mark.filter(Boolean).length };
}

export function ListenDictation({ T, dark, tts, onBack }) {
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [rate, setRate] = useState(0.75);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState({ hit: 0, total: 0 });
  const item = DICTATION[i];
  const result = checked ? diffWords(item.en, input) : null;

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { tts.stop(); setPlaying(false); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = () => {
    setPlaying(true);
    tts.speakMany([{ text: item.en }], rate, { onDone: () => setPlaying(false) });
  };
  const stop = () => { tts.stop(); setPlaying(false); };
  const check = () => {
    if (checked || !input.trim()) return;
    const r = diffWords(item.en, input);
    setChecked(true);
    setScore((s) => ({ hit: s.hit + r.hit, total: s.total + r.words.length }));
  };
  const next = () => {
    if (i + 1 >= DICTATION.length) { onBack(); return; }
    setI(i + 1); setInput(""); setChecked(false);
  };

  return (
    <div className="px-4 pt-4">
      <ListenHeader T={T} onBack={onBack} title="Chép chính tả"
        sub={"Câu " + (i + 1) + " / " + DICTATION.length + (score.total ? " · đúng " + pct(score.hit, score.total) + "% số từ" : "")} />
      <div className="mb-4"><Bar value={((i + (checked ? 1 : 0)) / DICTATION.length) * 100} T={T} /></div>
      <NoVoiceNote T={T} tts={tts} />

      <div key={item.id} className="animate-fade">
        <div className="mb-4">
          <AudioBar T={T} playing={playing} onPlay={play} onStop={stop} onReplay={play} rate={rate} setRate={setRate} />
        </div>

        <textarea value={input} onChange={(e) => setInput(e.target.value)} disabled={checked} rows={3}
          aria-label="Gõ lại câu vừa nghe" placeholder="Gõ lại câu bạn vừa nghe…" autoCapitalize="off" autoCorrect="off" spellCheck={false}
          className={"w-full rounded-2xl border px-4 py-3 text-base outline-none mb-3 " + T.card + " " + T.line} />

        {!checked ? (
          <div className="mb-4"><Primary onClick={check} disabled={!input.trim()}>Kiểm tra</Primary></div>
        ) : (
          <>
            <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
              <p className={"text-xs font-semibold uppercase tracking-wide mb-2 " + T.sub}>
                Câu gốc — bắt được {result.hit}/{result.words.length} từ
              </p>
              <p className="text-lg leading-relaxed mb-3">
                {result.words.map((w, n) => (
                  <span key={n} className={result.mark[n]
                    ? ""
                    : "px-1 rounded font-semibold " + (dark ? "bg-rose-900 text-rose-100" : "bg-rose-100 text-rose-800")}>{w}{" "}</span>
                ))}
              </p>
              <p className={"text-sm mb-2 " + T.sub}>{item.vi}</p>
              <p className={"text-sm " + T.accentText}>Chỗ dễ sai: {item.hard}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Ghost onClick={() => { setChecked(false); }} T={T}>Sửa lại câu này</Ghost>
              <Primary onClick={next}>{i + 1 >= DICTATION.length ? "Hoàn thành" : "Câu tiếp"}</Primary>
            </div>
          </>
        )}
        {!checked && <p className={"text-sm text-center mb-4 " + T.sub}>Mẹo: nghe ở 0.75x hai lần trước khi gõ, đừng nhìn transcript.</p>}
      </div>
    </div>
  );
}

/* ---------- Màn hình chính tab Nghe ---------- */
export function ListenScreen({ T, dark, tts, stats, onAnswer }) {
  const [view, setView] = useState("menu");
  const back = () => { tts.stop(); setView("menu"); };

  if (view === "p1") return <ListenP1 T={T} dark={dark} tts={tts} onBack={back} onAnswer={onAnswer} />;
  if (view === "p2") return <ListenP2 T={T} dark={dark} tts={tts} onBack={back} onAnswer={onAnswer} />;
  if (view === "p3") return <ListenTalk part={3} T={T} dark={dark} tts={tts} onBack={back} onAnswer={onAnswer} />;
  if (view === "p4") return <ListenTalk part={4} T={T} dark={dark} tts={tts} onBack={back} onAnswer={onAnswer} />;
  if (view === "dict") return <ListenDictation T={T} dark={dark} tts={tts} onBack={back} />;

  const totalQ = LISTEN_P1.length + LISTEN_P2.length + LISTEN_P3.length * 3 + LISTEN_P4.length * 3;
  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow="Kỹ năng nghe · Part 1–4"
        title="Luyện nghe"
        sub={totalQ + " câu · " + DICTATION.length + " câu chép chính tả"} />

      <NoVoiceNote T={T} tts={tts} />
      {tts.supported && tts.hasEnVoice && (
        <div className={"rounded-2xl p-4 mb-5 flex gap-3 " + T.soft}>
          <Lightbulb size={18} className={"shrink-0 mt-0.5 " + T.accentText} />
          <p className={"text-[15px] leading-relaxed " + T.softText}>
            Trên iPhone, lần đầu vào bài có thể phải chạm nút phát một lần thì máy mới chịu đọc. Part 2 là phần rẻ điểm nhất — nên làm mỗi ngày.
          </p>
        </div>
      )}

      <SectionTitle T={T}>Chọn phần luyện</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {LISTEN_MODES.map((m) => {
          const s = m.part ? stats.listening[m.part] : null;
          const done = s && s.t > 0;
          return (
            <button key={m.key} onClick={() => setView(m.key)}
              className={"group w-full text-left rounded-2xl border p-4 transition-all hover:shadow-sm active:scale-[0.99] " + T.card + " " + T.line}>
              <div className="flex items-start gap-3">
                {m.part
                  ? <PartMark n={m.part} T={T} active={done} />
                  : <span className={"inline-flex items-center justify-center rounded-lg shrink-0 " + T.soft} style={{ width: 34, height: 34 }}><PenLine size={17} className={T.accentText} /></span>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[15px]">{m.name}</span>
                    <span className={"text-[13px] shrink-0 tnum " + T.sub}>{m.n}</span>
                  </div>
                  <p className={"text-[13px] mt-0.5 mb-2.5 " + T.sub}>{m.desc}</p>
                  {done ? (
                    <>
                      <Bar value={pct(s.c, s.t)} T={T} />
                      <p className={"text-[13px] mt-1.5 " + T.sub}>Đã làm {s.t} câu · đúng <span className="font-semibold tnum">{pct(s.c, s.t)}%</span></p>
                    </>
                  ) : <p className={"text-[13px] font-medium " + T.accentText}>{m.part ? "Chưa luyện — bắt đầu ngay →" : "Bài tập lên điểm nghe nhanh nhất →"}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
