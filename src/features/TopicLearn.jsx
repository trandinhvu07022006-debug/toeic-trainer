import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, PartyPopper, RotateCcw, Volume2 } from "lucide-react";
import { VOCAB_TOPICS } from "../data/vocab.js";
import { pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary } from "../ui/index.jsx";
import { VocabArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   HỌC THEO CHỦ ĐỀ — giao diện thẻ chia nhóm (kiểu Parroto)
   Ba tầng: (1) danh sách chủ đề, (2) lật thẻ theo nhóm, (3) chúc mừng.
   Dùng chung srs/onGrade với chế độ SRS nên tiến độ được lưu thật.
   ═══════════════════════════════════════════════════════════════════ */

/* Một thẻ chủ đề trong lưới danh sách */
function TopicCard({ topic, learnedSet, dark, T, onOpen }) {
  const total = topic.words.length;
  const learned = topic.words.filter((w) => learnedSet.has(w.id)).length;
  const done = learned >= total && total > 0;
  const sampleId = topic.words[0]?.id;
  return (
    <button
      onClick={onOpen}
      style={{ minHeight: 88 }}
      className={"w-full text-left rounded-2xl border p-3 flex items-center gap-3 transition-colors active:scale-[0.99] " +
        (done
          ? (dark ? "bg-emerald-950 border-emerald-800" : "bg-emerald-50 border-emerald-300")
          : T.card + " " + T.line)}>
      <div className={"shrink-0 rounded-xl overflow-hidden " + T.soft} style={{ width: 52, height: 52 }}>
        <VocabArt id={sampleId} dark={dark} size={52} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{topic.topic}</p>
          {done && <Check size={16} className={dark ? "text-emerald-400" : "text-emerald-600"} />}
        </div>
        <p className={"text-sm mb-1.5 " + T.sub}>{total} thẻ</p>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? "#27272a" : "#e2e8f0" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: pct(learned, total) + "%", background: done ? "#10b981" : "var(--accent)" }} />
        </div>
      </div>
      <ChevronRight size={18} className={"shrink-0 " + T.sub} />
    </button>
  );
}

/* Màn danh sách chủ đề */
function TopicList({ learnedSet, dark, T, onOpen }) {
  const totalWords = useMemo(() => VOCAB_TOPICS.reduce((n, t) => n + t.words.length, 0), []);
  const learnedTotal = useMemo(
    () => VOCAB_TOPICS.reduce((n, t) => n + t.words.filter((w) => learnedSet.has(w.id)).length, 0),
    [learnedSet]);
  const doneTopics = VOCAB_TOPICS.filter((t) => t.words.every((w) => learnedSet.has(w.id))).length;

  return (
    <div className="px-4 pt-4">
      <div className="mb-4">
        <p className="text-lg font-bold">Học theo chủ đề</p>
        <p className={"text-sm " + T.sub}>
          {VOCAB_TOPICS.length} chủ đề · đã xong {doneTopics} · {learnedTotal}/{totalWords} từ
        </p>
      </div>
      <div className="mb-5"><Bar value={pct(learnedTotal, totalWords)} T={T} /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-4">
        {VOCAB_TOPICS.map((t) => (
          <TopicCard key={t.key} topic={t} learnedSet={learnedSet} dark={dark} T={T} onOpen={() => onOpen(t.key)} />
        ))}
      </div>
    </div>
  );
}

