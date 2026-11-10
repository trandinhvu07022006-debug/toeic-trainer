import React, { useMemo } from "react";
import {
  BookOpen,
  Headphones,
  FileText,
  Clock,
  BarChart3,
  ChevronRight,
  Target,
  CheckCircle2,
  Search,
  NotebookPen,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  BookmarkCheck,
  Award,
  Compass,
  Flag,
  PenTool,
} from "lucide-react";
import { Bar } from "../ui/index.jsx";
import { buildDailyPlan } from "../lib/dailyplan.js";
import { dayKey } from "../lib/srs.js";
import { TOTAL_WORDS } from "../data/counts.js";

const READING_PARTS = [
  { n: 5, key: 5, name: "Part 5", desc: "Điền vào câu (Ngữ pháp & Từ vựng)" },
  { n: 6, key: 6, name: "Part 6", desc: "Điền vào đoạn văn" },
  { n: 7, key: 7, name: "Part 7", desc: "Đọc hiểu văn bản đơn, kép & ba (Split-View)" },
];

export function HomeScreen({
  T,
  dark,
  streak,
  history,
  lastResults,
  onGo,
  srs = {},
  stats,
  doneToday,
  onStartTask,
  mistakeCount,
}) {
  const recent = (history || []).slice(-1)[0];
  const lastFull = lastResults && (lastResults.RC || lastResults.ALL);

  const plan = useMemo(
    () =>
      buildDailyPlan({
        totalWords: TOTAL_WORDS,
        srs: srs || {},
        stats,
        dateStr: dayKey(),
        doneToday: doneToday || {},
      }),
    [srs, stats, doneToday]
  );
  const pct = plan.total ? Math.round((plan.doneCount / plan.total) * 100) : 0;

  // Tính số lượng từ vựng đến hạn ôn tập và đã thuộc
  const dueCount = useMemo(
    () => Object.values(srs).filter((c) => c && c.due <= Date.now()).length,
    [srs]
  );
  const learnedCount = useMemo(
    () => Object.values(srs).filter((c) => c && c.box >= 3).length,
    [srs]
  );
  const fromReadingCount = useMemo(
    () => Object.values(srs).filter((c) => c && c.fromReading).length,
    [srs]
  );

  const featureCards = [
    {
      key: "vocab",
      label: "Kho Từ Vựng Thông Minh",
      desc: "Hơn 4.500 từ theo chủ đề, 6 chế độ học & thuật toán lặp lại ngắt quãng (SRS)",
      tag: `${dueCount} từ cần ôn`,
      tagColor: dueCount > 0 ? "accent" : "neutral",
      Icon: BookOpen,
      action: "Vào học từ",
    },
    {
      key: "write",
      label: "Luyện Tập Viết Thông Minh",
      desc: "Gõ chính tả cơ bắp (Spelling), điền từ vào câu (Cloze Deletion) và ghép câu hoàn chỉnh",
      tag: "3 Phương pháp",
      tagColor: "amber",
      Icon: PenTool,
      action: "Luyện viết ngay",
    },
    {
      key: "read",
      label: "Đọc Hiểu Part 5, 6, 7 (Split-View)",
      desc: "Giao diện 2 cột chuẩn thi máy, chạm từ để tra tức thì & lưu Flashcard",
      tag: "42 bài đọc · 162 câu",
      tagColor: "accent",
      Icon: FileText,
      action: "Luyện đọc ngay",
    },
    {
      key: "dict",
      label: "Tra Cứu Từ Điển & Lưu Thẻ",
      desc: "Tra cứu nhanh nghĩa tiếng Việt, phiên âm IPA, câu ví dụ và cụm từ đi kèm",
      tag: "Tra nhanh",
      tagColor: "neutral",
      Icon: Search,
      action: "Mở từ điển",
    },
    {
      key: "mistakes",
      label: "Sổ Tay Lỗi Sai (Mistake Book)",
      desc: "Xem lại và làm lại các câu đã chọn sai để khắc phục bẫy đề thi",
      tag: `${mistakeCount} câu cần sửa`,
      tagColor: mistakeCount > 0 ? "amber" : "neutral",
      Icon: NotebookPen,
      action: "Ôn lỗi sai",
    },
    {
      key: "progress",
      label: "Báo Cáo Năng Lực",
      desc: "Theo dõi chuỗi ngày học và mức độ thành thạo Từ vựng, Tập viết, Đọc hiểu",
      tag: `${streak} ngày liên tục`,
      tagColor: "neutral",
      Icon: BarChart3,
      action: "Xem tiến độ",
    },
  ];

  return (
    <div className="px-4 pt-4 lg:pt-2 pb-14 w-full max-w-6xl mx-auto animate-fade">
      {/* ===== THANH TÌM KIẾM NHANH TỪ VỰNG TRÊN ĐẦU TRANG ===== */}
      <button
        onClick={() => onGo("dict")}
        style={{ minHeight: 50 }}
        className={
          "w-full flex items-center justify-between gap-3 rounded-2xl px-5 mb-8 text-left transition-all border shadow-sm backdrop-blur-md " +
          (dark
            ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-accent/40"
            : "bg-white border-gray-200 hover:border-accent/40 hover:shadow-md")
        }
      >
        <div className="flex items-center gap-3">
          <Search size={19} className={T.accentText} />
          <span className={"text-[15px] font-medium " + T.sub}>
            Tra cứu nhanh trong 4.500+ từ vựng TOEIC...
          </span>
        </div>
        <span
          className={
            "hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-lg " +
            T.soft +
            " " +
            T.sub
          }
        >
          Nhấn để mở từ điển ↵
        </span>
      </button>

      {/* ===== HERO DASHBOARD: TRỌNG TÂM TỪ VỰNG & ĐỌC HIỂU ===== */}
      <section
        className={
          "relative rounded-3xl mb-10 overflow-hidden border shadow-xl transition-all " +
          (dark
            ? "bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#141414] border-white/10"
            : "bg-gradient-to-br from-white via-red-50/20 to-orange-50/30 border-gray-200")
        }
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid lg:grid-cols-[1.4fr_1fr] relative z-10">
          {/* CỘT TRÁI: THÔNG ĐIỆP & NÚT HÀNH ĐỘNG CHÍNH */}
          <div className="p-7 sm:p-9 lg:p-10 lg:border-r border-white/10 flex flex-col justify-between">
            <div>
              {/* Badge Tiêu điểm */}
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-accent text-white flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} />
                  TOEIC Vocab & Reading Lab
                </span>
                <span className={"px-3 py-1 text-[11px] font-bold rounded-full " + T.soft + " " + T.sub}>
                  Mục tiêu RC 350+ / 450+
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight leading-snug mb-3">
                Chinh Phục Từ Vựng & Kỹ Năng Đọc Hiểu TOEIC
              </h1>
              <p className={"text-sm sm:text-[15px] leading-relaxed mb-6 font-medium max-w-lg " + T.sub}>
                Ghi nhớ từ vựng qua phương pháp Spaced Repetition (SRS), kết hợp giải đề đọc hiểu Part 5, 6, 7 với tính năng chạm là tra từ tức thì.
              </p>

              {/* 3 NÚT HÀNH ĐỘNG NHANH CỐT LÕI (TỪ VỰNG - TẬP VIẾT - TẬP ĐỌC) */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  onClick={() => onGo("vocab")}
                  style={{ minHeight: 46 }}
                  className="px-5 rounded-2xl bg-accent text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-accent/25 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <BookOpen size={17} />
                  <span>Học từ vựng ({dueCount > 0 ? `${dueCount} từ đến hạn` : "64 chủ đề"})</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onGo("write")}
                  style={{ minHeight: 46 }}
                  className="px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
                >
                  <PenTool size={17} />
                  <span>Luyện tập viết (Spelling / Cloze)</span>
                </button>

                <button
                  onClick={() => onGo("read")}
                  style={{ minHeight: 46 }}
                  className={
                    "px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all active:scale-[0.98] " +
                    (dark
                      ? "bg-white/10 hover:bg-white/15 border-white/15 text-white"
                      : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900 shadow-sm")
                  }
                >
                  <FileText size={17} className={T.accentText} />
                  <span>Đọc hiểu (Split-View)</span>
                </button>
              </div>
            </div>

            {/* Thống kê nhanh từ vựng & Chuỗi ngày */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-white/10">
              <div className={"rounded-2xl p-3 border " + T.soft + " " + T.line}>
                <p className={"text-[11px] font-bold uppercase tracking-wider mb-1 " + T.sub}>
                  Đã thuộc (SRS)
                </p>
                <p className="text-xl sm:text-2xl font-bold tnum text-emerald-500">
                  {learnedCount}
                </p>
              </div>

              <div className={"rounded-2xl p-3 border " + T.soft + " " + T.line}>
                <p className={"text-[11px] font-bold uppercase tracking-wider mb-1 " + T.sub}>
                  Từ bài đọc
                </p>
                <p className="text-xl sm:text-2xl font-bold tnum text-accent">
                  {fromReadingCount}
                </p>
              </div>

              <div className={"rounded-2xl p-3 border " + T.soft + " " + T.line}>
                <p className={"text-[11px] font-bold uppercase tracking-wider mb-1 " + T.sub}>
                  Chuỗi ngày
                </p>
                <p className="text-xl sm:text-2xl font-bold tnum text-amber-500">
                  {streak} ngày
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: MA TRẬN ĐỌC HIỂU (READING MATRIX) */}
          <div
            className={
              "p-7 sm:p-9 lg:p-10 flex flex-col justify-between " +
              (dark ? "bg-black/35 backdrop-blur-md" : "bg-gray-50/70")
            }
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={"text-xs font-bold uppercase tracking-wider " + T.sub}>
                  Ma trận Kỹ năng Đọc hiểu (RC)
                </span>
                <button
                  onClick={() => onGo("read")}
                  className={"text-xs font-bold hover:underline flex items-center gap-1 " + T.accentText}
                >
                  Chi tiết <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {READING_PARTS.map((p) => {
                  const s = stats && stats.reading && stats.reading[p.key];
                  const c = s ? s.c : 0;
                  const t = s ? s.t : 0;
                  const rate = t > 0 ? Math.round((c / t) * 100) : 0;

                  return (
                    <div
                      key={p.n}
                      onClick={() => onGo("read")}
                      className={
                        "rounded-2xl border p-3.5 cursor-pointer transition-all hover:border-accent/40 " +
                        T.card +
                        " " +
                        T.line
                      }
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold">{p.name}</span>
                        <span className="text-xs font-semibold tnum text-accent">
                          {t > 0 ? `${rate}% đúng (${c}/${t})` : "Chưa luyện"}
                        </span>
                      </div>
                      <p className={"text-xs mb-2 truncate " + T.sub}>{p.desc}</p>
                      <div className={"w-full h-2 rounded-full overflow-hidden " + T.track}>
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-accent"
                          style={{ width: `${t > 0 ? rate : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nhiệm vụ hằng ngày tóm tắt */}
            <div className={"rounded-2xl p-4 border flex items-center justify-between gap-3 " + T.soft + " " + T.line}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Nhiệm vụ hôm nay
                </p>
                <p className="text-sm font-bold">
                  {plan.doneCount} / {plan.total} hoàn tất ({pct}%)
                </p>
              </div>
              <div className="w-20">
                <Bar value={pct} T={T} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NHIỆM VỤ HÀNG NGÀY (DAILY ACTION CHECKLIST) ===== */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold tracking-tight">Kế hoạch Luyện Tập Hôm Nay</h2>
        <span className={"text-xs font-semibold px-3 py-1 rounded-full " + T.soft + " " + T.sub}>
          {plan.allDone ? "✓ Hoàn thành xuất sắc" : `${plan.total - plan.doneCount} nhiệm vụ còn lại`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-10">
        {plan.tasks.map((task) => {
          const done = !!(doneToday && doneToday[task.id]);
          return (
            <button
              key={task.id}
              onClick={() => onStartTask(task.id, task.tab)}
              style={{ minHeight: 74 }}
              className={
                "rounded-2xl p-4 flex items-center gap-4 text-left transition-all border " +
                (done
                  ? "opacity-60 grayscale " + T.card + " " + T.line
                  : "hover:border-accent/40 hover:-translate-y-0.5 shadow-sm " +
                    T.card +
                    " " +
                    T.line)
              }
            >
              <div
                className={
                  "shrink-0 h-12 w-12 rounded-xl flex items-center justify-center font-bold " +
                  (done ? T.soft + " " + T.sub : "bg-accent/15 text-accent")
                }
              >
                {task.icon === "book" ? (
                  <BookOpen size={22} />
                ) : task.icon === "pencil" ? (
                  <PenTool size={22} />
                ) : (
                  <FileText size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p
                  className={
                    "text-[15px] font-bold truncate " +
                    (done ? "line-through opacity-70" : "")
                  }
                >
                  {task.label}
                </p>
                <p className={"text-xs mt-0.5 truncate " + T.sub}>{task.desc}</p>
              </div>
              {done ? (
                <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
              ) : (
                <div
                  className={
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 " +
                    T.soft
                  }
                >
                  <Play size={14} className="fill-current ml-0.5 text-accent" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ===== LỘ TRÌNH 4 GIAI ĐOẠN CHINH PHỤC TOEIC (ROADMAP) ===== */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Lộ Trình Chinh Phục TOEIC</h2>
          <p className={"text-xs mt-0.5 " + T.sub}>Từ mất gốc đến làm chủ Target 650+ / 900+</p>
        </div>
        <span className="text-xs font-bold text-accent uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
          4 Giai đoạn
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
        {[
          {
            phase: "Phase 1",
            target: "Target 250 - 400",
            title: "Nền Tảng & Khởi Động",
            desc: "Làm chủ ngữ pháp căn bản Part 5 (Thì, Từ loại, So sánh) và phản xạ nghe cơ bản.",
            tag: "Ngữ pháp & Part 5",
            tagColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
            action: () => onGo("read"),
            btnText: "Học Part 5",
          },
          {
            phase: "Phase 2",
            target: "Target 400 - 550",
            title: "Từ Vựng Thương Mại",
            desc: "Tích lũy 50 chủ đề từ vựng TOEIC (Hợp đồng, Marketing, Tài chính) theo chuẩn Parroto.",
            tag: "50 Chủ đề từ vựng",
            tagColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
            action: () => onGo("vocab"),
            btnText: "Học từ vựng",
          },
          {
            phase: "Phase 3",
            target: "Target 550 - 650",
            title: "Chiến Thuật Đọc Hiểu",
            desc: "Luyện đọc đoạn đơn, kép, ba Part 7 với tính năng Split-View và chạm tra từ tức thì.",
            tag: "Đọc hiểu Part 7",
            tagColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
            action: () => onGo("read"),
            btnText: "Luyện Part 7",
          },
          {
            phase: "Phase 4",
            target: "Target 650+",
            title: "Làm Chủ Viết & Đọc Hiểu",
            desc: "Hoàn thiện kỹ năng viết câu thương mại và chinh phục các bài đọc Part 7 độ khó cao.",
            tag: "Viết & Đọc Nâng Cao",
            tagColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
            action: () => onGo("write"),
            btnText: "Luyện Tập Viết",
          },
        ].map((p, idx) => (
          <div
            key={idx}
            className={
              "rounded-2xl p-5 border flex flex-col justify-between transition-all hover:border-accent/40 hover:-translate-y-0.5 " +
              T.card +
              " " +
              T.line
            }
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-accent">
                  {p.phase}
                </span>
                <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full border " + p.tagColor}>
                  {p.target}
                </span>
              </div>
              <h3 className="text-base font-bold mb-1.5">{p.title}</h3>
              <p className={"text-xs leading-relaxed mb-4 " + T.sub}>{p.desc}</p>
            </div>

            <button
              onClick={p.action}
              className={
                "w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border active:scale-95 " +
                (idx === 1
                  ? "bg-accent text-white border-accent shadow-md shadow-accent/25 hover:brightness-110"
                  : T.soft + " " + T.line + " hover:border-accent/40")
              }
            >
              <span>{p.btnText}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* ===== KHÁM PHÁ CÁC TÍNH NĂNG CHÍNH ===== */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold tracking-tight">Tất Cả Phân Hệ</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-8">
        {featureCards.map((c) => {
          const Icon = c.Icon;
          const tagCls =
            c.tagColor === "accent"
              ? "bg-accent text-white"
              : c.tagColor === "amber"
              ? "bg-amber-500 text-white"
              : T.soft + " " + T.sub;

          return (
            <button
              key={c.key}
              onClick={() => onGo(c.key)}
              style={{ minHeight: 140 }}
              className={
                "group rounded-2xl p-5 flex flex-col justify-between text-left transition-all border hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg " +
                T.card +
                " " +
                T.line
              }
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon size={22} />
                  </span>
                  <span className={"text-[11px] font-bold px-2.5 py-0.5 rounded-full " + tagCls}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1 group-hover:text-accent transition-colors">
                  {c.label}
                </h3>
                <p className={"text-xs leading-relaxed line-clamp-2 " + T.sub}>
                  {c.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-accent mt-3 pt-3 border-t border-white/5">
                <span>{c.action}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
