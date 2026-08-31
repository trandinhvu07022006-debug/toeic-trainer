/* Dữ liệu Nghe (Part 1-4 + dictation) — tách riêng cho màn Nghe và Thi thử. */
import listeningData from "./listening.json";

export const LISTEN_P1 = listeningData.part1;
export const LISTEN_P2 = listeningData.part2;
export const LISTEN_P3 = listeningData.part3;
export const LISTEN_P4 = listeningData.part4;
export const DICTATION = listeningData.dictation;
export const LISTEN_TOTAL = LISTEN_P1.length + LISTEN_P2.length + LISTEN_P3.length * 3 + LISTEN_P4.length * 3;
