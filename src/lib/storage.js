/**
 * Lưu trữ bền vững trên localStorage.
 * Có version để lần sau đổi cấu trúc dữ liệu vẫn nâng cấp được mà không mất sạch.
 */
const KEY = "toeic-trainer";
const VERSION = 1;

const EMPTY = {
  version: VERSION,
  srs: {},               // { [wordId]: { box, due, seen, right } }
  stats: {
    listening: { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 }, 4: { c: 0, t: 0 } },
    reading: { 5: { c: 0, t: 0 }, 6: { c: 0, t: 0 }, 7: { c: 0, t: 0 } },
  },
  grammarStats: {},      // { [topicId]: { c, t } }
  speakScores: {},       // { [questionId]: [n,n,n,n] }
  vocabDrill: { done: 0, correct: 0 },
  saved: [],             // id câu đã lưu
  lastResults: {},       // { LC: {...}, RC: {...} }
  history: [],           // nhật ký thi thử
  days: [],              // ["2026-08-25", ...] để tính streak thật
  dailyDone: { date: "", tasks: {} },  // nhiệm vụ hằng ngày đã đánh dấu xong, theo ngày
  mistakes: [],          // [{ id, skill, part, at }] câu đã làm sai để ôn lại
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return clone(EMPTY);
    const data = JSON.parse(raw);
    if (data.version !== VERSION) return migrate(data);
    return { ...clone(EMPTY), ...data };
  } catch {
    return clone(EMPTY);
  }
}

function migrate(old) {
  // Bản 1 là bản đầu tiên; các bản sau chỉ cần thêm nhánh ở đây.
  return { ...clone(EMPTY), ...old, version: VERSION };
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, version: VERSION }));
    return true;
  } catch {
    return false;   // hết dung lượng hoặc chế độ riêng tư — app vẫn chạy bình thường
  }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch { /* bỏ qua */ }
  return clone(EMPTY);
}

export function exportJSON(state) {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (typeof data !== "object" || data === null) throw new Error("Tệp không hợp lệ");
  return { ...clone(EMPTY), ...data, version: VERSION };
}

export const EMPTY_STATE = EMPTY;
