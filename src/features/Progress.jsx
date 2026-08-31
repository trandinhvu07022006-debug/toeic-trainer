import React from "react";
import { Lightbulb } from "lucide-react";
import { VOCAB } from "../data/vocab.js";
import { GRAMMAR } from "../data/reading.js";
import { SPEAKING, SPEAK_CRITERIA } from "../data/speaking.js";
import { partition, isLearned } from "../lib/srs.js";
import { cefrOf, pct } from "../lib/scoring.js";
import { Bar, SectionTitle , PageHeader } from "../ui/index.jsx";

/* ═══════════════════════════════════════════════════════════════════
   12. TAB TIẾN ĐỘ
   ═══════════════════════════════════════════════════════════════════ */

export function ProgressScreen({ T, dark, stats, srs, streak, vocabDrill, grammarStats, speakScores, lastResults, history, onReset }) {
  const lr = lastResults || {};
  const bothScore = lr.LC && lr.RC ? lr.LC.score + lr.RC.score : null;
  const gStats = grammarStats || {};
  const sp = speakScores || {};
  const spDone = Object.keys(sp).filter((k) => sp[k].reduce((a, b) => a + b, 0) > 0);
  const spAvg = spDone.length
    ? Math.round((spDone.reduce((a, k) => a + sp[k].reduce((x, y) => x + y, 0), 0) / spDone.length) * 10) / 10
    : 0;
  const drill = vocabDrill || { done: 0, correct: 0 };
  const r = stats.reading;
  const totalDone = r[5].t + r[6].t + r[7].t;
  const totalCorrect = r[5].c + r[6].c + r[7].c;
  const learned = VOCAB.filter((v) => isLearned(srs[v.id])).length;
  const parts = partition(VOCAB, srs);
  const vague = parts.due.length;
  const dueToday = parts.due.length;

  const tips = [];
  const lc = stats.listening;
  const lcDone = [1, 2, 3, 4].filter((p) => lc[p].t >= 3).map((p) => ({ p, a: pct(lc[p].c, lc[p].t) })).sort((a, b) => a.a - b.a);
  if (lcDone.length && lcDone[0].a < 70) {
    tips.push("Listening Part " + lcDone[0].p + " mới đúng " + lcDone[0].a + "%. Chép chính tả đúng những câu vừa sai, mỗi câu ba lần — hiệu quả hơn nghe lại thụ động.");
  }
  if (spDone.length >= 3) {
    const worstC = SPEAK_CRITERIA.map((c, n) => {
      const vals = spDone.map((k) => sp[k][n]).filter((v) => v > 0);
      return { c: c, a: vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : 3 };
    }).sort((a, b) => a.a - b.a)[0];
    if (worstC.a < 2.2) tips.push("Tiêu chí \"" + worstC.c + "\" đang là điểm yếu khi tự chấm Speaking. Ghi âm lại đúng bài mẫu ba lần rồi so với bản thu của bạn.");
  }
  const practised = [5, 6, 7].filter((p) => r[p].t >= 3).map((p) => ({ p, a: pct(r[p].c, r[p].t) })).sort((a, b) => a.a - b.a);
  if (practised.length) {
    const worst = practised[0];
    tips.push("Part " + worst.p + " đang là phần yếu nhất (" + worst.a + "% đúng). Làm lại các câu sai và ghi nguyên nhân vào sổ lỗi trước khi sang phần khác.");
    if (worst.p === 5) tips.push("Với Part 5, hãy nhìn 4 đáp án TRƯỚC khi đọc câu: nếu cùng gốc khác đuôi thì đó là câu từ loại, chỉ cần xét vị trí chỗ trống.");
    if (worst.p === 7) tips.push("Với Part 7, đọc câu hỏi trước rồi quét từ khoá; nhớ rằng đáp án đúng luôn là câu diễn đạt lại, đáp án copy nguyên văn thường là bẫy.");
    if (worst.p === 6) tips.push("Part 6 chỉ 16 câu trong đề thật — đừng đầu tư quá sâu, tập trung vào dạng chèn câu bằng cách bám từ nối và đại từ.");
  } else {
    tips.push("Hãy làm ít nhất 10 câu Part 5 để app có đủ dữ liệu gợi ý phần cần ôn.");
  }
  const weakG = GRAMMAR.map((g) => Object.assign({ name: g.name }, gStats[g.id] || { c: 0, t: 0 }))
    .filter((g) => g.t >= 3).sort((a, b) => pct(a.c, a.t) - pct(b.c, b.t));
  if (weakG.length && pct(weakG[0].c, weakG[0].t) < 75) {
    tips.push("Chuyên đề \"" + weakG[0].name + "\" mới đúng " + pct(weakG[0].c, weakG[0].t) + "%. Đọc lại bảng dấu hiệu nhận biết rồi làm lại toàn bộ câu của chuyên đề đó.");
  }
  if (learned < 10) tips.push("Mục tiêu từ vựng: 12 từ mỗi ngày. Học theo cụm (collocation) thay vì từ đơn lẻ.");
  else if (vague > 5) tips.push("Hôm nay có " + dueToday + " thẻ đến hạn ôn — duyệt lại các chủ đề đó trước khi học từ mới.");

  const Stat = ({ label, value, sub }) => (
    <div className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
      <p className={"text-[11px] font-semibold uppercase tracking-[0.12em] mb-1.5 " + T.sub}>{label}</p>
      <p className="font-display text-[28px] leading-none font-semibold tnum" style={{ color: "var(--accent)" }}>{value}</p>
      {sub && <p className={"text-[13px] mt-1.5 " + T.sub}>{sub}</p>}
    </div>
  );

  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow="Theo dõi tiến bộ"
        title="Tiến độ"
        sub="Mục tiêu 600–650 · cần đúng khoảng 115–125/200 câu" />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Câu đã làm" value={totalDone} sub={totalDone ? "Đúng " + pct(totalCorrect, totalDone) + "%" : "Chưa có dữ liệu"} />
        <Stat label="Từ đã thuộc" value={learned} sub={"trên tổng " + VOCAB.length + " từ"} />
        <Stat label="Lượt luyện từ" value={drill.done}
          sub={drill.done ? "Đúng " + pct(drill.correct, drill.done) + "%" : "chưa luyện"} />
        <Stat label={bothScore ? "Điểm tổng ước lượng" : "Điểm thi thử"}
          value={bothScore || (lr.RC ? lr.RC.score : (lr.LC ? lr.LC.score : "—"))}
          sub={bothScore ? "LC " + lr.LC.score + " + RC " + lr.RC.score + " · " + cefrOf(bothScore) : (lr.RC || lr.LC ? "Thi nốt kỹ năng còn lại để ra điểm tổng" : "Chưa thi thử")} />
      </div>

      <SectionTitle T={T}>Reading — độ chính xác theo Part</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[5, 6, 7].map((p) => (
          <div key={p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-base font-semibold">Part {p}</span>
              <span className={"text-base " + T.sub}>{r[p].t ? r[p].c + "/" + r[p].t + " · " + pct(r[p].c, r[p].t) + "%" : "chưa làm"}</span>
            </div>
            <Bar value={pct(r[p].c, r[p].t)} T={T} />
          </div>
        ))}
      </div>

      <SectionTitle T={T}>Ngữ pháp theo chuyên đề</SectionTitle>
      <div className={"rounded-2xl border p-4 mb-6 " + T.card + " " + T.line}>
        {GRAMMAR.filter((g) => (gStats[g.id] || { t: 0 }).t > 0).length === 0 ? (
          <p className={"text-base " + T.sub}>Chưa luyện chuyên đề nào. Mở tab Đọc &amp; Thi thử → Ngữ pháp để bắt đầu.</p>
        ) : GRAMMAR.filter((g) => (gStats[g.id] || { t: 0 }).t > 0).map((g, n) => {
          const st = gStats[g.id];
          return (
            <div key={g.id} className={n ? "pt-3 mt-3 border-t " + T.line : ""}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-base">{g.name}</span>
                <span className={"text-base " + T.sub}>{st.c}/{st.t} · {pct(st.c, st.t)}%</span>
              </div>
              <Bar value={pct(st.c, st.t)} T={T} />
            </div>
          );
        })}
      </div>

      <SectionTitle T={T}>Listening — độ chính xác theo Part</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-base font-semibold">Part {p}</span>
              <span className={"text-base " + T.sub}>
                {stats.listening[p].t ? stats.listening[p].c + "/" + stats.listening[p].t + " · " + pct(stats.listening[p].c, stats.listening[p].t) + "%" : "chưa làm"}
              </span>
            </div>
            <Bar value={pct(stats.listening[p].c, stats.listening[p].t)} T={T} />
          </div>
        ))}
      </div>

      <SectionTitle T={T}>Speaking — tự chấm</SectionTitle>
      <div className={"rounded-2xl border p-4 mb-6 " + T.card + " " + T.line}>
        {spDone.length === 0 ? (
          <p className={"text-base " + T.sub}>Chưa chấm câu nào. Mở tab Nói và bắt đầu từ Question 1.</p>
        ) : (
          <>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-base font-semibold">Đã hoàn thành {spDone.length}/{SPEAKING.length} câu</span>
              <span className={"text-base " + T.sub}>trung bình {spAvg}/12</span>
            </div>
            <Bar value={pct(spDone.length, SPEAKING.length)} T={T} />
            <div className="mt-4 space-y-2">
              {SPEAK_CRITERIA.map((c, n) => {
                const vals = spDone.map((k) => sp[k][n]).filter((v) => v > 0);
                const a = vals.length ? Math.round((vals.reduce((x, y) => x + y, 0) / vals.length) * 10) / 10 : 0;
                return (
                  <div key={c} className="flex justify-between items-baseline">
                    <span className={"text-base " + T.softText}>{c}</span>
                    <span className={"text-base " + (a && a < 2 ? T.noText : T.sub)}>{a ? a + "/3" : "—"}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {history && history.length > 0 && (
        <>
          <SectionTitle T={T}>Nhật ký thi thử</SectionTitle>
          <div className={"rounded-2xl border p-4 mb-6 " + T.card + " " + T.line}>
            {history.slice(-8).reverse().map((h, n) => (
              <div key={h.at} className={"flex justify-between items-baseline py-2 " + (n ? "border-t " + T.line : "")}>
                <span className={"text-base " + T.softText}>
                  {new Date(h.at).toLocaleDateString("vi-VN")} · {h.skill}
                </span>
                <span className="text-base font-semibold">{h.score} <span className={"font-normal " + T.sub}>({h.correct}/{h.total})</span></span>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle T={T}>Nên ôn gì tiếp theo</SectionTitle>
      <div className="space-y-3 mb-4">
        {tips.slice(0, 3).map((t, i) => (
          <div key={i} className={"rounded-2xl p-4 flex gap-3 " + T.soft}>
            <Lightbulb size={18} className={"shrink-0 mt-1 " + T.accentText} />
            <p className={"text-base leading-relaxed " + T.softText}>{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
