import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Image as ImageIcon, Layers, ListChecks, Pencil, RotateCcw, Shuffle, Trophy, Volume2, X } from "lucide-react";
import { VOCAB, VOCAB_TOPICS } from "../data/vocab.js";
import { partition, buildQueue, isLearned } from "../lib/srs.js";
import { LETTERS } from "../lib/utils.js";
import { mmss, pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary, SectionTitle, PageHeader, ChoiceBadge } from "../ui/index.jsx";
import { VocabArt } from "../ui/art.jsx";
import { TopicLearnScreen } from "./TopicLearn.jsx";

/* ═══════════════════════════════════════════════════════════════════
   5. TAB TỪ VỰNG — 6 chế độ học
   ═══════════════════════════════════════════════════════════════════ */

export const VOCAB_MODES = [
  { key: "card", name: "Thẻ ghi nhớ", desc: "Lật thẻ xem nghĩa, ví dụ và collocation", Icon: Layers },
  { key: "quiz", name: "Trắc nghiệm nghĩa", desc: "Chọn nghĩa đúng, đảo chiều Anh ↔ Việt", Icon: ListChecks },
  { key: "image", name: "Nhìn ảnh đoán từ", desc: "Xem hình minh hoạ rồi chọn từ khớp", Icon: ImageIcon },
  { key: "listen", name: "Nghe rồi gõ lại", desc: "Nghe phát âm và gõ đúng chính tả", Icon: Volume2 },
  { key: "blank", name: "Điền vào câu", desc: "Điền từ còn thiếu trong câu văn phòng", Icon: Pencil },
  { key: "match", name: "Ghép cặp", desc: "Nối 5 từ với nghĩa, đếm số lần sai", Icon: Shuffle },
];

