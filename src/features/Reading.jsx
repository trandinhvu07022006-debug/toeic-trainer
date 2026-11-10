import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock,
  Lightbulb,
  ListChecks,
  X,
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  ArrowRight,
  Highlighter,
  Layers,
  Search,
  Filter,
  Flame,
  CheckCircle2,
} from "lucide-react";
import {
  ALL_Q,
  GRAMMAR,
  P5_Q,
  P6_Q,
  P7_BY_GROUP,
  P7_Q,
  PASSAGE_BY_ID,
  Q_BY_ID,
} from "../data/reading.js";
import { VOCAB } from "../data/vocab.js";
import { lookupWord } from "../lib/vocabLookup.js";
import { WordLookupModal } from "../ui/WordLookupModal.jsx";
import { InteractiveText } from "../ui/InteractiveText.jsx";
import { LETTERS } from "../lib/utils.js";
import { pct } from "../lib/scoring.js";
import {
  Bar,
  Ghost,
  Primary,
  SectionTitle,
  PageHeader,
  PartMark,
  ChoiceBadge,
} from "../ui/index.jsx";

/* ═══════════════════════════════════════════════════════════════════
   BỘ PHÂN LOẠI DẠNG CÂU HỎI PART 7
   ═══════════════════════════════════════════════════════════════════ */
export function getQuestionType(qText) {
  const t = (qText || "").toLowerCase();
  if (
    t.includes("closest in meaning") ||
    (t.includes("word") && (t.includes("in paragraph") || t.includes("in line")))
  ) {
    return { key: "vocab", label: "Từ vựng ngữ cảnh", color: "purple" };
  }
  if (
    t.includes("not ") ||
    t.includes("not?") ||
    t.includes("is true") ||
    t.includes("are true") ||
    t.includes("correct?")
  ) {
    return { key: "not_true", label: "Phủ định / NOT-TRUE", color: "rose" };
  }
  if (
    t.includes("purpose") ||
    t.includes("mainly about") ||
    t.includes("why was") ||
    t.includes("why did") ||
    t.includes("what is the notice about") ||
    t.includes("what is the article about") ||
    t.includes("what is the email about") ||
    t.includes("why is mr.") ||
    t.includes("why is ms.")
  ) {
    return { key: "main_idea", label: "Ý chính / Mục đích", color: "blue" };
  }
  if (
    t.includes("suggest") ||
    t.includes("infer") ||
    t.includes("likely") ||
    t.includes("imply") ||
    t.includes("most probable")
  ) {
    return { key: "inference", label: "Suy luận / Ngụ ý", color: "amber" };
  }
  if (t.includes("[1]") || t.includes("best belong") || t.includes("marked [")) {
    return { key: "insert", label: "Chèn câu vào đoạn", color: "teal" };
  }
  return { key: "detail", label: "Chi tiết / Dữ kiện", color: "emerald" };
}

/* ═══════════════════════════════════════════════════════════════════
   1. PASSAGE BOX (BÀI ĐỌC TƯƠNG TÁC + BÚT HIGHLIGHT + SPLIT-VIEW)
   ═══════════════════════════════════════════════════════════════════ */
