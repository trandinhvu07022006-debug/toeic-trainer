import React from "react";
import { Lightbulb, BookOpen, PenTool, FileText, Flame, CheckCircle, Clock, Zap, RotateCcw } from "lucide-react";
import { VOCAB, VOCAB_TOPICS } from "../data/vocab.js";
import { GRAMMAR } from "../data/reading.js";
import { partition, isLearned } from "../lib/srs.js";
import { pct } from "../lib/scoring.js";
import { Bar, SectionTitle, PageHeader } from "../ui/index.jsx";

/* ═══════════════════════════════════════════════════════════════════
   BÁO CÁO TIẾN ĐỘ & NĂNG LỰC — CHUYÊN BIỆT CHO 3 TRỤ CỘT:
   1. TỪ VỰNG (VOCABULARY & SRS)
   2. TẬP VIẾT (WRITING & MOTOR MEMORY)
   3. ĐỌC HIỂU (READING COMPREHENSION PART 5, 6, 7)
   ═══════════════════════════════════════════════════════════════════ */

export function ProgressScreen({
  T,
  dark,
  stats = {},
  srs = {},
  streak = 0,
  vocabDrill = { done: 0, correct: 0 },
  grammarStats = {},
  onReset,
}) {
  const gStats = grammarStats || {};
  const drill = vocabDrill || { done: 0, correct: 0 };
  const r = stats?.reading || { 5: { c: 0, t: 0 }, 6: { c: 0, t: 0 }, 7: { c: 0, t: 0 } };

  const totalDone = (r[5]?.t || 0) + (r[6]?.t || 0) + (r[7]?.t || 0);
  const totalCorrect = (r[5]?.c || 0) + (r[6]?.c || 0) + (r[7]?.c || 0);

  const learned = VOCAB.filter((v) => isLearned(srs[v.id])).length;
  const parts = partition(VOCAB, srs);
  const dueToday = parts.due.length;
  const fromReadingCount = VOCAB.filter((v) => srs[v.id] && srs[v.id].fromReading).length;

  // Thống kê 4 hộp Leitner
  const boxCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  Object.values(srs || {}).forEach((card) => {
    if (card && typeof card.box === "number") {
      const b = Math.min(3, Math.max(0, card.box));
      boxCounts[b] = (boxCounts[b] || 0) + 1;
    }
  });

  // Tạo lời khuyên thông minh dựa trên dữ liệu thực
  const tips = [];
  const practised = [5, 6, 7]
    .filter((p) => r[p]?.t >= 3)
    .map((p) => ({ p, a: pct(r[p].c, r[p].t) }))
    .sort((a, b) => a.a - b.a);

  if (practised.length) {
    const worst = practised[0];
    tips.push(
      `Đọc hiểu Part ${worst.p} đang là phần cần cải thiện (${worst.a}% đúng). Hãy làm lại các câu sai trong Sổ lỗi sai trước khi luyện đề mới.`
    );
    if (worst.p === 5) {
      tips.push(
        "Mẹo Part 5: Nhìn 4 phương án TRƯỚC khi đọc câu. Nếu cùng gốc từ chỉ khác đuôi thì là câu từ loại, chỉ cần xác định vị trí chỗ trống (danh/tính/động/trạng)."
      );
    } else if (worst.p === 7) {
      tips.push(
        "Mẹo Part 7: Đọc câu hỏi trước để định vị từ khóa trong đoạn văn; phương án đúng luôn là paraphrase (diễn đạt lại), tránh bẫy copy y nguyên từ đoạn văn."
      );
    } else if (worst.p === 6) {
      tips.push(
        "Mẹo Part 6: Đối với câu điền nguyên câu, hãy quan sát liên từ nối (However, Therefore...) và đại từ thay thế (this, these...) ở câu trước và câu sau."
      );
    }
  } else {
    tips.push("Hãy làm ít nhất 10 câu Part 5 để hệ thống phân tích và chỉ ra phần cần cải thiện.");
  }

  const weakG = GRAMMAR.map((g) => ({ name: g.name, ...(gStats[g.id] || { c: 0, t: 0 }) }))
    .filter((g) => g.t >= 3)
    .sort((a, b) => pct(a.c, a.t) - pct(b.c, b.t));

  if (weakG.length && pct(weakG[0].c, weakG[0].t) < 75) {
    tips.push(
      `Chuyên đề "${weakG[0].name}" mới đạt ${pct(weakG[0].c, weakG[0].t)}%. Hãy xem lại công thức nhận biết và làm lại toàn bộ câu hỏi chuyên đề này.`
    );
  }

  if (learned < 15) {
    tips.push("Mục tiêu từ vựng: Duy trì 15–20 từ mỗi ngày trên giao diện 2 cột Parroto để tích lũy đủ 4.568 từ.");
  } else if (dueToday > 5) {
    tips.push(`Hôm nay có ${dueToday} thẻ từ vựng đến hạn ôn tập — hãy duyệt lại để chuyển từ sang Hộp ghi nhớ lâu dài.`);
  }

  tips.push("Kết hợp phòng Luyện Tập Viết (Gõ chính tả & Điền từ khuyết) giúp rèn trí nhớ cơ bắp và ghi nhớ từ vựng sâu gấp 3 lần học thụ động.");

  const Stat = ({ label, value, sub, color = "var(--accent)", icon: Icon }) => (
    <div className={"rounded-2xl border p-4 sm:p-5 flex flex-col justify-between " + T.card + " " + T.line}>
      <div className="flex items-center justify-between mb-2">
        <p className={"text-[11px] font-bold uppercase tracking-wider " + T.sub}>{label}</p>
        {Icon && <Icon size={16} className={T.sub} />}
      </div>
      <p className="font-display text-2xl sm:text-3xl font-extrabold tnum leading-tight" style={{ color }}>
        {value}
      </p>
      {sub && <p className={"text-xs mt-1.5 font-medium " + T.sub}>{sub}</p>}
    </div>
  );

  return (
    <div className="px-2 sm:px-4 pt-2 pb-14 max-w-6xl mx-auto animate-fade">
      <PageHeader
        T={T}
        eyebrow="Báo cáo năng lực học viên · KMG Club"
        title="Tiến Độ Học Tập 3 Trụ Cột"
        sub="Theo dõi chi tiết mức độ thành thạo Từ Vựng, Luyện Tập Viết và Đọc Hiểu Part 5, 6, 7"
      />

      {/* 4 THẺ CHỈ SỐ TỔNG QUAN HÀNG ĐẦU */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <Stat
          label="Từ vựng đã thuộc"
          value={learned}
          sub={`trên tổng ${VOCAB.length.toLocaleString()} từ (${pct(learned, VOCAB.length)}%)`}
          color="#10b981"
          icon={BookOpen}
        />
        <Stat
          label="Lượt luyện tập viết"
          value={drill.done}
          sub={drill.done ? `Đúng ${pct(drill.correct, drill.done)}% độ chính xác` : "Chưa làm bài tập viết"}
          color="#f59e0b"
          icon={PenTool}
        />
        <Stat
          label="Câu đọc hiểu đã giải"
          value={totalDone}
          sub={totalDone ? `Đúng ${totalCorrect}/${totalDone} câu (${pct(totalCorrect, totalDone)}%)` : "Chưa làm câu đọc nào"}
          color="#ef4444"
          icon={FileText}
        />
        <Stat
          label="Chuỗi ngày liên tục"
          value={`${streak} ngày`}
          sub={streak > 0 ? "Tuyệt vời, duy trì chuỗi học!" : "Bắt đầu học ngay hôm nay"}
          color="#f97316"
          icon={Flame}
        />
      </div>

      {/* ===== PHÂN HỆ 1: TỪ VỰNG & HỆ THỐNG GHI NHỚ NGẮT QUÃNG (SRS) ===== */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <SectionTitle T={T}>1. Năng Lực Từ Vựng & Hệ Thống Spaced Repetition (SRS)</SectionTitle>
          <span className="text-xs font-bold text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            64 Chủ đề · 4.568 từ
          </span>
        </div>

        <div className={"rounded-2xl border p-5 " + T.card + " " + T.line}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold">Tổng tiến độ làm chủ từ vựng TOEIC</span>
            <span className="text-sm font-extrabold text-accent">
              {learned} / {VOCAB.length} từ ({pct(learned, VOCAB.length)}%)
            </span>
          </div>
          <div className="mb-5">
            <Bar value={pct(learned, VOCAB.length)} T={T} />
          </div>

          {/* 4 Hộp Leitner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
            <div className={"p-3 rounded-xl border " + (dark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-200")}>
              <p className={"text-[10px] font-bold uppercase tracking-wider mb-1 " + T.sub}>Hộp 0 (Mới / Ôn lại)</p>
              <p className="text-xl font-bold tnum text-rose-400">{boxCounts[0] || 0}</p>
              <p className={"text-[11px] " + T.sub}>Luyện tập hàng ngày</p>
            </div>

            <div className={"p-3 rounded-xl border " + (dark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-200")}>
              <p className={"text-[10px] font-bold uppercase tracking-wider mb-1 " + T.sub}>Hộp 1 (Ghi nhớ ngắn)</p>
              <p className="text-xl font-bold tnum text-amber-400">{boxCounts[1] || 0}</p>
              <p className={"text-[11px] " + T.sub}>Ôn lại sau 1 ngày</p>
            </div>

            <div className={"p-3 rounded-xl border " + (dark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-200")}>
              <p className={"text-[10px] font-bold uppercase tracking-wider mb-1 " + T.sub}>Hộp 2 (Ghi nhớ sâu)</p>
              <p className="text-xl font-bold tnum text-sky-400">{boxCounts[2] || 0}</p>
              <p className={"text-[11px] " + T.sub}>Ôn lại sau 3 ngày</p>
            </div>

            <div className={"p-3 rounded-xl border " + (dark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-200")}>
              <p className={"text-[10px] font-bold uppercase tracking-wider mb-1 " + T.sub}>Hộp 3 (Thành thạo)</p>
              <p className="text-xl font-bold tnum text-emerald-400">{boxCounts[3] || 0}</p>
              <p className={"text-[11px] " + T.sub}>Bộ nhớ dài hạn</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs">
            <span className={T.sub}>
              Thẻ đến hạn hôm nay: <strong className="text-amber-400">{dueToday} thẻ</strong>
            </span>
            <span className={T.sub}>
              Từ lưu từ bài đọc: <strong className="text-accent">{fromReadingCount} từ</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ===== PHÂN HỆ 2: KỸ NĂNG ĐỌC HIỂU PART 5, 6, 7 ===== */}
      <div className="mb-8">
        <SectionTitle T={T}>2. Kỹ Năng Đọc Hiểu (Reading Comprehension)</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
          {[
            {
              p: 5,
              title: "Part 5: Hoàn thành câu",
              desc: "Ngữ pháp, từ loại, liên từ & đại từ",
              color: "text-sky-400",
            },
            {
              p: 6,
              title: "Part 6: Điền đoạn văn",
              desc: "Bối cảnh văn bản thương mại & điền câu",
              color: "text-amber-400",
            },
            {
              p: 7,
              title: "Part 7: Đọc hiểu văn bản",
              desc: "Đoạn đơn, đoạn kép, đoạn ba & paraphrase",
              color: "text-rose-400",
            },
          ].map((item) => {
            const p = item.p;
            const pt = r[p]?.t || 0;
            const pc = r[p]?.c || 0;
            const accuracy = pct(pc, pt);

            return (
              <div key={p} className={"rounded-2xl border p-4 sm:p-5 flex flex-col justify-between " + T.card + " " + T.line}>
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-base">{item.title}</span>
                    <span className={"text-xs font-extrabold px-2 py-0.5 rounded-full border " + (pt > 0 ? "border-accent/30 text-accent bg-accent/10" : T.soft + " " + T.sub)}>
                      {pt > 0 ? `${accuracy}%` : "Chưa làm"}
                    </span>
                  </div>
                  <p className={"text-xs mb-3 " + T.sub}>{item.desc}</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={T.sub}>Đã làm</span>
                    <span className="font-bold">{pt > 0 ? `${pc}/${pt} câu` : "0 câu"}</span>
                  </div>
                  <Bar value={accuracy} T={T} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Ngữ pháp theo chuyên đề */}
        <div className={"rounded-2xl border p-5 " + T.card + " " + T.line}>
          <h3 className="font-bold text-sm mb-3">Độ chính xác theo Chuyên Đề Ngữ Pháp Part 5</h3>
          {GRAMMAR.filter((g) => (gStats[g.id] || { t: 0 }).t > 0).length === 0 ? (
            <p className={"text-xs sm:text-sm " + T.sub}>
              Chưa làm câu ngữ pháp nào. Hãy mở tab <strong>Luyện đọc hiểu → Ngữ pháp</strong> để làm bài.
            </p>
          ) : (
            <div className="space-y-3">
              {GRAMMAR.filter((g) => (gStats[g.id] || { t: 0 }).t > 0).map((g, n) => {
                const st = gStats[g.id];
                return (
                  <div key={g.id} className={n ? "pt-2.5 border-t border-white/5" : ""}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs sm:text-sm font-semibold">{g.name}</span>
                      <span className={"text-xs font-mono " + T.sub}>
                        {st.c}/{st.t} · {pct(st.c, st.t)}%
                      </span>
                    </div>
                    <Bar value={pct(st.c, st.t)} T={T} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== LỜI KHUYÊN & CHIẾN THUẬT ÔN TẬP TIẾP THEO ===== */}
      <div className="mb-8">
        <SectionTitle T={T}>3. Lời Khuyên & Đề Xuất Học Tập Thông Minh</SectionTitle>
        <div className="space-y-3">
          {tips.slice(0, 4).map((tip, idx) => (
            <div
              key={idx}
              className={
                "rounded-2xl p-4 sm:p-4.5 flex items-start gap-3.5 border transition-colors " +
                (dark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200 shadow-sm")
              }
            >
              <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent shrink-0 mt-0.5">
                <Lightbulb size={18} />
              </div>
              <p className={"text-xs sm:text-[13px] leading-relaxed font-medium " + T.softText}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nút cài lại dữ liệu (chỉ khi học viên muốn làm lại từ đầu) */}
      {onReset && (
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập về ban đầu?")) {
                onReset();
              }
            }}
            className="text-xs font-semibold text-gray-500 hover:text-red-400 flex items-center gap-1.5 transition-colors p-2"
          >
            <RotateCcw size={13} />
            <span>Đặt lại toàn bộ tiến độ</span>
          </button>
        </div>
      )}
    </div>
  );
}