export const DRILL_SIZE = 10;
export const MATCH_SIZE = 5;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function normText(s) {
  let t = (s || "").toLowerCase();
  try { t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) { /* bỏ qua */ }
  return t.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

/* Khoét chỗ trống trong câu ví dụ, chấp nhận cả dạng chia (postponed, distributed…) */
function blankSentence(v) {
  let stem = v.w.toLowerCase();
  if (stem.length > 5 && /s$/.test(stem)) stem = stem.slice(0, -1);
  if (stem.length > 5 && /e$/.test(stem)) stem = stem.slice(0, -1);
  const esc = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  try {
    const re = new RegExp(esc + "[a-zA-Zé']*", "i");
    const m = v.ex.match(re);
    if (m) return { text: v.ex.replace(re, "_______"), target: m[0] };
  } catch (e) { /* bỏ qua */ }
  return { text: v.ex, target: v.w };
}

function distractors(v, n) {
  const same = shuffle(VOCAB.filter((x) => x.id !== v.id && x.topic === v.topic));
  const other = shuffle(VOCAB.filter((x) => x.id !== v.id && x.topic !== v.topic));
  return same.concat(other).slice(0, n);
}

function buildDrill(mode, deck) {
  const base = shuffle(deck).slice(0, Math.min(DRILL_SIZE, deck.length));
  return base.map((v, idx) => {
    const item = { v: v, key: v.id + "-" + idx };
    if (mode === "quiz" || mode === "image") {
      item.dir = mode === "quiz" ? (idx % 2 === 0 ? "en2vi" : "vi2en") : "img";
      item.options = shuffle([v].concat(distractors(v, 3)));
      item.ans = item.options.map((o) => o.id).indexOf(v.id);
    } else if (mode === "blank") {
      const b = blankSentence(v);
      item.sentence = b.text;
      item.target = b.target;
    }
    return item;
  });
}

/* ---------- Thẻ nhỏ hiện sau khi trả lời ---------- */
export function WordReveal({ v, T, dark, tts }) {
  return (
    <div className={"rounded-2xl border p-4 flex gap-4 " + T.card + " " + T.line}>
      <div className="shrink-0"><VocabArt id={v.id} dark={dark} size={64} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-lg font-bold">{v.w}</p>
          <button aria-label="Nghe phát âm" onClick={() => tts.speak(v.w, 0.9)} style={{ minHeight: 36, minWidth: 36 }}
            className={"rounded-full p-2 " + T.soft}><Volume2 size={15} /></button>
        </div>
        <p className={"text-sm mb-2 " + T.sub}>{v.ipa} · ({v.pos})</p>
        <p className="text-base mb-2">{v.vi}</p>
        <p className={"text-sm leading-relaxed " + T.sub}>{v.ex}</p>
      </div>
    </div>
  );
}

/* ---------- Chế độ 1: Thẻ ghi nhớ ---------- */
export function FlashcardMode({ deck, T, dark, tts, onExit, onGrade }) {
  const [queue, setQueue] = useState(() => deck.map((v) => v.id));
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue.length ? VOCAB.filter((v) => v.id === queue[0])[0] : null;
  const rate = (level) => {
    if (!current) return;
    onGrade(current.id, level === "known" ? 2 : level === "vague" ? 1 : 0);
    setFlipped(false);
    setDone((d) => d + 1);
    setQueue((q) => {
      const rest = q.slice(1);
      if (level === "known") return rest;
      const at = Math.min(level === "unknown" ? 2 : 5, rest.length);
      return rest.slice(0, at).concat([q[0]], rest.slice(at));
    });
  };

  if (!current) {
    return (
      <div className="px-4 pt-4">
        <DrillHeader T={T} onExit={onExit} title="Thẻ ghi nhớ" sub={"Đã duyệt hết " + deck.length + " từ"} />
        <div className={"rounded-2xl border p-8 text-center " + T.card + " " + T.line}>
          <Trophy className={"mx-auto mb-3 " + T.accentText} size={38} />
          <p className="text-lg font-semibold mb-5">Xong bộ thẻ này</p>
          <div className="space-y-2">
            <Primary onClick={() => { setQueue(deck.map((v) => v.id)); setDone(0); }}>
              <span className="flex items-center justify-center gap-2"><RotateCcw size={18} /> Duyệt lại</span>
            </Primary>
            <Ghost onClick={onExit} T={T} className="w-full">Chọn chế độ khác</Ghost>
          </div>
        </div>
      </div>
    );
  }

  const total = done + queue.length;
  return (
    <div className="px-4 pt-4">
      <DrillHeader T={T} onExit={onExit} title="Thẻ ghi nhớ" sub={"Còn " + queue.length + " thẻ"} />
      <div className="mb-4"><Bar value={total ? (done / total) * 100 : 0} T={T} /></div>

      <div style={{ perspective: 1200 }} className="h-96 mb-5">
        <div onClick={() => setFlipped((f) => !f)}
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.55s" }}
          className="relative w-full h-full cursor-pointer">

          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className={"absolute inset-0 rounded-2xl border flex flex-col items-center justify-center p-5 " + T.card + " " + T.line}>
            <span className={"text-xs font-semibold uppercase tracking-wider mb-2 px-3 py-1 rounded-full " + T.accentSoft}>{current.topic}</span>
            <VocabArt id={current.id} dark={dark} size={104} />
            <p className="font-display text-3xl font-semibold text-center mt-2">{current.w}</p>
            <p className={"text-base mb-4 " + T.sub}>{current.ipa} · ({current.pos})</p>
            <button aria-label="Nghe phát âm" onClick={(e) => { e.stopPropagation(); tts.speak(current.w, 0.9); }}
              style={{ minHeight: 48, minWidth: 48 }}
              className="rounded-full bg-accent text-white p-3 active:brightness-95 transition-colors">
              <Volume2 size={20} />
            </button>
            <p className={"text-sm mt-4 " + T.sub}>Chạm vào thẻ để xem nghĩa</p>
          </div>

          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className={"absolute inset-0 rounded-2xl border p-5 overflow-y-auto " + T.card + " " + T.line}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="font-display text-2xl font-semibold">{current.w}</p>
              <button aria-label="Nghe phát âm" onClick={(e) => { e.stopPropagation(); tts.speak(current.ex, 0.9); }}
                style={{ minHeight: 44, minWidth: 44 }} className={"shrink-0 rounded-full p-3 " + T.soft}>
                <Volume2 size={18} />
              </button>
            </div>
            <p className="text-lg font-medium mb-4">{current.vi}</p>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-1 " + T.sub}>Ví dụ</p>
            <p className="text-base mb-1">{current.ex}</p>
            <p className={"text-sm mb-4 " + T.sub}>{current.exVi}</p>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-2 " + T.sub}>Collocation hay gặp</p>
            <div className="flex flex-wrap gap-2">
              {current.col.map((c) => (
                <span key={c} className={"px-3 py-1 rounded-full text-sm " + T.soft + " " + T.softText}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => rate("unknown")} style={{ minHeight: 56 }}
          className={"rounded-2xl border text-base font-semibold px-2 " + (dark ? "bg-rose-950 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700")}>Chưa thuộc</button>
        <button onClick={() => rate("vague")} style={{ minHeight: 56 }}
          className={"rounded-2xl border text-base font-semibold px-2 " + (dark ? "bg-amber-950 border-amber-800 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700")}>Mơ hồ</button>
        <button onClick={() => rate("known")} style={{ minHeight: 56 }}
          className={"rounded-2xl border text-base font-semibold px-2 " + (dark ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700")}>Thuộc rồi</button>
      </div>
      <p className={"text-sm text-center mt-3 mb-4 " + T.sub}>
        Từ &quot;chưa thuộc&quot; quay lại sau 2 thẻ, &quot;mơ hồ&quot; sau 5 thẻ.
      </p>
    </div>
  );
}

/* ---------- Đầu màn hình của mọi chế độ ---------- */
export function DrillHeader({ T, onExit, title, sub }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={onExit} aria-label="Thoát" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
        <ArrowLeft size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold truncate">{title}</p>
        <p className={"text-sm " + T.sub}>{sub}</p>
      </div>
    </div>
  );
}

/* ---------- Tổng kết một lượt luyện ---------- */
export function DrillSummary({ T, dark, right, total, missed, onRetryMissed, onRestart, onExit, tts }) {
  return (
    <div className="px-4 pt-4">
      <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
        <Trophy className={"mx-auto mb-3 " + T.accentText} size={34} />
        <p className="font-display text-4xl font-semibold tnum mb-1">{right}/{total}</p>
        <p className={"text-base " + T.sub}>Đúng {pct(right, total)}%</p>
      </div>
      {missed.length > 0 && (
        <>
          <SectionTitle T={T}>Từ cần xem lại ({missed.length})</SectionTitle>
          <div className="space-y-2 mb-5">
            {missed.map((v) => (
              <div key={v.id} className={"rounded-2xl border p-3 flex items-center gap-3 " + T.card + " " + T.line}>
                <VocabArt id={v.id} dark={dark} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold">{v.w}</p>
                  <p className={"text-sm truncate " + T.sub}>{v.vi}</p>
                </div>
                <button aria-label="Nghe phát âm" onClick={() => tts.speak(v.w, 0.9)} style={{ minHeight: 40, minWidth: 40 }}
                  className={"rounded-full p-2 " + T.soft}><Volume2 size={16} /></button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="space-y-2 mb-4">
        {missed.length > 0 && <Primary onClick={onRetryMissed}>Luyện lại {missed.length} từ sai</Primary>}
        <Ghost onClick={onRestart} T={T} className="w-full">Lượt mới</Ghost>
        <Ghost onClick={onExit} T={T} className="w-full">Chọn chế độ khác</Ghost>
      </div>
    </div>
  );
}

/* ---------- Chế độ 2–5: trắc nghiệm / ảnh / nghe / điền câu ---------- */
export function DrillMode({ mode, deck, T, dark, tts, onExit, onGrade }) {
  const modeInfo = VOCAB_MODES.filter((m) => m.key === mode)[0];
  const [pool, setPool] = useState(deck);
  const [items, setItems] = useState(() => buildDrill(mode, deck));
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [input, setInput] = useState("");
  const [reveal, setReveal] = useState(false);
  const [right, setRight] = useState(0);
  const [missed, setMissed] = useState([]);
  const [finished, setFinished] = useState(false);

  const item = items[i];
  const typing = mode === "listen" || mode === "blank";

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === "listen" && item && !finished) tts.speak(item.v.w, 0.85);
  }, [i, mode, finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = (nextPool) => {
    const p = nextPool || pool;
    setPool(p); setItems(buildDrill(mode, p));
    setI(0); setChosen(null); setInput(""); setReveal(false);
    setRight(0); setMissed([]); setFinished(false);
  };

  const submit = (ok) => {
    setReveal(true);
    onGrade(item.v.id, ok);
    if (ok) setRight((r) => r + 1);
    else setMissed((m) => (m.map((x) => x.id).indexOf(item.v.id) === -1 ? m.concat([item.v]) : m));
  };

  const pick = (idx) => { if (!reveal) { setChosen(idx); submit(idx === item.ans); } };
  const check = () => {
    if (reveal || !normText(input)) return;
    const target = mode === "blank" ? item.target : item.v.w;
    submit(normText(input) === normText(target) || normText(input) === normText(item.v.w));
  };
  const next = () => {
    tts.stop();
    if (i + 1 >= items.length) { setFinished(true); return; }
    setI(i + 1); setChosen(null); setInput(""); setReveal(false);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };

  if (finished) {
    return <DrillSummary T={T} dark={dark} tts={tts} right={right} total={items.length} missed={missed}
      onRetryMissed={() => restart(missed)} onRestart={() => restart(deck)} onExit={onExit} />;
  }

  return (
    <div className="px-4 pt-4">
      <DrillHeader T={T} onExit={onExit} title={modeInfo.name} sub={"Câu " + (i + 1) + " / " + items.length + " · đúng " + right} />
      <div className="mb-5"><Bar value={((i + (reveal ? 1 : 0)) / items.length) * 100} T={T} /></div>

      <div key={item.key} className="animate-fade">
        {/* ĐỀ BÀI */}
        {mode === "quiz" && (
          <div className={"rounded-2xl border p-6 mb-4 text-center " + T.card + " " + T.line}>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-3 " + T.sub}>
              {item.dir === "en2vi" ? "Từ này nghĩa là gì?" : "Từ tiếng Anh nào mang nghĩa này?"}
            </p>
            {item.dir === "en2vi" ? (
              <>
                <p className="font-display text-3xl font-semibold mb-1">{item.v.w}</p>
                <p className={"text-base " + T.sub}>{item.v.ipa}</p>
              </>
            ) : (
              <p className="text-xl font-semibold leading-relaxed">{item.v.vi}</p>
            )}
          </div>
        )}

        {mode === "image" && (
          <div className={"rounded-2xl border p-6 mb-4 flex flex-col items-center " + T.card + " " + T.line}>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-3 " + T.sub}>Hình này nói về từ nào?</p>
            <VocabArt id={item.v.id} dark={dark} size={140} />
          </div>
        )}

        {mode === "listen" && (
          <div className={"rounded-2xl border p-6 mb-4 text-center " + T.card + " " + T.line}>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-4 " + T.sub}>
              {tts.supported ? "Nghe rồi gõ lại từ" : "Máy không phát được âm — gõ từ tiếng Anh cho nghĩa dưới đây"}
            </p>
            {tts.supported ? (
              <>
                <button aria-label="Nghe phát âm" onClick={() => tts.speak(item.v.w, 0.85)} style={{ minHeight: 72, minWidth: 72 }}
                  className="rounded-full bg-accent text-white p-5 active:brightness-95 transition-colors mb-3">
                  <Volume2 size={30} />
                </button>
                <div className="flex justify-center gap-2">
                  <button onClick={() => tts.speak(item.v.w, 0.6)} style={{ minHeight: 40 }}
                    className={"px-4 rounded-full text-sm font-medium " + T.soft + " " + T.softText}>Chậm 0.6x</button>
                  <button onClick={() => tts.speak(item.v.ex, 0.85)} style={{ minHeight: 40 }}
                    className={"px-4 rounded-full text-sm font-medium " + T.soft + " " + T.softText}>Nghe cả câu</button>
                </div>
              </>
            ) : (
              <p className="text-xl font-semibold">{item.v.vi}</p>
            )}
          </div>
        )}

        {mode === "blank" && (
          <div className={"rounded-2xl border p-5 mb-4 " + T.card + " " + T.line}>
            <p className={"text-xs font-semibold uppercase tracking-wide mb-3 " + T.sub}>Điền từ còn thiếu</p>
            <p className="text-lg leading-relaxed mb-3">{item.sentence}</p>
            <p className={"text-base " + T.sub}>{item.v.vi}</p>
            <p className={"text-sm mt-2 " + T.accentText}>
              Gợi ý: bắt đầu bằng &quot;{item.target.slice(0, 2)}&quot; · {item.target.length} chữ cái
            </p>
          </div>
        )}

        {/* TRẢ LỜI */}
        {!typing && (
          <div className="space-y-2">
            {item.options.map((o, idx) => {
              let cls = T.card + " " + T.line;
              if (reveal) {
                if (idx === item.ans) cls = T.okBox;
                else if (idx === chosen) cls = T.noBox;
                else cls = T.card + " " + T.line + " opacity-55";
              }
              let badge = "default";
              if (reveal) { if (idx === item.ans) badge = "correct"; else if (idx === chosen) badge = "wrong"; }
              else if (idx === chosen) badge = "chosen";
              return (
                <button key={o.id} onClick={() => pick(idx)} disabled={reveal} style={{ minHeight: 52 }}
                  className={"w-full text-left rounded-xl border px-3.5 py-3 flex items-center gap-3 transition-all " + (reveal ? "" : "hover:shadow-sm active:scale-[0.995] ") + cls}>
                  <ChoiceBadge letter={LETTERS[idx]} state={badge} T={T} />
                  <span className="text-[15px] flex-1">{mode === "image" || item.dir === "vi2en" ? o.w : o.vi}</span>
                  {reveal && idx === item.ans && <Check size={19} className="shrink-0" />}
                  {reveal && idx === chosen && idx !== item.ans && <X size={19} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {typing && (
          <div>
            <input value={input} onChange={(e) => setInput(e.target.value)} disabled={reveal}
              onKeyDown={(e) => { if (e.key === "Enter") check(); }}
              aria-label="Gõ từ tiếng Anh" placeholder="Gõ từ tiếng Anh…" autoCapitalize="off" autoCorrect="off" spellCheck={false}
              style={{ minHeight: 56 }}
              className={"w-full rounded-2xl border px-4 text-lg outline-none " + T.card + " " + T.line +
                (reveal ? (normText(input) === normText(item.v.w) || normText(input) === normText(item.target || item.v.w) ? " border-emerald-500" : " border-rose-500") : "")} />
            {!reveal && <div className="mt-3"><Primary onClick={check} disabled={!normText(input)}>Kiểm tra</Primary></div>}
            {reveal && (
              <div className={"mt-3 rounded-2xl border p-4 " + (missed.map((x) => x.id).indexOf(item.v.id) === -1 ? T.okBox : T.noBox)}>
                <p className="text-base font-semibold">
                  {missed.map((x) => x.id).indexOf(item.v.id) === -1 ? "Chính xác" : "Đáp án: " + (item.target || item.v.w)}
                </p>
              </div>
            )}
          </div>
        )}

        {reveal && (
          <>
            <div className="mt-4"><WordReveal v={item.v} T={T} dark={dark} tts={tts} /></div>
            <div className="mt-4 mb-4">
              <Primary onClick={next}>{i + 1 >= items.length ? "Xem kết quả" : "Từ tiếp theo"}</Primary>
            </div>
          </>
        )}
        {!reveal && !typing && <p className={"text-sm text-center mt-4 mb-4 " + T.sub}>Chọn một đáp án</p>}
      </div>
    </div>
  );
}

/* ---------- Chế độ 6: Ghép cặp ---------- */
export function MatchMode({ deck, T, dark, tts, onExit, onGrade }) {
  const build = () => {
    const picked = shuffle(deck).slice(0, Math.min(MATCH_SIZE, deck.length));
    return { picked: picked, left: shuffle(picked).map((v) => v.id), rightIds: shuffle(picked).map((v) => v.id) };
  };
  const [board, setBoard] = useState(build);
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);
  const [wrong, setWrong] = useState(0);
  const [secs, setSecs] = useState(0);
  const doneAll = matched.length === board.picked.length;

  useEffect(() => {
    if (doneAll) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [doneAll]);
  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (side, id) => {
    if (matched.indexOf(id) !== -1) return;
    if (!sel || sel.side === side) { setSel({ side: side, id: id }); return; }
    if (sel.id === id) {
      setMatched((m) => m.concat([id]));
      onGrade(id, true);
      setSel(null);
      tts.speak(VOCAB.filter((v) => v.id === id)[0].w, 0.9);
    } else {
      setWrong((w) => w + 1);
      onGrade(id, false);
      setFlash(id);
      setTimeout(() => setFlash(null), 450);
      setSel(null);
    }
  };

  const reset = () => { setBoard(build()); setSel(null); setMatched([]); setWrong(0); setSecs(0); };

  const tile = (side, id) => {
    const v = VOCAB.filter((x) => x.id === id)[0];
    const isMatched = matched.indexOf(id) !== -1;
    const isSel = sel && sel.side === side && sel.id === id;
    const isFlash = flash === id;
    let cls = T.card + " " + T.line;
    if (isMatched) cls = T.okBox + " opacity-60";
    else if (isFlash) cls = T.noBox;
    else if (isSel) cls = "bg-accent-tint border-accent";
    return (
      <button key={side + id} onClick={() => tap(side, id)} disabled={isMatched} style={{ minHeight: 66 }}
        className={"w-full rounded-2xl border px-3 py-2 text-left transition-colors " + cls}>
        {side === "w"
          ? <span className="text-base font-semibold">{v.w}</span>
          : <span className="text-sm leading-snug">{v.vi.split(",")[0]}</span>}
      </button>
    );
  };

  if (doneAll) {
    return (
      <div className="px-4 pt-4">
        <DrillHeader T={T} onExit={onExit} title="Ghép cặp" sub="Hoàn thành" />
        <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
          <Trophy className={"mx-auto mb-3 " + T.accentText} size={34} />
          <p className="font-display text-4xl font-semibold tnum mb-1">{mmss(secs)}</p>
          <p className={"text-base " + T.sub}>{wrong === 0 ? "Không sai lần nào" : "Sai " + wrong + " lần"}</p>
        </div>
        <div className="space-y-2 mb-4">
          <Primary onClick={reset}>Bộ 5 từ mới</Primary>
          <Ghost onClick={onExit} T={T} className="w-full">Chọn chế độ khác</Ghost>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <DrillHeader T={T} onExit={onExit} title="Ghép cặp"
        sub={matched.length + "/" + board.picked.length + " cặp · " + mmss(secs) + " · sai " + wrong} />
      <div className="mb-4"><Bar value={(matched.length / board.picked.length) * 100} T={T} /></div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="space-y-2">{board.left.map((id) => tile("w", id))}</div>
        <div className="space-y-2">{board.rightIds.map((id) => tile("m", id))}</div>
      </div>
      <p className={"text-sm text-center mb-4 " + T.sub}>Chạm một từ bên trái rồi chạm nghĩa tương ứng bên phải.</p>
    </div>
  );
}

/* ---------- Màn hình chính của tab ---------- */
export function VocabScreen({ T, dark, tts, srs, onGrade }) {
  const TOPICS = useMemo(() => VOCAB_TOPICS.map((t) => t.topic), []);
  const [deckKey, setDeckKey] = useState("__due");
  const [mode, setMode] = useState(null);
  const [learnMode, setLearnMode] = useState("srs"); // "srs" | "topic"

  const parts = useMemo(() => partition(VOCAB, srs), [srs]);
  const dueList = parts.due;
  const newList = parts.fresh;
  const todayQueue = useMemo(() => buildQueue(VOCAB, srs, 20, 8), [srs]);

  const deck = useMemo(() => {
    if (deckKey === "__due") return todayQueue;
    if (deckKey === "__due_all") return dueList;
    if (deckKey === "__new") return newList;
    if (deckKey === "__all") return VOCAB;
    return VOCAB.filter((v) => v.topic === deckKey);
  }, [deckKey, todayQueue, newList]);

  /* Các chế độ trắc nghiệm chấm đúng/sai, quy về thang SRS 0..2 */
  const grade = useCallback((id, ok) => onGrade(id, ok ? 2 : 0), [onGrade]);

  const learnedSet = useMemo(() => new Set(VOCAB.filter((v) => isLearned(srs[v.id])).map((v) => v.id)), [srs]);

  const exit = () => { tts.stop(); setMode(null); };

  if (mode === "card") return <FlashcardMode deck={deck} T={T} dark={dark} tts={tts} onExit={exit} onGrade={onGrade} />;
  if (mode === "match") return <MatchMode deck={deck} T={T} dark={dark} tts={tts} onExit={exit} onGrade={grade} />;
  if (mode) return <DrillMode mode={mode} deck={deck} T={T} dark={dark} tts={tts} onExit={exit} onGrade={grade} />;

  const learned = VOCAB.filter((v) => isLearned(srs[v.id])).length;

  /* Thanh chuyển đổi giữa hai chế độ học */
  const ModeToggle = () => (
    <div className={"flex gap-1 p-1 rounded-2xl mb-5 " + T.soft}>
      {[["srs", "Ôn theo SRS"], ["topic", "Học theo chủ đề"]].map(([k, label]) => (
        <button key={k} onClick={() => setLearnMode(k)} style={{ minHeight: 40 }}
          className={"flex-1 rounded-xl text-sm font-semibold transition-colors " +
            (learnMode === k ? "bg-accent text-white" : T.softText)}>
          {label}
        </button>
      ))}
    </div>
  );

  if (learnMode === "topic") {
    return (
      <div>
        <div className="px-4 pt-4"><ModeToggle /></div>
        <TopicLearnScreen T={T} dark={dark} tts={tts} learnedSet={learnedSet} onGrade={onGrade} />
      </div>
    );
  }
  const decks = [
    { key: "__due", label: "Hôm nay", n: todayQueue.length },
    { key: "__due_all", label: "Đến hạn", n: dueList.length },
    { key: "__new", label: "Chưa học", n: newList.length },
    { key: "__all", label: "Tất cả", n: VOCAB.length },
  ].concat(TOPICS.map((t) => ({ key: t, label: t, n: VOCAB.filter((v) => v.topic === t).length })));

  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow={"Từ vựng · " + VOCAB.length + " từ theo chủ đề"}
        title="Từ vựng"
        sub={"Đã thuộc " + learned + "/" + VOCAB.length + " từ"}
        right={<div className={"px-3 py-1 rounded-full text-[13px] font-semibold shrink-0 " + T.accentSoft}>{deck.length} từ trong bộ</div>} />
      <div className="mb-5"><Bar value={pct(learned, VOCAB.length)} T={T} /></div>

      <ModeToggle />

      <SectionTitle T={T}>Chọn bộ từ</SectionTitle>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 mb-5">
        {decks.map((d) => (
          <button key={d.key} onClick={() => setDeckKey(d.key)} style={{ minHeight: 44 }}
            className={"shrink-0 px-4 rounded-full text-base font-medium border transition-colors " +
              (d.key === deckKey ? "bg-accent text-white border-accent" : T.card + " " + T.line + " " + T.softText)}>
            {d.label} <span className="opacity-70">{d.n}</span>
          </button>
        ))}
      </div>

      <SectionTitle T={T}>Chọn cách học</SectionTitle>
      {deck.length === 0 ? (
        <div className={"rounded-2xl border p-6 text-center mb-4 " + T.card + " " + T.line}>
          <p className="text-base font-medium mb-1">Bộ này đang trống</p>
          <p className={"text-base " + T.sub}>
            {deckKey === "__due" ? "Hôm nay không còn thẻ nào đến hạn. Chọn Chưa học để thêm từ mới." : "Bạn đã học hết các từ trong bộ này."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {VOCAB_MODES.map((m) => {
            const Icon = m.Icon;
            const tooSmall = m.key === "match" && deck.length < 2;
            return (
              <button key={m.key} onClick={() => !tooSmall && setMode(m.key)} disabled={tooSmall}
                className={"w-full text-left rounded-2xl border p-4 flex items-center gap-4 " + T.card + " " + T.line + (tooSmall ? " opacity-40" : "")}>
                <span className={"shrink-0 rounded-2xl p-3 " + T.soft}><Icon size={22} className={T.accentText} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-base font-semibold">{m.name}</span>
                  <span className={"block text-base " + T.sub}>{m.desc}</span>
                </span>
                <ChevronRight size={20} className={T.sub} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
