import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  PenTool,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Shuffle,
  Keyboard,
  FileCheck,
  Check,
  HelpCircle,
  Eye,
  ArrowLeft,
  Flame,
  Award,
} from "lucide-react";
import { VOCAB, VOCAB_TOPICS } from "../data/vocab.js";
import { VocabArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   BỘ 3 PHƯƠNG PHÁP TẬP VIẾT THÔNG MINH:
   1. GÕ CHÍNH TẢ (Active Recall & Muscle Memory Spelling)
   2. ĐIỀN TỪ VÀO CÂU (Cloze Deletion Writing in Context)
   3. GHÉP CÂU HOÀN CHỈNH (Sentence Builder / Scramble)
   ═══════════════════════════════════════════════════════════════════ */

/* 1. CHẾ ĐỘ GÕ CHÍNH TẢ TỪNG KÝ TỰ (SPELLING DRILL) */
function SpellingDrill({ words, dark, T, tts, onDone, onBack }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  const current = words[idx] || words[0];
  const target = current ? current.w.trim().toLowerCase() : "";

  useEffect(() => {
    setInput("");
    setChecked(false);
    setHintCount(0);
    if (current) tts.speak(current.w, 0.9);
    if (inputRef.current) inputRef.current.focus();
  }, [idx, current]); // eslint-disable-line react-hooks/exhaustive-deps

  const isMatch = input.trim().toLowerCase() === target;

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setChecked(true);
    if (input.trim().toLowerCase() === target) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= words.length) {
      onDone(score + (isMatch ? 1 : 0), words.length);
      return;
    }
    setIdx((i) => i + 1);
  };

  const handleHint = () => {
    if (!current) return;
    const nextHint = Math.min(hintCount + 1, target.length);
    setHintCount(nextHint);
    setInput(target.slice(0, nextHint));
    if (inputRef.current) inputRef.current.focus();
  };

  if (!current) return null;

  return (
    <div
      className={
        "rounded-3xl border p-5 sm:p-8 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      {/* Header thanh tiến độ */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Luyện Viết Chính Tả
          </span>
          <span className={"text-xs font-mono " + T.sub}>
            {idx + 1} / {words.length}
          </span>
        </div>

        <button
          onClick={() => tts.speak(current.w, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Nội dung gợi ý nghĩa & phát âm */}
      <div className="text-center max-w-lg mx-auto mb-6">
        <div className="mb-3 flex justify-center">
          <VocabArt id={current.id} dark={dark} size={84} />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
          Chủ đề: {current.topic} ({current.pos})
        </p>

        <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">
          &quot;{current.vi}&quot;
        </h3>

        <p className={"text-sm font-mono mb-4 text-accent/90"}>{current.ipa || "/.../"}</p>

        {/* Khung nhập từ tiếng Anh */}
        <form onSubmit={handleCheck} className="relative mt-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={checked}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Gõ từ tiếng Anh (${target.length} chữ cái)...`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={
              "w-full text-center text-xl sm:text-2xl font-bold py-3.5 px-4 rounded-2xl border outline-none tracking-wide transition-all " +
              (checked
                ? isMatch
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30"
                  : "bg-red-500/20 border-red-500 text-red-300 ring-2 ring-red-500/30"
                : dark
                ? "bg-[#141923] border-[#253248] text-white focus:border-accent focus:ring-2 focus:ring-accent/30"
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/30")
            }
          />
        </form>

        {/* Kết quả kiểm tra */}
        {checked && (
          <div className="mt-4 p-4 rounded-2xl border bg-black/30 border-white/10 animate-fade">
            <div className="flex items-center justify-center gap-2 mb-1">
              {isMatch ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">Chính xác tuyệt đối!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-400" />
                  <span className="text-sm font-bold text-red-400">
                    Đáp án đúng: <span className="font-mono text-white underline">{current.w}</span>
                  </span>
                </>
              )}
            </div>

            {current.ex && (
              <p className={"text-xs italic mt-2 leading-relaxed " + T.sub}>
                &quot;{current.ex}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chân trang điều khiển */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 max-w-lg mx-auto">
        {!checked ? (
          <>
            <button
              type="button"
              onClick={handleHint}
              className={"px-4 py-2.5 rounded-xl border text-xs font-bold transition-all " + T.soft + " " + T.line}
            >
              💡 Gợi ý ({target.length - hintCount} chữ)
            </button>
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="px-8 py-2.5 rounded-xl bg-accent text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all disabled:opacity-40"
            >
              Kiểm tra (Enter)
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{idx + 1 >= words.length ? "Hoàn thành bài tập" : "Từ kế tiếp"}</span>
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/* 2. CHẾ ĐỘ ĐIỀN TỪ VÀO CÂU NGỮ CẢNH (CLOZE WRITING IN CONTEXT) */
function ClozeWritingDrill({ words, dark, T, tts, onDone, onBack }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const current = words[idx] || words[0];
  const target = current ? current.w.trim().toLowerCase() : "";

  // Tạo câu khuyết từ
  const blanked = useMemo(() => {
    if (!current || !current.ex) return { pre: "She will ", post: " the meeting." };
    const ex = current.ex;
    const re = new RegExp(`\\b${current.w}\\b`, "i");
    const m = ex.match(re);
    if (m && m.index !== undefined) {
      return {
        pre: ex.slice(0, m.index),
        post: ex.slice(m.index + m[0].length),
      };
    }
    return { pre: ex.slice(0, Math.floor(ex.length / 2)) + " ", post: " " + ex.slice(Math.floor(ex.length / 2)) };
  }, [current]);

  const isMatch = input.trim().toLowerCase() === target;

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setChecked(true);
    if (isMatch) setScore((s) => s + 1);
    tts.speak(current.ex, 0.9);
  };

  const handleNext = () => {
    setInput("");
    setChecked(false);
    if (idx + 1 >= words.length) {
      onDone(score + (isMatch ? 1 : 0), words.length);
      return;
    }
    setIdx((i) => i + 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "rounded-3xl border p-5 sm:p-8 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Điền Từ Vào Câu Ngữ Cảnh ({idx + 1} / {words.length})
        </span>
        <button
          onClick={() => tts.speak(current.ex, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm cả câu"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <div className="max-w-xl mx-auto my-6 text-center">
        <p className="text-xs uppercase font-bold tracking-wider text-accent mb-2">
          Gợi ý nghĩa: {current.vi} ({current.pos})
        </p>

        {/* Khung câu ngữ cảnh có chỗ trống */}
        <div className="p-6 rounded-2xl bg-black/25 border border-white/10 my-4 text-left leading-relaxed text-base sm:text-lg">
          <span className="text-white/90">{blanked.pre}</span>
          <span className="inline-block mx-1.5 border-b-2 border-accent font-bold text-accent px-2 min-w-[100px] text-center">
            {checked ? (
              <span className={isMatch ? "text-emerald-400" : "text-red-400"}>
                {input.trim() || "______"}
              </span>
            ) : (
              input || "______"
            )}
          </span>
          <span className="text-white/90">{blanked.post}</span>
        </div>

        {current.exVi && (
          <p className={"text-xs sm:text-sm italic mb-4 " + T.sub}>
            Dịch: &quot;{current.exVi}&quot;
          </p>
        )}

        <form onSubmit={handleCheck} className="flex gap-2 max-w-md mx-auto mt-4">
          <input
            type="text"
            value={input}
            disabled={checked}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Gõ từ: ${current.w[0]}...`}
            autoComplete="off"
            className={
              "flex-1 px-4 py-3 text-sm sm:text-base font-bold rounded-2xl border outline-none " +
              (dark ? "bg-[#141923] border-[#253248] text-white focus:border-accent" : "bg-gray-50 border-gray-300 text-gray-900")
            }
          />
          {!checked ? (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm shadow-md disabled:opacity-40"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md"
            >
              Tiếp tục →
            </button>
          )}
        </form>

        {checked && !isMatch && (
          <p className="text-xs text-red-400 font-bold mt-3 animate-fade">
            Từ chính xác là: <span className="font-mono text-white underline text-sm">{current.w}</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* 3. CHẾ ĐỘ GHÉP TỪ THÀNH CÂU (SENTENCE SCRAMBLE BUILDER) */
function SentenceBuilderDrill({ words, dark, T, tts, onDone, onBack }) {
  const [idx, setIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [poolWords, setPoolWords] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const current = words[idx] || words[0];

  // Tách câu thành danh sách từ xáo trộn
  useEffect(() => {
    if (!current || !current.ex) return;
    const cleaned = current.ex.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    const shuffled = parts
      .map((w, i) => ({ id: `${w}-${i}`, text: w }))
      .sort(() => 0.5 - Math.random());
    setPoolWords(shuffled);
    setSelectedWords([]);
    setChecked(false);
  }, [idx, current]);

  const targetSentence = current ? current.ex.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").trim().toLowerCase() : "";
  const currentSentence = selectedWords.map((w) => w.text).join(" ").toLowerCase();
  const isMatch = currentSentence === targetSentence;

  const handlePickWord = (wordObj) => {
    if (checked) return;
    setPoolWords((p) => p.filter((w) => w.id !== wordObj.id));
    setSelectedWords((s) => [...s, wordObj]);
  };

  const handleRemoveWord = (wordObj) => {
    if (checked) return;
    setSelectedWords((s) => s.filter((w) => w.id !== wordObj.id));
    setPoolWords((p) => [...p, wordObj]);
  };

  const handleCheck = () => {
    setChecked(true);
    if (isMatch) setScore((s) => s + 1);
    if (current) tts.speak(current.ex, 0.9);
  };

  const handleNext = () => {
    if (idx + 1 >= words.length) {
      onDone(score + (isMatch ? 1 : 0), words.length);
      return;
    }
    setIdx((i) => i + 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "rounded-3xl border p-5 sm:p-8 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Ghép Câu Hoàn Chỉnh ({idx + 1} / {words.length})
        </span>
        <button
          onClick={() => tts.speak(current.ex, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <div className="max-w-xl mx-auto my-4 text-center">
        <p className="text-xs uppercase font-bold tracking-wider text-accent mb-1">
          Nghĩa tiếng Việt của câu
        </p>
        <h4 className="text-lg sm:text-xl font-bold mb-4 text-white">
          &quot;{current.exVi || current.vi}&quot;
        </h4>

        {/* Khung câu đang ghép */}
        <div
          className={
            "min-h-[90px] p-4 rounded-2xl border flex flex-wrap gap-2 items-center justify-center transition-all " +
            (checked
              ? isMatch
                ? "bg-emerald-500/15 border-emerald-500/50"
                : "bg-red-500/15 border-red-500/50"
              : dark
              ? "bg-[#151c2b] border-[#253248]"
              : "bg-gray-50 border-gray-200")
          }
        >
          {selectedWords.length === 0 ? (
            <span className={"text-xs italic " + T.sub}>
              Chạm vào các từ bên dưới để ghép thành câu hoàn chỉnh
            </span>
          ) : (
            selectedWords.map((w) => (
              <button
                key={w.id}
                onClick={() => handleRemoveWord(w)}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-white font-bold text-xs sm:text-sm shadow-sm hover:scale-95 transition-transform"
              >
                {w.text}
              </button>
            ))
          )}
        </div>

        {/* Kho từ xáo trộn để chọn */}
        <div className="flex flex-wrap gap-2 justify-center my-6 min-h-[80px]">
          {poolWords.map((w) => (
            <button
              key={w.id}
              onClick={() => handlePickWord(w)}
              className={
                "px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all hover:scale-105 active:scale-95 " +
                (dark ? "bg-[#182030] hover:bg-[#202b40] border-[#29354d] text-gray-200" : "bg-white hover:bg-gray-100 border-gray-300 text-gray-900 shadow-sm")
              }
            >
              {w.text}
            </button>
          ))}
        </div>

        {/* Điều khiển kiểm tra & hoàn thành */}
        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={poolWords.length > 0}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-accent text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-40"
            >
              Kiểm tra câu
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              {idx + 1 >= words.length ? "Hoàn thành bài tập" : "Câu tiếp theo →"}
            </button>
          )}
        </div>

        {checked && !isMatch && (
          <p className="text-xs text-red-400 font-bold mt-3">
            Câu chuẩn: <span className="text-white italic">&quot;{current.ex}&quot;</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MÀN HÌNH CHÍNH WRITING SCREEN (TRUNG TÂM LUYỆN VIẾT THÔNG MINH)
   ═══════════════════════════════════════════════════════════════════ */
export function WritingScreen({ T, dark, tts, srs = {}, onSaveWord }) {
  const [activeDrill, setActiveDrill] = useState(null); // null | "spelling" | "cloze" | "scramble"
  const [selectedTopic, setSelectedTopic] = useState(VOCAB_TOPICS[0]?.key || "");
  const [result, setResult] = useState(null);

  const topic = useMemo(() => {
    return VOCAB_TOPICS.find((t) => t.key === selectedTopic) || VOCAB_TOPICS[0];
  }, [selectedTopic]);

  const words = useMemo(() => {
    if (!topic || !topic.words) return VOCAB.slice(0, 10);
    return topic.words.slice(0, 15);
  }, [topic]);

  const handleDone = (correct, total) => {
    setResult({ correct, total });
    setActiveDrill(null);
  };

  if (activeDrill === "spelling") {
    return (
      <SpellingDrill
        words={words}
        dark={dark}
        T={T}
        tts={tts}
        onDone={handleDone}
        onBack={() => setActiveDrill(null)}
      />
    );
  }

  if (activeDrill === "cloze") {
    return (
      <ClozeWritingDrill
        words={words}
        dark={dark}
        T={T}
        tts={tts}
        onDone={handleDone}
        onBack={() => setActiveDrill(null)}
      />
    );
  }

  if (activeDrill === "scramble") {
    return (
      <SentenceBuilderDrill
        words={words}
        dark={dark}
        T={T}
        tts={tts}
        onDone={handleDone}
        onBack={() => setActiveDrill(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 pb-12 animate-fade">
      {/* Header Giới Thiệu Phân Hệ Tập Viết */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-white shadow-sm flex items-center gap-1.5">
            <PenTool size={13} />
            Phương Pháp Học Kích Hoạt Vận Động
          </span>
          <span className={"text-xs font-bold " + T.sub}>Ghi nhớ từ vựng sâu gấp 3 lần</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Phân Hệ Luyện Viết & Ghi Nhớ Chủ Động
        </h1>
        <p className={"text-xs sm:text-sm mt-1.5 leading-relaxed max-w-2xl " + T.sub}>
          Kết hợp 3 phương pháp tập viết thông minh: <strong>Gõ chính tả (Spelling)</strong>,{" "}
          <strong>Điền từ ngữ cảnh (Cloze Deletion)</strong> và{" "}
          <strong>Xếp từ thành câu (Sentence Scramble)</strong> giúp từ vựng đi thẳng vào trí nhớ dài hạn.
        </p>
      </div>

      {/* Thông báo kết quả bài trước (nếu có) */}
      {result && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-emerald-300">Hoàn thành lượt luyện viết!</p>
              <p className="text-xs text-emerald-400/80">
                Đúng {result.correct} / {result.total} câu ({Math.round((result.correct / result.total) * 100)}%)
              </p>
            </div>
          </div>
          <button
            onClick={() => setResult(null)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Chọn chủ đề luyện viết */}
      <div className="mb-6">
        <label className={"block text-xs font-bold uppercase tracking-wider mb-2 text-accent"}>
          Chọn Chủ Đề Luyện Viết (Hơn 64 Chủ Đề):
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className={
            "w-full sm:w-auto px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold focus:outline-none transition-all " +
            (dark
              ? "bg-[#141923] border-[#253248] text-white focus:border-accent"
              : "bg-white border-gray-300 text-gray-900 focus:border-accent shadow-sm")
          }
        >
          {VOCAB_TOPICS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.topic} ({t.words.length} từ)
            </option>
          ))}
        </select>
      </div>

      {/* 3 Thẻ Phương Pháp Luyện Viết Thông Minh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Phương pháp 1: Gõ chính tả */}
        <div
          className={
            "rounded-3xl border p-6 flex flex-col justify-between transition-all hover:border-accent/40 hover:-translate-y-1 shadow-lg " +
            (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200")
          }
        >
          <div>
            <div className="h-12 w-12 rounded-2xl bg-red-500/15 text-accent flex items-center justify-center mb-4">
              <Keyboard size={24} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">
              Phương Pháp 1
            </span>
            <h3 className="text-lg font-bold mt-1 mb-2">Gõ Chính Tả Cơ Bắp</h3>
            <p className={"text-xs leading-relaxed " + T.sub}>
              Đọc nghĩa và nghe phát âm, tự gõ lại chính xác từng ký tự tiếng Anh. Kích hoạt trí nhớ vận động cơ bắp (Muscle Memory).
            </p>
          </div>

          <button
            onClick={() => setActiveDrill("spelling")}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Luyện gõ chính tả</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Phương pháp 2: Điền từ vào câu */}
        <div
          className={
            "rounded-3xl border p-6 flex flex-col justify-between transition-all hover:border-accent/40 hover:-translate-y-1 shadow-lg " +
            (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200")
          }
        >
          <div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
              <FileCheck size={24} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Phương Pháp 2
            </span>
            <h3 className="text-lg font-bold mt-1 mb-2">Điền Từ Ngữ Cảnh</h3>
            <p className={"text-xs leading-relaxed " + T.sub}>
              Phương pháp Cloze Deletion được đại học Cambridge khuyên dùng: Viết từ vựng vào đúng chỗ trống trong câu văn công sở thực tế.
            </p>
          </div>

          <button
            onClick={() => setActiveDrill("cloze")}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Điền từ vào câu</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Phương pháp 3: Ghép câu hoàn chỉnh */}
        <div
          className={
            "rounded-3xl border p-6 flex flex-col justify-between transition-all hover:border-accent/40 hover:-translate-y-1 shadow-lg " +
            (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200")
          }
        >
          <div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
              <Shuffle size={24} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              Phương Pháp 3
            </span>
            <h3 className="text-lg font-bold mt-1 mb-2">Ghép Câu Cấu Trúc</h3>
            <p className={"text-xs leading-relaxed " + T.sub}>
              Sắp xếp các khối từ vựng xáo trộn thành một câu hoàn chỉnh chuẩn ngữ pháp TOEIC Part 5 & 6, giúp não bộ nắm vững cấu trúc viết.
            </p>
          </div>

          <button
            onClick={() => setActiveDrill("scramble")}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ghép câu hoàn chỉnh</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