export function PassageBox({
  passage,
  T,
  dark,
  defaultOpen = true,
  onWordClick,
  splitView = false,
}) {
  const [open, setOpen] = useState(defaultOpen !== false);
  const [activeTab, setActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState("normal"); // "small" | "normal" | "large"
  const [interactiveMode, setInteractiveMode] = useState("lookup"); // "lookup" | "highlight"
  const [highlightedIndices, setHighlightedIndices] = useState(new Set());

  if (!passage) return null;
  const parts = passage.bodyA
    ? [{ label: "Văn bản 1", text: passage.bodyA }, { label: "Văn bản 2", text: passage.bodyB }].concat(
        passage.bodyC ? [{ label: "Văn bản 3", text: passage.bodyC }] : []
      )
    : [{ label: null, text: passage.body }];

  const fontClass =
    fontSize === "small"
      ? "text-[14px]"
      : fontSize === "large"
      ? "text-[17.5px]"
      : "text-[15.5px]";

  const toggleHighlight = (key) => {
    setHighlightedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      className={
        "rounded-3xl border mb-4 overflow-hidden transition-all shadow-sm " +
        T.passage +
        " " +
        T.line
      }
    >
      {/* Header thanh công cụ bài đọc */}
      <div className="w-full flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className={"text-xs font-bold px-2.5 py-1 rounded-full shrink-0 " + T.accentSoft}>
            {passage.kind || "Bài đọc"}
          </span>
          <span className="text-[15px] sm:text-base font-bold truncate">{passage.title}</span>
        </div>

        {/* Cụm công cụ: Bút dạ quang / Tra từ / Đổi cỡ chữ */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() =>
              setInteractiveMode((m) => (m === "lookup" ? "highlight" : "lookup"))
            }
            className={
              "text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all " +
              (interactiveMode === "highlight"
                ? "bg-amber-400 text-gray-950 shadow-sm"
                : "bg-accent/15 text-accent border border-accent/30")
            }
            title={
              interactiveMode === "highlight"
                ? "Đang bật Bút dạ quang (Bấm từ để highlight). Nhấn để chuyển sang Tra từ."
                : "Đang bật Tra từ (Bấm từ để xem nghĩa). Nhấn để chuyển sang Bút dạ quang."
            }
          >
            {interactiveMode === "highlight" ? (
              <>
                <Highlighter size={13} />
                <span className="hidden sm:inline">Bút highlight</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span className="hidden sm:inline">Chạm tra từ</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              setFontSize((s) => (s === "normal" ? "large" : s === "large" ? "small" : "normal"))
            }
            className={"p-1.5 rounded-full " + T.soft + " " + T.sub}
            title="Đổi cỡ chữ"
          >
            <span className="text-xs font-bold px-1">
              {fontSize === "large" ? "A+" : fontSize === "small" ? "A-" : "A"}
            </span>
          </button>

          {!splitView && (
            <button
              onClick={() => setOpen((o) => !o)}
              style={{ minHeight: 32, minWidth: 32 }}
              className={"rounded-full p-1.5 flex items-center justify-center " + T.soft}
              aria-label="Thu gọn/Mở rộng bài đọc"
            >
              <ChevronRight
                size={18}
                className={"transition-transform " + (open ? "rotate-90" : "")}
              />
            </button>
          )}
        </div>
      </div>

      {/* Tabs cho bài đọc Đoạn kép / Đoạn ba (Double / Triple passages) */}
      {parts.length > 1 && (
        <div
          className={
            "flex items-center gap-1.5 px-4 pt-2.5 pb-2 border-b " +
            T.line +
            " overflow-x-auto bg-black/[0.01] dark:bg-white/[0.01]"
          }
        >
          {parts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={
                "text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shrink-0 " +
                (activeTab === idx
                  ? "bg-accent text-white shadow-sm"
                  : T.soft + " " + T.softText)
              }
            >
              {p.label || `Văn bản ${idx + 1}`}
            </button>
          ))}
          <button
            onClick={() => setActiveTab(-1)}
            className={
              "text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 " +
              (activeTab === -1
                ? "bg-accent text-white shadow-sm"
                : T.soft + " " + T.sub)
            }
          >
            Toàn bộ ({parts.length} văn bản)
          </button>
        </div>
      )}

      {/* Nội dung bài đọc */}
      {(open || splitView) && (
        <div
          className={
            "p-5 sm:p-6 " +
            (splitView
              ? "max-h-[calc(100vh-220px)] overflow-y-auto pr-4 space-y-4 paper-grain"
              : "space-y-4")
          }
        >
          {parts.map((p, i) => {
            if (parts.length > 1 && activeTab !== -1 && activeTab !== i) return null;
            return (
              <div
                key={i}
                className={i > 0 && activeTab === -1 ? "mt-6 pt-6 border-t " + T.line : ""}
              >
                {p.label && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-4 bg-accent rounded-full" />
                    <p className={"text-xs font-bold uppercase tracking-wider " + T.sub}>
                      {p.label}
                    </p>
                  </div>
                )}
                <InteractiveText
                  text={p.text}
                  interactive={interactiveMode === "lookup"}
                  highlightMode={interactiveMode === "highlight"}
                  highlightedIndices={highlightedIndices}
                  onToggleHighlight={toggleHighlight}
                  onWordClick={onWordClick}
                  className={fontClass}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. QUESTION CARD (CÂU HỎI TRẮC NGHIỆM & PHÂN LOẠI DẠNG BÀI)
   ═══════════════════════════════════════════════════════════════════ */
export function QuestionCard({
  q,
  index,
  total,
  chosen,
  reveal,
  onPick,
  T,
  dark,
  saved,
  onToggleSave,
  showSave,
  onWordClick,
}) {
  const qType = getQuestionType(q.text);

  return (
    <div key={q.id} className="animate-fade">
      {/* Tiêu đề câu hỏi & Huy hiệu dạng bài */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="text-base font-medium leading-relaxed flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={"font-bold text-base " + T.accentText}>
              {typeof index === "number" ? `Câu ${index + 1}` : ""}
            </span>
            {qType && (
              <span
                className={
                  "inline-block text-[11px] font-bold px-2 py-0.5 rounded-md " +
                  (qType.color === "purple"
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                    : qType.color === "rose"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    : qType.color === "blue"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                    : qType.color === "amber"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    : qType.color === "teal"
                    ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30")
                }
              >
                {qType.label}
              </span>
            )}
          </div>
          <InteractiveText
            text={q.text}
            interactive={true}
            onWordClick={onWordClick}
            className="text-[15.5px] font-semibold"
          />
        </div>

        {showSave && (
          <button
            onClick={() => onToggleSave(q.id)}
            aria-label={saved ? "Bỏ lưu câu này" : "Lưu câu này"}
            aria-pressed={saved}
            style={{ minHeight: 40, minWidth: 40 }}
            className={"shrink-0 rounded-full p-2.5 transition-colors " + T.soft}
            title={saved ? "Bỏ lưu câu này" : "Lưu câu để ôn lại sau"}
          >
            {saved ? (
              <BookmarkCheck size={18} className={T.accentText} />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        )}
      </div>

      {/* Danh sách 4 đáp án A-B-C-D */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let cls = T.card + " " + T.line;
          let badge = "default";
          if (reveal) {
            if (i === q.ans) {
              cls = T.okBox;
              badge = "correct";
            } else if (i === chosen) {
              cls = T.noBox;
              badge = "wrong";
            } else {
              cls = T.card + " " + T.line + " opacity-55";
            }
          } else if (i === chosen) {
            cls = "bg-accent-tint border-accent";
            badge = "chosen";
          }
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={reveal}
              style={{ minHeight: 52 }}
              className={
                "group w-full text-left rounded-2xl border px-4 py-3 flex items-center gap-3 transition-all " +
                (reveal ? "" : "hover:shadow-sm active:scale-[0.995] ") +
                cls
              }
            >
              <ChoiceBadge letter={LETTERS[i]} state={badge} T={T} />
              <span className="text-[15px] leading-relaxed flex-1 font-medium">{opt}</span>
              {reveal && i === q.ans && (
                <Check size={19} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {reveal && i === chosen && i !== q.ans && (
                <X size={19} className="shrink-0 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Giải thích chi tiết & Chỉ dẫn manh mối */}
      {reveal && (
        <div className={"mt-4 rounded-2xl border p-4.5 animate-fade " + T.soft + " " + T.line}>
          <div className="flex items-center justify-between mb-2">
            <p
              className={
                "flex items-center gap-2 text-sm font-bold " +
                (chosen === q.ans ? T.okText : T.noText)
              }
            >
              {chosen === q.ans ? (
                <Check size={17} strokeWidth={2.5} />
              ) : (
                <X size={17} strokeWidth={2.5} />
              )}
              {chosen === q.ans ? "Chính xác!" : "Đáp án đúng: " + LETTERS[q.ans]}
            </p>
            <span
              className={
                "text-xs font-semibold px-2 py-0.5 rounded-full " +
                (chosen === q.ans
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400")
              }
            >
              {chosen === q.ans ? "Chuẩn xác" : "Cần lưu ý"}
            </span>
          </div>
          <p className={"text-[15px] leading-relaxed " + T.softText}>{q.exp}</p>
        </div>
      )}

      {typeof total === "number" && (
        <p className={"text-xs text-center mt-3.5 opacity-60 " + T.sub}>
          Câu {index + 1} / {total}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. PRACTICE SCREEN (LUYỆN TẬP SPLIT-VIEW THEO BỘ LỌC)
   ═══════════════════════════════════════════════════════════════════ */
export function PracticeScreen({
  part,
  filterTitle = "",
  questionsList,
  T,
  dark,
  onBack,
  onAnswer,
  saved,
  onToggleSave,
  srs = {},
  onSaveWord,
  onRemoveWord,
  tts,
  onWordClick,
}) {
  const defaultList = part === 5 ? P5_Q : part === 6 ? P6_Q : P7_Q;
  const list = questionsList && questionsList.length > 0 ? questionsList : defaultList;

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reveals, setReveals] = useState({});
  const [mobileTab, setMobileTab] = useState("question");

  const q = list[i] || list[0];
  const passage = q && q.passageId ? PASSAGE_BY_ID[q.passageId] : null;

  // Lấy các câu hỏi thuộc cùng một bài đọc trong danh sách hiện tại
  const passageIndices = useMemo(() => {
    if (!passage) return [];
    const res = [];
    for (let idx = 0; idx < list.length; idx++) {
      if (list[idx].passageId === passage.id) {
        res.push(idx);
      }
    }
    return res;
  }, [passage, list]);

  const chosen = q ? answers[q.id] : null;
  const reveal = q ? !!reveals[q.id] : false;

  const pick = (idx) => {
    if (reveal || !q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
    setReveals((prev) => ({ ...prev, [q.id]: true }));
    onAnswer(part, idx === q.ans, q.id);
  };

  const next = () => {
    if (i + 1 >= list.length) {
      onBack();
      return;
    }
    setI(i + 1);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      /* ignore */
    }
  };

  const isSplitView = part === 6 || part === 7;

  return (
    <div className="px-3 sm:px-4 pt-3 sm:pt-4 max-w-7xl mx-auto">
      {/* Header thanh điều hướng bài tập */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Quay lại danh mục"
            style={{ minHeight: 44, minWidth: 44 }}
            className={"rounded-full p-2.5 transition-colors " + T.soft}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">
                Part {part} {filterTitle ? `· ${filterTitle}` : ""}
              </p>
              {isSplitView && (
                <span className={"text-xs px-2.5 py-0.5 rounded-full font-bold " + T.accentSoft}>
                  Split-View
                </span>
              )}
            </div>
            <p className={"text-xs sm:text-sm " + T.sub}>
              Câu {i + 1} / {list.length} {passage ? `· ${passage.kind}` : ""}
            </p>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className="w-36 hidden sm:block">
          <Bar value={((i + (reveal ? 1 : 0)) / list.length) * 100} T={T} />
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <Bar value={((i + (reveal ? 1 : 0)) / list.length) * 100} T={T} />
      </div>

      {/* Tabs trên điện thoại khi có đoạn văn (Part 6 & Part 7) */}
      {passage && (
        <div className="lg:hidden grid grid-cols-2 gap-1.5 p-1 rounded-2xl mb-4 bg-black/5 dark:bg-white/5 border border-white/10">
          <button
            onClick={() => setMobileTab("passage")}
            className={
              "py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all " +
              (mobileTab === "passage" ? "bg-accent text-white shadow-md" : T.sub)
            }
          >
            <BookOpen size={15} />
            <span>Xem bài đọc</span>
          </button>
          <button
            onClick={() => setMobileTab("question")}
            className={
              "py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all " +
              (mobileTab === "question" ? "bg-accent text-white shadow-md" : T.sub)
            }
          >
            <HelpCircle size={15} />
            <span>Làm câu hỏi ({i + 1})</span>
          </button>
        </div>
      )}

      {/* BỐ CỤC 2 CỘT SPLIT-VIEW TRÊN DESKTOP */}
      {isSplitView && passage ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
          {/* CỘT TRÁI: VĂN BẢN BÀI ĐỌC (Col 7) */}
          <div
            className={
              "lg:col-span-7 lg:sticky lg:top-4 " +
              (mobileTab === "passage" ? "block" : "hidden lg:block")
            }
          >
            <PassageBox
              passage={passage}
              T={T}
              dark={dark}
              defaultOpen={true}
              onWordClick={onWordClick}
              splitView={true}
            />

            {/* Nút làm câu hỏi trên Mobile */}
            <div className="lg:hidden mt-3 mb-6">
              <Primary onClick={() => setMobileTab("question")}>
                Làm câu hỏi của bài này →
              </Primary>
            </div>
          </div>

          {/* CỘT PHẢI: BỘ CÂU HỎI & ĐÁP ÁN (Col 5) */}
          <div
            className={
              "lg:col-span-5 " +
              (mobileTab === "question" ? "block" : "hidden lg:block")
            }
          >
            {/* Thanh chuyển nhanh giữa các câu của bài đọc này */}
            {passageIndices.length > 1 && (
              <div
                className={
                  "rounded-2xl border p-2.5 mb-3.5 flex items-center gap-1.5 flex-wrap " +
                  T.card +
                  " " +
                  T.line
                }
              >
                <span className={"text-xs font-bold uppercase tracking-wider px-2 " + T.sub}>
                  Câu:
                </span>
                {passageIndices.map((idx, pNum) => {
                  const itemQ = list[idx];
                  const isCurrent = idx === i;
                  const isAnswered = !!reveals[itemQ.id];
                  const isCorrect = isAnswered && answers[itemQ.id] === itemQ.ans;
                  return (
                    <button
                      key={itemQ.id}
                      onClick={() => {
                        setI(idx);
                        setMobileTab("question");
                      }}
                      className={
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all " +
                        (isCurrent
                          ? "bg-accent text-white shadow-md ring-2 ring-accent/30"
                          : isAnswered
                          ? isCorrect
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                          : T.soft + " " + T.sub)
                      }
                    >
                      Câu {pNum + 1}
                    </button>
                  );
                })}
              </div>
            )}

            <div className={"rounded-3xl border p-5 sm:p-6 shadow-sm " + T.card + " " + T.line}>
              <QuestionCard
                q={q}
                index={i}
                chosen={chosen}
                reveal={reveal}
                onPick={pick}
                T={T}
                dark={dark}
                saved={saved.indexOf(q.id) !== -1}
                onToggleSave={onToggleSave}
                showSave
                onWordClick={onWordClick}
              />
            </div>

            {/* Nút câu tiếp theo */}
            <div className="mt-4 mb-6">
              {reveal ? (
                <Primary onClick={next}>
                  {i + 1 >= list.length ? "Hoàn thành bài luyện" : "Câu tiếp theo →"}
                </Primary>
              ) : (
                <p className={"text-center text-xs sm:text-sm py-2 opacity-75 " + T.sub}>
                  Chọn một đáp án để chấm điểm & xem giải thích
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* PART 5 (ĐIỀN CÂU) */
        <div className="max-w-2xl mx-auto">
          <div className={"rounded-3xl border p-6 sm:p-7 mb-4 shadow-sm " + T.card + " " + T.line}>
            <QuestionCard
              q={q}
              index={i}
              chosen={chosen}
              reveal={reveal}
              onPick={pick}
              T={T}
              dark={dark}
              saved={saved.indexOf(q.id) !== -1}
              onToggleSave={onToggleSave}
              showSave
              onWordClick={onWordClick}
            />
          </div>

          <div className="mt-4 mb-6">
            {reveal ? (
              <Primary onClick={next}>
                {i + 1 >= list.length ? "Hoàn thành bài luyện" : "Câu tiếp theo →"}
              </Primary>
            ) : (
              <p className={"text-center text-sm py-2 " + T.sub}>
                Chọn đáp án để xem giải thích & từ vựng ngữ cảnh
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. CÂU ĐÃ LƯU
   ═══════════════════════════════════════════════════════════════════ */
export function SavedScreen({
  T,
  dark,
  onBack,
  saved,
  onToggleSave,
  onWordClick,
}) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="px-4 pt-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          aria-label="Quay lại"
          style={{ minHeight: 44, minWidth: 44 }}
          className={"rounded-full p-3 " + T.soft}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xl font-bold">Câu hỏi đọc hiểu đã lưu</p>
          <p className={"text-xs sm:text-sm " + T.sub}>{saved.length} câu đã đánh dấu</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className={"rounded-3xl border p-10 text-center " + T.card + " " + T.line}>
          <Bookmark className={"mx-auto mb-3 opacity-40 " + T.accentText} size={40} />
          <p className="text-base font-bold mb-1">Chưa lưu câu hỏi nào</p>
          <p className={"text-sm max-w-sm mx-auto " + T.sub}>
            Trong lúc làm Part 5, 6, 7, hãy nhấn vào biểu tượng dấu trang ở góc phải mỗi câu để lưu lại và ôn tập sau.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {saved.map((id) => {
            const q = Q_BY_ID[id];
            if (!q) return null;
            const open = openId === id;
            return (
              <div key={id} className={"rounded-2xl border transition-all " + T.card + " " + T.line}>
                <button
                  onClick={() => setOpenId(open ? null : id)}
                  style={{ minHeight: 56 }}
                  className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className={"text-xs font-bold px-2 py-0.5 rounded-full shrink-0 " + T.accentSoft}>
                      Part {q.part}
                    </span>
                    <span className="text-[15px] font-semibold truncate">{q.text}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className={"shrink-0 transition-transform " + (open ? "rotate-90" : "")}
                  />
                </button>
                {open && (
                  <div className={"px-5 pb-5 border-t pt-4 " + T.line}>
                    {q.passageId && (
                      <PassageBox
                        passage={PASSAGE_BY_ID[q.passageId]}
                        T={T}
                        dark={dark}
                        defaultOpen={false}
                        onWordClick={onWordClick}
                      />
                    )}
                    <div className="space-y-1.5 mb-3.5">
                      {q.options.map((o, i2) => (
                        <p
                          key={i2}
                          className={
                            "text-sm sm:text-base " +
                            (i2 === q.ans
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : T.softText)
                          }
                        >
                          {LETTERS[i2]}. {o}
                        </p>
                      ))}
                    </div>
                    <div className={"rounded-2xl p-4 mb-4 " + T.soft}>
                      <p className={"text-sm leading-relaxed " + T.softText}>{q.exp}</p>
                    </div>
                    <Ghost onClick={() => onToggleSave(id)} T={T} className="w-full">
                      Bỏ lưu câu này
                    </Ghost>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. LUYỆN NGỮ PHÁP (GRAMMAR SCREEN)
   ═══════════════════════════════════════════════════════════════════ */
export function GrammarScreen({
  T,
  dark,
  onBack,
  grammarStats,
  onGrammarAnswer,
  saved,
  onToggleSave,
  onWordClick,
}) {
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("theory");
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);

  const topic = openId ? GRAMMAR.filter((g) => g.id === openId)[0] : null;

  const openTopic = (id) => {
    setOpenId(id);
    setTab("theory");
    setI(0);
    setChosen(null);
    setReveal(false);
  };
  const pick = (idx) => {
    if (reveal) return;
    setChosen(idx);
    setReveal(true);
    onGrammarAnswer(topic.id, idx === topic.questions[i].ans, topic.questions[i].id);
  };
  const next = () => {
    if (i + 1 >= topic.questions.length) {
      setI(0);
      setTab("theory");
      setChosen(null);
      setReveal(false);
      return;
    }
    setI(i + 1);
    setChosen(null);
    setReveal(false);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      /* ignore */
    }
  };

  if (!topic) {
    const totalQ = GRAMMAR.reduce((n, g) => n + g.questions.length, 0);
    return (
      <div className="px-4 pt-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            style={{ minHeight: 44, minWidth: 44 }}
            className={"rounded-full p-3 " + T.soft}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xl font-bold">Ngữ pháp TOEIC Trọng Điểm</p>
            <p className={"text-xs sm:text-sm " + T.sub}>
              {GRAMMAR.length} chuyên đề · {totalQ} câu bài tập thực hành
            </p>
          </div>
        </div>
        <div className={"rounded-2xl p-4.5 mb-5 flex gap-3.5 " + T.soft}>
          <Lightbulb size={20} className={"shrink-0 mt-0.5 " + T.accentText} />
          <p className={"text-sm leading-relaxed " + T.softText}>
            Học theo tần suất ra đề: từ loại, liên từ và dạng động từ chiếm gần nửa số câu Part 5.
            Mỗi chuyên đề gồm bảng dấu hiệu nhận biết, bẫy hay gặp và bài tập chấm ngay.
          </p>
        </div>
        <div className="space-y-3 mb-6">
          {GRAMMAR.map((g) => {
            const s = grammarStats[g.id] || { c: 0, t: 0 };
            return (
              <button
                key={g.id}
                onClick={() => openTopic(g.id)}
                className={
                  "w-full text-left rounded-2xl border p-4.5 transition-all hover:border-accent/40 " +
                  T.card +
                  " " +
                  T.line
                }
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className="text-base font-bold">{g.name}</span>
                  <span className={"text-xs shrink-0 px-2.5 py-1 rounded-full font-bold " + T.accentSoft}>
                    {g.freq}
                  </span>
                </div>
                <p className={"text-xs sm:text-sm mb-3 " + T.sub}>
                  {g.level} · {g.questions.length} câu
                </p>
                {s.t > 0 ? (
                  <>
                    <Bar value={pct(s.c, s.t)} T={T} />
                    <p className={"text-xs mt-2 " + T.sub}>
                      Đã làm {s.t} câu · đúng {pct(s.c, s.t)}%
                    </p>
                  </>
                ) : (
                  <p className={"text-xs font-semibold " + T.accentText}>Chưa luyện → Bắt đầu</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const q = topic.questions[i];
  return (
    <div className="px-4 pt-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setOpenId(null)}
          aria-label="Đóng chuyên đề"
          style={{ minHeight: 44, minWidth: 44 }}
          className={"rounded-full p-3 " + T.soft}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate">{topic.name}</p>
          <p className={"text-xs " + T.sub}>{topic.freq}</p>
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-1 rounded-2xl p-1 mb-5 " + T.soft}>
        {[
          ["theory", "Lý thuyết & Bẫy"],
          ["drill", "Luyện tập (" + topic.questions.length + " câu)"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{ minHeight: 44 }}
            className={
              "rounded-xl text-sm font-bold transition-all " +
              (tab === k ? "bg-accent text-white shadow-sm" : T.softText)
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "theory" ? (
        <div className="animate-fade">
          <p className="text-base leading-relaxed mb-5 font-medium">{topic.intro}</p>
          {topic.rules.map((r) => (
            <div key={r.h} className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
              <p className={"text-sm font-bold uppercase tracking-wider mb-2.5 " + T.accentText}>
                {r.h}
              </p>
              <ul className="space-y-2">
                {r.lines.map((l) => (
                  <li key={l} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0 bg-accent" />
                    <span className="text-[15px] leading-relaxed">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div
            className={
              "rounded-2xl border p-4.5 mb-5 " +
              (dark ? "bg-amber-950/40 border-amber-800/40" : "bg-amber-50 border-amber-200")
            }
          >
            <p
              className={
                "text-xs font-bold uppercase tracking-wider mb-2 " +
                (dark ? "text-amber-300" : "text-amber-800")
              }
            >
              Bẫy hay gặp trong đề thi
            </p>
            <ul className="space-y-2">
              {topic.traps.map((t) => (
                <li
                  key={t}
                  className={
                    "text-sm leading-relaxed " +
                    (dark ? "text-amber-100" : "text-amber-950")
                  }
                >
                  • {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <Primary onClick={() => setTab("drill")}>
              Làm {topic.questions.length} câu bài tập →
            </Primary>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <Bar value={((i + (reveal ? 1 : 0)) / topic.questions.length) * 100} T={T} />
          </div>
          <div className={"rounded-3xl border p-5 sm:p-6 mb-4 shadow-sm " + T.card + " " + T.line}>
            <QuestionCard
              q={q}
              index={i}
              total={topic.questions.length}
              chosen={chosen}
              reveal={reveal}
              onPick={pick}
              T={T}
              dark={dark}
              saved={saved.indexOf(q.id) !== -1}
              onToggleSave={onToggleSave}
              showSave
              onWordClick={onWordClick}
            />
          </div>
          <div className="mt-5 mb-6">
            {reveal ? (
              <Primary onClick={next}>
                {i + 1 >= topic.questions.length ? "Hoàn thành chuyên đề" : "Câu tiếp theo →"}
              </Primary>
            ) : (
              <p className={"text-center text-sm " + T.sub}>
                Chọn một đáp án để xem giải thích
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6. TAB ĐỌC CHÍNH (READING HUB) — THIẾT KẾ MỚI TẬP TRUNG TOÀN DIỆN
   ═══════════════════════════════════════════════════════════════════ */
export function ReadingScreen({
  T,
  dark,
  stats,
  grammarStats,
  onAnswer,
  onGrammarAnswer,
  saved,
  onToggleSave,
  srs = {},
  onSaveWord,
  onRemoveWord,
  tts,
}) {
  const [view, setView] = useState("menu");
  const [activeFilter, setActiveFilter] = useState({ title: "", questions: null });
  const [lookup, setLookup] = useState(null); // { word, rawQuery }

  const handleWordClick = (rawWord) => {
    const wordData = lookupWord(rawWord, VOCAB);
    setLookup({ word: wordData, rawQuery: rawWord });
  };

  const modal = lookup && (
    <WordLookupModal
      word={lookup.word}
      rawQuery={lookup.rawQuery}
      onClose={() => setLookup(null)}
      T={T}
      dark={dark}
      tts={tts}
      srs={srs}
      onSaveWord={onSaveWord}
      onRemoveWord={onRemoveWord}
    />
  );

  const startPart7Practice = (title, passages) => {
    const questions = passages.flatMap((p) =>
      p.questions.map((q) => ({ ...q, part: 7, passageId: p.id }))
    );
    setActiveFilter({ title, questions });
    setView("p7_custom");
  };

  const startPart7ByQuestionType = (typeKey, label) => {
    const questions = P7_Q.filter((q) => getQuestionType(q.text).key === typeKey);
    setActiveFilter({ title: `Dạng câu: ${label}`, questions });
    setView("p7_custom");
  };

  if (view === "grammar") {
    return (
      <>
        <GrammarScreen
          T={T}
          dark={dark}
          onBack={() => setView("menu")}
          grammarStats={grammarStats}
          onGrammarAnswer={onGrammarAnswer}
          saved={saved}
          onToggleSave={onToggleSave}
          onWordClick={handleWordClick}
        />
        {modal}
      </>
    );
  }

  if (view === "p5" || view === "p6" || view === "p7" || view === "p7_custom") {
    const partNum = view === "p5" ? 5 : view === "p6" ? 6 : 7;
    return (
      <>
        <PracticeScreen
          part={partNum}
          filterTitle={activeFilter.title}
          questionsList={view === "p7_custom" ? activeFilter.questions : null}
          T={T}
          dark={dark}
          onBack={() => setView("menu")}
          onAnswer={onAnswer}
          saved={saved}
          onToggleSave={onToggleSave}
          srs={srs}
          onSaveWord={onSaveWord}
          onRemoveWord={onRemoveWord}
          tts={tts}
          onWordClick={handleWordClick}
        />
        {modal}
      </>
    );
  }

  if (view === "saved") {
    return (
      <>
        <SavedScreen
          T={T}
          dark={dark}
          onBack={() => setView("menu")}
          saved={saved}
          onToggleSave={onToggleSave}
          onWordClick={handleWordClick}
        />
        {modal}
      </>
    );
  }

  const grammarDone = GRAMMAR.reduce(
    (n, g) => n + ((grammarStats[g.id] || { t: 0 }).t),
    0
  );
  const grammarQ = GRAMMAR.reduce((n, g) => n + g.questions.length, 0);

  const s7 = stats.reading[7];
  const s6 = stats.reading[6];
  const s5 = stats.reading[5];

  return (
    <div className="px-4 pt-4 max-w-5xl mx-auto pb-12 animate-fade">
      <PageHeader
        T={T}
        eyebrow="Kỹ năng Đọc hiểu · Part 5, 6, 7"
        title="Trung Tâm Luyện Đọc Hiểu"
        sub={`${ALL_Q.length} câu hỏi chuẩn format · Chạm từ bất kỳ để tra nghĩa & lưu Flashcard`}
      />

      {/* BANNER NỔI BẬT: CHẾ ĐỘ SPLIT-VIEW & TRA TỪ */}
      <div
        className={
          "rounded-3xl border p-5 sm:p-6 mb-8 flex items-start gap-4 transition-all " +
          (dark
            ? "bg-accent/10 border-accent/25"
            : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200/80")
        }
      >
        <div className="p-3 rounded-2xl bg-accent text-white shrink-0 shadow-lg shadow-accent/20">
          <Sparkles size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-bold mb-1">
            Giao diện Split-View 2 Cột Chuẩn ETS & Chạm Tra Từ Tức Thì
          </p>
          <p className={"text-xs sm:text-sm leading-relaxed font-medium " + T.sub}>
            Bài đọc văn bản bên trái, câu hỏi trắc nghiệm bên phải. Bạn có thể <strong>bấm vào từ bất kỳ</strong> để xem nghĩa & lưu vào Flashcard, hoặc dùng <strong>Bút dạ quang (Highlighter)</strong> để gạch chân câu chứa manh mối.
          </p>
        </div>
      </div>

      {/* ===== PHÂN KHÚC 1: TRỌNG TÂM PART 7 (ĐỌC HIỂU ĐOẠN VĂN) ===== */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Trọng Tâm Part 7: Đọc Hiểu Đoạn Văn</h2>
            <p className={"text-xs mt-0.5 " + T.sub}>Chiếm 54/100 câu đọc hiểu · Thử thách lớn nhất về từ vựng & tốc độ</p>
          </div>
          <span className={"text-xs font-bold px-3 py-1 rounded-full " + T.accentSoft}>
            Split-View 2 Cột
          </span>
        </div>

        {/* THẺ PART 7 TỔNG THỂ */}
        <div
          className={
            "rounded-3xl border p-6 sm:p-7 mb-4 transition-all " +
            T.card +
            " " +
            T.line
          }
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xl font-bold mb-1">Part 7: Đọc hiểu Văn bản Đơn, Kép & Ba</p>
              <p className={"text-sm " + T.sub}>
                {P7_Q.length} câu trắc nghiệm chia thành 42 bài đọc (Email, Notice, Ad, Invoice, Article...)
              </p>
            </div>
            <button
              onClick={() => {
                setActiveFilter({ title: "Tất cả bài đọc", questions: null });
                setView("p7");
              }}
              style={{ minHeight: 46 }}
              className="px-6 rounded-2xl bg-accent text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-accent/25 hover:brightness-110 active:scale-[0.98] transition-all shrink-0"
            >
              <Play size={16} className="fill-current" />
              <span>Luyện toàn bộ ({P7_Q.length} câu)</span>
            </button>
          </div>

          {/* Chọn luyện theo định dạng văn bản */}
          <p className={"text-xs font-bold uppercase tracking-wider mb-3 " + T.sub}>
            Luyện theo cấu trúc văn bản:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={() =>
                startPart7Practice("Đoạn đơn (Single Passages)", P7_BY_GROUP.single)
              }
              className={
                "p-4 rounded-2xl border text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 " +
                T.soft +
                " " +
                T.line
              }
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Đoạn Đơn (Single)</span>
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + T.accentSoft}>
                  {P7_BY_GROUP.single.length} bài
                </span>
              </div>
              <p className={"text-xs " + T.sub}>Email, Thông báo, Lịch trình, Quảng cáo</p>
            </button>

            <button
              onClick={() =>
                startPart7Practice("Đoạn kép (Double Passages)", P7_BY_GROUP.double)
              }
              className={
                "p-4 rounded-2xl border text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 " +
                T.soft +
                " " +
                T.line
              }
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Đoạn Kép (Double)</span>
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + T.accentSoft}>
                  {P7_BY_GROUP.double.length} bài
                </span>
              </div>
              <p className={"text-xs " + T.sub}>Đối chiếu thông tin giữa 2 tài liệu</p>
            </button>

            <button
              onClick={() =>
                startPart7Practice("Đoạn ba (Triple Passages)", P7_BY_GROUP.triple)
              }
              className={
                "p-4 rounded-2xl border text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 " +
                T.soft +
                " " +
                T.line
              }
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Đoạn Ba (Triple)</span>
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + T.accentSoft}>
                  {P7_BY_GROUP.triple.length} bài
                </span>
              </div>
              <p className={"text-xs " + T.sub}>Liên kết chuỗi 3 tài liệu phức tạp</p>
            </button>
          </div>

          {/* Chọn luyện theo dạng câu hỏi */}
          <p className={"text-xs font-bold uppercase tracking-wider mb-3 " + T.sub}>
            Luyện tập chuyên biệt theo dạng câu hỏi:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "main_idea", label: "🎯 Ý chính & Mục đích" },
              { key: "detail", label: "🔍 Dữ kiện chi tiết" },
              { key: "not_true", label: "🚫 Phủ định / NOT-TRUE" },
              { key: "inference", label: "💡 Suy luận / Ngụ ý" },
              { key: "vocab", label: "📚 Từ vựng ngữ cảnh" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => startPart7ByQuestionType(cat.key, cat.label)}
                className={
                  "px-3.5 py-2 rounded-xl text-xs font-bold border transition-all hover:border-accent/40 active:scale-95 " +
                  T.card +
                  " " +
                  T.line
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PHÂN KHÚC 2: PART 5 & PART 6 ===== */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-3 px-1">
          Luyện Điền Câu & Điền Đoạn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card Part 5 */}
          <button
            onClick={() => setView("p5")}
            className={
              "p-6 rounded-3xl border text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg " +
              T.card +
              " " +
              T.line
            }
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="p-3 rounded-2xl bg-accent/10 text-accent">
                <FileText size={22} />
              </span>
              <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + T.accentSoft}>
                {P5_Q.length} câu
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">Part 5: Điền vào câu</h3>
            <p className={"text-xs sm:text-sm leading-relaxed mb-4 " + T.sub}>
              Rèn phản xạ nhanh 15–20 giây/câu: Ngữ pháp cốt lõi và từ vựng thông dụng văn phòng.
            </p>
            {s5.t > 0 ? (
              <div>
                <Bar value={pct(s5.c, s5.t)} T={T} />
                <p className={"text-xs mt-2 " + T.sub}>
                  Đã làm {s5.t} câu · đúng {pct(s5.c, s5.t)}%
                </p>
              </div>
            ) : (
              <p className={"text-xs font-bold text-accent"}>Bắt đầu luyện Part 5 →</p>
            )}
          </button>

          {/* Card Part 6 */}
          <button
            onClick={() => setView("p6")}
            className={
              "p-6 rounded-3xl border text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg " +
              T.card +
              " " +
              T.line
            }
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="p-3 rounded-2xl bg-accent/10 text-accent">
                <BookOpen size={22} />
              </span>
              <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + T.accentSoft}>
                {P6_Q.length} câu
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">Part 6: Điền vào đoạn văn</h3>
            <p className={"text-xs sm:text-sm leading-relaxed mb-4 " + T.sub}>
              Đọc hiểu mạch liên kết văn bản, dạng điền từ và dạng chèn nguyên câu phù hợp ngữ cảnh.
            </p>
            {s6.t > 0 ? (
              <div>
                <Bar value={pct(s6.c, s6.t)} T={T} />
                <p className={"text-xs mt-2 " + T.sub}>
                  Đã làm {s6.t} câu · đúng {pct(s6.c, s6.t)}%
                </p>
              </div>
            ) : (
              <p className={"text-xs font-bold text-accent"}>Bắt đầu luyện Part 6 →</p>
            )}
          </button>
        </div>
      </div>

      {/* ===== PHÂN KHÚC 3: NGỮ PHÁP TRỌNG ĐIỂM & CÂU ĐÃ LƯU ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        <button
          onClick={() => setView("grammar")}
          className={
            "p-5 rounded-3xl border text-left transition-all hover:border-accent/40 flex items-center gap-4 " +
            T.card +
            " " +
            T.line
          }
        >
          <span className={"p-3.5 rounded-2xl shrink-0 " + T.soft}>
            <ListChecks size={22} className={T.accentText} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold mb-0.5">9 Chuyên Đề Ngữ Pháp Part 5</h3>
            <p className={"text-xs truncate " + T.sub}>
              {grammarDone ? `Đã làm ${grammarDone}/${grammarQ} câu` : "Từ loại, thì, liên từ, bị động"}
            </p>
          </div>
          <ChevronRight size={18} className={T.sub} />
        </button>

        <button
          onClick={() => setView("saved")}
          className={
            "p-5 rounded-3xl border text-left transition-all hover:border-accent/40 flex items-center gap-4 " +
            T.card +
            " " +
            T.line
          }
        >
          <span className={"p-3.5 rounded-2xl shrink-0 " + T.soft}>
            <BookmarkCheck size={22} className={T.accentText} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold mb-0.5">Câu Hỏi Đọc Hiểu Đã Lưu</h3>
            <p className={"text-xs truncate " + T.sub}>{saved.length} câu đã đánh dấu để ôn lại</p>
          </div>
          <ChevronRight size={18} className={T.sub} />
        </button>
      </div>

      {modal}
    </div>
  );
}
