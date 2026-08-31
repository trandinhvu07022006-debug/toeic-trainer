import React, { useState, useMemo } from "react";
import { ArrowLeft, RotateCcw, Volume2, Trash2, CheckCircle2, XCircle, NotebookPen } from "lucide-react";
import { Q_BY_ID } from "../data/reading.js";
import { LISTEN_P1, LISTEN_P2, LISTEN_P3, LISTEN_P4 } from "../data/listening.js";

/* Gom mọi câu Listening về một bảng tra theo id (P1/P2 là câu đơn; P3/P4 có nhiều câu con) */
function buildListenIndex() {
  const idx = {};
  for (const it of LISTEN_P1) idx[it.id] = { ...it, part: 1, kind: "single" };
  for (const it of LISTEN_P2) idx[it.id] = { ...it, part: 2, kind: "single" };
  for (const conv of LISTEN_P3) for (const q of conv.questions) idx[q.id] = { ...q, part: 3, kind: "sub", context: conv };
  for (const talk of LISTEN_P4) for (const q of talk.questions) idx[q.id] = { ...q, part: 4, kind: "sub", context: talk };
  return idx;
}

/* Nhãn nguồn câu */
const SKILL_LABEL = { RC: "Đọc", LC: "Nghe", GR: "Ngữ pháp" };

export function MistakeBookScreen({ T, dark, tts, mistakes, onClear, onBack }) {
  const listenIdx = useMemo(buildListenIndex, []);
  const [reveal, setReveal] = useState({}); // { [id]: chosenIdx } đã xem đáp án

  /* Tra nội dung từng câu sai từ ngân hàng tương ứng */
  const items = useMemo(() => {
    return (mistakes || [])
      .map((m) => {
        let q = null;
        if (m.skill === "LC") q = listenIdx[m.id];
        else q = Q_BY_ID[m.id]; // RC và GR đều nằm trong Q_BY_ID (P5_POOL gồm grammar)
        if (!q) return null;
        return { ...m, q };
      })
      .filter(Boolean)
      .sort((a, b) => (b.at || 0) - (a.at || 0));
  }, [mistakes, listenIdx]);

  if (!items.length) {
    return (
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
            <ArrowLeft size={18} />
          </button>
          <p className="text-lg font-bold">Sổ tay lỗi sai</p>
        </div>
        <div className={"rounded-2xl border p-8 text-center " + T.card + " " + T.line}>
          <NotebookPen size={32} className={"mx-auto mb-3 " + T.sub} />
          <p className="font-semibold mb-1">Chưa có câu nào sai</p>
          <p className={"text-sm " + T.sub}>Khi bạn làm sai một câu ở phần Nghe, Đọc hay Ngữ pháp, câu đó sẽ tự được lưu vào đây để ôn lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-lg font-bold">Sổ tay lỗi sai</p>
          <p className={"text-sm " + T.sub}>{items.length} câu cần ôn lại</p>
        </div>
      </div>

      <div className={"rounded-2xl p-3 mb-4 flex gap-2.5 " + T.soft}>
        <RotateCcw size={17} className={"shrink-0 mt-0.5 " + T.accentText} />
        <p className={"text-sm " + T.softText}>
          Làm lại từng câu để kiểm tra. Chọn đúng thì câu tự rời khỏi sổ; chọn sai vẫn giữ lại để ôn tiếp lần sau.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-4 items-start">
        {items.map(({ id, skill, part, q }) => {
          const chosen = reveal[id];
          const answered = chosen !== undefined;
          const listenCtx = skill === "LC" && q.kind === "sub" ? q.context : null;
          return (
            <div key={id} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
              <div className="flex items-center gap-2 mb-2">
                <span className={"text-xs px-2 py-0.5 rounded-full " + T.accentSoft}>
                  {SKILL_LABEL[skill] || skill} · Part {part}
                </span>
              </div>

              {/* Ngữ cảnh nghe (nếu có): cho phép nghe lại lời thoại */}
              {listenCtx && (
                <button onClick={() => tts.speak(listenCtx.lines.map((l) => l.en).join(" "), 0.95)}
                  style={{ minHeight: 40 }}
                  className={"w-full flex items-center justify-center gap-2 rounded-xl mb-3 text-sm font-medium " + T.soft + " " + T.softText}>
                  <Volume2 size={16} /> Nghe lại đoạn hội thoại
                </button>
              )}

              <p className="font-medium mb-3">{q.text || q.caption}</p>

              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let cls = T.card + " " + T.line;
                  if (answered) {
                    if (idx === q.ans) cls = T.okBox;
                    else if (idx === chosen) cls = T.noBox;
                  }
                  return (
                    <button key={idx} disabled={answered}
                      onClick={() => {
                        setReveal((r) => ({ ...r, [id]: idx }));
                        if (idx === q.ans) onClear(id); // đúng thì xóa khỏi sổ
                      }}
                      style={{ minHeight: 48 }}
                      className={"w-full text-left rounded-xl border px-4 py-2.5 text-base flex items-center gap-2 " + cls}>
                      {answered && idx === q.ans && <CheckCircle2 size={17} className="shrink-0" />}
                      {answered && idx === chosen && idx !== q.ans && <XCircle size={17} className="shrink-0" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-3">
                  <p className={"text-sm mb-3 " + T.sub}>{q.exp}</p>
                  <div className="flex items-center gap-2">
                    {chosen === q.ans
                      ? <span className={"text-sm font-semibold " + T.okText}>Đúng rồi! Câu này đã rời khỏi sổ.</span>
                      : <button onClick={() => onClear(id)} style={{ minHeight: 40 }}
                          className={"flex items-center gap-1.5 rounded-xl px-3 text-sm font-medium " + T.soft + " " + T.softText}>
                          <Trash2 size={15} /> Bỏ khỏi sổ
                        </button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
