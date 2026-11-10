/**
 * Kế hoạch học hằng ngày.
 *
 * Sinh một danh sách nhiệm vụ ngắn cho "hôm nay" dựa trên dữ liệu thật:
 * số từ đến hạn ôn (SRS), phần đang yếu nhất, và một dạng bài luân phiên.
 * Mục tiêu: người tự học mở app ra là biết ngay hôm nay nên làm gì,
 * thay vì phải tự quyết giữa 6 tab.
 *
 * Thuần logic, không phụ thuộc React — dễ kiểm thử.
 */
import { isDue } from "./srs.js";
import { pct } from "./scoring.js";

/* Mục tiêu mặc định mỗi ngày */
export const DAILY_VOCAB_GOAL = 15;

/* Các dạng bài luân phiên theo ngày cho 3 TRỤ CỘT: TỪ VỰNG - TẬP VIẾT - TẬP ĐỌC */
const ROTATION = [
  { tab: "write", label: "Luyện viết: Gõ chính tả", desc: "Gõ từ theo nghĩa tiếng Việt, rèn cơ bắp", icon: "pencil" },
  { tab: "read", label: "Đọc hiểu: Ngữ pháp Part 5", desc: "Chọn từ đúng điền vào câu", icon: "file" },
  { tab: "write", label: "Luyện viết: Điền từ vào câu", desc: "Phương pháp Cloze Deletion ngữ cảnh", icon: "pencil" },
  { tab: "read", label: "Đọc hiểu: Part 7 Split-View", desc: "Đoạn văn và câu hỏi phân loại", icon: "file" },
  { tab: "write", label: "Luyện viết: Ghép câu", desc: "Sắp xếp từ thành câu chuẩn ngữ pháp", icon: "pencil" },
  { tab: "read", label: "Đọc hiểu: Part 6 Điền đoạn", desc: "Điền từ vào đoạn văn công sở", icon: "file" },
  { tab: "vocab", label: "Từ vựng: Học theo chủ đề", desc: "Luyện thẻ ghi nhớ và trắc nghiệm đảo", icon: "book" },
];

/* Số thứ tự ngày trong năm — để chọn dạng bài luân phiên ổn định trong cùng một ngày */
function dayIndex(dateStr) {
  // dateStr dạng "YYYY-MM-DD"; tổng hoá đơn giản, chỉ cần ổn định theo ngày
  const parts = (dateStr || "").split("-").map(Number);
  if (parts.length !== 3) return 0;
  const [y, m, d] = parts;
  return (y * 372 + m * 31 + d) % ROTATION.length;
}

/* Tìm phần (Part) yếu nhất đã có đủ dữ liệu, ưu tiên phần Đọc hiểu Part 5, 6, 7 */
function weakestPart(stats) {
  if (!stats || !stats.reading) return null;
  const entries = [];
  const nameRC = { 5: "Đọc · Part 5", 6: "Đọc · Part 6", 7: "Đọc · Part 7" };
  for (const p of [5, 6, 7]) {
    const s = stats.reading[p];
    if (s && s.t >= 5) entries.push({ part: p, name: nameRC[p], tab: "read", acc: pct(s.c, s.t) });
  }
  if (!entries.length) return null;
  entries.sort((a, b) => a.acc - b.acc);
  return entries[0];
}

/**
 * Sinh kế hoạch hôm nay.
 * @param {Object} args
 *   totalWords - tổng số từ trong ngân hàng (một con số, không cần mảng nặng)
 *   srs        - trạng thái SRS
 *   stats      - thống kê đúng/sai theo part
 *   dateStr    - ngày hôm nay "YYYY-MM-DD"
 *   doneToday  - object { [taskId]: true } các nhiệm vụ đã đánh dấu xong hôm nay
 * @returns { tasks: [...], doneCount, total, allDone }
 */
export function buildDailyPlan({ totalWords, srs, stats, dateStr, doneToday = {} }) {
  const tasks = [];

  // 1) Từ vựng: đếm thẻ đến hạn từ srs, phần còn lại của ngân hàng là từ chưa học
  let dueCount = 0, seenCount = 0;
  for (const id in srs) {
    seenCount += 1;
    if (isDue(srs[id])) dueCount += 1;
  }
  const freshAvail = Math.max(0, (totalWords || 0) - seenCount);
  const newCount = Math.max(0, Math.min(freshAvail, DAILY_VOCAB_GOAL - Math.min(dueCount, DAILY_VOCAB_GOAL)));
  const vocabTotal = Math.min(dueCount, DAILY_VOCAB_GOAL) + newCount;
  let vocabDesc;
  if (dueCount >= DAILY_VOCAB_GOAL) vocabDesc = "Ôn " + DAILY_VOCAB_GOAL + " từ đến hạn nhớ lại";
  else if (dueCount > 0) vocabDesc = "Ôn " + dueCount + " từ đến hạn + học " + newCount + " từ mới";
  else vocabDesc = "Học " + vocabTotal + " từ mới theo chủ đề";
  tasks.push({
    id: "vocab", tab: "vocab", icon: "book",
    label: "Từ vựng", desc: vocabDesc,
    goal: vocabTotal || DAILY_VOCAB_GOAL,
  });

  // 2) Ôn phần yếu nhất (nếu đã có đủ dữ liệu)
  const weak = weakestPart(stats);
  if (weak) {
    tasks.push({
      id: "weak", tab: weak.tab, icon: weak.tab === "listen" ? "headphones" : "file",
      label: "Ôn phần yếu: " + weak.name, desc: "Đang đúng " + weak.acc + "% — luyện thêm để cải thiện",
    });
  }

  // 3) Một dạng bài luân phiên theo ngày (tránh trùng phần yếu nếu có thể)
  let rot = ROTATION[dayIndex(dateStr)];
  if (weak && rot.label.includes(weak.name.split("· ")[1] || "")) {
    rot = ROTATION[(dayIndex(dateStr) + 1) % ROTATION.length];
  }
  tasks.push({
    id: "rotation", tab: rot.tab, icon: rot.icon,
    label: rot.label, desc: rot.desc,
  });

  // Đếm hoàn thành
  const doneCount = tasks.filter((t) => doneToday[t.id]).length;
  return { tasks, doneCount, total: tasks.length, allDone: doneCount >= tasks.length };
}
