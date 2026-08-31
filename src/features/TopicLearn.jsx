import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, PartyPopper, RotateCcw, Volume2, X, List, MonitorPlay } from "lucide-react";
import { VOCAB_TOPICS, VOCAB } from "../data/vocab.js";
import { pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary, SectionTitle } from "../ui/index.jsx";
import { VocabArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   KMG CLUB - HỌC TỪ VỰNG CHUẨN WEB (2 CỘT PARROTO CLONE)
   ═══════════════════════════════════════════════════════════════════ */

/* ---------- Bảng Liệt Kê Các Từ Trong Nhóm (Modal) ---------- */
function WordListModal({ topic, onClose, dark, T, tts }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className={"w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border-4 border-black overflow-hidden " + (dark ? "bg-[#111]" : "bg-white")}>
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-black text-white">
          <p className="font-display text-lg tracking-wide uppercase">Các từ trong nhóm này: {topic.topic}</p>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors"><X size={24} /></button>
        </div>

        {/* Bảng Từ */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className={"sticky top-0 z-10 border-b-4 border-black uppercase text-xs font-bold " + (dark ? "bg-gray-900" : "bg-gray-100")}>
              <tr>
                <th className="p-4">Từ Vựng</th>
                <th className="p-4">IPA / Đọc</th>
                <th className="p-4 hidden sm:table-cell">Loại Từ</th>
                <th className="p-4">Bản Dịch</th>
                <th className="p-4 hidden md:table-cell">Ví dụ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topic.words.map((w, idx) => (
                <tr key={w.id} className={"border-b border-gray-300 dark:border-gray-800 transition-colors " + (dark ? "hover:bg-gray-800" : "hover:bg-gray-50")}>
                  <td className="p-4 font-bold text-[16px] text-accent">{w.w}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs opacity-70 mb-1">{w.ipa}</span>
                      <button aria-label="Nghe US" onClick={() => tts.speak(w.w, 0.9)} className="border-2 border-black rounded px-2 py-0.5 w-auto inline-flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] font-bold"><Volume2 size={12} /> US</button>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><span className="border-2 border-black rounded px-2 py-0.5 text-[10px] font-bold uppercase">{w.pos}</span></td>
                  <td className="p-4 font-semibold">{w.vi}</td>
                  <td className="p-4 hidden md:table-cell text-xs leading-relaxed italic opacity-80">&quot;{w.ex}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/* ---------- Cột Trái: Danh sách chủ đề ---------- */
function TopicCard({ topic, learnedSet, dark, T, onOpen, isActive, onOpenStats }) {
  const total = topic.words.length;
  const learned = topic.words.filter((w) => learnedSet.has(w.id)).length;
  const done = learned >= total && total > 0;
  const sampleId = topic.words[0]?.id;
  return (
    <div className={"w-full rounded-xl border-4 p-3 flex items-center gap-3 transition-colors " +
      (isActive ? "border-accent bg-accent/5 dark:bg-accent/10 " : (dark ? "border-gray-800 bg-[#111]" : "border-black bg-white"))}>

      <button onClick={onOpen} className="flex-1 flex items-center gap-3 min-w-0 text-left active:scale-[0.98]">
        <div className={"shrink-0 flex items-center justify-center border-2 border-black rounded-lg overflow-hidden " + (dark ? "bg-[#222]" : "bg-gray-200")} style={{ width: 56, height: 56 }}>
          <VocabArt id={sampleId} dark={dark} size={56} />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center justify-between mb-1">
            <p className="font-display text-[15px] truncate max-w-[140px] uppercase">{topic.topic}</p>
            <span className={"text-[11px] font-bold px-1.5 py-0.5 rounded border-2 border-black " + (done ? "bg-black text-white" : "")}>{pct(learned, total)}%</span>
          </div>
          <div className="h-2 border-2 border-black rounded-full overflow-hidden bg-white dark:bg-gray-900 mt-1">
            <div className="h-full bg-accent transition-all" style={{ width: pct(learned, total) + "%" }} />
          </div>
          <p className={"text-[11px] font-semibold mt-1 opacity-70"}>{learned}/{total} thẻ</p>
        </div>
      </button>

      <button onClick={onOpenStats} aria-label="Xem từ vựng" className={"shrink-0 p-2.5 rounded-lg border-2 border-black transition-colors hover:bg-black hover:text-white " + (dark ? "bg-[#222] text-white" : "bg-gray-100")}>
        <List size={20} />
      </button>
    </div>
  );
}


/* ---------- Cột Phải: Khung Gõ Từ (Thay thế Lật Thẻ) ---------- */
function InteractiveCard({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const words = topic.words;
  const current = words[i];

  const [input, setInput] = useState("");
  const [reveal, setReveal] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  // Normalize checking
  const checkNormalize = (s) => {
    let t = (s || "").toLowerCase();
    try { t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) { }
    return t.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  };

  useEffect(() => () => tts.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const next = (grade) => {
    onGrade(current.id, grade);
    tts.stop();
    if (i + 1 >= words.length) { onDone(); return; }

    // Reset state for next card
    setInput("");
    setReveal(false);
    setIncorrect(false);
    setI(i + 1);
  };

  const handleCheck = () => {
    if (reveal) return; // If already revealed, do nothing or go next.
    if (!input.trim()) return;

    if (checkNormalize(input) === checkNormalize(current.w)) { // Correct
      tts.speak(current.w, 0.9);
      setReveal(true);
      setIncorrect(false);
      // Auto advance after correct or just show it glowing green?
      // Let's force them to hit "Tiếp tục" or auto next after 1.5s
    } else { // Wrong
      setIncorrect(true);
    }
  };

  const handleSurrender = () => {
    setReveal(true);
    setIncorrect(true); // Treat as wrong/unknown
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Topic */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} aria-label="Quay lại list (Mobile)" style={{ minHeight: 44, minWidth: 44 }} className="lg:hidden rounded-full border-2 border-black p-2 flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <p className="font-display text-xl uppercase tracking-widest text-accent">{topic.topic}</p>
          <div className="mt-2 h-1.5 border-black border max-w-[200px] lg:max-w-md mx-auto lg:mx-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: (i / words.length) * 100 + "%" }} />
          </div>
        </div>
        <p className="font-display text-2xl px-2">{i + 1}/{words.length}</p>
      </div>

      {/* Main Container Học */}
      <div className={"flex-1 flex flex-col items-center justify-center rounded-2xl border-4 p-5 lg:p-8 " + (dark ? "bg-[#0a0a0a] border-[#222]" : "bg-white border-black")}>

        <div className="w-full max-w-lg flex flex-col items-center text-center animate-fade">
          <div className="rounded-2xl border-4 border-black overflow-hidden mb-6 shadow-md" style={{ width: 140, height: 140 }}>
            <VocabArt id={current.id} dark={dark} size={140} />
          </div>

          <p className="font-display text-[26px] mb-2">{current.vi}</p>
          <div className="inline-block px-3 py-1 bg-black text-white rounded textxs font-bold uppercase mb-4">{current.pos}</div>

          {/* Hint / Definitions - Hiện lên nếu sai quá nhiều hoặc khi Reveal */}
          <div className="mb-6 w-full text-[15px] space-y-2 opacity-80 px-2 lg:px-6">
            <p className="italic">&quot;{current.exVi}&quot;</p>
          </div>

          {/* Input Gõ Khác Thường */}
          <div className="w-full mb-6 relative">
            {reveal ? (
              <div className={"font-display text-4xl py-3 border-b-4 tracking-wider transition-colors " + (!incorrect ? "border-green-500 text-green-500" : "border-red-600 text-red-600")}>
                {current.w}
              </div>
            ) : (
              <input
                autoFocus
                value={input}
                onChange={(e) => { setInput(e.target.value); setIncorrect(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }}
                placeholder="Nhập từ tiếng Anh..."
                className={"w-full text-center font-display text-2xl lg:text-3xl py-4 border-b-4 bg-transparent outline-none transition-colors " +
                  (incorrect ? "border-red-500 text-red-500 animate-pulse" : (dark ? "border-gray-700 text-white focus:border-accent" : "border-gray-300 text-black focus:border-black"))}
              />
            )}
          </div>

          {/* Actions */}
          <div className="w-full flex gap-3">
            {!reveal ? (
              <>
                <button onClick={handleSurrender} className="flex-1 py-4 font-display uppercase tracking-widest text-sm lg:text-base border-4 border-black bg-white hover:bg-gray-100 text-black transition-transform active:translate-y-1">
                  Không biết
                </button>
                <button onClick={handleCheck} disabled={!input} className="flex-1 py-4 font-display uppercase tracking-widest text-sm lg:text-base border-4 border-black bg-accent hover:bg-red-700 text-white transition-transform active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0">
                  Kiểm tra
                </button>
              </>
            ) : (
              <button onClick={() => next(incorrect ? 0 : 2)} className={"w-full py-4 font-display uppercase tracking-widest text-lg border-4 border-black transition-transform active:translate-y-1 text-white " + (!incorrect ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-900")}>
                Tiếp tục
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


/* ---------- Cột Phải: Màn hình Chúc Mừng (Done) ---------- */
function TopicDone({ topic, count, dark, T, onReview, onNext, onRestart, hasNext }) {
  return (
    <div className={"flex flex-col items-center justify-center mt-12 w-full max-w-lg mx-auto rounded-3xl border-4 border-black p-8 text-center " + (dark ? "bg-[#111]" : "bg-white")}>
      <PartyPopper className={"mx-auto mb-4 text-accent"} size={56} />
      <p className="font-display text-3xl mb-2">QUÁ ĐỈNH!</p>
      <p className={"text-base mb-6 font-bold " + T.sub}>Bạn đã cày xong bài {topic.topic}</p>
      <p className={"font-display text-4xl mb-8 " + T.accentText}>+ {count} TỪ VỰNG</p>

      <div className="w-full space-y-3">
        {hasNext && (
          <button onClick={onNext} className="w-full py-4 text-lg border-4 border-black bg-accent text-white font-display uppercase tracking-widest hover:bg-red-700 active:translate-y-1 transition-all">
            Học nhóm tiếp theo
          </button>
        )}
        <button onClick={onRestart} className={"w-full py-4 text-lg border-4 border-black font-display uppercase tracking-widest active:translate-y-1 transition-all " + (dark ? "bg-[#222] text-white hover:bg-gray-800" : "bg-gray-100 text-black hover:bg-gray-200")}>
          Luyện lại từ đầu
        </button>
      </div>
    </div>
  );
}


/* ---------- Điều phối Layout 2 Cột Desktop / Trượt Mobile ---------- */
export function TopicLearnScreen({ T, dark, tts, learnedSet, onGrade, onExitMode }) {
  const [openKey, setOpenKey] = useState(null);
  const [phase, setPhase] = useState("list");     // "list" | "cards" | "done"
  const [modalTopic, setModalTopic] = useState(null);

  const topicIdx = useMemo(() => VOCAB_TOPICS.findIndex((t) => t.key === openKey), [openKey]);
  const topic = topicIdx >= 0 ? VOCAB_TOPICS[topicIdx] : null;
  const hasNext = topicIdx >= 0 && topicIdx + 1 < VOCAB_TOPICS.length;

  const openTopic = (key) => { setOpenKey(key); setPhase("cards"); };
  const backToList = () => { tts.stop(); setOpenKey(null); setPhase("list"); };

  // Nếu Desktop, tự động mở Topic đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!openKey && window.innerWidth >= 1024) {
      openTopic(VOCAB_TOPICS[0].key);
    }
  }, [openKey]);

  // View cho Cột Phải
  let rightContent = null;
  if (!topic) {
    rightContent = (
      <div className={"flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl border-4 border-dashed border-gray-300 dark:border-gray-800 " + T.sub}>
        <MonitorPlay size={64} className="opacity-30 mb-4" />
        <p className="font-display text-xl uppercase opacity-60">Chọn chủ đề bên trái để bắt đầu luyện</p>
      </div>
    );
  } else if (phase === "cards") {
    rightContent = (
      <InteractiveCard topic={topic} dark={dark} T={T} tts={tts} onGrade={onGrade} onDone={() => setPhase("done")} onBack={backToList} />
    );
  } else if (phase === "done") {
    rightContent = (
      <TopicDone topic={topic} count={topic.words.length} dark={dark} T={T} hasNext={hasNext}
        onReview={() => setPhase("cards")}
        onRestart={() => setPhase("cards")}
        onNext={() => { if (hasNext) openTopic(VOCAB_TOPICS[topicIdx + 1].key); }} />
    );
  }

  // Tracking progress
  const totalWords = useMemo(() => VOCAB_TOPICS.reduce((n, t) => n + t.words.length, 0), []);
  const learnedTotal = useMemo(() => VOCAB_TOPICS.reduce((n, t) => n + t.words.filter((w) => learnedSet.has(w.id)).length, 0), [learnedSet]);

  return (
    <>
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 px-4 pt-4 items-start w-full max-w-[1400px] mx-auto min-h-[80vh]">

        {/* CỘT TRÁI (DANH SÁCH CHỦ ĐỀ) - Ẩn trên mobile khi đang học */}
        <div className={`flex flex-col gap-4 ${openKey ? 'hidden lg:flex' : 'flex'} w-full bg-white dark:bg-[#0a0a0a] rounded-xl lg:border-4 border-black p-2 lg:p-4 h-[80vh] overflow-y-auto`}>
          <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] pb-2 z-10 border-b-4 border-black mb-2">
            <SectionTitle T={T}>DANH SÁCH CHỦ ĐỀ</SectionTitle>
            <p className={"text-sm font-bold uppercase " + T.sub}>Tiến độ: {learnedTotal}/{totalWords} từ</p>
          </div>

          <div className="flex flex-col gap-3 pb-8">
            {VOCAB_TOPICS.map((t) => (
              <TopicCard
                key={t.key}
                topic={t}
                learnedSet={learnedSet}
                dark={dark} T={T}
                isActive={t.key === openKey}
                onOpen={() => openTopic(t.key)}
                onOpenStats={(e) => { e.stopPropagation(); setModalTopic(t); }}
              />
            ))}
          </div>
        </div>

        {/* CỘT PHẢI (MAIN INTERACTION) - Ẩn trên mobile khi chưa chọn Topic */}
        <div className={`w-full h-full flex flex-col ${!openKey ? 'hidden lg:flex' : 'flex'}`}>
          {rightContent}
        </div>
      </div>

      {modalTopic && (
        <WordListModal topic={modalTopic} onClose={() => setModalTopic(null)} dark={dark} T={T} tts={tts} />
      )}
    </>
  );
}
