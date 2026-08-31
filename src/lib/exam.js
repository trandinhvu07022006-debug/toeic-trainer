import { shuffle } from "./utils.js";
import { PART6_PASSAGES, P5_POOL, P7_BY_GROUP } from "../data/reading.js";
import { LISTEN_P1, LISTEN_P2, LISTEN_P3, LISTEN_P4 } from "../data/listening.js";

/* Chọn trọn bài đọc sao cho tổng số câu bằng đúng mục tiêu */
export function pickPassages(list, target) {
  if (target <= 0) return [];
  const pool = shuffle(list).sort((a, b) => b.questions.length - a.questions.length);
  const out = [];
  let sum = 0;
  for (let i = 0; i < pool.length; i++) {
    const n = pool[i].questions.length;
    if (sum + n <= target) { out.push(pool[i]); sum += n; }
    if (sum === target) break;
  }
  return out;
}

export function buildTest(format) {
  const p5 = shuffle(P5_POOL).slice(0, format.p5);
  const p6Passages = pickPassages(PART6_PASSAGES, format.p6);
  const p7Passages = pickPassages(P7_BY_GROUP.single, format.p7.single)
    .concat(pickPassages(P7_BY_GROUP.double, format.p7.double))
    .concat(pickPassages(P7_BY_GROUP.triple, format.p7.triple));
  const fromPassages = (list, part) =>
    list.reduce((acc, p) => acc.concat(p.questions.map((q) => ({ ...q, part: part, passageId: p.id }))), []);
  return p5.concat(fromPassages(p6Passages, 6)).concat(fromPassages(p7Passages, 7));
}


/* Dựng đề Listening: mỗi "unit" là một lượt audio */
export function buildListeningExam(spec) {
  const units = [];
  shuffle(LISTEN_P1).slice(0, spec.p1).forEach((x) => units.push({ kind: "single", part: 1, item: x }));
  shuffle(LISTEN_P2).slice(0, spec.p2).forEach((x) => units.push({ kind: "single", part: 2, item: x }));
  shuffle(LISTEN_P3).slice(0, spec.p3).forEach((x) => units.push({ kind: "talk", part: 3, item: x }));
  shuffle(LISTEN_P4).slice(0, spec.p4).forEach((x) => units.push({ kind: "talk", part: 4, item: x }));
  return units;
}
export function unitQuestionCount(u) { return u.kind === "single" ? 1 : u.item.questions.length; }
export function examQuestionCount(units) { return units.reduce((n, u) => n + unitQuestionCount(u), 0); }

