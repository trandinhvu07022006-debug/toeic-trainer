import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, PartyPopper, RotateCcw, Volume2, X, List, MonitorPlay } from "lucide-react";
import { VOCAB_TOPICS } from "../data/vocab.js";
import { pct } from "../lib/scoring.js";
import { SectionTitle } from "../ui/index.jsx";
import { VocabArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   PREMIUM WEB - TỪ VỰNG (SPOTIFY x PARROTO GLOW STYLE)
   ═══════════════════════════════════════════════════════════════════ */

/* ---------- Modal Bảng Từ ---------- */
function WordListModal({ topic, onClose, dark, T, tts }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
      <div className={"w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-accent/20 border " + T.card + " " + T.line}>
        {/* Header Modal */}
        <div className={"flex items-center justify-between p-5 border-b " + T.line}>
          <p className="font-display text-xl tracking-wide">TỪ VỰNG CHỦ ĐỀ: <span className={T.accentText}>{topic.topic}</span></p>
          <button onClick={onClose} className={"p-2 rounded-full transition-colors " + T.soft}><X size={20} /></button>
        </div>

        {/* Table Giao diện Dashboard Cao Cấp */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className={"sticky top-0 z-10 backdrop-blur-xl border-b uppercase text-xs tracking-wider " + T.line + " " + T.sub}>
              <tr>
                <th className="p-5 font-bold">Word / Phrasal</th>
                <th className="p-5 font-bold">Pronunciation</th>
                <th className="p-5 font-bold hidden sm:table-cell">Type</th>
                <th className="p-5 font-bold">Translation</th>
                <th className="p-5 font-bold hidden md:table-cell">Usage Context</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topic.words.map((w, idx) => (
                <tr key={w.id} className={"border-b transition-colors " + T.line + " hover:bg-white/5"}>
                  <td className={"p-5 font-display text-[16px] tracking-wide " + T.accentText}>{w.w}</td>
                  <td className="p-5">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={"text-xs opacity-80 font-mono " + T.sub}>{w.ipa}</span>
                      <button aria-label="Nghe US" onClick={() => tts.speak(w.w, 0.9)}
                        className={"rounded-full px-2.5 py-1 w-auto inline-flex items-center gap-1.5 transition-all active:scale-95 text-[11px] font-bold " + T.soft}>
                        <Volume2 size={13} /> US
                      </button>
                    </div>
                  </td>
                  <td className="p-5 hidden sm:table-cell">
                    <span className={"rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider " + T.soft + " " + T.softText}>{w.pos}</span>
                  </td>
                  <td className="p-5 font-semibold text-[15px]">{w.vi}</td>
                  <td className={"p-5 hidden md:table-cell text-xs leading-relaxed italic opacity-80 " + T.sub}>
                    &quot;{w.ex}&quot;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Cột Trái ---------- */
function TopicCard({ topic, learnedSet, dark, T, onOpen, isActive, onOpenStats }) {
  const total = topic.words.length;
  const learned = topic.words.filter((w) => learnedSet.has(w.id)).length;
  const done = learned >= total && total > 0;
  const sampleId = topic.words[0]?.id;
  return (
    <div className={"w-full rounded-2xl border p-2 flex items-center gap-3 transition-colors " +
      (isActive ? "border-accent bg-accent/5 backdrop-blur-lg " : T.card + " " + T.line + " hover:border-gray-500/50")}>

      <button onClick={onOpen} className="flex-1 flex items-center gap-4 min-w-0 text-left active:scale-[0.98]">
        <div className={"shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-inner " + T.soft} style={{ width: 64, height: 64 }}>
          <VocabArt id={sampleId} dark={dark} size={64} />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-[15px] truncate max-w-[140px] uppercase tracking-wide">{topic.topic}</p>
            <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (done ? "bg-emerald-500/20 text-emerald-400" : T.soft)}>{pct(learned, total)}%</span>
          </div>
          <div className={"h-1.5 rounded-full overflow-hidden mt-1.5 " + T.track}>
            <div className="h-full bg-accent transition-all shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: pct(learned, total) + "%" }} />
          </div>
          <p className={"text-[11px] font-medium mt-1.5 " + T.sub}>{learned}/{total} thẻ đã thuộc</p>
        </div>
      </button>

      <button onClick={onOpenStats} aria-label="Xem từ vựng"
        className={"shrink-0 p-3 rounded-xl transition-all hover:bg-white/10 active:scale-90 mr-1 " + T.softText}>
        <List size={22} />
      </button>
    </div>
  );
}

/* ---------- Cột Phải Khung Tương Tác Glow ---------- */
function InteractiveCard({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const words = topic.words;
  const current = words[i];

  const [input, setInput] = useState("");
  const [reveal, setReveal] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  const checkNormalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

  useEffect(() => () => tts.stop(), []);

  const next = (grade) => {
    onGrade(current.id, grade);
    tts.stop();
    if (i + 1 >= words.length) { onDone(); return; }
    setInput(""); setReveal(false); setIncorrect(false); setI(i + 1);
  };

  const handleCheck = () => {
    if (reveal || !input.trim()) return;
    if (checkNormalize(input) === checkNormalize(current.w)) {
      tts.speak(current.w, 0.9); setReveal(true); setIncorrect(false);
    } else { setIncorrect(true); }
  };
  const handleSurrender = () => { setReveal(true); setIncorrect(true); };

  return (
    <div className="flex flex-col h-full animate-fade">
      {/* Header Topic */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className={"lg:hidden rounded-full p-3 transition-colors " + T.soft}><ArrowLeft size={18} /></button>
        <div className="flex-1 min-w-0">
          <p className={"font-display text-lg uppercase tracking-widest " + T.accentText}>{topic.topic}</p>
          <div className={"mt-2.5 h-1 md:max-w-[200px] rounded-full overflow-hidden " + T.track}>
            <div className="h-full bg-accent transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ width: (i / words.length) * 100 + "%" }} />
          </div>
        </div>
        <p className={"font-display text-2xl " + T.sub}>{i + 1}<span className="text-sm opacity-50">/{words.length}</span></p>
      </div>

      {/* Main Container Form */}
      <div className={"flex-1 flex flex-col items-center justify-center rounded-[32px] border p-6 lg:p-12 shadow-2xl " + T.card + " " + T.line}>
        <div className="w-full max-w-md flex flex-col items-center text-center">

          <div className={"rounded-[28px] overflow-hidden mb-6 shadow-xl " + T.line + " border"} style={{ width: 140, height: 140 }}>
            <VocabArt id={current.id} dark={dark} size={140} />
          </div>

          <p className="font-display text-[28px] tracking-wide mb-3">{current.vi}</p>
          <div className={"inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 " + T.soft + " " + T.softText}>{current.pos}</div>

          <div className={"mb-8 w-full text-[15px] space-y-2 opacity-80 px-2 lg:px-6 italic leading-relaxed " + T.sub}>
            &quot;{current.exVi}&quot;
          </div>

          {/* Khung Input Neumorphic/Glow */}
          <div className="w-full mb-8 relative">
            {reveal ? (
              <div className={"font-display text-4xl pb-4 border-b-2 tracking-wider transition-colors " + (!incorrect ? "border-emerald-500 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "border-rose-500 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]")}>
                {current.w}
              </div>
            ) : (
              <input
                autoFocus value={input} onChange={(e) => { setInput(e.target.value); setIncorrect(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }}
                placeholder="Type in English..."
                className={"w-full text-center font-display text-[26px] pb-4 border-b-2 bg-transparent outline-none transition-colors " +
                  (incorrect ? "border-red-500 text-red-500 animate-pulse" : "border-gray-500/30 focus:border-accent text-white placeholder-gray-600")}
              />
            )}
          </div>

          {/* Hành động Tương tác */}
          <div className="w-full flex gap-3">
            {!reveal ? (
              <>
                <button onClick={handleSurrender} className={"flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all " + T.soft + " hover:bg-white/20 text-white"}>
                  Skip
                </button>
                <button onClick={handleCheck} disabled={!input} className={"flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-sm glow-btn disabled:opacity-50 disabled:shadow-none"}>
                  Check
                </button>
              </>
            ) : (
              <button onClick={() => next(incorrect ? 0 : 2)} className={"w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg " + (!incorrect ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30" : "bg-white/10 hover:bg-white/20 text-white")}>
                Next Card
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Cột Phải Chúc mừng ---------- */
function TopicDone({ topic, count, dark, T, onReview, onNext, onRestart, hasNext }) {
  return (
    <div className={"flex flex-col items-center justify-center mt-12 w-full max-w-lg mx-auto rounded-[32px] border p-12 text-center shadow-2xl " + T.card + " " + T.line}>
      <PartyPopper className={"mx-auto mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] " + T.accentText} size={64} />
      <p className="font-display text-4xl mb-3 tracking-wide">AMAZING!</p>
      <p className={"text-[15px] mb-8 font-medium " + T.sub}>You've mastered the <span className="text-white">{topic.topic}</span> module</p>
      <div className={"px-6 py-2 rounded-full mb-10 bg-accent-tint border-accent"}>
        <p className={"font-display text-2xl tracking-widest " + T.accentText}>+ {count} WORDS</p>
      </div>

      <div className="w-full space-y-4">
        {hasNext && (
          <button onClick={onNext} className="w-full py-4 rounded-xl text-sm glow-btn font-bold uppercase tracking-widest">
            Next Module
          </button>
        )}
        <button onClick={onRestart} className={"w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all " + T.soft + " hover:bg-white/20"}>
          Restart Module
        </button>
      </div>
    </div>
  );
}

export function TopicLearnScreen({ T, dark, tts, learnedSet, onGrade, onExitMode }) {
  const [openKey, setOpenKey] = useState(null);
  const [phase, setPhase] = useState("list");
  const [modalTopic, setModalTopic] = useState(null);
  const topicIdx = useMemo(() => VOCAB_TOPICS.findIndex((t) => t.key === openKey), [openKey]);
  const topic = topicIdx >= 0 ? VOCAB_TOPICS[topicIdx] : null;
  const hasNext = topicIdx >= 0 && topicIdx + 1 < VOCAB_TOPICS.length;

  const openTopic = (key) => { setOpenKey(key); setPhase("cards"); };
  const backToList = () => { tts.stop(); setOpenKey(null); setPhase("list"); };

  useEffect(() => { if (!openKey && window.innerWidth >= 1024) openTopic(VOCAB_TOPICS[0].key); }, [openKey]);

  let rightContent = null;
  if (!topic) {
    rightContent = (
      <div className={"flex-1 flex flex-col items-center justify-center p-12 text-center rounded-[32px] border-2 border-dashed " + T.line}>
        <MonitorPlay size={64} className={"opacity-30 mb-5 " + T.sub} />
        <p className={"font-display text-xl uppercase opacity-50 tracking-wider " + T.sub}>Select a module to begin</p>
      </div>
    );
  } else if (phase === "cards") {
    rightContent = <InteractiveCard topic={topic} dark={dark} T={T} tts={tts} onGrade={onGrade} onDone={() => setPhase("done")} onBack={backToList} />;
  } else if (phase === "done") {
    rightContent = <TopicDone topic={topic} count={topic.words.length} dark={dark} T={T} hasNext={hasNext} onReview={() => setPhase("cards")} onRestart={() => setPhase("cards")} onNext={() => { if (hasNext) openTopic(VOCAB_TOPICS[topicIdx + 1].key); }} />;
  }

  const totalWords = useMemo(() => VOCAB_TOPICS.reduce((n, t) => n + t.words.length, 0), []);
  const learnedTotal = useMemo(() => VOCAB_TOPICS.reduce((n, t) => n + t.words.filter((w) => learnedSet.has(w.id)).length, 0), [learnedSet]);

  return (
    <>
      <div className="grid lg:grid-cols-[380px_1fr] gap-8 px-4 pt-4 lg:pt-0 items-start w-full max-w-[1400px] mx-auto min-h-[85vh]">
        <div className={`flex flex-col gap-4 ${openKey ? 'hidden lg:flex' : 'flex'} w-full rounded-3xl p-2 lg:p-0 h-[85vh] overflow-y-auto`}>
          <div className={"sticky top-0 pb-3 pt-2 z-10 mb-2 backdrop-blur-3xl"}>
            <SectionTitle T={T}>MODULE EXPLORER</SectionTitle>
            <p className={"text-xs font-bold uppercase tracking-wider " + T.sub}>Total Progress: {learnedTotal}/{totalWords} Words</p>
          </div>

          <div className="flex flex-col gap-3 pb-12">
            {VOCAB_TOPICS.map((t) => (
              <TopicCard key={t.key} topic={t} learnedSet={learnedSet} dark={dark} T={T} isActive={t.key === openKey} onOpen={() => openTopic(t.key)} onOpenStats={(e) => { e.stopPropagation(); setModalTopic(t); }} />
            ))}
          </div>
        </div>
        <div className={`w-full h-full flex flex-col ${!openKey ? 'hidden lg:flex' : 'flex'} py-2`}>
          {rightContent}
        </div>
      </div>
      {modalTopic && <WordListModal topic={modalTopic} onClose={() => setModalTopic(null)} dark={dark} T={T} tts={tts} />}
    </>
  );
}
