/* Dữ liệu Đọc và Ngữ pháp (Part 5-7) — tách riêng cho màn Đọc và Thi thử. */
import grammarData from "./grammar.json";
import readingData from "./reading.json";
import qbankV2 from "./qbank_v2.json";

const mapAns = (c) => c === "A" ? 0 : c === "B" ? 1 : c === "C" ? 2 : 3;

const extraP5 = qbankV2.questions.filter(q => q.test_part === 5).map(q => ({
  id: q.question_id,
  text: q.question_text,
  options: q.options.map(o => o.text),
  ans: mapAns(q.correct_answer),
  exp: q.explanation_vi
}));

export const GRAMMAR = grammarData;
export const GRAMMAR_Q = GRAMMAR.flatMap((g) =>
  g.questions.map((q) => ({ ...q, part: 5, passageId: null, gid: g.id }))
);

export const PART5 = [...readingData.part5, ...extraP5];
export const PART6_PASSAGES = readingData.part6;
export const PART7_PASSAGES = readingData.part7;
export const PACE_GUIDE = readingData.paceGuide;

export const P5_Q = PART5.map((q) => ({ ...q, part: 5, passageId: null, gid: null }));
export const P5_POOL = [...P5_Q, ...GRAMMAR_Q];
export const P6_Q = PART6_PASSAGES.flatMap((p) => p.questions.map((q) => ({ ...q, part: 6, passageId: p.id })));
export const P7_Q = PART7_PASSAGES.flatMap((p) => p.questions.map((q) => ({ ...q, part: 7, passageId: p.id })));
export const ALL_Q = [...P5_POOL, ...P6_Q, ...P7_Q];
export const Q_BY_ID = Object.fromEntries(ALL_Q.map((q) => [q.id, q]));
export const PASSAGE_BY_ID = Object.fromEntries([...PART6_PASSAGES, ...PART7_PASSAGES].map((p) => [p.id, p]));

const groupOf = (p) => p.group || (p.bodyA ? "double" : "single");
export const P7_BY_GROUP = PART7_PASSAGES.reduce(
  (acc, p) => { acc[groupOf(p)].push(p); return acc; },
  { single: [], double: [], triple: [] }
);

