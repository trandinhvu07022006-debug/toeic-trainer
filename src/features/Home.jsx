import React, { useMemo } from "react";
import { BookOpen, Headphones, Mic, FileText, Clock, BarChart3, ChevronRight, Target, CheckCircle2, Circle, Search, NotebookPen, ArrowRight, Play } from "lucide-react";
import { Bar, Eyebrow } from "../ui/index.jsx";
import { buildDailyPlan } from "../lib/dailyplan.js";
import { dayKey } from "../lib/srs.js";
import { TOTAL_WORDS } from "../data/counts.js";

const ICONS = { book: BookOpen, headphones: Headphones, file: FileText, mic: Mic };

const PARTS = [
  { n: 1, skill: "listening", key: 1, short: "Ảnh" },
  { n: 2, skill: "listening", key: 2, short: "Hỏi–đáp" },
  { n: 3, skill: "listening", key: 3, short: "Hội thoại" },
  { n: 4, skill: "listening", key: 4, short: "Bài nói" },
  { n: 5, skill: "reading", key: 5, short: "Câu" },
  { n: 6, skill: "reading", key: 6, short: "Đoạn" },
  { n: 7, skill: "reading", key: 7, short: "Đọc hiểu" },
];

export function HomeScreen({ T, dark, streak, history, lastResults, onGo, srs, stats, doneToday, onStartTask, mistakeCount }) {
  const recent = (history || []).slice(-1)[0];
  const lastFull = lastResults && lastResults.ALL;
  const plan = useMemo(() => buildDailyPlan({ totalWords: TOTAL_WORDS, srs: srs || {}, stats, dateStr: dayKey(), doneToday: doneToday || {} }), [srs, stats, doneToday]);
  const pct = plan.total ? Math.round((plan.doneCount / plan.total) * 100) : 0;

  const shortcuts = [
    { key: "vocab", label: "Từ vựng", desc: "4.400+ từ theo chủ đề", Icon: BookOpen },
    { key: "listen", label: "Luyện nghe", desc: "Part 1–4 có phụ đề", Icon: Headphones },
    { key: "read", label: "Luyện đọc", desc: "Part 5–7 kèm giải thích", Icon: FileText },
    { key: "speak", label: "Luyện nói", desc: "11 dạng câu hỏi", Icon: Mic },
    { key: "exam", label: "Thi thử", desc: "Mini · Nửa đề · Full", Icon: Clock },
    { key: "progress", label: "Tiến độ", desc: "Điểm & chuỗi ngày", Icon: BarChart3 },
  ];

  return (
    <div className="px-4 pt-4 lg:pt-0 pb-12 w-full max-w-[1400px] mx-auto animate-fade">

      {/* Search Bar - Premium Float Style */}
      <button onClick={() => onGo("dict")} style={{ minHeight: 48 }}
        className={"w-full flex items-center gap-3 rounded-2xl px-5 mb-8 text-left transition-all border shadow-sm backdrop-blur-md " +
          (dark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:border-gray-300")}>
        <Search size={18} className={T.sub} />
        <span className={"text-[15px] " + T.sub}>Tra nghĩa một từ trên KMG Club...</span>
      </button>

      {/* ===== HERO: Spotify Premium Card ====== */}
      <section className={"relative animate-pop rounded-[32px] mb-10 overflow-hidden shadow-2xl border " + (dark ? "bg-[#111] border-white/5" : "bg-gradient-to-br from-white to-gray-50 border-gray-200")}>
        {/* Glow Effects */}
        {dark && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 left-0 w-40 h-40 bg-accent/10 rounded-full blur-[60px]" />
          </>
        )}

        <div className="grid lg:grid-cols-[1.3fr_1fr] relative z-10">
          {/* Main Info */}
          <div className="p-8 lg:p-10 lg:border-r border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className={"px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md " + (dark ? "bg-white/10 text-gray-300" : "bg-black text-white")}>
                KMG TRAINING
              </span>
            </div>
            <h1 className={"font-display text-[32px] lg:text-[40px] tracking-wide leading-tight mb-3 " + (dark ? "text-white" : "text-black")}>
              {plan.allDone ? "CHÁY HẾT TẤM NĂNG LƯỢNG! 🎸" : "LÊN DÂY ĐÀN NÀO, ROCKER!"}
            </h1>
            <p className={"text-[15px] mb-8 leading-relaxed opacity-80 max-w-md font-medium " + T.sub}>
              {plan.allDone ? "Hoàn thành xuất sắc nhiệm vụ hôm nay. Nghỉ ngơi hoặc cày thêm nếu bạn tự tin." : "Hoàn thành các beat dưới đây để cháy hết mình trên sân khấu tiếng Anh."}
            </p>

            {/* Premium Progress Bar */}
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[44px] tracking-wider tnum text-accent drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">{plan.doneCount}</span>
                <span className={"text-[15px] font-bold uppercase tracking-wider " + T.sub}>/ {plan.total} nhiệm vụ</span>
              </div>
            </div>
            <div className={"w-full h-2 rounded-full overflow-hidden shadow-inner " + T.track}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out bg-accent shadow-[0_0_12px_rgba(239,68,68,0.8)]" style={{ width: pct + "%" }} />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              {lastFull && (
                <div className={"flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-r transition-all " + (dark ? "from-accent/20 to-transparent border border-accent/20" : "from-accent/10 to-transparent border border-accent/10")}>
                  <Target size={18} className={T.accentText} />
                  <span className={"text-[14px] font-bold " + (dark ? "text-white" : "text-black")}>{lastFull.score} điểm Tests</span>
                </div>
              )}
              <div className={"flex items-center gap-2 rounded-xl px-4 py-2 border transition-all " + T.soft + " " + T.line}>
                <span className={"text-[15px] font-display tracking-widest tnum " + (dark ? "text-white" : "text-black")}>{streak}</span>
                <span className={"text-[13px] font-semibold uppercase tracking-wider " + T.sub}>Ngày lốc xoáy</span>
              </div>
            </div>
          </div>

          {/* Right Stats (Thước điểm) */}
          <div className={"hidden lg:block p-10 " + (dark ? "bg-black/40 backdrop-blur-md" : "bg-gray-50/50")}>
            <span className={"font-display tracking-widest uppercase text-[12px] opacity-70 " + (dark ? "text-white" : "text-black")}>Thống kê Năng Năng Lực</span>
            <div className="mt-6"><SkillSpine stats={stats} T={T} dark={dark} onGo={onGo} /></div>
          </div>
        </div>
      </section>

      {/* ===== NHIỆM VỤ DAILY PLAYLIST ===== */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className={"font-display text-[22px] tracking-wide " + (dark ? "text-white" : "text-black")}>Nhiệm vụ hôm nay</h2>
        <span className={"text-sm font-bold uppercase tracking-widest tnum bg-white/10 px-3 py-1 rounded-full " + T.sub}>{pct}% Hoàn Tất</span>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {plan.tasks.map((task) => {
          const Icon = ICONS[task.icon] || BookOpen;
          const done = !!(doneToday && doneToday[task.id]);
          return (
            <button key={task.id} onClick={() => onStartTask(task.id, task.tab)} style={{ minHeight: 88 }}
              className={"group rounded-[24px] p-4 lg:p-5 flex items-center gap-5 text-left transition-all backdrop-blur-md border " +
                (done ? "opacity-60 grayscale " + T.card + " " + T.line : "hover:-translate-y-1 hover:border-accent/40 shadow-lg " + (dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"))}>
              <div className={"shrink-0 flex items-center justify-center rounded-[18px] transition-all " + (done ? T.soft : "glow-btn shadow-[0_0_20px_rgba(239,68,68,0.3)]")} style={{ width: 62, height: 62 }}>
                <Icon size={28} className={done ? T.sub : "text-white"} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className={"font-display tracking-wide text-[18px] " + (done ? "line-through " + T.sub : (dark ? "text-white" : "text-black"))}>{task.label}</p>
                <p className={"text-[13px] font-medium mt-1 " + T.sub}>{task.desc}</p>
              </div>
              {done
                ? <div className={"h-10 w-10 rounded-full flex items-center justify-center shrink-0 border " + (dark ? "bg-emerald-500/20 border-emerald-500/50" : "bg-emerald-50 border-emerald-300")}><CheckCircle2 size={24} className={dark ? "text-emerald-400" : "text-emerald-600"} strokeWidth={2.5} /></div>
                : <div className={"h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors " + (dark ? "text-white" : "text-black")}><Play size={18} className={"group-hover:text-white fill-current ml-0.5"} /></div>}
            </button>
          );
        })}
      </div>

      {/* Sổ tay lỗi sai & Lượt thi */}
      <div className="grid lg:grid-cols-2 gap-4 mb-12">
        {recent && (
          <div className={"rounded-[24px] border p-6 flex flex-col justify-between transition-colors " + T.card + " " + T.line}>
            <div>
              <p className={"text-[11px] font-bold uppercase tracking-widest mb-1.5 " + T.sub}>Lần luyện gần nhất</p>
              <p className={"font-display text-[20px] mb-1 " + (dark ? "text-white" : "text-black")}>{recent.format || "Bài luyện"}</p>
              <p className={"text-[14px] " + T.sub}>Đúng {recent.correct}/{recent.total} · {recent.score} điểm</p>
            </div>
            <div className="mt-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-display tracking-widest text-xl">
                {Math.round((recent.correct / recent.total) * 100)}%
              </div>
            </div>
          </div>
        )}

        {mistakeCount > 0 && (
          <button onClick={() => onGo("mistakes")} className={"w-full rounded-[24px] border p-6 flex flex-col text-left transition-transform active:scale-[0.98] " + (dark ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15" : "bg-amber-50 border-amber-100 hover:bg-amber-100")}>
            <div className="shrink-0 rounded-xl flex items-center justify-center mb-4" style={{ width: 48, height: 48, background: "var(--amber)" }}>
              <NotebookPen size={24} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={"font-display text-[20px] mb-1 " + (dark ? "text-white" : "text-orange-950")}>Sổ Tay Nhịp Lỗi</p>
              <p className={"text-[14px] " + (dark ? "text-amber-200/60" : "text-amber-800/80")}>{mistakeCount} câu cần ôn lại — gỡ rối và ghim beat.</p>
            </div>
          </button>
        )}
      </div>

      {/* TẤT CẢ NỘI DUNG (Grid shortcuts) */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <h2 className={"font-display text-[22px] tracking-wide " + (dark ? "text-white" : "text-black")}>Khám Phá Tính Năng</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8 stagger mt-2">
        {shortcuts.map((s) => {
          const Icon = s.Icon;
          return (
            <button key={s.key} onClick={() => onGo(s.key)} style={{ minHeight: 110 }}
              className={"group rounded-[24px] p-5 flex flex-col text-left transition-all border shadow-sm backdrop-blur-sm " +
                (dark ? "bg-[#111] hover:bg-[#1a1a1a] border-white/5 hover:border-accent/40" : "bg-white hover:bg-gray-50 border-gray-200 hover:border-accent/50 hover:-translate-y-1")}>
              <Icon size={30} className={"mb-4 transition-transform group-hover:scale-110 " + T.accentText} strokeWidth={2.5} />
              <p className={"font-display tracking-wider text-[15px] mb-1 " + (dark ? "text-gray-100" : "text-black")}>{s.label}</p>
              <p className={"text-[11px] font-semibold opacity-70 " + (dark ? "text-gray-400" : "text-gray-500")}>{s.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkillSpine({ stats, T, dark, onGo }) {
  const val = (p) => {
    const g = stats && stats[p.skill] && stats[p.skill][p.key];
    if (!g || !g.t) return null;
    return Math.round((g.c / g.t) * 100);
  };
  return (
    <div className="space-y-3">
      {PARTS.map((p) => {
        const v = val(p);
        const target = p.skill === "listening" ? "listen" : "read";
        return (
          <button key={p.n} onClick={() => onGo(target)}
            className="w-full flex items-center gap-3 group text-left transition-transform hover:translate-x-1" style={{ height: 26 }}>
            <span className="font-display text-[15px] font-semibold tnum w-4 shrink-0 transition-colors" style={{ color: v == null ? "currentColor" : "var(--accent)", opacity: v == null ? 0.3 : 1 }}>{p.n}</span>
            <div className={"flex-1 h-2 rounded-full overflow-hidden relative " + T.track}>
              {v != null && (
                <div className="h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ width: v + "%", background: "var(--accent)" }} />
              )}
            </div>
            <span className={"text-[12px] font-display tnum w-11 text-right shrink-0 tracking-wider " + (v == null ? T.sub + " opacity-50" : (dark ? "text-white" : "text-black"))}>
              {v == null ? "0%" : v + "%"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
