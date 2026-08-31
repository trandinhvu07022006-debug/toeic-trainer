export const LETTERS = ["A", "B", "C", "D"];

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normText(s) {
  let t = (s || "").toLowerCase();
  try { t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch { /* bỏ qua */ }
  return t.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

const tokenize = (s) => (s || "").trim().split(/\s+/).filter(Boolean);

/** So sánh câu chép chính tả bằng LCS, để thiếu một từ không làm đỏ cả câu */
export function diffWords(target, typed) {
  const A = tokenize(target), B = tokenize(typed);
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let x = m - 1; x >= 0; x--)
    for (let y = n - 1; y >= 0; y--)
      dp[x][y] = normText(A[x]) === normText(B[y]) ? dp[x + 1][y + 1] + 1 : Math.max(dp[x + 1][y], dp[x][y + 1]);
  const mark = new Array(m).fill(false);
  let x = 0, y = 0;
  while (x < m && y < n) {
    if (normText(A[x]) === normText(B[y])) { mark[x] = true; x++; y++; }
    else if (dp[x + 1][y] >= dp[x][y + 1]) x++;
    else y++;
  }
  return { words: A, mark, hit: mark.filter(Boolean).length };
}

/** Khoét từ khỏi câu ví dụ, chấp nhận cả dạng chia (postponed, amenities, underwrote…) */
export function blankSentence(v) {
  // với cụm từ, chọn từ dài nhất làm từ khoá để khoét (in advance → advance)
  const parts = v.w.toLowerCase().replace(/-/g, " ").split(" ").filter(Boolean);
  const first = parts.sort((a, b) => b.length - a.length)[0] || v.w.toLowerCase();
  // rút về gốc chung: bỏ đuôi -ies/-es/-s/-e để bắt được biến thể số nhiều và chia động từ
  let stem = first;
  if (stem.length > 4 && /ies$/.test(stem)) stem = stem.slice(0, -3);
  else if (stem.length > 4 && /(es|ed)$/.test(stem)) stem = stem.slice(0, -2);
  else if (stem.length > 4 && /s$/.test(stem)) stem = stem.slice(0, -1);
  if (stem.length > 5 && /e$/.test(stem)) stem = stem.slice(0, -1);
  if (stem.length > 4 && /y$/.test(stem)) stem = stem.slice(0, -1); // amenity → amenit- bắt amenities
  const esc = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  try {
    const re = new RegExp(esc + "[a-zA-Zé']*", "i");
    const m = v.ex.match(re);
    if (m && m[0].length >= 3) return { text: v.ex.replace(re, "_______"), target: m[0] };
  } catch { /* bỏ qua */ }
  return { text: v.ex, target: v.w };
}