/* Màn chúc mừng khi học xong một nhóm */
function TopicDone({ topic, count, dark, T, onReview, onNext, onRestart, onBack, hasNext }) {
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <p className="text-lg font-bold truncate flex-1">{topic.topic}</p>
      </div>

      <div className={"rounded-2xl border p-8 text-center mb-4 " + T.card + " " + T.line}>
        <PartyPopper className={"mx-auto mb-3 " + T.accentText} size={44} />
        <p className="text-xl font-bold mb-1">Tuyệt vời!</p>
        <p className={"text-sm mb-1 " + T.sub}>Bạn đã học xong các thẻ trong nhóm này</p>
        <p className={"text-sm mb-5 " + T.sub}>Hãy nhớ ôn tập thường xuyên để nhớ lâu dài nhé!</p>
        <p className={"text-2xl font-bold mb-6 " + T.accentText}>Đã học {count}/{count} từ</p>

        <div className="space-y-2">
          {hasNext && (
            <Primary onClick={onNext}>
              <span className="flex items-center justify-center gap-2">Học nhóm tiếp theo <ChevronRight size={18} /></span>
            </Primary>
          )}
          <Ghost onClick={onReview} T={T} className="w-full">Xem lại từ vựng</Ghost>
          <button onClick={onRestart} style={{ minHeight: 48 }}
            className={"w-full rounded-2xl border font-semibold flex items-center justify-center gap-2 " +
              (dark ? "bg-rose-950 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700")}>
            <RotateCcw size={17} /> Học lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
}

/* Màn lật thẻ cho một chủ đề */
function TopicFlashcards({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const words = topic.words;
  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const current = words[i];
  const next = (grade) => {
    onGrade(current.id, grade);
    tts.stop();
    if (i + 1 >= words.length) { onDone(); return; }
    setFlipped(false);
    setI(i + 1);
  };

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold truncate">{topic.topic}</p>
          <p className={"text-sm " + T.sub}>Thẻ {i + 1}/{words.length}</p>
        </div>
      </div>
      <div className="mb-4"><Bar value={((i) / words.length) * 100} T={T} /></div>

      <div style={{ perspective: 1200 }} className="h-96 mb-5">
        <div onClick={() => setFlipped((f) => !f)}
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.55s" }}
          className="relative w-full h-full cursor-pointer">

          {/* Mặt trước */}
          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className={"absolute inset-0 rounded-2xl border flex flex-col items-center justify-center p-5 " + T.card + " " + T.line}>
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

          {/* Mặt sau */}
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

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => next(0)} style={{ minHeight: 56 }}
          className={"rounded-2xl border text-base font-semibold px-2 " +
            (dark ? "bg-amber-950 border-amber-800 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700")}>
          Cần ôn thêm
        </button>
        <button onClick={() => next(2)} style={{ minHeight: 56 }}
          className={"rounded-2xl border text-base font-semibold px-2 " +
            (dark ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700")}>
          Đã thuộc
        </button>
      </div>
      <p className={"text-sm text-center mt-3 mb-4 " + T.sub}>Lật thẻ xem nghĩa rồi tự đánh giá để lưu tiến độ.</p>
    </div>
  );
}

/* Điều phối ba tầng của chế độ học theo chủ đề */
export function TopicLearnScreen({ T, dark, tts, learnedSet, onGrade, onExitMode }) {
  const [openKey, setOpenKey] = useState(null);   // chủ đề đang mở
  const [phase, setPhase] = useState("list");     // "list" | "cards" | "done"

  const topicIdx = useMemo(() => VOCAB_TOPICS.findIndex((t) => t.key === openKey), [openKey]);
  const topic = topicIdx >= 0 ? VOCAB_TOPICS[topicIdx] : null;
  const hasNext = topicIdx >= 0 && topicIdx + 1 < VOCAB_TOPICS.length;

  const openTopic = (key) => { setOpenKey(key); setPhase("cards"); };
  const backToList = () => { tts.stop(); setOpenKey(null); setPhase("list"); };

  if (phase === "list" || !topic) {
    return <TopicList learnedSet={learnedSet} dark={dark} T={T} onOpen={openTopic} />;
  }
  if (phase === "cards") {
    return (
      <TopicFlashcards topic={topic} dark={dark} T={T} tts={tts} onGrade={onGrade}
        onDone={() => setPhase("done")} onBack={backToList} />
    );
  }
  // phase === "done"
  return (
    <TopicDone topic={topic} count={topic.words.length} dark={dark} T={T} hasNext={hasNext}
      onReview={() => setPhase("cards")}
      onRestart={() => setPhase("cards")}
      onNext={() => { if (hasNext) { setOpenKey(VOCAB_TOPICS[topicIdx + 1].key); setPhase("cards"); } }}
      onBack={backToList} />
  );
}
