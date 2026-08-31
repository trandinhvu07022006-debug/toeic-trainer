/* Điểm gom re-export cho tương thích ngược (test, thống kê ngân hàng).
   Các màn nên import trực tiếp từ ./vocab, ./reading, ./listening, ./speaking
   để Vite tách chunk gọn — chỉ tải phần dữ liệu mà màn đó cần. */
export * from "./vocab.js";
export * from "./reading.js";
export * from "./listening.js";
export * from "./speaking.js";

import { VOCAB, VOCAB_TOPICS } from "./vocab.js";
import { GRAMMAR_Q, ALL_Q } from "./reading.js";
import { LISTEN_TOTAL, DICTATION } from "./listening.js";
import { SPEAKING } from "./speaking.js";

/* Thống kê ngân hàng, dùng cho màn hình Tiến độ */
export const BANK = {
  vocab: VOCAB.length,
  topics: VOCAB_TOPICS.length,
  grammar: GRAMMAR_Q.length,
  reading: ALL_Q.length,
  listening: LISTEN_TOTAL,
  speaking: SPEAKING.length,
  dictation: DICTATION.length,
};
