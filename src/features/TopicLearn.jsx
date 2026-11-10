import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Volume2,
  X,
  List,
  RotateCcw,
  Sparkles,
  Layers,
  ListChecks,
  Shuffle,
  VolumeX,
  Settings,
  HelpCircle,
  Lightbulb,
  Mic,
  ArrowRightLeft,
  Eye,
  Award,
  Search,
} from "lucide-react";
import { VOCAB_TOPICS, VOCAB } from "../data/vocab.js";
import { pct } from "../lib/scoring.js";
import { VocabArt } from "../ui/art.jsx";
import { ParrotoMascot } from "../ui/ParrotoMascot.jsx";

/* ═══════════════════════════════════════════════════════════════════
   1. MODAL BẢNG XEM TOÀN BỘ TỪ VỰNG CỦA CHỦ ĐỀ
   ═══════════════════════════════════════════════════════════════════ */
function WordListModal({ topic, onClose, dark, T, tts }) {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade">
      <div
        className={
          "w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border " +
          T.card +
          " " +
          T.line
        }
      >
        {/* Header Modal */}
        <div className={"flex items-center justify-between p-5 border-b " + T.line}>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-accent">Danh sách từ vựng</p>
            <h3 className="text-xl font-bold">{topic.topic}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className={"p-2 rounded-full transition-colors " + T.soft}
          >
            <X size={20} />
          </button>
        </div>

        {/* Bảng từ vựng */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead
              className={
                "sticky top-0 z-10 backdrop-blur-xl border-b uppercase text-xs tracking-wider " +
                T.line +
                " " +
                T.sub
              }
            >
              <tr>
                <th className="p-4 font-bold">Từ vựng</th>
                <th className="p-4 font-bold">Phát âm</th>
                <th className="p-4 font-bold hidden sm:table-cell">Loại</th>
                <th className="p-4 font-bold">Nghĩa tiếng Việt</th>
                <th className="p-4 font-bold hidden md:table-cell">Ví dụ ngữ cảnh</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {topic.words.map((w) => (
                <tr
                  key={w.id}
                  className={"transition-colors hover:bg-white/[0.03] " + T.line}
                >
                  <td className="p-4 font-bold text-base text-accent">{w.w}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={"text-xs font-mono " + T.sub}>{w.ipa}</span>
                      <button
                        onClick={() => tts.speak(w.w, 0.9)}
                        aria-label="Nghe"
                        className={"p-1.5 rounded-full transition-all active:scale-90 " + T.soft}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={"rounded-md px-2 py-0.5 text-xs font-semibold " + T.soft}>
                      {w.pos}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-[15px]">{w.vi}</td>
                  <td className={"p-4 hidden md:table-cell text-xs leading-relaxed italic " + T.sub}>
                    &quot;{w.ex}&quot;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={"p-4 border-t flex justify-end " + T.line}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-accent text-white shadow-md active:scale-95 transition-all"
          >
            Đóng bảng từ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. THẺ CHỦ ĐỀ TRONG DANH SÁCH BÊN TRÁI (LEFT TOPIC CARD)
   ═══════════════════════════════════════════════════════════════════ */
function TopicCard({
  topic,
  learnedSet,
  dark,
  T,
  isSelected,
  onSelect,
}) {
  const total = topic.words.length;
  const learned = topic.words.filter((w) => learnedSet.has(w.id)).length;
  const isCompleted = learned >= total && total > 0;
  const inProgress = learned > 0 && learned < total;
  const progressPercent = pct(learned, total);

  const sampleId = topic.words[0]?.id;

  return (
    <button
      onClick={onSelect}
      className={
        "w-full rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left transition-all border active:scale-[0.99] " +
        (isSelected
          ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-600/30 ring-2 ring-red-400/40"
          : dark
          ? "bg-[#141923] hover:bg-[#1a212f] border-[#222b3d] text-gray-200"
          : "bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm")
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Khung Icon tròn/bo góc với minh hoạ */}
        <div
          className={
            "shrink-0 h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden border " +
            (isSelected
              ? "bg-white/20 border-white/30"
              : dark
              ? "bg-[#0c1017] border-white/10"
              : "bg-gray-100 border-gray-200")
          }
        >
          <VocabArt id={sampleId} dark={dark || isSelected} size={44} />
        </div>

        {/* Tiêu đề & Tiến độ */}
        <div className="min-w-0">
          <p className={"font-bold text-[15px] truncate " + (isSelected ? "text-white" : "")}>
            {topic.topic}
          </p>
          <p
            className={
              "text-xs mt-0.5 font-medium " +
              (isSelected ? "text-white/80" : T.sub)
            }
          >
            {learned}/{total} thẻ
          </p>
        </div>
      </div>

      {/* Huy hiệu trạng thái góc phải (Check xanh / % Cam / Gạch ngang) */}
      <div className="shrink-0">
        {isCompleted ? (
          <div
            className={
              "h-7 w-7 rounded-full flex items-center justify-center border " +
              (isSelected
                ? "bg-white text-red-600 border-white"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40")
            }
          >
            <Check size={16} strokeWidth={3} />
          </div>
        ) : inProgress ? (
          <span
            className={
              "text-xs font-bold px-2 py-0.5 rounded-full border " +
              (isSelected
                ? "bg-white text-red-600 border-white"
                : "bg-amber-500/20 text-amber-400 border-amber-500/40")
            }
          >
            {progressPercent}%
          </span>
        ) : (
          <div
            className={
              "h-7 w-7 rounded-full flex items-center justify-center border " +
              (isSelected
                ? "bg-white/20 text-white border-white/30"
                : dark
                ? "bg-white/5 text-gray-500 border-white/10"
                : "bg-gray-100 text-gray-400 border-gray-300")
            }
          >
            <span className="text-xs font-bold">—</span>
          </div>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. BẢNG HỌC TẬP & KẾT QUẢ BÊN PHẢI (RIGHT STUDY & CELEBRATION PANEL)
   Tái hiện chính xác hình ảnh Parroto với Mascot + 3 Stat Boxes + 2 Nút
   ═══════════════════════════════════════════════════════════════════ */
function OverviewRightPanel({
  topic,
  learnedSet,
  dark,
  T,
  onStartStudy,
  onOpenWordList,
  onNextTopic,
  hasNext,
}) {
  const total = topic.words.length;
  const mastered = topic.words.filter((w) => learnedSet.has(w.id)).length;
  const learning = total - mastered;
  const reviewing = Math.round(mastered * 0.4);

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-6 sm:p-10 shadow-xl transition-all " +
        (dark
          ? "bg-[#101520] border-[#1f283a]"
          : "bg-white border-gray-200 shadow-md")
      }
    >
      {/* Vùng linh vật & Thông điệp chúc mừng */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
        {/* Mascot chim xanh đeo kính thổi kèn chúc mừng */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <ParrotoMascot size={160} />
        </div>

        {/* Tiêu đề chúc mừng */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Tuyệt vời!</h2>
        </div>

        <p className={"text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-4 " + T.sub}>
          Bạn đã hoàn thành các từ vựng trong nhóm <strong>{topic.topic}</strong>. Hãy duy trì ôn tập thường xuyên để ghi nhớ lâu dài!
        </p>

        {/* Dòng đếm số từ */}
        <p className="text-lg sm:text-xl font-bold mb-7">
          Đã học <span className="text-accent">{mastered}</span> / {total} từ
        </p>

        {/* 3 HỘP THỐNG KÊ (3 STAT BOXES - ĐẶC TRƯNG PARROTO) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-md mx-auto mb-8">
          {/* Hộp 1: Đang học (Cam / Amber) */}
          <div
            className={
              "rounded-2xl p-3 sm:p-4 border-2 text-center transition-transform hover:-translate-y-0.5 " +
              (dark
                ? "bg-amber-950/20 border-amber-500/50 text-amber-300"
                : "bg-amber-50 border-amber-400 text-amber-800")
            }
          >
            <p className="text-2xl sm:text-3xl font-black tnum mb-1 text-amber-400">
              {learning > 0 ? learning : total}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-85">Đang học</p>
          </div>

          {/* Hộp 2: Đang ôn (KMG Red / Crimson) */}
          <div
            className={
              "rounded-2xl p-3 sm:p-4 border-2 text-center transition-transform hover:-translate-y-0.5 " +
              (dark
                ? "bg-red-950/20 border-red-500/50 text-red-300"
                : "bg-red-50 border-red-400 text-red-800")
            }
          >
            <p className="text-2xl sm:text-3xl font-black tnum mb-1 text-accent">
              {reviewing}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-85">Đang ôn</p>
          </div>

          {/* Hộp 3: Thành thạo (Lục / Emerald) */}
          <div
            className={
              "rounded-2xl p-3 sm:p-4 border-2 text-center transition-transform hover:-translate-y-0.5 " +
              (dark
                ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-300"
                : "bg-emerald-50 border-emerald-400 text-emerald-800")
            }
          >
            <p className="text-2xl sm:text-3xl font-black tnum mb-1 text-emerald-400">
              {mastered}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-85">Thành thạo</p>
          </div>
        </div>
      </div>

      {/* 2 NÚT HÀNH ĐỘNG DƯỚI ĐÁY (EXACT PARROTO BUTTONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-white/10">
        <button
          onClick={onOpenWordList}
          style={{ minHeight: 52 }}
          className={
            "w-full rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border transition-all active:scale-[0.98] " +
            (dark
              ? "bg-[#182030] hover:bg-[#1f2a40] border-[#29354d] text-white"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900")
          }
        >
          <List size={18} />
          <span>XEM TỪ VỰNG</span>
        </button>

        <button
          onClick={() => {
            if (hasNext && mastered >= total) {
              onNextTopic();
            } else {
              onStartStudy();
            }
          }}
          style={{ minHeight: 52 }}
          className="w-full rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span>{hasNext && mastered >= total ? "HỌC NHÓM TIẾP THEO" : "BẮT ĐẦU LUYỆN TẬP"}</span>
          <ChevronRight size={19} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. CÁC CHẾ ĐỘ HỌC TƯƠNG TÁC (FLASHCARD, ĐOÁN TỪ, TRẮC NGHIỆM, ĐẢO, LẶP LẠI)
   ═══════════════════════════════════════════════════════════════════ */

/* 4.1. Chế độ Flashcard (Lật thẻ 2 mặt + SRS) */
function FlashcardStudyPanel({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const words = topic.words;
  const current = words[i] || words[0];

  const handleNext = (grade) => {
    if (onGrade && current) onGrade(current.id, grade);
    setFlipped(false);
    if (i + 1 >= words.length) {
      onDone();
      return;
    }
    setI((prev) => prev + 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-5 sm:p-7 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      {/* Header thanh tiến độ */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <span className={"text-xs font-bold uppercase tracking-wider " + T.sub}>
          Thẻ {i + 1} / {words.length}
        </span>
        <button
          onClick={() => tts.speak(current.w, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Thẻ lật 2 mặt */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className={
          "flex-1 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border cursor-pointer select-none text-center transition-all duration-300 min-h-[300px] " +
          (flipped
            ? "bg-accent/10 border-accent/40 shadow-inner"
            : dark
            ? "bg-[#151c2b] border-[#222d42] hover:border-accent/40"
            : "bg-gray-50 border-gray-200 hover:border-accent/40")
        }
      >
        <div className="mb-4">
          <VocabArt id={current.id} dark={dark} size={100} />
        </div>

        {!flipped ? (
          <>
            <h3 className="text-3xl sm:text-4xl font-black tracking-wide mb-2 text-white">
              {current.w}
            </h3>
            <p className={"text-sm font-mono mb-3 " + T.sub}>{current.ipa || "/.../"}</p>
            <span className={"text-xs font-bold uppercase px-3 py-1 rounded-full " + T.soft}>
              {current.pos}
            </span>
            <p className={"text-xs mt-6 opacity-60 " + T.sub}>Chạm vào thẻ để xem nghĩa tiếng Việt</p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase font-bold tracking-wider text-accent mb-1">
              Nghĩa tiếng Việt
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">{current.vi}</h3>
            {current.ex && (
              <p className={"text-sm italic max-w-md mx-auto leading-relaxed mt-2 " + T.sub}>
                &quot;{current.ex}&quot;
              </p>
            )}
          </>
        )}
      </div>

      {/* Nút đánh giá SRS 3 cấp độ */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5">
        <button
          onClick={() => handleNext(0)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all active:scale-95"
        >
          Chưa thuộc (0)
        </button>
        <button
          onClick={() => handleNext(1)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all active:scale-95"
        >
          Mơ hồ (1)
        </button>
        <button
          onClick={() => handleNext(2)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all active:scale-95"
        >
          Đã thuộc (2)
        </button>
      </div>
    </div>
  );
}

/* 4.2. Chế độ Đoán từ (Guessing Mode: Masked Letters & Clues) */
function GuessStudyPanel({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const words = topic.words;
  const current = words[i] || words[0];

  // Mặt nạ chữ cái: hiển thị chữ đầu, chữ cuối và một vài chữ ở giữa
  const maskedWord = useMemo(() => {
    if (!current) return "";
    const w = current.w;
    if (w.length <= 3) return w[0] + " _ ".repeat(w.length - 1);
    return w
      .split("")
      .map((ch, idx) => {
        if (idx === 0 || idx === w.length - 1 || ch === " " || ch === "-") return ch;
        if (idx % 3 === 0) return ch;
        return "_";
      })
      .join(" ");
  }, [current]);

  const handleNext = (grade) => {
    if (onGrade && current) onGrade(current.id, grade);
    setRevealed(false);
    if (i + 1 >= words.length) {
      onDone();
      return;
    }
    setI((prev) => prev + 1);
  };

  const handleReveal = () => {
    setRevealed(true);
    if (current) tts.speak(current.w, 0.9);
  };

  if (!current) return null;

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-5 sm:p-7 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
          <Lightbulb size={13} />
          <span>Đoán từ: {i + 1} / {words.length}</span>
        </div>
        <button
          onClick={() => tts.speak(current.w, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <div
        className={
          "flex-1 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border text-center min-h-[300px] " +
          (dark ? "bg-[#151c2b] border-[#222d42]" : "bg-gray-50 border-gray-200")
        }
      >
        <div className="mb-3">
          <VocabArt id={current.id} dark={dark} size={90} />
        </div>

        <p className="text-xs uppercase font-bold tracking-wider text-accent mb-2">
          Nghĩa: {current.vi} ({current.pos})
        </p>

        {/* Chữ cái bị ẩn hoặc hiện đầy đủ */}
        <div className="my-3 py-2 px-5 rounded-2xl bg-black/30 border border-white/10">
          <p className="text-2xl sm:text-4xl font-mono font-black tracking-widest text-amber-400">
            {revealed ? current.w : maskedWord}
          </p>
        </div>

        {revealed && (
          <p className={"text-sm font-mono text-white/80 mt-1 " + T.sub}>{current.ipa}</p>
        )}

        {/* Ví dụ ngữ cảnh khuyết từ */}
        {current.ex && (
          <p className={"text-xs sm:text-sm italic max-w-md mx-auto leading-relaxed mt-4 " + T.sub}>
            &quot;{revealed ? current.ex : current.ex.replace(new RegExp(current.w, "gi"), "_____")}&quot;
          </p>
        )}

        {!revealed ? (
          <button
            onClick={handleReveal}
            className="mt-6 px-6 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-amber-500/30 active:scale-95 transition-all"
          >
            <Eye size={16} />
            <span>Hiện đáp án & Phát âm</span>
          </button>
        ) : (
          <p className="text-xs text-emerald-400 font-bold mt-4">
            ✓ Đã mở đáp án! Hãy tự đánh giá mức độ ghi nhớ:
          </p>
        )}
      </div>

      {/* Nút đánh giá tiếp theo */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5">
        <button
          onClick={() => handleNext(0)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all active:scale-95"
        >
          Chưa nhớ (0)
        </button>
        <button
          onClick={() => handleNext(1)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all active:scale-95"
        >
          Nhớ mang máng (1)
        </button>
        <button
          onClick={() => handleNext(2)}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all active:scale-95"
        >
          Đoán đúng (2)
        </button>
      </div>
    </div>
  );
}

/* 4.3. Chế độ Trắc nghiệm (Multiple Choice: EN -> VI) */
function QuizStudyPanel({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const words = topic.words;
  const current = words[i] || words[0];

  // Sinh 4 đáp án (1 đúng + 3 phân tâm từ topic hoặc vocab)
  const options = useMemo(() => {
    if (!current) return [];
    const correct = current.vi;
    const others = topic.words
      .filter((w) => w.id !== current.id && w.vi && w.vi !== correct)
      .map((w) => w.vi);
    const pool = others.length >= 3 ? others : VOCAB.map((w) => w.vi).filter((v) => v !== correct);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledPool].sort(() => 0.5 - Math.random());
  }, [current, topic]);

  const handlePick = (opt, idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    const isCorrect = opt === current.vi;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (onGrade) onGrade(current.id, 2);
    } else {
      if (onGrade) onGrade(current.id, 0);
    }
    tts.speak(current.w, 0.9);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedIdx(null);
    if (i + 1 >= words.length) {
      onDone();
      return;
    }
    setI((prev) => prev + 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-5 sm:p-7 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <span className={"text-xs font-bold uppercase tracking-wider " + T.sub}>
          Câu {i + 1} / {words.length} • Đúng: <span className="text-emerald-400">{score}</span>
        </span>
        <button
          onClick={() => tts.speak(current.w, 0.9)}
          className="p-2.5 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          aria-label="Phát âm"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Câu hỏi từ tiếng Anh */}
      <div className="text-center my-3">
        <p className="text-xs uppercase font-bold tracking-wider text-accent mb-1">
          Chọn nghĩa tiếng Việt chính xác
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          {current.w}
        </h2>
        <p className={"text-xs font-mono mt-1 " + T.sub}>{current.ipa || "/.../"} ({current.pos})</p>
      </div>

      {/* 4 Lựa chọn trắc nghiệm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {options.map((opt, idx) => {
          let btnCls = dark
            ? "bg-[#151c2b] border-[#253248] text-gray-200 hover:border-accent/40"
            : "bg-gray-50 border-gray-200 text-gray-900 hover:border-accent/40";

          if (isAnswered) {
            if (opt === current.vi) {
              btnCls = "bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-950/40";
            } else if (idx === selectedIdx) {
              btnCls = "bg-red-500/25 border-red-500 text-red-300 font-bold";
            } else {
              btnCls = "opacity-40 border-transparent";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handlePick(opt, idx)}
              className={
                "p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base transition-all active:scale-[0.98] " +
                btnCls
              }
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 truncate">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chân trang điều khiển câu tiếp theo */}
      <div className="pt-3 border-t border-white/10 flex justify-end">
        {isAnswered ? (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{i + 1 >= words.length ? "Hoàn thành bài tập" : "Câu tiếp theo"}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <p className={"text-xs text-center w-full " + T.sub}>
            Hãy chọn một trong 4 phương án trên để tiếp tục
          </p>
        )}
      </div>
    </div>
  );
}

/* 4.4. Chế độ Trắc nghiệm đảo (Reverse Quiz: VI -> EN) */
function ReverseQuizStudyPanel({ topic, dark, T, tts, onGrade, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const words = topic.words;
  const current = words[i] || words[0];

  const options = useMemo(() => {
    if (!current) return [];
    const correct = current.w;
    const others = topic.words
      .filter((w) => w.id !== current.id && w.w && w.w !== correct)
      .map((w) => w.w);
    const pool = others.length >= 3 ? others : VOCAB.map((w) => w.w).filter((w) => w !== correct);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledPool].sort(() => 0.5 - Math.random());
  }, [current, topic]);

  const handlePick = (opt, idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    const isCorrect = opt === current.w;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (onGrade) onGrade(current.id, 2);
    } else {
      if (onGrade) onGrade(current.id, 0);
    }
    tts.speak(opt, 0.9);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedIdx(null);
    if (i + 1 >= words.length) {
      onDone();
      return;
    }
    setI((prev) => prev + 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-5 sm:p-7 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold border border-rose-500/30">
          <ArrowRightLeft size={13} />
          <span>Trắc nghiệm đảo: {i + 1} / {words.length}</span>
        </div>
        <span className={"text-xs font-bold " + T.sub}>Đúng: {score}</span>
      </div>

      <div className="text-center my-3">
        <p className="text-xs uppercase font-bold tracking-wider text-accent mb-1">
          Chọn từ tiếng Anh phù hợp với nghĩa
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          &quot;{current.vi}&quot;
        </h2>
        {current.ex && (
          <p className={"text-xs italic max-w-md mx-auto mt-2 " + T.sub}>
            &quot;{current.ex.replace(new RegExp(current.w, "gi"), "_____")}&quot;
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {options.map((opt, idx) => {
          let btnCls = dark
            ? "bg-[#151c2b] border-[#253248] text-gray-200 hover:border-accent/40"
            : "bg-gray-50 border-gray-200 text-gray-900 hover:border-accent/40";

          if (isAnswered) {
            if (opt === current.w) {
              btnCls = "bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-950/40";
            } else if (idx === selectedIdx) {
              btnCls = "bg-red-500/25 border-red-500 text-red-300 font-bold";
            } else {
              btnCls = "opacity-40 border-transparent";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handlePick(opt, idx)}
              className={
                "p-4 rounded-2xl border text-left font-bold text-base sm:text-lg transition-all active:scale-[0.98] " +
                btnCls
              }
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 truncate">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-end">
        {isAnswered ? (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{i + 1 >= words.length ? "Hoàn thành bài tập" : "Câu tiếp theo"}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <p className={"text-xs text-center w-full " + T.sub}>
            Chọn từ vựng tiếng Anh tương ứng
          </p>
        )}
      </div>
    </div>
  );
}

/* 4.5. Chế độ Lặp lại (Listen & Repeat Drill with TTS Audio) */
function RepeatStudyPanel({ topic, dark, T, tts, onDone, onBack }) {
  const [i, setI] = useState(0);
  const [rate, setRate] = useState(0.85); // 0.85x chuẩn cho luyện nói
  const words = topic.words;
  const current = words[i] || words[0];

  const handleNext = () => {
    if (i + 1 >= words.length) {
      onDone();
      return;
    }
    setI((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (i > 0) setI((prev) => prev - 1);
  };

  if (!current) return null;

  return (
    <div
      className={
        "h-full flex flex-col justify-between rounded-3xl border p-5 sm:p-7 animate-fade transition-all " +
        (dark ? "bg-[#101520] border-[#1f283a]" : "bg-white border-gray-200 shadow-md")
      }
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className={"rounded-full p-2.5 transition-colors border " + T.soft + " " + T.line}
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold border border-sky-500/30">
          <Mic size={13} />
          <span>Lặp lại & Phát âm: {i + 1} / {words.length}</span>
        </div>
        {/* Tốc độ đọc */}
        <button
          onClick={() => setRate((r) => (r === 0.85 ? 1.0 : 0.85))}
          className={"text-xs font-bold px-2.5 py-1 rounded-full border " + T.soft + " " + T.line}
        >
          {rate}x
        </button>
      </div>

      <div
        className={
          "flex-1 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border text-center min-h-[300px] " +
          (dark ? "bg-[#151c2b] border-[#222d42]" : "bg-gray-50 border-gray-200")
        }
      >
        <div className="mb-4">
          <VocabArt id={current.id} dark={dark} size={110} />
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-1 text-white">
          {current.w}
        </h3>
        <p className={"text-base font-mono mb-2 text-accent"}>{current.ipa || "/.../"}</p>
        <p className={"text-sm font-semibold mb-5 " + T.sub}>{current.vi}</p>

        {/* Nút phát âm to nổi bật */}
        <button
          onClick={() => tts.speak(current.w, rate)}
          className="h-20 w-20 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
          title="Bấm để nghe phát âm"
        >
          <Volume2 size={36} />
        </button>
        <p className={"text-xs mt-3 " + T.sub}>Bấm vào loa để nghe lại và đọc to theo</p>
      </div>

      {/* Điều khiển chuyển từ */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={handlePrev}
          disabled={i === 0}
          className={"py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all " + (i === 0 ? "opacity-30 cursor-not-allowed" : T.soft)}
        >
          Từ trước
        </button>
        <button
          onClick={handleNext}
          className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md active:scale-95 transition-all"
        >
          {i + 1 >= words.length ? "Hoàn thành" : "Từ kế tiếp →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. MÀN HÌNH CHÍNH TOPIC LEARN SCREEN (GIAO DIỆN 2 CỘT PARROTO)
   ═══════════════════════════════════════════════════════════════════ */
export function TopicLearnScreen({ T, dark, tts, learnedSet, onGrade, onBackToHub }) {
  const [openKey, setOpenKey] = useState(() => VOCAB_TOPICS[0]?.key || "");
  const [activeMode, setActiveMode] = useState("overview"); // "overview" | "guess" | "card" | "quiz" | "reverseQuiz" | "repeat"
  const [modalTopic, setModalTopic] = useState(null);
  const [topicSearch, setTopicSearch] = useState("");
  const [mobileTab, setMobileTab] = useState("list"); // "list" | "study"

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return VOCAB_TOPICS;
    const q = topicSearch.toLowerCase().trim();
    return VOCAB_TOPICS.filter((t) => t.topic.toLowerCase().includes(q));
  }, [topicSearch]);

  const topicIdx = useMemo(
    () => VOCAB_TOPICS.findIndex((t) => t.key === openKey),
    [openKey]
  );
  const topic = topicIdx >= 0 ? VOCAB_TOPICS[topicIdx] : VOCAB_TOPICS[0];
  const hasNext = topicIdx >= 0 && topicIdx + 1 < VOCAB_TOPICS.length;

  const nextTopic = () => {
    if (hasNext) {
      setOpenKey(VOCAB_TOPICS[topicIdx + 1].key);
      setActiveMode("overview");
      setMobileTab("study");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-12 animate-fade">
      {/* ===== THANH TIÊU ĐỀ & CHẾ ĐỘ HỌC (TOP BAR TRÊN CÙNG) ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-1">
        {/* Nút quay lại & Tiêu đề */}
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              style={{ minHeight: 38, minWidth: 38 }}
              className={"rounded-full p-2 transition-colors border " + T.soft + " " + T.line}
              title="Quay lại"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              4.500 từ tiếng Anh thông dụng
            </h1>
            <p className={"text-xs " + T.sub}>
              Chủ đề hiện tại: <span className="font-bold text-accent">{topic?.topic}</span>
            </p>
          </div>
        </div>

        {/* CỤM NÚT CHUYỂN CHẾ ĐỘ HỌC (PARROTO MODE SWITCHERS CHUẨN) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: "guess", label: "Đoán", Icon: Lightbulb },
            { key: "card", label: "Flashcard", Icon: Layers },
            { key: "quiz", label: "Trắc nghiệm", Icon: ListChecks },
            { key: "reverseQuiz", label: "Trắc nghiệm đảo", Icon: ArrowRightLeft },
            { key: "repeat", label: "Lặp lại", Icon: Mic },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMode(m.key)}
              className={
                "px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 border " +
                (activeMode === m.key
                  ? "bg-accent text-white border-accent shadow-md shadow-accent/25"
                  : dark
                  ? "bg-[#141923] hover:bg-[#1a212f] border-[#222b3d] text-gray-300"
                  : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700")
              }
            >
              <m.Icon size={13} />
              <span>{m.label}</span>
            </button>
          ))}
          <button
            onClick={() => setModalTopic(topic)}
            className={
              "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all shrink-0 border " +
              (dark ? "bg-[#141923] border-[#222b3d] text-gray-300" : "bg-white border-gray-200 text-gray-700")
            }
            title="Xem toàn bộ danh sách từ"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setActiveMode("overview")}
            className={
              "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all shrink-0 border " +
              (activeMode === "overview"
                ? "bg-accent text-white border-accent shadow-md shadow-accent/25"
                : dark
                ? "bg-[#141923] border-[#222b3d] text-gray-300"
                : "bg-white border-gray-200 text-gray-700")
            }
            title="Tổng quan chủ đề"
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>

      {/* ===== CHUYỂN ĐỔI TAB TRÊN MOBILE (DANH SÁCH CHỦ ĐỀ / BẢNG HỌC TẬP) ===== */}
      <div className="lg:hidden flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 mb-4">
        <button
          onClick={() => setMobileTab("list")}
          className={
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all " +
            (mobileTab === "list"
              ? "bg-accent text-white shadow-md"
              : "text-gray-400 hover:text-white")
          }
        >
          📋 Danh Sách ({filteredTopics.length})
        </button>
        <button
          onClick={() => setMobileTab("study")}
          className={
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all truncate px-2 " +
            (mobileTab === "study"
              ? "bg-accent text-white shadow-md"
              : "text-gray-400 hover:text-white")
          }
        >
          🎯 {topic?.topic || "Bảng Học Tập"}
        </button>
      </div>

      {/* ===== BỐ CỤC 2 CỘT PARROTO CHUẨN ===== */}
      <div className="grid lg:grid-cols-12 gap-5 items-stretch min-h-[640px]">
        {/* CỘT TRÁI: DANH SÁCH CHỦ ĐỀ (~38% = 5/12 cols) */}
        <div className={"lg:col-span-5 flex flex-col " + (mobileTab === "study" ? "hidden lg:flex" : "flex")}>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              Danh Sách Chủ Đề ({filteredTopics.length})
            </h2>
            <span className={"text-xs font-semibold " + T.sub}>
              {VOCAB_TOPICS.reduce((sum, t) => sum + t.words.filter((w) => learnedSet.has(w.id)).length, 0)} từ đã thuộc
            </span>
          </div>

          {/* Ô tìm kiếm nhanh chủ đề */}
          <div className="relative mb-3">
            <Search size={14} className={"absolute left-3 top-1/2 -translate-y-1/2 " + T.sub} />
            <input
              type="text"
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              placeholder="Tìm nhanh chủ đề..."
              className={
                "w-full pl-8 pr-7 py-2 text-xs rounded-xl border focus:outline-none transition-all " +
                (dark
                  ? "bg-[#141923] border-[#222b3d] text-white focus:border-accent"
                  : "bg-white border-gray-200 text-gray-900 focus:border-accent")
              }
            />
            {topicSearch && (
              <button
                onClick={() => setTopicSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div
            className={
              "flex-1 overflow-y-auto space-y-2.5 pr-1.5 max-h-[640px] rounded-3xl p-2.5 border " +
              (dark ? "bg-[#0c1017] border-[#1a2233]" : "bg-gray-50/70 border-gray-200")
            }
          >
            {filteredTopics.map((t) => (
              <TopicCard
                key={t.key}
                topic={t}
                learnedSet={learnedSet}
                dark={dark}
                T={T}
                isSelected={t.key === openKey}
                onSelect={() => {
                  setOpenKey(t.key);
                  setActiveMode("overview");
                  setMobileTab("study");
                }}
              />
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG HỌC TẬP & KẾT QUẢ (~62% = 7/12 cols) */}
        <div className={"lg:col-span-7 flex flex-col " + (mobileTab === "list" ? "hidden lg:flex" : "flex")}>
          {/* Nút quay lại danh sách trên mobile */}
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setMobileTab("list")}
              className="text-xs font-semibold flex items-center gap-1 text-accent py-1"
            >
              <ArrowLeft size={13} />
              <span>← Chọn chủ đề khác</span>
            </button>
          </div>

          {activeMode === "overview" && (
            <OverviewRightPanel
              topic={topic}
              learnedSet={learnedSet}
              dark={dark}
              T={T}
              onStartStudy={() => setActiveMode("card")}
              onOpenWordList={() => setModalTopic(topic)}
              onNextTopic={nextTopic}
              hasNext={hasNext}
            />
          )}

          {activeMode === "card" && (
            <FlashcardStudyPanel
              topic={topic}
              dark={dark}
              T={T}
              tts={tts}
              onGrade={onGrade}
              onDone={() => setActiveMode("overview")}
              onBack={() => setActiveMode("overview")}
            />
          )}

          {activeMode === "guess" && (
            <GuessStudyPanel
              topic={topic}
              dark={dark}
              T={T}
              tts={tts}
              onGrade={onGrade}
              onDone={() => setActiveMode("overview")}
              onBack={() => setActiveMode("overview")}
            />
          )}

          {activeMode === "quiz" && (
            <QuizStudyPanel
              topic={topic}
              dark={dark}
              T={T}
              tts={tts}
              onGrade={onGrade}
              onDone={() => setActiveMode("overview")}
              onBack={() => setActiveMode("overview")}
            />
          )}

          {activeMode === "reverseQuiz" && (
            <ReverseQuizStudyPanel
              topic={topic}
              dark={dark}
              T={T}
              tts={tts}
              onGrade={onGrade}
              onDone={() => setActiveMode("overview")}
              onBack={() => setActiveMode("overview")}
            />
          )}

          {activeMode === "repeat" && (
            <RepeatStudyPanel
              topic={topic}
              dark={dark}
              T={T}
              tts={tts}
              onDone={() => setActiveMode("overview")}
              onBack={() => setActiveMode("overview")}
            />
          )}
        </div>
      </div>

      {/* Modal Bảng từ vựng */}
      {modalTopic && (
        <WordListModal
          topic={modalTopic}
          onClose={() => setModalTopic(null)}
          dark={dark}
          T={T}
          tts={tts}
        />
      )}
    </div>
  );
}
