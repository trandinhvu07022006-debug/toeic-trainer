/**
 * Quy đổi điểm. ETS không công bố bảng thật và quy đổi riêng cho từng đề,
 * nên đây là ước lượng, hiệu chuẩn theo mốc tham chiếu phổ biến:
 * 89/100 Listening ≈ 455 · 89/100 Reading ≈ 425.
 */
const LC_SCALE = [[0, 5], [10, 40], [20, 85], [30, 135], [40, 190], [50, 245],
  [60, 300], [70, 355], [80, 410], [90, 460], [96, 490], [100, 495]];
const RC_SCALE = [[0, 5], [10, 35], [20, 75], [30, 125], [40, 175], [50, 225],
  [60, 280], [70, 330], [80, 380], [85, 405], [90, 430], [95, 465], [100, 495]];

function scaleWith(table, correct, total) {
  if (!total) return 0;
  const raw = (correct / total) * 100;
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i - 1];
    const [x2, y2] = table[i];
    if (raw <= x2) return Math.max(5, Math.round((y1 + ((raw - x1) / (x2 - x1)) * (y2 - y1)) / 5) * 5);
  }
  return 495;
}

export const estimateLC = (c, t) => scaleWith(LC_SCALE, c, t);
export const estimateRC = (c, t) => scaleWith(RC_SCALE, c, t);

/** Mốc CEFR chính thức của ETS — áp cho ĐIỂM TỔNG, không áp riêng từng phần */
const CEFR_BANDS = [[945, "C1"], [785, "B2"], [550, "B1"], [225, "A2"], [120, "A1"]];
export function cefrOf(total) {
  for (const [min, band] of CEFR_BANDS) if (total >= min) return band;
  return "dưới A1";
}

export const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
export const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
