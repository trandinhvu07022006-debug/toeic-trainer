import React, { useMemo } from "react";
import { BookOpen, Headphones, Mic, FileText, Clock, BarChart3, ChevronRight, Target, CheckCircle2, Circle, Search, NotebookPen, ArrowRight } from "lucide-react";
import { Bar, Eyebrow } from "../ui/index.jsx";
import { buildDailyPlan } from "../lib/dailyplan.js";
import { dayKey } from "../lib/srs.js";
import { TOTAL_WORDS } from "../data/counts.js";

/* Icon cho từng nhiệm vụ theo mã icon trong dailyplan */
const ICONS = { book: BookOpen, headphones: Headphones, file: FileText, mic: Mic };

/* Bảy phần thi TOEIC — dùng cho "thước điểm" (signature). Part 1→7 là một chuỗi
   thật, nên đánh số ở đây mang thông tin chứ không phải trang trí. */
const PARTS = [
  { n: 1, skill: "listening", key: 1, short: "Ảnh" },
  { n: 2, skill: "listening", key: 2, short: "Hỏi–đáp" },
  { n: 3, skill: "listening", key: 3, short: "Hội thoại" },
  { n: 4, skill: "listening", key: 4, short: "Bài nói" },
  { n: 5, skill: "reading", key: 5, short: "Câu" },
  { n: 6, skill: "reading", key: 6, short: "Đoạn" },
  { n: 7, skill: "reading", key: 7, short: "Đọc hiểu" },
];

/* Trang chủ nhẹ (không nạp học liệu nặng). Trọng tâm là "Nhiệm vụ hôm nay" để
   người tự học biết ngay nên làm gì. */
