/**
 * Spaced repetition thật, tính theo ngày chứ không theo phiên.
 * Hộp 0..5, khoảng cách tăng dần. Trả lời sai kéo về hộp 0.
 */
export const BOX_DAYS = [0, 1, 3, 7, 16, 35];
export const MAX_BOX = BOX_DAYS.length - 1;

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
export function dayKey(ts = Date.now()) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Cập nhật một thẻ sau khi trả lời. grade: 0 chưa thuộc · 1 mơ hồ · 2 thuộc rồi */
export function review(card, grade) {
  const prev = card || { box: 0, due: 0, seen: 0, right: 0 };
  let box;
  if (grade === 0) box = 0;
  else if (grade === 1) box = Math.max(0, Math.min(MAX_BOX, prev.box));
  else box = Math.min(MAX_BOX, prev.box + 1);
  return {
    box,
    due: today() + BOX_DAYS[box] * 86400000,
    seen: prev.seen + 1,
    right: prev.right + (grade === 2 ? 1 : 0),
  };
}

export function isDue(card) {
  return !card || card.due <= today();
}
export function isLearned(card) {
  return !!card && card.box >= 3;   // đã qua mốc 7 ngày mới tính là thuộc
}

/** Chia một bộ từ thành: đến hạn ôn · chưa học · chưa tới hạn */
export function partition(words, srs) {
  const due = [], fresh = [], resting = [];
  for (const w of words) {
    const card = srs[w.id];
    if (!card) fresh.push(w);
    else if (isDue(card)) due.push(w);
    else resting.push(w);
  }
  return { due, fresh, resting };
}

/** Hàng học hôm nay: ưu tiên thẻ đến hạn, rồi bù bằng từ mới */
export function buildQueue(words, srs, limit = 20, newPerDay = 8) {
  const { due, fresh } = partition(words, srs);
  const sortedDue = due.sort((a, b) => (srs[a.id].due - srs[b.id].due));
  const queue = sortedDue.slice(0, limit);
  const room = Math.min(limit - queue.length, newPerDay);
  return queue.concat(fresh.slice(0, Math.max(0, room)));
}

/** Chuỗi ngày học liên tiếp, tính từ danh sách ngày đã học */
export function streakOf(days) {
  if (!days || !days.length) return 0;
  const set = new Set(days);
  let n = 0;
  const cursor = new Date();
  if (!set.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    if (!set.has(dayKey(cursor.getTime()))) break;
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}
