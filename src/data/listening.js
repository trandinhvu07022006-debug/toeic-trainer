/* Dữ liệu Nghe (Part 1-4 + dictation) — tách riêng cho màn Nghe và Thi thử. */
import listeningData from "./listening.json";
import qbankV2 from "./qbank_v2.json";

const mapAns = (c) => c === "A" ? 0 : c === "B" ? 1 : c === "C" ? 2 : 3;

const extraP1 = qbankV2.questions.filter(q => q.test_part === 1).map(q => ({
    id: q.question_id, scene: "office", caption: q.source_book || "N/A",
    options: q.options.map(o => o.text),
    ans: mapAns(q.correct_answer), exp: q.explanation_vi
}));
const extraP2 = qbankV2.questions.filter(q => q.test_part === 2).map(q => ({
    id: q.question_id, type: "WH", q: q.question_text,
    options: q.options.map(o => o.text),
    ans: mapAns(q.correct_answer), exp: q.explanation_vi
}));

const rawP3 = qbankV2.questions.filter(q => q.test_part === 3);
const extraP3 = [];
for (let i = 0; i < rawP3.length; i += 3) {
    const slice = rawP3.slice(i, i + 3);
    extraP3.push({
        id: slice[0].question_id + "-group",
        scene: slice[0].source_book,
        dialogue: slice[0].transcript_vi,
        questions: slice.map((q) => ({
            id: q.question_id, text: q.question_text, options: q.options.map(o => o.text),
            ans: mapAns(q.correct_answer), exp: q.explanation_vi
        }))
    });
}

const rawP4 = qbankV2.questions.filter(q => q.test_part === 4);
const extraP4 = [];
for (let i = 0; i < rawP4.length; i += 3) {
    const slice = rawP4.slice(i, i + 3);
    extraP4.push({
        id: slice[0].question_id + "-group",
        scene: slice[0].source_book,
        talk: slice[0].transcript_vi,
        questions: slice.map((q) => ({
            id: q.question_id, text: q.question_text, options: q.options.map(o => o.text),
            ans: mapAns(q.correct_answer), exp: q.explanation_vi
        }))
    });
}

export const LISTEN_P1 = [...listeningData.part1, ...extraP1];
export const LISTEN_P2 = [...listeningData.part2, ...extraP2];
export const LISTEN_P3 = [...listeningData.part3, ...extraP3];
export const LISTEN_P4 = [...listeningData.part4, ...extraP4];
export const DICTATION = listeningData.dictation;
export const LISTEN_TOTAL = LISTEN_P1.length + LISTEN_P2.length + LISTEN_P3.length * 3 + LISTEN_P4.length * 3;