export function HomeScreen({ T, dark, streak, history, lastResults, onGo, srs, stats, doneToday, onStartTask, mistakeCount }) {
  const recent = (history || []).slice(-1)[0];
  const lastFull = lastResults && lastResults.ALL;

  const plan = useMemo(
    () => buildDailyPlan({ totalWords: TOTAL_WORDS, srs: srs || {}, stats, dateStr: dayKey(), doneToday: doneToday || {} }),
    [srs, stats, doneToday]
  );

  const shortcuts = [
    { key: "vocab", label: "Từ vựng", desc: "4.400+ từ theo chủ đề", Icon: BookOpen },
    { key: "listen", label: "Luyện nghe", desc: "Part 1–4 có phụ đề", Icon: Headphones },
    { key: "read", label: "Luyện đọc", desc: "Part 5–7 kèm giải thích", Icon: FileText },
    { key: "speak", label: "Luyện nói", desc: "11 dạng câu hỏi", Icon: Mic },
    { key: "exam", label: "Thi thử", desc: "Mini · Nửa đề · Full 200", Icon: Clock },
    { key: "progress", label: "Tiến độ", desc: "Điểm & chuỗi ngày", Icon: BarChart3 },
  ];

  const pct = plan.total ? Math.round((plan.doneCount / plan.total) * 100) : 0;

  return (
    <div className="px-4 pt-4">
      {/* Thanh tra từ điển */}
      <button onClick={() => onGo("dict")} style={{ minHeight: 46 }}
        className={"w-full flex items-center gap-2.5 rounded-xl border px-4 mb-5 text-left " + T.card + " " + T.line}>
        <Search size={17} className={T.sub} />
        <span className={"text-[15px] " + T.sub}>Tra nghĩa một từ…</span>
      </button>

      {/* ===== HERO: Giao diện Gamified nổi bật ====== */}
      <section className={"animate-pop rounded-[32px] border-2 border-b-[6px] mb-6 overflow-hidden " + (dark ? "bg-gray-800 border-gray-900" : "bg-white border-gray-200")}>
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          {/* Cột trái */}
          <div className="p-6 lg:p-8 lg:border-r" style={{ borderColor: dark ? "#111" : "#eee" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-3 w-3 rounded-full animate-bounce" style={{ background: "var(--accent)" }} />
              <span className={"font-bold uppercase tracking-wider text-[13px] " + T.sub}>Mục tiêu hôm nay</span>
            </div>
            <h1 className="font-display text-[28px] lg:text-[34px] font-extrabold leading-tight mb-2">
              {plan.allDone ? "Tuyệt vời, xong hết! 🎉" : "Lên cấp cùng bài luyện!"}
            </h1>
            <p className={"text-[16px] mb-6 font-semibold " + T.sub}>
              {plan.allDone
                ? "Giữ chuỗi ngày cực đỉnh. Muốn rèn thêm phản xạ thì cứ chiến tiếp nhé."
                : "Hoàn thành các nhiệm vụ dưới đây để thăng hạng và giữ Streak rực vinh quang."}
            </p>

            <div className="flex items-end justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tnum text-accent">{plan.doneCount}</span>
                <span className={"text-base font-bold " + T.sub}>/ {plan.total} nhiệm vụ</span>
              </div>
            </div>
            {/* Thanh tiến độ siêu béo mượt */}
            <div className={"w-full h-5 rounded-full overflow-hidden shadow-inner " + (dark ? "bg-gray-900" : "bg-gray-100")}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out bg-accent" style={{ width: pct + "%" }} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-6">
              {lastFull && (
                <div className={"flex items-center gap-1.5 rounded-xl px-3 py-2 " + T.soft}>
                  <Target size={16} className={T.accentText} strokeWidth={2.5} />
                  <span className="text-[14px] font-bold">{lastFull.score} điểm gần nhất</span>
                </div>
              )}
              <div className={"flex items-center gap-1.5 rounded-xl px-3 py-2 " + T.soft}>
                <span className="text-[14px] font-extrabold tnum">{streak}</span>
                <span className={"text-[13px] font-semibold " + T.sub}>ngày bốc lửa</span>
              </div>
            </div>
          </div>

          {/* Cột phải: THƯỚC ĐIỂM 7 PHẦN */}
          <div className={"hidden lg:block p-8 " + (dark ? "bg-white/[0.02]" : "bg-gray-50")}>
            <span className={"font-bold uppercase tracking-wider text-[13px] " + T.sub}>Thống kê cá nhân</span>
            <div className="mt-4"><SkillSpine stats={stats} T={T} dark={dark} onGo={onGo} /></div>
          </div>
        </div>
      </section>

      {/* ===== NHIỆM VỤ HÔM NAY ===== */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-semibold">Nhiệm vụ hôm nay</h2>
        <span className={"text-sm font-semibold tnum " + T.sub}>{plan.doneCount}/{plan.total}</span>
      </div>

      {plan.allDone && (
        <div className={"rounded-xl border p-4 mb-4 flex items-center gap-3 " + (dark ? "bg-emerald-500/10 border-emerald-500/40" : "bg-emerald-50 border-emerald-300")}>
          <CheckCircle2 className={dark ? "text-emerald-400" : "text-emerald-600"} size={24} />
          <p className="font-semibold">Hoàn thành cả buổi học hôm nay.</p>
        </div>
      )}

      <div className="flex flex-col gap-3.5 mb-8">
        {plan.tasks.map((task) => {
          const Icon = ICONS[task.icon] || BookOpen;
          const done = !!(doneToday && doneToday[task.id]);
          return (
            <button key={task.id} onClick={() => onStartTask(task.id, task.tab)} style={{ minHeight: 76 }}
              className={"group rounded-[24px] border-2 p-3.5 flex items-center gap-4 text-left transition-all active:scale-[0.98] " +
                (done ? (dark ? "bg-gray-800 border-gray-900 border-b-2 opacity-60" : "bg-gray-50 border-gray-200 border-b-2") : "border-b-[5px] bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 dark:bg-gray-800 dark:border-gray-700")}>
              <div className="shrink-0 rounded-[16px] flex items-center justify-center shadow-sm" style={{
                width: 50, height: 50,
                background: done ? (dark ? "rgba(255,255,255,0.05)" : "#e5e7eb") : (dark ? "rgba(92,174,149,0.3)" : "#e5fbee")
              }}>
                <Icon size={24} className={done ? T.sub : T.accentText} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={"font-extrabold text-[16px] " + (done ? "line-through " + T.sub : "")}>{task.label}</p>
                <p className={"text-[14px] font-semibold mt-0.5 " + T.sub}>{task.desc}</p>
              </div>
              {done
                ? <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={20} className={"text-emerald-500"} strokeWidth={3} /></div>
                : <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-green-100 group-hover:text-green-600 transition-colors"><ArrowRight size={20} className={"text-gray-400 group-hover:text-green-500"} strokeWidth={2.5} /></div>}
            </button>
          );
        })}
      </div>

      {/* Lần luyện gần nhất */}
      {recent && (
        <div className={"rounded-xl border p-4 mb-5 flex items-center justify-between " + T.card + " " + T.line}>
          <div>
            <Eyebrow T={T} className="mb-1">Lần luyện gần nhất</Eyebrow>
            <p className="font-semibold">{recent.format || "Bài luyện"}</p>
            <p className={"text-[13px] " + T.sub}>Đúng {recent.correct}/{recent.total} · {recent.score} điểm</p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-semibold tnum" style={{ color: "var(--accent)" }}>
              {Math.round((recent.correct / recent.total) * 100)}<span className="text-lg">%</span>
            </div>
          </div>
        </div>
      )}

      {/* Sổ tay lỗi sai */}
      {mistakeCount > 0 && (
        <button onClick={() => onGo("mistakes")} style={{ minHeight: 64 }}
          className={"w-full rounded-xl border p-3 flex items-center gap-3 text-left mb-8 transition-all active:scale-[0.99] " +
            (dark ? "bg-[#c8791f]/10 border-[#c8791f]/30" : "bg-[#faf1e3] border-[#e2d3b8]")}>
          <div className="shrink-0 rounded-lg flex items-center justify-center" style={{ width: 42, height: 42, background: "var(--amber)" }}>
            <NotebookPen size={20} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Sổ tay lỗi sai</p>
            <p className={"text-[13px] " + T.sub}>{mistakeCount} câu cần ôn lại — học từ chính lỗi của mình</p>
          </div>
          <ChevronRight size={18} className={"shrink-0 " + T.sub} />
        </button>
      )}

      {/* Tất cả nội dung */}
      <div className="flex items-center gap-2 mb-4 mt-8">
        <span className={"font-bold uppercase tracking-wider text-[14px] " + T.sub}>🚀 Sân tập vô hạn</span>
      </div>
      <div className="grid grid-cols-2 gap-3 pb-8 stagger">
        {shortcuts.map((s) => {
          const Icon = s.Icon;
          return (
            <button key={s.key} onClick={() => onGo(s.key)} style={{ minHeight: 96 }}
              className={"group rounded-3xl border-2 border-b-[6px] p-4 flex flex-col text-left transition-all active:scale-[0.97] " +
                (dark ? "bg-gray-800 border-gray-900 hover:border-gray-700" : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50")}>
              <Icon size={28} className={"mb-3 " + T.accentText} strokeWidth={2.5} />
              <p className={"font-extrabold text-[16px] leading-tight " + (dark ? "text-white" : "text-gray-800")}>{s.label}</p>
              <p className={"text-[13px] font-semibold mt-1 opacity-70 " + (dark ? "text-gray-300" : "text-gray-500")}>{s.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===== SIGNATURE: "thước điểm" 7 phần =====
   Mỗi phần là một vạch ngang có chiều dài tỉ lệ với độ chính xác (c/t).
   Đặt số phần bằng font hiển thị, gợi thước kẻ / bảng điểm của sách luyện đề.
   Bấm vào một vạch sẽ nhảy tới phần luyện tương ứng. */
function SkillSpine({ stats, T, dark, onGo }) {
  const val = (p) => {
    const g = stats && stats[p.skill] && stats[p.skill][p.key];
    if (!g || !g.t) return null;
    return Math.round((g.c / g.t) * 100);
  };
  return (
    <div className="space-y-2">
      {PARTS.map((p) => {
        const v = val(p);
        const target = p.skill === "listening" ? "listen" : "read";
        return (
          <button key={p.n} onClick={() => onGo(target)}
            className="w-full flex items-center gap-3 group text-left" style={{ height: 26 }}>
            <span className="font-display text-[13px] font-semibold tnum w-4 shrink-0" style={{ color: v == null ? undefined : "var(--accent)", opacity: v == null ? 0.5 : 1 }}>{p.n}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden relative" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#ece5d8" }}>
              {v != null && (
                <div className="h-full rounded-full transition-all duration-700" style={{ width: v + "%", background: "var(--accent)" }} />
              )}
            </div>
            <span className={"text-[11px] tnum w-9 text-right shrink-0 " + (v == null ? T.sub : "font-semibold")}>
              {v == null ? "—" : v + "%"}
            </span>
          </button>
        );
      })}
      <p className={"text-[11px] pt-1 " + T.sub}>Phần chưa có dấu “—”. Bấm để bắt đầu luyện.</p>
    </div>
  );
}
