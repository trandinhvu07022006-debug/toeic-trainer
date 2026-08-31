import React from "react";

export const VOCAB_ART = {
  v01: (a) => (<><rect x="26" y="18" width="44" height="62" rx="6" /><rect x="38" y="11" width="20" height="13" rx="4" fill={a} stroke="none" /><path d="M34 42h10M34 56h10M34 70h10" /><path d="M52 40l4 4 8-8M52 54l4 4 8-8" stroke={a} /></>),
  v02: (a) => (<><path d="M24 12h32l16 16v56H24z" /><path d="M56 12v16h16" /><path d="M34 46h28M34 58h28M34 70h18" stroke={a} /></>),
  v03: (a) => (<><circle cx="40" cy="48" r="24" /><path d="M40 33v15l11 7" /><path d="M70 48h14" stroke={a} /><path d="M78 42l6 6-6 6" stroke={a} /></>),
  v04: (a) => (<><path d="M30 44h36l-4 34H34z" /><path d="M40 44V24M48 44V17M56 44V28" /><circle cx="40" cy="21" r="4" fill={a} stroke="none" /><circle cx="48" cy="14" r="4" fill={a} stroke="none" /><circle cx="56" cy="25" r="4" fill={a} stroke="none" /></>),
  v05: (a) => (<><path d="M32 62c6-6 4-10 4-18a12 12 0 0124 0c0 8-2 12 4 18z" /><path d="M42 70a6 6 0 0012 0" /><path d="M48 26v-7" /><path d="M18 42c0-7 3-13 8-17M78 42c0-7-3-13-8-17" stroke={a} /></>),
  v06: (a) => (<><circle cx="38" cy="48" r="19" /><circle cx="58" cy="48" r="19" /><path d="M12 48h10M84 48H74" stroke={a} /><path d="M18 42l-6 6 6 6M78 42l6 6-6 6" stroke={a} /></>),
  v07: (a) => (<><rect x="36" y="12" width="24" height="18" rx="4" /><path d="M48 30v10M28 40h40M28 40v20M68 40v20" /><rect x="16" y="60" width="24" height="18" rx="4" /><rect x="56" y="60" width="24" height="18" rx="4" fill={a} stroke={a} /></>),
  v08: (a) => (<><rect x="34" y="34" width="28" height="28" rx="5" /><path d="M30 30L15 15M15 15v11M15 15h11" stroke={a} /><path d="M66 30l15-15M81 15v11M81 15H70" stroke={a} /><path d="M30 66L15 81M15 81V70M15 81h11" stroke={a} /><path d="M66 66l15 15M81 81V70M81 81H70" stroke={a} /></>),
  v09: (a) => (<><rect x="16" y="50" width="26" height="30" rx="3" /><rect x="54" y="34" width="26" height="46" rx="3" fill={a} stroke={a} /><path d="M67 34V14" /><path d="M67 17l14 5-14 5" /></>),
  v10: (a) => (<><rect x="18" y="22" width="26" height="19" rx="5" /><path d="M27 41v7l8-7" /><rect x="52" y="22" width="26" height="19" rx="5" fill={a} stroke={a} /><path d="M69 41v7l-8-7" fill={a} stroke={a} /><path d="M16 64h64" /><path d="M30 64v14M66 64v14" /></>),
  v11: (a) => (<><path d="M16 76C34 76 30 46 48 46s16-28 32-28" strokeDasharray="5 7" stroke={a} /><circle cx="16" cy="76" r="5" fill={a} stroke="none" /><circle cx="80" cy="18" r="5" fill={a} stroke="none" /><path d="M48 32a8 8 0 00-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 00-8-8z" /></>),
  v12: (a) => (<><rect x="12" y="30" width="72" height="36" rx="6" /><path d="M58 30v36" strokeDasharray="4 5" stroke={a} /><path d="M22 44h24M22 55h15" /><path d="M65 42l12 6-12 6 3-6z" fill={a} stroke={a} /></>),
  v13: (a) => (<><path d="M14 70V36" /><path d="M14 54h68v16" /><path d="M82 54v-6a9 9 0 00-9-9H42v15" /><rect x="20" y="39" width="17" height="11" rx="5" fill={a} stroke={a} /></>),
  v14: (a) => (<><circle cx="40" cy="44" r="23" /><path d="M40 30v14l10 6" /><path d="M70 56l12 22H58z" fill={a} stroke={a} /><path d="M70 64v5" stroke="#fff" /><circle cx="70" cy="73" r="1.6" fill="#fff" stroke="none" /></>),
  v15: (a) => (<><circle cx="44" cy="54" r="20" /><path d="M44 44v20M50 48a6 5 0 00-12 0c0 8 12 3 12 11a6 5 0 01-12 0" /><path d="M74 26a32 32 0 00-46 4" stroke={a} /><path d="M64 20l11 5-4 11" stroke={a} /></>),
  v16: (a) => (<><path d="M22 12h32l16 16v56H22z" /><path d="M54 12v16h16" /><path d="M32 44h24M32 56h16" /><circle cx="60" cy="68" r="12" fill={a} stroke={a} /><text x="60" y="74" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff" stroke="none">$</text></>),
  v17: (a) => (<><circle cx="48" cy="48" r="27" /><path d="M48 48V21a27 27 0 0123 14z" fill={a} stroke={a} /><path d="M48 48l23-13" /></>),
  v18: (a) => (<><path d="M16 78h64" /><rect x="22" y="58" width="14" height="20" /><rect x="41" y="45" width="14" height="33" /><rect x="60" y="28" width="14" height="50" fill={a} stroke={a} /></>),
  v19: (a) => (<><ellipse cx="38" cy="32" rx="20" ry="8" /><path d="M18 32v26c0 5 9 8 20 8s20-3 20-8V32" /><path d="M18 45c0 5 9 8 20 8s20-3 20-8" /><path d="M76 32v28" stroke={a} /><path d="M69 53l7 9 7-9" stroke={a} /></>),
  v20: (a) => (<><path d="M22 10h30l14 14v30H22z" /><path d="M52 10v14h14" /><path d="M32 32h22M32 43h14" /><circle cx="56" cy="60" r="16" /><path d="M68 72l12 12" stroke={a} strokeWidth="6" /></>),
  v21: (a) => (<><path d="M20 40v14a6 6 0 006 6h6l22 14V20L32 34h-6a6 6 0 00-6 6z" /><path d="M70 34a16 16 0 010 28" stroke={a} /><path d="M79 26a27 27 0 010 44" stroke={a} /></>),
  v22: (a) => (<><rect x="24" y="18" width="48" height="64" rx="6" /><rect x="38" y="11" width="20" height="13" rx="4" fill={a} stroke="none" /><rect x="33" y="34" width="13" height="13" rx="3" /><rect x="33" y="56" width="13" height="13" rx="3" /><path d="M53 40h13M53 62h13" /><path d="M35 40l3 3 6-7" stroke={a} /></>),
  v23: (a) => (<><path d="M52 12H22a9 9 0 00-9 9v30a8 8 0 002 6l30 30a6 6 0 009 0l27-27a6 6 0 000-9L58 15a9 9 0 00-6-3z" /><circle cx="31" cy="30" r="6" fill={a} stroke="none" /><text x="55" y="63" textAnchor="middle" fontSize="22" fontWeight="700" fill={a} stroke="none">%</text></>),
  v24: (a) => (<><path d="M22 34h52l-5 46H27z" /><path d="M36 34V26a12 12 0 0124 0v8" /><path d="M48 46l4.4 9 9.6 1.2-7 6.8 1.8 9.6-8.8-4.8-8.8 4.8L41 62l-7-6.8 9.6-1.2z" fill={a} stroke={a} /></>),
  v25: (a) => (<><path d="M16 24h64v40H50L34 80V64H16z" /><path d="M40 34l4 8 8.6 1.2-6.3 6 1.5 8.6L40 53.8 32.2 57.8l1.5-8.6-6.3-6L36 42z" fill={a} stroke={a} /><path d="M62 40h10M62 52h6" /></>),
  v26: (a) => (<><circle cx="34" cy="28" r="12" /><path d="M14 76c0-11 9-20 20-20s20 9 20 20" /><rect x="56" y="38" width="27" height="36" rx="4" fill={a} stroke={a} /><path d="M62 48h15M62 57h15M62 66h9" stroke="#fff" /></>),
  v27: (a) => (<><rect x="22" y="12" width="52" height="72" rx="6" /><rect x="32" y="24" width="17" height="19" rx="3" fill={a} stroke={a} /><path d="M55 29h12M55 39h12M32 55h32M32 65h32M32 75h20" /></>),
  v28: (a) => (<><circle cx="62" cy="26" r="9" /><path d="M46 58c0-9 7-16 16-16s16 7 16 16" /><circle cx="34" cy="34" r="13" /><path d="M12 78c0-12 10-22 22-22s22 10 22 22" /><circle cx="34" cy="64" r="7" fill={a} stroke={a} /></>),
  v29: (a) => (<><path d="M48 80S16 60 16 38a16 16 0 0132-9 16 16 0 0132 9c0 22-32 42-32 42z" /><path d="M48 34v20M38 44h20" stroke={a} strokeWidth="6" /></>),
  v30: (a) => (<><rect x="16" y="20" width="64" height="60" rx="8" strokeDasharray="7 6" /><path d="M16 38h64" /><path d="M32 20V10M64 20V10" /><text x="48" y="70" textAnchor="middle" fontSize="26" fontWeight="700" fill={a} stroke="none">3</text></>),
  v31: (a) => (<><path d="M22 12h32l16 16v56H22z" /><path d="M54 12v16h16" /><path d="M31 42h30M31 52h30" /><rect x="30" y="60" width="34" height="15" rx="3" fill={a} stroke={a} /></>),
  v32: (a) => (<><path d="M22 12h32l16 16v56H22z" /><path d="M54 12v16h16" /><path d="M34 48l24 24M58 48L34 72" stroke={a} strokeWidth="5.5" /></>),
  v33: (a) => (<><path d="M48 12l30 11v25c0 21-15 34-30 40-15-6-30-19-30-40V23z" /><path d="M34 47l10 11 20-21" stroke={a} strokeWidth="6" /></>),
  v34: (a) => (<><rect x="30" y="32" width="36" height="34" rx="5" /><path d="M30 42h36" /><path d="M78 40a32 32 0 11-16-16" stroke={a} /><path d="M54 18l10 6-8 9" stroke={a} /></>),
  v35: (a) => (<><path d="M48 22v54M30 78h36" /><path d="M18 34h60" /><circle cx="48" cy="26" r="5" fill={a} stroke={a} /><path d="M18 34l-8 18a10 8 0 0016 0z" /><path d="M78 34l8 18a10 8 0 01-16 0z" /></>),
  v36: (a) => (<><path d="M16 32l32-15 32 15-32 15z" /><path d="M16 32v33l32 15 32-15V32" /><path d="M48 47v33" /><path d="M32 24.5l32 15" stroke={a} /></>),
  v37: (a) => (<><path d="M14 40l34-23 34 23v40H14z" /><rect x="33" y="52" width="30" height="28" fill={a} stroke={a} /><path d="M33 61h30M33 70h30" stroke="#fff" /></>),
  v38: (a) => (<><path d="M16 18v62M80 18v62" /><path d="M16 44h64M16 66h64M16 80h64" /><rect x="26" y="28" width="17" height="15" fill={a} stroke={a} /><rect x="52" y="31" width="15" height="12" /><rect x="30" y="53" width="15" height="12" /><rect x="54" y="51" width="17" height="14" fill={a} stroke={a} /></>),
  v39: (a) => (<><rect x="16" y="30" width="45" height="44" rx="4" /><path d="M16 44h45" /><path d="M36 44l6 10-9 6 8 8" stroke={a} /><path d="M73 42l12 22H61z" fill={a} stroke={a} /><path d="M73 50v6" stroke="#fff" /><circle cx="73" cy="60" r="1.6" fill="#fff" stroke="none" /></>),
  v40: (a) => (<><circle cx="22" cy="48" r="11" fill={a} stroke={a} /><circle cx="76" cy="20" r="8" /><circle cx="76" cy="48" r="8" /><circle cx="76" cy="76" r="8" /><path d="M32 44l35-19M33 48h35M32 52l35 19" /></>),
  _fallback: (a) => (<><rect x="18" y="18" width="60" height="60" rx="15" /><path d="M48 34l5.2 10.6 11.8 1.7-8.5 8.3 2 11.7L48 60.8l-10.5 5.5 2-11.7-8.5-8.3 11.8-1.7z" fill={a} stroke={a} /></>),
};

export function VocabArt({ id, dark, size }) {
  const accent = dark ? "#818cf8" : "#4f46e5";
  const ink = dark ? "#d4d4d4" : "#334155";
  const draw = VOCAB_ART[id] || VOCAB_ART._fallback;
  return (
    <svg viewBox="0 0 96 96" width={size || 96} height={size || 96} aria-hidden="true">
      <g stroke={ink} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {draw(accent)}
      </g>
    </svg>
  );
}

/* ---------- 1.2 PART 5 — Điền vào câu (24 câu) ---------- */
const PART5 = [
  { id: "p5-01", text: "All employees ______ submit their timesheets by 5:00 P.M. on Friday.", options: ["must", "might", "would", "could"] , ans: 0,
    exp: "Câu nói về quy định bắt buộc → dùng must. (B) might và (D) could chỉ khả năng, (C) would chỉ giả định — đều không diễn tả nghĩa bắt buộc. Bẫy: thấy 4 modal thì phải dịch nghĩa, không đoán theo thì." },
  { id: "p5-02", text: "The new filing system has made document retrieval far ______ than before.", options: ["efficient", "efficiently", "more efficient", "efficiency"], ans: 2,
    exp: "Có \"than\" ở cuối → bắt buộc dạng so sánh hơn: more efficient. (A) là tính từ nguyên cấp, (B) trạng từ không đứng sau \"far ... than\", (D) là danh từ. Dấu hiệu: chỉ cần thấy \"than\" là quét ngay đáp án so sánh." },
  { id: "p5-03", text: "Ms. Tran will be ______ for training all new sales representatives.", options: ["responsible", "responsibly", "responsibility", "responsive"], ans: 0,
    exp: "Sau \"be\" cần tính từ, và cụm cố định là be responsible for = chịu trách nhiệm về. (D) responsive nghĩa \"phản hồi nhanh\" — bẫy từ gần giống. (C) là danh từ, (B) là trạng từ." },
  { id: "p5-04", text: "Please contact the help desk ______ you experience any difficulty logging in.", options: ["if", "so", "despite", "during"], ans: 0,
    exp: "Sau chỗ trống là một mệnh đề đầy đủ (S + V) → cần liên từ chỉ điều kiện: if. (C) despite và (D) during là giới từ, chỉ đi với danh từ. (B) so không hợp nghĩa ở vị trí này." },
  { id: "p5-05", text: "The conference room ______ on the third floor has been reserved for the interview.", options: ["locate", "locating", "located", "locates"], ans: 2,
    exp: "Rút gọn mệnh đề quan hệ bị động: the room which is located → located. Phòng \"được đặt ở\" nên dùng quá khứ phân từ. (B) locating mang nghĩa chủ động (phòng tự định vị) — sai logic. (A), (D) làm câu có hai động từ chia." },
  { id: "p5-06", text: "Sales of the XT-9 printer have increased ______ since the price reduction.", options: ["steady", "steadily", "steadiness", "steadier"], ans: 1,
    exp: "Chỗ trống bổ nghĩa cho động từ \"have increased\" → trạng từ steadily. Đây là dạng word form kinh điển: sau động từ thường, chọn đuôi -ly. (A) tính từ, (C) danh từ, (D) so sánh hơn của tính từ." },
  { id: "p5-07", text: "______ the heavy rain, the outdoor product demonstration was moved indoors.", options: ["Because", "Because of", "Although", "So that"], ans: 1,
    exp: "Sau chỗ trống là cụm danh từ \"the heavy rain\" (không có động từ chia) → phải dùng giới từ: because of. (A) Because và (C) Although là liên từ, cần theo sau bằng mệnh đề. Đây là bẫy liên từ / giới từ ra 3–4 câu mỗi đề." },
  { id: "p5-08", text: "The board approved the proposal ______ discussing it for less than an hour.", options: ["after", "while", "since", "until"], ans: 0,
    exp: "Duyệt đề xuất xảy ra SAU khi thảo luận → after + V-ing. (B) while nghĩa \"trong lúc\" sai logic thời gian, (D) until nghĩa \"cho đến khi\", (C) since dùng với mốc thời gian cụ thể." },
  { id: "p5-09", text: "Applicants must submit ______ résumés electronically no later than 15 May.", options: ["they", "them", "their", "theirs"], ans: 2,
    exp: "Trước danh từ \"résumés\" cần tính từ sở hữu: their. (A) đại từ chủ ngữ, (B) đại từ tân ngữ, (D) đại từ sở hữu (đứng một mình, không kèm danh từ). Mẹo: thấy chỗ trống + danh từ ngay sau → chọn dạng sở hữu." },
  { id: "p5-10", text: "The technician explained the procedure so ______ that everyone understood immediately.", options: ["clear", "clearly", "clearer", "clarity"], ans: 1,
    exp: "Bổ nghĩa cho động từ \"explained\" → trạng từ clearly. Cấu trúc so + adv + that. (A) tính từ, (D) danh từ, (C) so sánh hơn không đi với \"so ... that\"." },
  { id: "p5-11", text: "Ms. Alvarez has worked at Brightline Logistics ______ 2015.", options: ["for", "since", "from", "during"], ans: 1,
    exp: "Hiện tại hoàn thành + mốc thời gian cụ thể (2015) → since. (A) for đi với khoảng thời gian (for five years). (C) from cần cặp from ... to. (D) during đi với danh từ chỉ giai đoạn (during the meeting)." },
  { id: "p5-12", text: "Our client requested that we ______ the samples before the end of the month.", options: ["deliver", "delivers", "delivering", "to deliver"], ans: 0,
    exp: "Sau các động từ đề nghị/yêu cầu (request, suggest, recommend, insist) + that + S + V nguyên mẫu, bỏ \"to\" và không chia. Vì thế (B) delivers là bẫy hòa hợp chủ vị, (C) và (D) sai dạng." },
  { id: "p5-13", text: "The renovation of the lobby is expected ______ by early November.", options: ["complete", "completing", "to be completed", "completion"], ans: 2,
    exp: "be expected + to V; việc cải tạo \"được hoàn thành\" nên cần bị động → to be completed. (B) to complete (chủ động) sẽ sai logic vì sảnh không tự hoàn thành. (A), (D) sai dạng." },
  { id: "p5-14", text: "All packages must be ______ inspected before they leave the warehouse.", options: ["thorough", "thoroughly", "thoroughness", "more thorough"], ans: 1,
    exp: "Chỗ trống nằm giữa \"be\" và quá khứ phân từ \"inspected\" → vị trí của trạng từ: thoroughly. Nhiều bạn chọn (A) vì thấy \"be\" nên nghĩ cần tính từ — nhưng tính từ chỉ đứng sau be khi KHÔNG có V-ed theo sau." },
  { id: "p5-15", text: "______ the marketing team nor the design team was informed of the schedule change.", options: ["Either", "Both", "Neither", "Not only"], ans: 2,
    exp: "Có \"nor\" ở giữa → cặp cố định neither ... nor. (A) Either đi với or, (B) Both đi với and, (D) Not only đi với but also. Dạng cặp liên từ này gần như đề nào cũng có." },
  { id: "p5-16", text: "The updated software allows users to access files ______ any device.", options: ["from", "into", "among", "between"], ans: 0,
    exp: "access files from a device = truy cập tệp TỪ một thiết bị. (B) into chỉ chuyển động vào trong, (C) among dùng cho ba đối tượng trở lên, (D) between dùng cho hai đối tượng." },
  { id: "p5-17", text: "Ticket holders will receive a full ______ if the event is cancelled.", options: ["refund", "refusal", "reform", "reserve"], ans: 0,
    exp: "Câu từ vựng: sự kiện bị hủy → khách được hoàn tiền, a full refund. (B) refusal = sự từ chối, (C) reform = cải cách, (D) reserve = dự trữ. Với dạng 4 đáp án khác nghĩa hoàn toàn, bắt buộc phải đọc hiểu cả câu." },
  { id: "p5-18", text: "Mr. Osei is ______ to be promoted to regional director next quarter.", options: ["likely", "alike", "likeness", "liking"], ans: 0,
    exp: "Cấu trúc be likely to V = có khả năng sẽ. (B) alike (giống nhau) không đi với to V, (C) danh từ, (D) danh động từ. Lưu ý likely tuy có đuôi -ly nhưng là TÍNH TỪ." },
  { id: "p5-19", text: "The workshop was so popular ______ a second session had to be scheduled.", options: ["that", "as", "for", "than"], ans: 0,
    exp: "Cấu trúc so + adj + that + mệnh đề (quá ... đến nỗi mà). (B) as cần cặp as ... as, (D) than cần dạng so sánh hơn (popular chứ không phải more popular)." },
  { id: "p5-20", text: "Because of a scheduling ______, two departments booked the same room for Monday.", options: ["conflict", "contract", "content", "contact"], ans: 0,
    exp: "a scheduling conflict = trùng lịch. Ba đáp án còn lại là bẫy gần âm quen thuộc: contract (hợp đồng), content (nội dung), contact (liên hệ). Gặp nhóm từ na ná nhau, hãy dịch nghĩa cả cụm chứ đừng nhìn hình dạng từ." },
  { id: "p5-21", text: "The manual explains ______ to install the software on multiple computers.", options: ["how", "what", "why", "whose"], ans: 0,
    exp: "Cấu trúc how + to V = cách làm gì. (B) what to do cũng tồn tại nhưng \"what to install the software\" thiếu tân ngữ nên sai. (C) why và (D) whose không đi với to V trong cấu trúc này." },
  { id: "p5-22", text: "Anyone ______ in joining the volunteer program should speak with Ms. Park.", options: ["interest", "interested", "interesting", "interests"], ans: 1,
    exp: "Người CẢM THẤY hứng thú → dùng V-ed: interested in. (C) interesting nghĩa \"gây hứng thú\", dùng cho vật/sự việc — đây là bẫy V-ing/V-ed kinh điển. Cụm cố định: be interested IN + V-ing." },
  { id: "p5-23", text: "Production at the Da Nang plant has doubled ______ the past two years.", options: ["over", "along", "toward", "beside"], ans: 0,
    exp: "over the past two years = trong suốt hai năm qua, cụm cố định đi với hiện tại hoàn thành. (B), (C), (D) đều là giới từ chỉ nơi chốn/phương hướng, không dùng cho khoảng thời gian." },
  { id: "p5-24", text: "The new supplier offers lower prices ______ maintaining the same level of quality.", options: ["while", "unless", "despite of", "because"], ans: 0,
    exp: "while + V-ing = trong khi vẫn (rút gọn mệnh đề cùng chủ ngữ). (B) unless cần mệnh đề đầy đủ, (C) sai ngữ pháp (đúng là \"in spite of\" hoặc \"despite\"), (D) because cần S + V." },
];

/* ---------- 1.3 PART 6 — Điền vào đoạn văn (3 đoạn × 4 câu) ---------- */
const PART6_PASSAGES = [
  {
    id: "p6-1", part: 6, kind: "E-mail", title: "Temporary Office Relocation",
    body: `To: All Staff
From: Facilities Management
Subject: Temporary Office Relocation

Beginning on 14 March, the third floor will be closed for electrical work. During this period, all Accounting staff will ___(1)___ to meeting rooms 2B and 2C on the second floor. Please pack your personal belongings in the boxes ___(2)___ outside the copy room.

We understand that this move may cause some inconvenience. ___(3)___ You will be notified as soon as the third floor ___(4)___.

Thank you for your cooperation.`,
    questions: [
      { id: "p6-1-1", text: "Chỗ trống (1)", options: ["relocate", "relocated", "have relocated", "relocating"], ans: 0,
        exp: "Sau \"will\" luôn là động từ nguyên mẫu không \"to\" → relocate. (B), (C), (D) đều sai dạng sau modal. Đây là câu Part 6 dễ ăn điểm nhất, chỉ cần nhìn từ đứng trước chỗ trống." },
      { id: "p6-1-2", text: "Chỗ trống (2)", options: ["provide", "provided", "providing", "provides"], ans: 1,
        exp: "Rút gọn mệnh đề quan hệ bị động: the boxes which are provided → provided. Thùng \"được cung cấp\" nên dùng V-ed. (C) providing mang nghĩa chủ động, (A) và (D) làm câu có hai động từ chia." },
      { id: "p6-1-3", text: "Chỗ trống (3) — chọn câu phù hợp", options: [
          "We appreciate your patience while the repairs are completed.",
          "The third-floor cafeteria will reopen next week.",
          "Applications for the position must be submitted by Friday.",
          "Please contact the sales team for current pricing."], ans: 0,
        exp: "Câu trước nói \"may cause some inconvenience\" → câu tiếp theo phải nối mạch xin lỗi/cảm ơn sự thông cảm. (B) mâu thuẫn vì tầng ba đang đóng cửa, (C) và (D) lạc chủ đề. Với dạng chèn câu, hãy bám vào câu ngay trước và ngay sau." },
      { id: "p6-1-4", text: "Chỗ trống (4)", options: ["reopens", "will reopen", "reopened", "is reopening"], ans: 0,
        exp: "Sau \"as soon as\" (mệnh đề trạng ngữ chỉ thời gian) dùng hiện tại đơn thay cho tương lai. (B) will reopen là bẫy phổ biến nhất vì cả câu đang nói về tương lai. (C) sai thì, (D) không hợp ngữ cảnh." },
    ],
  },
  {
    id: "p6-2", part: 6, kind: "Notice", title: "Greenfield Market Rewards",
    body: `ATTENTION VALUED CUSTOMERS

Starting 1 June, Greenfield Market will launch a new rewards program. Members will earn one point for every dollar ___(1)___ at any of our twelve locations. Points may be ___(2)___ for discounts on groceries, or donated to a local food bank.

Signing up is simple and free. ___(3)___ Cards are also available at the customer service desk.

For ___(4)___ information, visit our Web site or ask any cashier.`,
    questions: [
      { id: "p6-2-1", text: "Chỗ trống (1)", options: ["spend", "spent", "spending", "to spend"], ans: 1,
        exp: "Rút gọn mệnh đề quan hệ bị động: every dollar that is spent → spent. Tiền \"được tiêu\" nên dùng V-ed. (C) spending mang nghĩa chủ động, (A) làm câu có hai động từ chia." },
      { id: "p6-2-2", text: "Chỗ trống (2)", options: ["exchanged", "redeemed", "returned", "replaced"], ans: 1,
        exp: "Câu từ vựng: redeem points for discounts là cụm chuẩn trong ngữ cảnh tích điểm. (A) exchange thường đi với \"exchange A for B\" về hàng hóa, (C) return = trả lại hàng, (D) replace = thay thế." },
      { id: "p6-2-3", text: "Chỗ trống (3) — chọn câu phù hợp", options: [
          "Our produce section has recently been expanded.",
          "Simply complete the short form on our Web site to receive your card by mail.",
          "The store will close for renovations throughout July.",
          "Applications for seasonal positions are now closed."], ans: 1,
        exp: "Câu trước nói \"Signing up is simple and free\", câu sau nói \"Cards are ALSO available at the desk\" → chỗ trống phải nêu cách đăng ký thứ nhất để chữ \"also\" có nghĩa. Từ nối \"also\" ở câu sau chính là manh mối." },
      { id: "p6-2-4", text: "Chỗ trống (4)", options: ["additional", "addition", "additionally", "added"], ans: 0,
        exp: "Trước danh từ \"information\" cần tính từ: additional information. (B) là danh từ (in addition), (C) là trạng từ, (D) added tuy có thể làm tính từ nhưng không dùng trong cụm cố định này." },
    ],
  },
  {
    id: "p6-3", part: 6, kind: "Memo", title: "Annual Performance Reviews",
    body: `MEMO
To: Department Managers
From: Linh Pham, Human Resources
Date: 9 October
Re: Annual Performance Reviews

Performance reviews for this year must be ___(1)___ by 30 November. Each manager should schedule a one-hour meeting with every member of his or her team. ___(2)___

Evaluation forms are now available on the HR portal. Please note that the rating scale ___(3)___ since last year; the new scale runs from one to five rather than one to four. If you are unfamiliar with the revised form, a short training video has been posted ___(4)___ the portal's main page.

Contact HR at extension 244 with any questions.`,
    questions: [
      { id: "p6-3-1", text: "Chỗ trống (1)", options: ["complete", "completed", "completing", "completion"], ans: 1,
        exp: "must be + V-ed = bị động: các bản đánh giá \"được hoàn thành\". (A) sẽ thành \"must be complete\" (tính từ, nghĩa là đầy đủ) — nghe được nhưng không hợp với mốc thời hạn \"by 30 November\". (C), (D) sai dạng sau \"be\"." },
      { id: "p6-3-2", text: "Chỗ trống (2) — chọn câu phù hợp", options: [
          "Meetings held after that date will not count toward this year's cycle.",
          "The company picnic will take place in June.",
          "New office chairs have been ordered for all departments.",
          "Parking permits expire at the end of the month."], ans: 0,
        exp: "Đoạn đang nói về hạn chót và việc xếp lịch họp → câu chèn phải tiếp tục nói về hạn chót đó (\"that date\" trỏ ngược về 30 November). (B), (C), (D) đều lạc đề. Mẹo: đại từ chỉ định (that, this, they) trong đáp án đúng luôn có chỗ để trỏ về." },
      { id: "p6-3-3", text: "Chỗ trống (3)", options: ["changes", "is changing", "has changed", "will change"], ans: 2,
        exp: "\"since last year\" là dấu hiệu bắt buộc của hiện tại hoàn thành → has changed. (A) hiện tại đơn và (B) hiện tại tiếp diễn không đi với since, (D) tương lai mâu thuẫn với việc thang điểm mới đã áp dụng." },
      { id: "p6-3-4", text: "Chỗ trống (4)", options: ["on", "in", "among", "through"], ans: 0,
        exp: "posted on a page / on a Web site — giới từ chuẩn cho việc đăng nội dung lên trang. (B) in dùng cho không gian bên trong, (C) among cần nhiều đối tượng, (D) through nghĩa xuyên qua/thông qua." },
    ],
  },
  {
    id: "p6-4", part: 6, kind: "E-mail", title: "New Expense-Reporting System",
    body: `To: All Staff
From: Priya Nandakumar, Finance
Subject: New expense-reporting system

Starting 1 April, all travel and entertainment expenses ___(1)___ through the Orbit portal rather than on paper forms. The portal accepts photographs of receipts, so there is no longer any need to post originals to Finance.

Claims submitted before 25 March will still be processed under the old system. ___(2)___

Reimbursements are issued twice a month, on the 10th and the 25th. A claim approved ___(3)___ the 20th will therefore appear in the payment made on the 25th. If your manager is away, the portal forwards the claim to the ___(4)___ approver listed in your department profile.`,
    questions: [
      { id: "p6-4-1", text: "Chỗ trống (1)", options: ["submit", "must submit", "must be submitted", "submitting"], ans: 2,
        exp: "Chủ ngữ là \"expenses\" (chi phí) — chi phí được nộp chứ không tự nộp → bị động must be submitted. (B) là bẫy chủ động phổ biến nhất ở dạng câu này." },
      { id: "p6-4-2", text: "Chỗ trống (2) — chọn câu phù hợp", options: [
          "After that date, paper forms will no longer be accepted.",
          "The cafeteria will be closed for cleaning next week.",
          "New laptops have been ordered for the sales team.",
          "Please contact IT to request a parking permit."], ans: 0,
        exp: "Câu trước nói đơn nộp trước 25/3 vẫn xử lý theo hệ thống cũ → câu tiếp phải nói điều gì xảy ra sau mốc đó. Cụm \"that date\" trỏ ngược về 25 March, đúng nguyên tắc bám đại từ chỉ định." },
      { id: "p6-4-3", text: "Chỗ trống (3)", options: ["on", "in", "among", "until"], ans: 0,
        exp: "Giới từ đi với ngày cụ thể là on (on the 20th). (B) in dùng cho tháng/năm, (D) until nghĩa \"cho đến\" làm sai logic vì đây là một thời điểm duyệt đơn." },
      { id: "p6-4-4", text: "Chỗ trống (4)", options: ["alternate", "alternately", "alternation", "alternating"], ans: 0,
        exp: "Trước danh từ \"approver\" cần tính từ: alternate approver = người duyệt thay. (B) trạng từ, (C) danh từ, (D) phân từ mang nghĩa \"luân phiên\" không hợp." },
    ],
  },
];

/* ---------- 1.4 PART 7 — Đọc hiểu (6 bài đọc / 24 câu) ---------- */
const PART7_PASSAGES = [
  {
    id: "p7-1", part: 7, kind: "Notice", title: "Elevator Maintenance",
    body: `NOTICE — Riverside Business Center
Elevator Maintenance

The east elevator will be out of service from Monday, 5 May through Wednesday, 7 May while a new control panel is installed. The west elevator will operate normally throughout this period.

Tenants moving large equipment should use the freight elevator in the parking garage. A key can be borrowed from the security desk in the main lobby between 7:00 A.M. and 6:00 P.M.

We apologize for the inconvenience. Questions may be directed to building management at 555-0173.`,
    questions: [
      { id: "p7-1-1", text: "What is the purpose of the notice?", options: [
          "To advertise available office space",
          "To announce a temporary service interruption",
          "To introduce a new security team",
          "To request payment from tenants"], ans: 1,
        exp: "Câu hỏi mục đích → đọc 2–3 dòng đầu: thang máy phía đông ngừng hoạt động vài ngày. Đó là \"gián đoạn dịch vụ tạm thời\". (A), (C), (D) đều nhắc tới thứ không có trong bài. Lưu ý đáp án đúng là câu paraphrase, không lặp nguyên văn \"out of service\"." },
      { id: "p7-1-2", text: "What are tenants advised to do if they need to move large items?", options: [
          "Use the west elevator",
          "Contact building management in advance",
          "Borrow a key from the security desk",
          "Reschedule the move for after 7 May"], ans: 2,
        exp: "Đoạn 2 nói rõ: dùng thang chở hàng và mượn chìa khóa ở quầy bảo vệ. (A) là bẫy lặp từ — thang phía tây có được nhắc nhưng dành cho việc đi lại bình thường, không phải chuyển thiết bị lớn." },
      { id: "p7-1-3", text: "What is indicated about the west elevator?", options: [
          "It will also be repaired.",
          "It will remain available.",
          "It is reserved for deliveries.",
          "It requires a key to operate."], ans: 1,
        exp: "\"will operate normally throughout this period\" → vẫn dùng được bình thường. (A) mâu thuẫn với bài, (C) và (D) mô tả thang chở hàng chứ không phải thang phía tây — bẫy tráo đối tượng rất hay gặp." },
    ],
  },
  {
    id: "p7-2", part: 7, kind: "E-mail", title: "Order #4471",
    body: `To: r.okafor@nortexdesign.example
From: services@printmasters.example
Date: 12 June
Subject: Order #4471

Dear Mr. Okafor,

Thank you for your order of 500 brochures. Your files have been received and have passed our quality check.

However, the logo on page one is a low-resolution image and may appear blurry when printed at full size. If you can send a higher-resolution version by Thursday, 14 June, we can still meet your requested delivery date of 21 June. If we do not hear from you, we will print the files exactly as they were submitted.

Please also note that the balance from your March order has not yet been settled. Payment must be received before we can ship.

Sincerely,
Dana Whitfield
Customer Services, PrintMasters`,
    questions: [
      { id: "p7-2-1", text: "Why was the e-mail sent?", options: [
          "To confirm a change of address",
          "To report a problem with a submitted file",
          "To offer a discount on a future order",
          "To announce a delay in production"], ans: 1,
        exp: "Trọng tâm email nằm ở đoạn \"However...\": logo độ phân giải thấp. (D) là bẫy suy diễn — bài chưa hề nói đơn hàng bị trễ, ngược lại vẫn kịp hạn 21/6 nếu gửi file mới." },
      { id: "p7-2-2", text: "What is Mr. Okafor asked to do by 14 June?", options: [
          "Approve a printing sample",
          "Reduce the number of brochures",
          "Provide a replacement image",
          "Visit the PrintMasters office"], ans: 2,
        exp: "\"send a higher-resolution version\" = gửi ảnh thay thế. Câu hỏi có mốc thời gian cụ thể (14 June) → quét tìm đúng con số đó trong bài rồi đọc câu chứa nó." },
      { id: "p7-2-3", text: "What will happen if Mr. Okafor does not respond?", options: [
          "The order will be cancelled.",
          "The order will be printed as submitted.",
          "The delivery date will be moved to July.",
          "A new invoice will be issued."], ans: 1,
        exp: "\"If we do not hear from you, we will print the files exactly as they were submitted.\" Đáp án đúng gần như dịch lại câu này. (A) và (C) là suy diễn quá xa so với thông tin bài cho." },
      { id: "p7-2-4", text: "What is mentioned about Mr. Okafor's account?", options: [
          "It was recently created.",
          "It qualifies for free shipping.",
          "It has an unpaid balance.",
          "It will be closed in June."], ans: 2,
        exp: "\"the balance from your March order has not yet been settled\" → còn nợ chưa thanh toán. Ở đây bạn cần biết settle a balance = thanh toán dư nợ; đây là cụm từ vựng thương mại rất hay ra." },
    ],
  },
  {
    id: "p7-3", part: 7, kind: "Advertisement", title: "The Loft Workspace",
    body: `THE LOFT WORKSPACE — Now open in the Harbour District
Flexible desks for freelancers and small teams, five minutes from Central Station.

• Day Pass — $18 — open seating, high-speed Internet, unlimited coffee
• Monthly Flex — $180 — open seating, 10 hours of meeting-room use
• Dedicated Desk — $320 — your own desk, a locker, mail service
• Team Suite — from $900 — a private room for up to six people

All members may book meeting rooms through our mobile app. Printing is charged separately at 10 cents per page.

Mention this advertisement before 31 August and receive your first week free with any monthly plan. Tours are offered every weekday at 11:00 A.M.; no appointment is needed.`,
    questions: [
      { id: "p7-3-1", text: "What is being advertised?", options: [
          "A shared office facility",
          "A hotel near a train station",
          "A printing and mailing service",
          "A mobile application for freelancers"], ans: 0,
        exp: "Toàn bài nói về chỗ ngồi làm việc linh hoạt, phòng họp, tủ khóa → không gian làm việc chung. (C) và (D) là bẫy lặp từ: printing và mobile app có xuất hiện nhưng chỉ là dịch vụ đi kèm." },
      { id: "p7-3-2", text: "What is NOT included in the membership fees?", options: [
          "Internet access",
          "Printing",
          "Use of meeting rooms",
          "Coffee"], ans: 1,
        exp: "\"Printing is charged separately\" = tính phí riêng, tức không nằm trong phí thành viên. Với câu hỏi dạng NOT / EXCEPT, hãy gạch bỏ từng phương án có trong bài rồi lấy phương án còn lại." },
      { id: "p7-3-3", text: "What must customers do to receive the special offer?", options: [
          "Sign a one-year contract",
          "Take a tour of the facility",
          "Mention the advertisement before a certain date",
          "Pay for three months in advance"], ans: 2,
        exp: "\"Mention this advertisement before 31 August\" là điều kiện duy nhất được nêu. (B) tuy có thật trong bài nhưng tour không liên quan tới ưu đãi — bẫy ghép hai thông tin rời nhau." },
      { id: "p7-3-4", text: "What is stated about the tours?", options: [
          "They are held on weekends.",
          "They do not require a reservation.",
          "They last about one hour.",
          "They are available to members only."], ans: 1,
        exp: "\"no appointment is needed\" → không cần đặt trước. (A) sai vì tour diễn ra vào ngày trong tuần (every weekday). (C) và (D) là thông tin bài không hề cung cấp." },
    ],
  },
  {
    id: "p7-4", part: 7, kind: "Article", title: "Kestrel Foods to Build Second Plant",
    body: `BRIGHT VALLEY — Kestrel Foods announced on Tuesday that it will open a second production facility in Bright Valley, creating an estimated 140 jobs over the next two years.

The company, founded in 1998 as a small bakery, now supplies frozen desserts to supermarkets in nine provinces. Demand rose sharply after Kestrel introduced its low-sugar line in 2023, and its existing plant has been operating at full capacity since last autumn.

"We looked at four sites, and Bright Valley offered the best combination of transport links and available workers," said chief operating officer Marisol Reyes. Construction is scheduled to begin in February, with production expected to start the following year.

Local officials welcomed the news. The town council has agreed to upgrade the road leading to the industrial park, a project that had been postponed twice because of funding shortages.`,
    questions: [
      { id: "p7-4-1", text: "What is the article mainly about?", options: [
          "A company's plan to expand its production",
          "The launch of a new dessert product",
          "A change in local road regulations",
          "The appointment of a new company executive"], ans: 0,
        exp: "Câu đầu đã nêu ý chính: mở nhà máy thứ hai. (B) và (D) là bẫy chi tiết — dòng sản phẩm ít đường và bà Reyes đều được nhắc nhưng chỉ là thông tin phụ." },
      { id: "p7-4-2", text: "What is suggested about Kestrel Foods' existing plant?", options: [
          "It will be closed next year.",
          "It cannot produce more than it currently does.",
          "It was built in 1998.",
          "It is located in Bright Valley."], ans: 1,
        exp: "\"operating at full capacity\" = chạy hết công suất, tức không thể sản xuất thêm. Đây là câu suy luận (suggested/indicated) nên đáp án không nằm nguyên văn trong bài. (C) sai: 1998 là năm thành lập công ty, không phải năm xây nhà máy." },
      { id: "p7-4-3", text: "According to Ms. Reyes, why was Bright Valley chosen?", options: [
          "It offered the lowest land prices.",
          "It is close to the company's headquarters.",
          "It has good transportation and a suitable workforce.",
          "The town council offered a tax reduction."], ans: 2,
        exp: "Lời dẫn trực tiếp nói rõ: transport links và available workers. (D) là bẫy ghép nhầm — hội đồng thị trấn có hành động, nhưng là nâng cấp đường, và diễn ra SAU khi quyết định đã công bố." },
      { id: "p7-4-4", text: "What is indicated about the road project?", options: [
          "It has been delayed in the past.",
          "It will be paid for by Kestrel Foods.",
          "It was completed last autumn.",
          "It requires approval from the provincial government."], ans: 0,
        exp: "\"had been postponed twice because of funding shortages\" → từng bị hoãn. Bạn cần nhận ra postpone = delay; đáp án đúng của Part 7 gần như luôn là từ đồng nghĩa chứ không lặp lại từ gốc." },
    ],
  },
  {
    id: "p7-5", part: 7, kind: "Text message chain", title: "Presentation moved up",
    body: `Ha Nguyen (9:12 A.M.)
Morning, Peter. The client just moved our presentation from 2:00 to 11:30. Can you be ready?

Peter Salib (9:14 A.M.)
The slides are done, but the sales figures for July aren't in the deck yet.

Ha Nguyen (9:15 A.M.)
Dao has them. She's working from the Riverside office today.

Peter Salib (9:16 A.M.)
I'll call her now. Do we still meet in Room 5?

Ha Nguyen (9:18 A.M.)
They asked for the video link instead — they're joining from Osaka.

Peter Salib (9:19 A.M.)
Understood. I'll send the invitation once the deck is final.

Ha Nguyen (9:20 A.M.)
Perfect. Let's do a quick run-through at 11:00.`,
    questions: [
      { id: "p7-5-1", text: "Why did Ms. Nguyen contact Mr. Salib?", options: [
          "To ask him to prepare a new set of slides",
          "To inform him of a schedule change",
          "To invite him to visit a client's office",
          "To report a problem with a video system"], ans: 1,
        exp: "Tin nhắn đầu tiên: buổi thuyết trình dời từ 2:00 lên 11:30. Với dạng chat, câu hỏi mục đích gần như luôn nằm ở tin nhắn đầu tiên." },
      { id: "p7-5-2", text: "At 9:14 A.M., what does Mr. Salib most likely mean when he writes, \"the sales figures for July aren't in the deck yet\"?", options: [
          "He needs more time to design the slides.",
          "He believes the meeting should be cancelled.",
          "Part of the presentation is still incomplete.",
          "He disagrees with the figures Dao provided."], ans: 2,
        exp: "Câu hỏi ngụ ý: anh ấy nói slide xong rồi NHƯNG còn thiếu số liệu → bài thuyết trình chưa hoàn chỉnh. (A) là bẫy vì vấn đề nằm ở dữ liệu chứ không phải thiết kế. Dạng câu này phải đọc cả tin nhắn trước và sau." },
      { id: "p7-5-3", text: "What will Mr. Salib most likely do next?", options: [
          "Book Room 5",
          "Contact Dao",
          "Travel to Osaka",
          "Postpone the run-through"], ans: 1,
        exp: "\"I'll call her now\" ngay sau khi biết Dao giữ số liệu. Câu hỏi \"do next\" luôn lấy đáp án từ hành động được nêu gần cuối đoạn hội thoại." },
      { id: "p7-5-4", text: "How will the presentation be given?", options: [
          "In Room 5",
          "At the Riverside office",
          "By video conference",
          "At the client's headquarters"], ans: 2,
        exp: "\"They asked for the video link instead\" → họp trực tuyến. (A) là bẫy vì Room 5 được nhắc tới rồi bị bác bỏ ngay tin nhắn sau — hãy đọc hết chuỗi chat trước khi chọn." },
    ],
  },
  {
    id: "p7-6", part: 7, kind: "Double passage", title: "Autumn Training Series",
    bodyA: `AUTUMN TRAINING SERIES — Vantage Consulting
All sessions are held in the Willow Room, 9:00 A.M.–12:00 P.M.

3 Oct — Data Privacy Basics — H. Iqbal
10 Oct — Client Communication — M. Duarte
17 Oct — Advanced Spreadsheets — T. Nakamura
24 Oct — Project Budgeting — M. Duarte

Staff must register at least three days before each session. Sessions with fewer than eight participants will be cancelled.`,
    bodyB: `To: t.nakamura@vantage.example
From: k.berg@vantage.example
Date: 12 October
Subject: Next week

Hi Toshi,

Only six people have signed up for your session so far, so under our policy it would normally be cancelled. Before I make that decision, I want to ask whether you would be willing to combine your session with the one on 24 October. Mateo has 15 participants, and several of them have asked for spreadsheet training as well.

If you agree, we would extend that session to a full day and move it to the Cedar Room, which seats 30. Please let me know by Monday afternoon so that I can notify everyone in time.

Thanks,
Katrin Berg`,
    questions: [
      { id: "p7-6-1", text: "What is indicated about the training series?", options: [
          "It is open to clients as well as staff.",
          "Every session is scheduled in the morning.",
          "Each session is led by a different trainer.",
          "Registration closes one week in advance."], ans: 1,
        exp: "Dòng đầu bảng: 9:00 A.M.–12:00 P.M. cho tất cả các buổi. (C) sai vì M. Duarte dạy hai buổi. (D) sai chi tiết: hạn đăng ký là ba ngày, không phải một tuần — bẫy đổi con số." },
      { id: "p7-6-2", text: "Which session is at risk of being cancelled?", options: [
          "Data Privacy Basics",
          "Client Communication",
          "Advanced Spreadsheets",
          "Project Budgeting"], ans: 2,
        exp: "Câu nối hai văn bản: email gửi cho t.nakamura, tra bảng thấy T. Nakamura dạy Advanced Spreadsheets ngày 17/10, và email nói mới có sáu người đăng ký (dưới mức tám). Đây chính là dạng câu bắt buộc kết hợp hai bài." },
      { id: "p7-6-3", text: "Who leads the session that Ms. Berg proposes combining with?", options: [
          "H. Iqbal", "M. Duarte", "T. Nakamura", "K. Berg"], ans: 1,
        exp: "Email đề xuất gộp với buổi ngày 24 October; tra bảng thấy buổi đó do M. Duarte phụ trách (email gọi thân mật là Mateo). Lại là một câu nối hai văn bản." },
      { id: "p7-6-4", text: "What change would be necessary if Mr. Nakamura agrees?", options: [
          "Hiring an additional trainer",
          "Moving to a larger room",
          "Reducing the number of participants",
          "Rescheduling to a different month"], ans: 1,
        exp: "\"move it to the Cedar Room, which seats 30\" — vì gộp lại sẽ có hơn 20 người, phòng Willow không đủ chỗ. (C) đi ngược mục đích của đề xuất." },
      { id: "p7-6-5", text: "What is Mr. Nakamura asked to do?", options: [
          "Contact the participants directly",
          "Prepare additional course materials",
          "Reply by Monday afternoon",
          "Submit an attendance list"], ans: 2,
        exp: "\"Please let me know by Monday afternoon\" → trả lời trước chiều thứ Hai. (A) sai vì chính bà Berg mới là người sẽ thông báo cho mọi người (\"so that I can notify everyone\")." },
    ],
  },
  {
    id: "p7-7", part: 7, group: "single", kind: "E-mail", title: "Service visit SV-2288",
    body: `To: m.delacruz@brightlane.example
From: service@nordicappliance.example
Date: 3 August
Subject: Service visit — reference SV-2288

Dear Ms. Dela Cruz,

A technician will visit your office on Thursday, 8 August, between 1:00 P.M. and 3:00 P.M. to replace the compressor on your walk-in cooler. Please make sure the unit is emptied before the technician arrives; we cannot begin work on a fully stocked cooler.

The visit is covered by your service plan, so there is no charge for labour. Any additional parts will be billed separately.

To change the appointment, reply to this message at least 24 hours in advance.

Nordic Appliance Service Team`,
    questions: [
      { id: "p7-7-1", text: "What is Ms. Dela Cruz asked to do before the visit?", options: [
          "Empty the cooler", "Pay a deposit", "Order a replacement part", "Move the unit to the loading area"], ans: 0,
        exp: "\"make sure the unit is emptied before the technician arrives\" — yêu cầu duy nhất trước buổi hẹn. (C) sai vì linh kiện do bên dịch vụ mang tới." },
      { id: "p7-7-2", text: "What is indicated about the cost of the visit?", options: [
          "It will be refunded later.", "Labour is included in her plan.", "It must be paid in advance.", "It depends on how long the work takes."], ans: 1,
        exp: "\"covered by your service plan, so there is no charge for labour\". (D) là bẫy vì phí phát sinh chỉ liên quan tới linh kiện, không phải thời gian làm việc." },
    ],
  },
  {
    id: "p7-8", part: 7, group: "single", kind: "Notice", title: "Parking Lot B closure",
    body: `NOTICE TO ALL EMPLOYEES
Parking Lot B — Resurfacing

Parking Lot B will be closed from Friday, 12 September at 6:00 P.M. until Monday, 15 September at 7:00 A.M. while the surface is repaved and new lines are painted.

During the closure, employees who normally park in Lot B may use the visitor spaces in Lot A. Please display your employee tag on the dashboard; vehicles without a tag may be towed.

Weekend staff should enter the building through the north entrance, as the Lot B doors will be locked.`,
    questions: [
      { id: "p7-8-1", text: "What must employees do to park in Lot A?", options: [
          "Register with security", "Pay a daily fee", "Display an employee tag", "Arrive before 7:00 A.M."], ans: 2,
        exp: "\"Please display your employee tag on the dashboard\" là điều kiện duy nhất được nêu; xe không có thẻ có thể bị kéo đi." },
      { id: "p7-8-2", text: "What is mentioned about weekend staff?", options: [
          "They must use a different entrance.", "They are not allowed on site.", "They will be given a temporary pass.", "They should park on the street."], ans: 0,
        exp: "Cửa phía Lot B bị khóa nên phải đi cửa bắc. (C) là suy diễn không có trong bài." },
    ],
  },
  {
    id: "p7-9", part: 7, group: "single", kind: "Advertisement", title: "SkillBridge courses",
    body: `SKILLBRIDGE — Learn at your own pace

Over 400 short courses in business writing, spreadsheets, project management and public speaking. Every course is broken into 15-minute lessons you can finish on the train.

• Individual — $12 per month, unlimited courses
• Team (5–20 people) — $9 per person per month, plus a progress dashboard for managers
• Enterprise — contact our sales team for pricing

New subscribers receive a 14-day trial. Certificates are issued after you complete a course and pass the final review.`,
    questions: [
      { id: "p7-9-1", text: "What is suggested about the courses?", options: [
          "They are taught by live instructors.", "They are designed to be studied in short sessions.", "They require a university degree.", "They are only available to companies."], ans: 1,
        exp: "\"broken into 15-minute lessons you can finish on the train\" → học từng đoạn ngắn. (D) mâu thuẫn vì có gói cá nhân." },
      { id: "p7-9-2", text: "What is offered to new subscribers?", options: [
          "A free trial period", "A discounted first year", "A printed workbook", "A personal tutor"], ans: 0,
        exp: "\"New subscribers receive a 14-day trial\". Các phương án còn lại đều là dịch vụ không hề được nhắc tới." },
    ],
  },
  {
    id: "p7-10", part: 7, group: "single", kind: "Online review", title: "Harbour Grand Hotel",
    body: `★★★★☆  Harbour Grand Hotel — reviewed by T. Ferreira, 14 June

I stayed here for three nights during a trade fair. The location is excellent: the convention centre is a seven-minute walk away, and there is a tram stop directly outside.

The room was quiet and the desk was large enough to work at, which matters more to me than a view. Breakfast, however, ends at 8:30 A.M. — too early for anyone attending evening events. I asked the front desk about a later option and was told room service is available from 6:00 A.M. instead.

I would stay again, but I would eat elsewhere.`,
    questions: [
      { id: "p7-10-1", text: "Why did Mr. Ferreira stay at the hotel?", options: [
          "To visit family", "To attend a trade fair", "To inspect the property", "To take a holiday"], ans: 1,
        exp: "Câu đầu nêu rõ mục đích. Câu hỏi lý do trong bài đánh giá gần như luôn nằm ở dòng mở đầu." },
      { id: "p7-10-2", text: "What does Mr. Ferreira complain about?", options: [
          "The noise from the tram stop", "The size of the room", "The breakfast hours", "The cost of room service"], ans: 2,
        exp: "\"Breakfast, however, ends at 8:30 A.M. — too early\". (A) là bẫy: trạm tram được nhắc như một điểm cộng, không phải điều phàn nàn." },
    ],
  },
  {
    id: "p7-11", part: 7, group: "single", kind: "Order confirmation", title: "Lumen Catering LC-7741",
    body: `LUMEN CATERING — Order confirmation

Order number: LC-7741
Client: Vantage Consulting, 12th floor
Delivery: Tuesday, 21 October, 11:30 A.M.

Sandwich platter (30 servings) ........ $180.00
Seasonal fruit tray (30 servings) ..... $95.00
Coffee urn, 60 cups ................... $70.00
Delivery within city centre ........... $0.00
                                Total: $345.00

Changes to quantities may be made until 5:00 P.M. on 19 October. Cancellations after that time are charged at 50 percent. Serving staff are not included; they may be added at $28 per hour when ordering.`,
    questions: [
      { id: "p7-11-1", text: "What is NOT included in the total?", options: [
          "Delivery", "Serving staff", "Coffee", "The fruit tray"], ans: 1,
        exp: "\"Serving staff are not included\"; giao hàng nội thành ghi rõ $0.00 tức đã bao gồm. Với câu NOT, hãy gạch từng phương án có trong bảng giá." },
      { id: "p7-11-2", text: "What will happen if the order is cancelled on 20 October?", options: [
          "The full amount will be refunded.", "Half the cost will be charged.", "A new order must be placed.", "The delivery will be rescheduled."], ans: 1,
        exp: "Hạn đổi là 17:00 ngày 19/10; hủy sau mốc đó chịu 50%. Ngày 20/10 nằm sau mốc nên bị tính nửa tiền — dạng câu bắt đối chiếu ngày tháng." },
    ],
  },
  {
    id: "p7-12", part: 7, group: "double", kind: "Double passage", title: "Quality Assurance Coordinator",
    bodyA: `KESTREL FOODS — Quality Assurance Coordinator (Bright Valley)

Kestrel Foods is seeking a Quality Assurance Coordinator for its new Bright Valley facility, which opens next year.

Responsibilities: monitor production lines, record test results, and prepare monthly compliance reports.

Requirements:
• A degree in food science or a related field
• At least three years in a food-production environment
• Familiarity with provincial safety regulations
• Willingness to work occasional weekend shifts

Applications close 30 November. Send a résumé and a short cover letter to careers@kestrelfoods.example. Only shortlisted candidates will be contacted.`,
    bodyB: `To: careers@kestrelfoods.example
From: n.abara@mailbox.example
Date: 18 November
Subject: Quality Assurance Coordinator

Dear Hiring Team,

I am writing to apply for the position advertised on your Web site. I have spent the last five years as a laboratory technician at Halden Dairy, where I ran daily quality tests and wrote the monthly reports submitted to provincial inspectors.

I hold a degree in chemistry rather than food science, but my work has been entirely within food production, and I completed the provincial food-safety certificate in 2024.

I am available for weekend shifts and could relocate to Bright Valley by February. My résumé is attached.

Sincerely,
Nkem Abara`,
    questions: [
      { id: "p7-12-1", text: "What is indicated about the Bright Valley facility?", options: [
          "It is not yet in operation.", "It has recently been expanded.", "It produces dairy products.", "It is the company's headquarters."], ans: 0,
        exp: "\"its new Bright Valley facility, which opens next year\" → chưa vận hành. (C) là bẫy trộn thông tin từ văn bản 2 (Halden Dairy là chỗ làm cũ của ứng viên)." },
      { id: "p7-12-2", text: "According to the advertisement, what will the coordinator do every month?", options: [
          "Train new staff", "Prepare compliance reports", "Inspect other facilities", "Meet with provincial officials"], ans: 1,
        exp: "\"prepare monthly compliance reports\" nằm trong phần trách nhiệm. (D) là bẫy: bài chỉ nói báo cáo được nộp cho thanh tra, không nói gặp trực tiếp." },
      { id: "p7-12-3", text: "Which requirement does Ms. Abara NOT fully meet?", options: [
          "Years of experience", "The educational field", "Weekend availability", "Knowledge of provincial rules"], ans: 1,
        exp: "Câu nối hai văn bản: tin tuyển yêu cầu bằng food science, email nói bà có bằng chemistry. Ba yêu cầu còn lại đều được email đáp ứng rõ ràng." },
      { id: "p7-12-4", text: "What does Ms. Abara mention about her current position?", options: [
          "She supervises a team.", "She writes reports for inspectors.", "She works only on weekends.", "She recently transferred departments."], ans: 1,
        exp: "\"wrote the monthly reports submitted to provincial inspectors\" — cũng chính là kinh nghiệm khớp với công việc mới." },
      { id: "p7-12-5", text: "What is suggested about Ms. Abara's application?", options: [
          "It was submitted before the deadline.", "It was sent to the wrong address.", "It arrived without a résumé.", "It was requested by a manager."], ans: 0,
        exp: "Email đề ngày 18/11, hạn nộp là 30/11 → nộp đúng hạn. Đây là dạng câu bắt so ngày giữa hai văn bản." },
    ],
  },
  {
    id: "p7-13", part: 7, group: "triple", kind: "Triple passage", title: "Northern Logistics Forum",
    bodyA: `NORTHERN LOGISTICS FORUM — 4–5 March, Harbour Convention Centre

Two days of talks and workshops for supply-chain professionals. Registration includes all sessions, lunch on both days, and the Wednesday evening reception.

Early registration (before 15 January) — $220
Standard registration — $290
Student rate (with valid ID) — $95

Workshops have limited seats and must be selected when you register.`,
    bodyB: `DAY 1 — WEDNESDAY 4 MARCH
09:00  Opening remarks — R. Sandoval
10:00  Keynote: Rethinking last-mile delivery — Dr. P. Whitfield
13:30  Workshop A: Warehouse automation basics (40 seats)
15:30  Workshop B: Negotiating with carriers (25 seats)
18:00  Evening reception

DAY 2 — THURSDAY 5 MARCH
09:30  Panel: Regional customs updates
11:00  Workshop C: Demand forecasting (25 seats)
14:00  Closing session — R. Sandoval`,
    bodyC: `To: registration@nlforum.example
From: h.tran@meridianfreight.example
Date: 9 January
Subject: Registration for two attendees

Hello,

I would like to register two colleagues from Meridian Freight at the current rate. Both would like to attend the Wednesday workshop on automation.

One of them, Ms. Bui, must travel home on Wednesday evening and will miss the second day entirely. Is a one-day rate available, or should she pay the full fee?

Could you also confirm whether the reception requires a separate ticket?

Thank you,
Hoa Tran`,
    questions: [
      { id: "p7-13-1", text: "What does the registration fee include?", options: [
          "Accommodation near the venue", "Lunch on both days", "A recording of the sessions", "Transport from the airport"], ans: 1,
        exp: "\"Registration includes all sessions, lunch on both days, and the Wednesday evening reception.\" Ba phương án còn lại không hề xuất hiện." },
      { id: "p7-13-2", text: "What rate will the Meridian Freight employees most likely pay?", options: [
          "$95", "$220", "$290", "$440"], ans: 1,
        exp: "Email đề ngày 9 January, tức trước mốc 15 January → hưởng giá early $220. Câu nối hai văn bản dựa vào ngày tháng." },
      { id: "p7-13-3", text: "Which workshop do Ms. Tran's colleagues want to attend?", options: [
          "Workshop A", "Workshop B", "Workshop C", "Both A and B"], ans: 0,
        exp: "Email nói \"the Wednesday workshop on automation\"; tra lịch thấy Workshop A là Warehouse automation basics, diễn ra thứ Tư." },
      { id: "p7-13-4", text: "What is suggested about Ms. Bui?", options: [
          "She will miss the closing session.", "She has attended the forum before.", "She will lead a workshop.", "She is registering as a student."], ans: 0,
        exp: "Bà về nhà tối thứ Tư nên vắng toàn bộ ngày 2; theo lịch, closing session nằm lúc 14:00 ngày 5 March. Câu này bắt ghép email với bảng lịch." },
      { id: "p7-13-5", text: "What does Ms. Tran ask about the reception?", options: [
          "Whether it is held off site", "Whether an extra ticket is needed", "Whether guests may attend", "Whether food will be served"], ans: 1,
        exp: "\"confirm whether the reception requires a separate ticket\". Lưu ý văn bản 1 đã trả lời sẵn là có bao gồm — nhưng câu hỏi hỏi bà ấy hỏi gì, không hỏi đáp án đúng." },
    ],
  },
  {
    id: "p7-14", part: 7, group: "triple", kind: "Triple passage", title: "Ferndale Books expansion",
    bodyA: `MILLBROOK — Ferndale Books will open a second shop on Cedar Street in April, owner Grace Ubalde announced last week.

The original shop, opened in 2016, has grown from a single room into the town's main venue for author readings. The new location will be nearly three times larger and will include a small café.

"We ran out of room for events two years ago," Ms. Ubalde said. "The new shop is designed around them."

Renovation work begins in January and is expected to take ten weeks.`,
    bodyB: `To: g.ubalde@ferndalebooks.example
From: orders@crestfurnishings.example
Date: 6 February
Subject: Quotation 5512 — café seating

Dear Ms. Ubalde,

Thank you for visiting our showroom. The quotation below covers seating for the café area only; the shelving units are quoted separately.

We can deliver within three weeks of receiving your order. If you order before 20 February, we will apply a 10 percent discount on the tables.

Please note that our vans cannot access Cedar Street before 9:00 A.M. because of the morning market, so delivery would be scheduled for late morning.

Regards,
Dev Raman`,
    bodyC: `CREST FURNISHINGS — Quotation 5512
Prepared for: Ferndale Books, Cedar Street

12 café chairs .................... $960.00
4 round tables .................... $720.00
1 counter stool set (3) ........... $285.00
Delivery and assembly ............. $150.00
                       Subtotal: $2,115.00`,
    questions: [
      { id: "p7-14-1", text: "What is the article mainly about?", options: [
          "The expansion of a local business", "The closing of a bookshop", "A change of ownership", "A new author reading series"], ans: 0,
        exp: "Cả bài xoay quanh việc mở cửa hàng thứ hai. (D) là bẫy chi tiết: sự kiện đọc sách chỉ giải thích lý do cần chỗ rộng hơn." },
      { id: "p7-14-2", text: "According to Ms. Ubalde, why is the new shop needed?", options: [
          "Rent increased at the old location.", "The shop lacked space for events.", "The building was sold.", "Book sales have fallen."], ans: 1,
        exp: "\"We ran out of room for events two years ago.\" Lời dẫn trực tiếp thường chứa đáp án cho câu hỏi lý do." },
      { id: "p7-14-3", text: "What is quoted separately from quotation 5512?", options: [
          "Delivery", "The counter stools", "The shelving units", "Assembly"], ans: 2,
        exp: "Email nói báo giá chỉ gồm ghế ngồi khu café, phần kệ báo giá riêng; bảng giá cũng không có dòng nào cho kệ. Câu nối văn bản 2 và 3." },
      { id: "p7-14-4", text: "If Ms. Ubalde orders on 15 February, which amount will be reduced?", options: [
          "$960.00", "$720.00", "$285.00", "$150.00"], ans: 1,
        exp: "Ưu đãi 10% chỉ áp cho tables; tra bảng thấy 4 round tables là $720.00. Đây là câu bắt ghép điều kiện ở văn bản 2 với con số ở văn bản 3." },
      { id: "p7-14-5", text: "What is indicated about deliveries to Cedar Street?", options: [
          "They cost extra on weekends.", "They cannot arrive early in the morning.", "They must be signed for by the owner.", "They take three months to arrange."], ans: 1,
        exp: "Xe tải không vào được trước 9:00 sáng vì chợ. (D) sai chi tiết: ba tuần chứ không phải ba tháng — bẫy đổi đơn vị thời gian." },
    ],
  },
  {
    id: "p7-15", part: 7, group: "triple", kind: "Triple passage", title: "Printer replacement",
    bodyA: `MEMO
To: All Department Heads
From: Operations
Date: 2 May
Re: Printer replacement

Our current printers are out of warranty, and repair costs rose sharply last year. We will replace all twelve units before the end of the quarter.

Each department head should tell us by 16 May how many colour pages the department prints in a typical month. Departments printing more than 2,000 colour pages will receive the higher-capacity model.`,
    bodyB: `PRINTER OPTIONS — reviewed by Operations

Model        Colour pages/month    Price per unit    Warranty
Alta 200          1,500                 $640           2 years
Alta 400          3,000                 $910           3 years
Corvus X            800                 $520           1 year
Corvus XL         2,500               $1,050           3 years`,
    bodyC: `To: operations@company.example
From: d.moreau@company.example
Date: 14 May
Subject: Design department figures

Hi,

We print about 2,400 colour pages a month, and that number climbs to roughly 3,200 in the weeks before a campaign launch.

Given those peaks, I would rather not be at the limit of the machine. Could we be assigned the model with the highest monthly capacity, even if it costs more?

Also, our current printer is only three years old. Could it be moved to a department with lighter use instead of being discarded?

Thanks,
Daniel Moreau`,
    questions: [
      { id: "p7-15-1", text: "Why will the printers be replaced?", options: [
          "They are no longer produced.", "Repairs have become expensive.", "Staff requested faster machines.", "The office is moving."], ans: 1,
        exp: "\"out of warranty, and repair costs rose sharply last year\" — hai lý do đều liên quan tới chi phí sửa chữa." },
      { id: "p7-15-2", text: "What are department heads asked to provide?", options: [
          "A budget estimate", "Their monthly colour printing volume", "A list of broken equipment", "Approval from Finance"], ans: 1,
        exp: "\"tell us by 16 May how many colour pages the department prints in a typical month\". (A) là bẫy vì giá chỉ xuất hiện ở bảng so sánh." },
      { id: "p7-15-3", text: "Which model does Mr. Moreau most likely want?", options: [
          "Alta 200", "Alta 400", "Corvus X", "Corvus XL"], ans: 1,
        exp: "Ông xin máy có công suất tháng cao nhất; tra bảng thấy Alta 400 đạt 3,000 trang — cao nhất. Corvus XL đắt hơn nhưng chỉ 2,500 nên là bẫy \"đắt hơn thì mạnh hơn\"." },
      { id: "p7-15-4", text: "What does the memo suggest about the Design department?", options: [
          "It will keep its current printer.", "It qualifies for the higher-capacity model.", "It must share a printer with another team.", "It has exceeded its budget."], ans: 1,
        exp: "Quy định: in trên 2,000 trang màu thì được máy công suất cao; email báo 2,400 trang. Câu nối memo với email." },
      { id: "p7-15-5", text: "What additional request does Mr. Moreau make?", options: [
          "To postpone the replacement", "To reassign the old printer to another department", "To order extra ink cartridges", "To extend the reporting deadline"], ans: 1,
        exp: "\"Could it be moved to a department with lighter use instead of being discarded?\" (A) đi ngược ý ông vì ông chỉ muốn đổi sang máy mạnh hơn." },
    ],
  },
];

/* ---------- 1.5 NGỮ PHÁP — 9 chuyên đề theo tần suất ra đề ----------
   questions dùng đúng format Part 5 nên cũng được rút vào đề thi thử.  */
const GRAMMAR = [
  {
    id: "g1", name: "Từ loại", freq: "8–10 câu/đề", level: "Nền tảng",
    intro: "Khoảng một phần ba câu Part 5 chỉ hỏi từ loại. Nhìn 4 đáp án thấy cùng gốc khác đuôi thì không cần dịch cả câu — chỉ cần xét vị trí chỗ trống.",
    rules: [
      { h: "Nhận biết qua đuôi từ", lines: [
        "Danh từ: -tion, -ment, -ness, -ity, -ance/-ence, -er/-or, -ist",
        "Động từ: -ize, -ify, -en, -ate",
        "Tính từ: -ful, -less, -ive, -able, -ous, -al, -ic",
        "Trạng từ: -ly (nhưng likely, friendly, costly là TÍNH TỪ)"] },
      { h: "Nhận biết qua vị trí", lines: [
        "Sau a / an / the / sở hữu cách → danh từ",
        "Trước danh từ, hoặc sau be, seem, become, remain, prove → tính từ",
        "Sau động từ thường, hoặc giữa be và V-ed → trạng từ",
        "Sau giới từ (of, for, in…) → danh từ hoặc V-ing"] },
    ],
    traps: [
      "Thấy \"be\" là chọn ngay tính từ — sai khi sau đó còn V-ed (be thoroughly inspected).",
      "responsible / responsive, economic / economical, considerable / considerate: cùng gốc nhưng khác nghĩa hoàn toàn."],
    questions: [
      { id: "g1-1", text: "The company's ______ to renewable energy has attracted new investors.", options: ["commit", "commits", "commitment", "committed"], ans: 2,
        exp: "Sau sở hữu cách \"company's\" cần danh từ: commitment. (A), (B) là động từ, (D) là phân từ." },
      { id: "g1-2", text: "Ms. Ito reviewed the contract ______ before signing it.", options: ["careful", "carefully", "care", "caring"], ans: 1,
        exp: "Bổ nghĩa cho động từ \"reviewed\" → trạng từ carefully. Sau một động từ đã có tân ngữ đầy đủ, chỗ trống gần như luôn là trạng từ." },
      { id: "g1-3", text: "The training program has proven highly ______ for new employees.", options: ["benefit", "beneficial", "beneficially", "benefiting"], ans: 1,
        exp: "prove là động từ nối (linking verb) nên theo sau là tính từ: beneficial. \"highly\" là trạng từ bổ nghĩa cho tính từ, không đổi được vị trí này." },
      { id: "g1-4", text: "All visitors must show ______ at the reception desk.", options: ["identify", "identifiable", "identification", "identified"], ans: 2,
        exp: "Sau động từ \"show\" cần tân ngữ, tức danh từ: identification. (A) làm câu có hai động từ nguyên mẫu liên tiếp." },
      { id: "g1-5", text: "The manager responded ______ to the customer's complaint.", options: ["prompt", "promptly", "promptness", "prompted"], ans: 1,
        exp: "respond là nội động từ, sau nó không có tân ngữ mà là trạng từ: promptly. Đây là mẫu câu ra đi ra lại trong Part 5." },
      { id: "g1-6", text: "The new packaging design was praised for its ______.", options: ["simple", "simply", "simplicity", "simplify"], ans: 2,
        exp: "Sau tính từ sở hữu \"its\" cần danh từ: simplicity. Cụm \"praised for + N\" cũng đòi danh từ." },
      { id: "g1-7", text: "Employees are encouraged to work ______ with other departments.", options: ["cooperate", "cooperative", "cooperatively", "cooperation"], ans: 2,
        exp: "Bổ nghĩa cho \"work\" → trạng từ cooperatively. (B) tính từ chỉ đứng trước danh từ hoặc sau be." },
      { id: "g1-8", text: "The engineer gave a ______ explanation of the new system.", options: ["detail", "detailed", "detailing", "details"], ans: 1,
        exp: "Giữa mạo từ \"a\" và danh từ \"explanation\" là vị trí của tính từ: detailed. (C) detailing mang nghĩa chủ động, không hợp." },
    ],
  },
  {
    id: "g2", name: "Dạng động từ", freq: "3–4 câu/đề", level: "Nền tảng",
    intro: "Sau một động từ khác, động từ thứ hai phải đổi dạng: to V, V-ing hoặc V nguyên mẫu. Cách duy nhất là thuộc nhóm.",
    rules: [
      { h: "Theo sau là to V", lines: [
        "decide, plan, agree, offer, refuse, hope, expect, promise, fail, manage",
        "be able / be likely / be expected / be designed / be required + to V"] },
      { h: "Theo sau là V-ing", lines: [
        "suggest, recommend, consider, avoid, finish, enjoy, mind, postpone, deny",
        "look forward to, be used to, be committed to, object to + V-ing (\"to\" ở đây là giới từ)"] },
      { h: "Theo sau là V nguyên mẫu", lines: [
        "let, make, have (sai khiến) + tân ngữ + V nguyên mẫu",
        "help + tân ngữ + (to) V — dùng cách nào cũng đúng"] },
    ],
    traps: [
      "look forward to + V-ing chứ không phải to V — bẫy kinh điển vì nhìn thấy \"to\".",
      "Sau modal (must, should, will, can) luôn là V nguyên mẫu, không bao giờ là to V."],
    questions: [
      { id: "g2-1", text: "The committee decided ______ the product launch until spring.", options: ["delay", "delaying", "to delay", "delayed"], ans: 2,
        exp: "decide + to V. (B) là bẫy vì nhiều động từ khác dùng V-ing, nhưng decide thì không." },
      { id: "g2-2", text: "We look forward to ______ from you at your earliest convenience.", options: ["hear", "hearing", "heard", "be heard"], ans: 1,
        exp: "\"to\" trong look forward to là giới từ nên theo sau phải là V-ing: hearing. Đây là câu bẫy hay gặp nhất trong nhóm dạng động từ." },
      { id: "g2-3", text: "Mr. Ramos suggested ______ the meeting to Thursday morning.", options: ["move", "to move", "moving", "moved"], ans: 2,
        exp: "suggest + V-ing (hoặc suggest that S + V nguyên mẫu). Không bao giờ dùng suggest + to V." },
      { id: "g2-4", text: "The manual is designed ______ new technicians quickly.", options: ["train", "to train", "training", "trained"], ans: 1,
        exp: "be designed + to V = được thiết kế để. Nhóm be + V-ed + to V (be required, be expected, be intended) rất hay ra." },
      { id: "g2-5", text: "Please avoid ______ the emergency exit at any time.", options: ["block", "to block", "blocking", "blocked"], ans: 2,
        exp: "avoid + V-ing. (B) sai vì avoid không bao giờ đi với to V." },
      { id: "g2-6", text: "The supervisor let the team ______ an hour early on Friday.", options: ["leave", "to leave", "leaving", "left"], ans: 0,
        exp: "let + tân ngữ + V nguyên mẫu (không \"to\"). So sánh: allow the team TO leave — cùng nghĩa nhưng khác cấu trúc." },
    ],
  },
  {
    id: "g3", name: "Thì và hoà hợp chủ vị", freq: "3–5 câu/đề", level: "Nền tảng",
    intro: "Đề luôn cài sẵn một dấu hiệu thời gian. Tìm dấu hiệu trước, chọn thì sau — đừng dịch cả câu.",
    rules: [
      { h: "Dấu hiệu thời gian", lines: [
        "since + mốc / for + khoảng / over the past… → hiện tại hoàn thành",
        "last week, yesterday, in 2019, ago → quá khứ đơn",
        "next month, tomorrow, as of… → tương lai",
        "By the time / By next year + mốc tương lai → tương lai hoàn thành"] },
      { h: "Hoà hợp chủ vị", lines: [
        "Each / Every / Either / Neither + N số ít → động từ số ít",
        "Neither A nor B / Either A or B → chia theo danh từ GẦN NHẤT",
        "Cụm giới từ chen giữa (The list of items IS…) không đổi chủ ngữ"] },
    ],
    traps: [
      "Mệnh đề bắt đầu bằng when, as soon as, before, after, until chỉ tương lai vẫn dùng hiện tại đơn.",
      "\"The number of\" + số ít, nhưng \"A number of\" + số nhiều."],
    questions: [
      { id: "g3-1", text: "By the time the shipment arrives, the store ______ for the day.", options: ["will close", "will have closed", "has closed", "closed"], ans: 1,
        exp: "\"By the time\" + hiện tại đơn ở mệnh đề phụ → mệnh đề chính dùng tương lai hoàn thành: will have closed (đóng cửa xong TRƯỚC khi hàng tới)." },
      { id: "g3-2", text: "Each of the departments ______ its own training budget.", options: ["manage", "manages", "are managing", "have managed"], ans: 1,
        exp: "Each of + danh từ số nhiều vẫn là chủ ngữ số ít → manages. \"the departments\" chỉ là cụm giới từ, không phải chủ ngữ." },
      { id: "g3-3", text: "Ms. Okonkwo ______ the Tokyo office since March.", options: ["manages", "managed", "has managed", "will manage"], ans: 2,
        exp: "\"since March\" là dấu hiệu bắt buộc của hiện tại hoàn thành. (B) quá khứ đơn không đi được với since." },
      { id: "g3-4", text: "The technicians ______ the equipment when the power suddenly failed.", options: ["test", "were testing", "have tested", "will test"], ans: 1,
        exp: "Hành động đang diễn ra thì bị cắt ngang → quá khứ tiếp diễn. Cặp \"was/were V-ing when + quá khứ đơn\" là mẫu cố định." },
      { id: "g3-5", text: "Neither the manager nor the assistants ______ available this afternoon.", options: ["is", "are", "was", "has been"], ans: 1,
        exp: "Neither A nor B chia theo danh từ gần nhất — ở đây là \"the assistants\" số nhiều → are. Đảo lại thứ tự thì đáp án cũng đảo." },
      { id: "g3-6", text: "Last quarter, the company ______ three new branches in the region.", options: ["opens", "has opened", "opened", "will open"], ans: 2,
        exp: "\"Last quarter\" là mốc quá khứ xác định → quá khứ đơn. (B) là bẫy vì hiện tại hoàn thành không đi với mốc quá khứ cụ thể." },
    ],
  },
  {
    id: "g4", name: "Câu bị động", freq: "2–3 câu/đề", level: "Nền tảng",
    intro: "Hỏi một câu duy nhất: chủ ngữ tự làm hành động, hay bị làm? Vật vô tri gần như luôn ở thể bị động.",
    rules: [
      { h: "Công thức", lines: [
        "be + V-ed (was sent, is required, will be shipped)",
        "modal + be + V-ed (must be submitted, may be returned)",
        "hoàn thành: have/has been + V-ed"] },
      { h: "Dấu hiệu chọn bị động", lines: [
        "Sau chỗ trống KHÔNG có tân ngữ → nhiều khả năng bị động",
        "Chủ ngữ là tài liệu, đơn hàng, thiết bị, phòng họp… → bị động",
        "Có \"by + người/tổ chức\" phía sau → bị động"] },
    ],
    traps: [
      "Rút gọn mệnh đề quan hệ: the room located on the third floor (bị động, bỏ which is).",
      "Một số động từ trông bị động nhưng là tính từ: be interested in, be involved in, be located at."],
    questions: [
      { id: "g4-1", text: "The new safety guidelines ______ to all staff last week.", options: ["distributed", "were distributed", "have distributing", "distributing"], ans: 1,
        exp: "Hướng dẫn được phát chứ không tự phát, và \"last week\" là quá khứ → were distributed. (A) chủ động sẽ thiếu tân ngữ." },
      { id: "g4-2", text: "Your order ______ as soon as payment is confirmed.", options: ["will ship", "will be shipped", "shipped", "is shipping"], ans: 1,
        exp: "Đơn hàng được gửi đi → bị động tương lai. Lưu ý mệnh đề \"as soon as\" đã dùng hiện tại đơn thay cho tương lai." },
      { id: "g4-3", text: "Applicants ______ to submit two letters of reference.", options: ["require", "are required", "requiring", "requirement"], ans: 1,
        exp: "be required to V = được yêu cầu phải. (A) chủ động sẽ có nghĩa ứng viên đi yêu cầu người khác — sai logic." },
      { id: "g4-4", text: "The conference room ______ for renovation until 12 May.", options: ["closes", "is closing", "will be closed", "has closed"], ans: 2,
        exp: "Phòng được đóng để sửa → bị động. (A) và (D) chủ động khiến phòng tự đóng cửa." },
      { id: "g4-5", text: "The quarterly report must ______ before Friday afternoon.", options: ["submit", "be submitted", "submitting", "submitted"], ans: 1,
        exp: "modal + be + V-ed. (D) thiếu \"be\" nên sai cấu trúc — đây là bẫy hay gặp nhất ở dạng bị động có modal." },
    ],
  },
  {
    id: "g5", name: "Liên từ và giới từ", freq: "3–4 câu/đề", level: "Trọng tâm",
    intro: "Không cần dịch nghĩa trước. Nhìn phía sau chỗ trống: có S + V thì chọn liên từ, chỉ có cụm danh từ thì chọn giới từ.",
    rules: [
      { h: "Cặp cùng nghĩa, khác loại", lines: [
        "because (liên từ) ↔ because of / due to (giới từ)",
        "although / even though (liên từ) ↔ despite / in spite of (giới từ)",
        "while / when (liên từ) ↔ during (giới từ)",
        "so that (liên từ) ↔ for / in order to (giới từ, to V)"] },
      { h: "Cặp liên từ tương quan", lines: [
        "both A and B · either A or B · neither A nor B",
        "not only A but also B"] },
    ],
    traps: [
      "\"despite of\" luôn sai — chỉ có despite hoặc in spite of.",
      "however, therefore, nevertheless là trạng từ nối, không nối được hai mệnh đề bằng dấu phẩy."],
    questions: [
      { id: "g5-1", text: "______ the software update, several users reported slower performance.", options: ["Although", "Since", "Following", "Whereas"], ans: 2,
        exp: "Sau chỗ trống là cụm danh từ \"the software update\" → cần giới từ: Following (= sau). (A), (D) là liên từ, cần S + V." },
      { id: "g5-2", text: "The store will remain open ______ the renovation is being completed.", options: ["during", "while", "despite", "because of"], ans: 1,
        exp: "Sau chỗ trống có mệnh đề đầy đủ → liên từ while. (A) during là giới từ, chỉ đi với danh từ (during the renovation)." },
      { id: "g5-3", text: "______ his limited experience, Mr. Patel was selected for the role.", options: ["Even though", "Despite", "However", "Because"], ans: 1,
        exp: "\"his limited experience\" là cụm danh từ → giới từ chỉ sự nhượng bộ: Despite. (A) đúng nghĩa nhưng sai loại từ." },
      { id: "g5-4", text: "The shipment was delayed ______ an unexpected customs inspection.", options: ["because", "due to", "although", "so"], ans: 1,
        exp: "Theo sau là cụm danh từ → due to. (A) because cần mệnh đề: because an inspection WAS carried out." },
      { id: "g5-5", text: "Ms. Chen will lead the project ______ Mr. Alvarez returns from leave.", options: ["until", "by", "during", "among"], ans: 0,
        exp: "until vừa là liên từ vừa hợp nghĩa \"cho đến khi\". (B) by là giới từ chỉ hạn chót, không đi với mệnh đề." },
      { id: "g5-6", text: "The proposal was rejected ______ it exceeded the approved budget.", options: ["because of", "despite", "because", "in spite of"], ans: 2,
        exp: "Sau chỗ trống là \"it exceeded…\" tức S + V → liên từ because. Ba phương án còn lại đều là giới từ." },
      { id: "g5-7", text: "______ registering online, participants may sign up at the front desk.", options: ["Instead", "Instead of", "Rather", "Nevertheless"], ans: 1,
        exp: "instead of + V-ing = thay vì. (A) instead là trạng từ, đứng một mình cuối câu; (D) là trạng từ nối." },
    ],
  },
  {
    id: "g6", name: "Mệnh đề quan hệ", freq: "1–2 câu/đề", level: "Trung cấp",
    intro: "Xác định danh từ đứng trước chỗ trống là người hay vật, rồi xem sau chỗ trống thiếu chủ ngữ hay thiếu tân ngữ.",
    rules: [
      { h: "Chọn đại từ quan hệ", lines: [
        "Người: who (chủ ngữ) / whom (tân ngữ) / whose (sở hữu)",
        "Vật: which, that — whose vẫn dùng được cho vật",
        "Nơi chốn: where · thời gian: when · lý do: why"] },
      { h: "Quy tắc dấu phẩy", lines: [
        "Sau dấu phẩy KHÔNG bao giờ dùng that",
        "Sau chỗ trống thiếu chủ ngữ → who/which/that; đủ chủ ngữ rồi → whom/which/whose"] },
    ],
    traps: [
      "whose + danh từ (không có mạo từ ở giữa): the consultant whose report…",
      "where chỉ dùng khi sau nó là mệnh đề đầy đủ; nếu thiếu chủ ngữ phải dùng which."],
    questions: [
      { id: "g6-1", text: "The consultant ______ report was published yesterday will speak at the seminar.", options: ["who", "whom", "whose", "which"], ans: 2,
        exp: "Sau chỗ trống là danh từ trần \"report\" (không mạo từ) → sở hữu: whose. (A) who cần đi kèm động từ ngay sau." },
      { id: "g6-2", text: "Employees ______ complete the survey will receive a gift voucher.", options: ["who", "whom", "which", "whose"], ans: 0,
        exp: "Danh từ chỉ người + sau chỗ trống thiếu chủ ngữ cho \"complete\" → who. (B) whom chỉ dùng khi đã có chủ ngữ khác." },
      { id: "g6-3", text: "The building, ______ was constructed in 1975, will be renovated next year.", options: ["that", "which", "who", "where"], ans: 1,
        exp: "Có dấu phẩy nên loại that ngay; danh từ là vật nên dùng which. Quy tắc \"sau phẩy không dùng that\" giải quyết câu này trong 5 giây." },
      { id: "g6-4", text: "This is the warehouse ______ the damaged goods are currently stored.", options: ["which", "that", "where", "whose"], ans: 2,
        exp: "Sau chỗ trống là mệnh đề đầy đủ (the goods are stored) và danh từ chỉ nơi chốn → where. (A), (B) chỉ dùng khi mệnh đề còn thiếu thành phần." },
      { id: "g6-5", text: "The date ______ the current contract expires has not been confirmed.", options: ["when", "which", "what", "who"], ans: 0,
        exp: "Danh từ chỉ thời gian + mệnh đề đầy đủ phía sau → when. (C) what không bao giờ làm đại từ quan hệ." },
    ],
  },
  {
    id: "g7", name: "So sánh", freq: "1–2 câu/đề", level: "Trung cấp",
    intro: "Chỉ cần tìm từ khoá: thấy than là so sánh hơn, thấy the hoặc of the three là so sánh nhất, thấy as…as là so sánh bằng.",
    rules: [
      { h: "Ba dạng", lines: [
        "Hơn: adj-er / more + adj + than",
        "Nhất: the + adj-est / the most + adj (+ in / of)",
        "Bằng: as + adj nguyên cấp + as"] },
      { h: "Trạng từ bổ nghĩa so sánh hơn", lines: [
        "much, far, significantly, considerably, slightly + so sánh hơn",
        "KHÔNG dùng very, so, too với so sánh hơn"] },
    ],
    traps: [
      "twice / three times + as + adj + as (gấp đôi, gấp ba).",
      "the + so sánh hơn + …, the + so sánh hơn + … (càng… càng…)."],
    questions: [
      { id: "g7-1", text: "The XR-5 model is ______ efficient than the previous version.", options: ["much", "more", "most", "very"], ans: 1,
        exp: "Có \"than\" → bắt buộc so sánh hơn: more efficient. (A) much chỉ bổ nghĩa cho dạng so sánh đã có sẵn (much more efficient)." },
      { id: "g7-2", text: "Nordwind is the ______ reliable supplier we have ever worked with.", options: ["more", "most", "much", "very"], ans: 1,
        exp: "Có mạo từ \"the\" và mệnh đề \"we have ever worked with\" → so sánh nhất: the most reliable." },
      { id: "g7-3", text: "The new office is twice ______ large as the previous one.", options: ["as", "so", "more", "very"], ans: 0,
        exp: "Cấu trúc twice as + adj + as = gấp đôi. Có chữ \"as\" thứ hai ở cuối câu là dấu hiệu bắt buộc." },
      { id: "g7-4", text: "Of the three proposals submitted, Ms. Duval's was ______.", options: ["detailed", "more detailed", "the most detailed", "detail"], ans: 2,
        exp: "\"Of the three\" so sánh từ ba đối tượng trở lên → so sánh nhất. (B) chỉ dùng khi so hai đối tượng." },
      { id: "g7-5", text: "Attendance this year was ______ higher than it was last year.", options: ["very", "too", "significantly", "so"], ans: 2,
        exp: "Trước dạng so sánh hơn \"higher\" phải dùng trạng từ như significantly, much, far. very / so / too không bao giờ đứng trước so sánh hơn." },
    ],
  },
  {
    id: "g8", name: "Đại từ và giới từ thông dụng", freq: "2–4 câu/đề", level: "Nền tảng",
    intro: "Hai nhóm này cho điểm gần như miễn phí: chỉ cần nhớ bảng dạng đại từ và vài giới từ thời gian cơ bản.",
    rules: [
      { h: "Bảng đại từ", lines: [
        "Chủ ngữ: I, he, she, they — Tân ngữ: me, him, her, them",
        "Sở hữu + N: my, his, her, their — Sở hữu đứng một mình: mine, his, hers, theirs",
        "Phản thân: myself, himself, themselves (khi chủ ngữ và tân ngữ trùng nhau)"] },
      { h: "Giới từ thời gian và nơi chốn", lines: [
        "at + giờ, at night · on + ngày, thứ · in + tháng, năm, buổi",
        "by = trước hoặc đúng hạn · until = kéo dài cho đến",
        "in + không gian kín · on + bề mặt · at + một điểm"] },
    ],
    traps: [
      "by Friday (hạn chót) khác until Friday (kéo dài tới hết thứ Sáu).",
      "Sau giới từ luôn dùng đại từ tân ngữ: between you and ME, không phải I."],
    questions: [
      { id: "g8-1", text: "Anyone interested in the position should send ______ résumé to Human Resources.", options: ["they", "their", "theirs", "them"], ans: 1,
        exp: "Trước danh từ \"résumé\" cần tính từ sở hữu: their. (C) theirs đứng một mình, không kèm danh từ." },
      { id: "g8-2", text: "The design team completed the entire campaign by ______.", options: ["they", "them", "themselves", "their"], ans: 2,
        exp: "by oneself = tự mình. Chủ ngữ và đối tượng trùng nhau nên dùng đại từ phản thân themselves." },
      { id: "g8-3", text: "The orientation session will begin ______ 9:00 A.M. in the main hall.", options: ["in", "on", "at", "by"], ans: 2,
        exp: "at + giờ cụ thể. (B) on đi với ngày/thứ, (A) in đi với tháng/năm/buổi." },
      { id: "g8-4", text: "Please submit the completed form ______ Friday at the latest.", options: ["until", "by", "since", "for"], ans: 1,
        exp: "by = hạn chót, hợp với \"at the latest\". until nghĩa kéo dài liên tục cho đến, không dùng cho việc nộp một lần." },
      { id: "g8-5", text: "The archived contracts are stored ______ the cabinet next to the window.", options: ["on", "at", "in", "to"], ans: 2,
        exp: "in + không gian kín như tủ, ngăn kéo, phòng. (A) on chỉ bề mặt (on the cabinet = đặt trên nóc tủ)." },
      { id: "g8-6", text: "Ms. Haddad and ______ will represent the company at the trade fair.", options: ["I", "me", "my", "mine"], ans: 0,
        exp: "Chỗ trống là một phần của chủ ngữ kép → đại từ chủ ngữ I. Mẹo: bỏ \"Ms. Haddad and\" đi, còn lại phải đọc xuôi là \"I will represent\"." },
    ],
  },
  {
    id: "g9", name: "Điều kiện và giả định", freq: "1–2 câu/đề", level: "Nâng cao",
    intro: "Nhóm ít câu nhất nhưng dễ ăn điểm vì công thức cố định, đặc biệt là giả định thức sau recommend, suggest, require.",
    rules: [
      { h: "Câu điều kiện", lines: [
        "Loại 1: If + hiện tại đơn, S + will + V (có thật ở tương lai)",
        "Loại 2: If + quá khứ đơn, S + would + V (trái hiện tại)",
        "Loại 3: If + had + V-ed, S + would have + V-ed (trái quá khứ)"] },
      { h: "Giả định thức", lines: [
        "recommend / suggest / request / require / insist / demand + that + S + V nguyên mẫu",
        "It is essential / important / necessary + that + S + V nguyên mẫu",
        "Không chia số ít số nhiều, không thêm s, phủ định là that S not V"] },
    ],
    traps: [
      "Sau \"If\" ở loại 1 tuyệt đối không dùng will.",
      "Giả định thức giữ nguyên mẫu kể cả khi chủ ngữ số ít: recommend that he COMPLETE."],
    questions: [
      { id: "g9-1", text: "If the replacement parts ______ tomorrow, assembly can begin on Monday.", options: ["arrive", "will arrive", "arrived", "would arrive"], ans: 0,
        exp: "Điều kiện loại 1: sau If dùng hiện tại đơn dù nói về tương lai. (B) là bẫy phổ biến nhất của dạng này." },
      { id: "g9-2", text: "The director recommended that the deadline ______ extended by one week.", options: ["is", "be", "was", "will be"], ans: 1,
        exp: "recommend that + S + V nguyên mẫu; ở thể bị động là \"be extended\". Không chia theo chủ ngữ, không theo thì của động từ chính." },
      { id: "g9-3", text: "If we ______ more time, we would have tested the prototype twice.", options: ["have", "had", "had had", "would have"], ans: 2,
        exp: "Mệnh đề chính dùng would have tested → điều kiện loại 3, mệnh đề if phải là had + V-ed, tức had had." },
      { id: "g9-4", text: "It is essential that every employee ______ the safety training before July.", options: ["completes", "complete", "completed", "completing"], ans: 1,
        exp: "It is essential that + S + V nguyên mẫu. (A) completes là bẫy hoà hợp chủ vị — với giả định thức thì không thêm s." },
    ],
  },
];

/* ---------- 1.6 Các dạng đề thi thử ----------
   Đề Full RC dựng đúng cấu trúc thật: 30 câu Part 5, 16 câu Part 6,
   54 câu Part 7 (single 24 câu, double 15 câu, triple 15 câu).  */
const TEST_FORMATS = [
  { key: "mini", name: "Mini test", sub: "40 câu · 30 phút", note: "Làm nhanh giữa tuần để giữ nhịp.",
    minutes: 30, p5: 16, p6: 8, p7: { single: 16, double: 0, triple: 0 } },
  { key: "half", name: "Nửa đề RC", sub: "50 câu · 38 phút", note: "Có đủ single, double và triple passage.",
    minutes: 38, p5: 16, p6: 8, p7: { single: 16, double: 5, triple: 5 } },
  { key: "full", name: "Full RC chuẩn TOEIC", sub: "100 câu · 75 phút", note: "Đúng cấu trúc và thời gian phòng thi thật.",
    minutes: 75, p5: 30, p6: 16, p7: { single: 24, double: 15, triple: 15 } },
];

/* Mốc thời gian khuyến nghị trong phòng thi (theo lộ trình) */
const PACE_GUIDE = [
  { part: "Part 5", n: 30, min: 11 },
  { part: "Part 6", n: 16, min: 8 },
  { part: "Part 7 single", n: 24, min: 22 },
  { part: "Part 7 double + triple", n: 30, min: 32 },
];

/* ---------- 1.7 TRANH PART 1 (SVG, khung 240×140) ---------- */

export const SCENE_ART = {
  desk: (a) => (<><path d="M28 96h184" /><path d="M50 96v32M190 96v32" /><circle cx="82" cy="46" r="13" /><path d="M62 96c0-13 9-23 20-23s20 10 20 23" /><path d="M102 84h16" /><path d="M122 96h44l-7-26h-30z" fill={a} stroke={a} /><path d="M116 96h56" /><rect x="180" y="84" width="26" height="12" rx="2" /><path d="M206 84V62l-10-8" /><path d="M186 52h22l-7 10h-8z" fill={a} stroke={a} /></>),
  meeting: (a) => (<><ellipse cx="132" cy="104" rx="64" ry="18" /><circle cx="96" cy="68" r="11" /><path d="M80 94c0-10 7-18 16-18s16 8 16 18" /><circle cx="138" cy="62" r="11" /><path d="M122 88c0-10 7-18 16-18s16 8 16 18" /><circle cx="180" cy="70" r="11" /><path d="M164 96c0-10 7-18 16-18s16 8 16 18" /><rect x="10" y="18" width="48" height="34" rx="3" fill={a} stroke={a} /><path d="M20 30h26M20 40h18" stroke="#fff" /><circle cx="60" cy="76" r="10" /><path d="M46 104c0-9 6-16 14-16s14 7 14 16" /></>),
  boxes: (a) => (<><path d="M130 100V58h58l20 22v20z" /><circle cx="150" cy="110" r="9" /><circle cx="196" cy="110" r="9" /><path d="M188 62h14l14 18h-28z" fill={a} stroke={a} /><circle cx="50" cy="44" r="12" /><path d="M34 100c0-14 7-24 16-24s16 10 16 24" /><path d="M56 68h8" /><rect x="62" y="54" width="30" height="26" rx="2" fill={a} stroke={a} /><path d="M62 67h30" stroke="#fff" /><rect x="96" y="76" width="26" height="24" rx="2" /><rect x="100" y="50" width="26" height="24" rx="2" /><path d="M14 100h200" /></>),
  platform: (a) => (<><path d="M10 112h220" /><circle cx="62" cy="44" r="12" /><path d="M46 100c0-14 7-24 16-24s16 10 16 24" /><path d="M78 72h10v6" /><rect x="88" y="76" width="26" height="34" rx="3" fill={a} stroke={a} /><path d="M94 76v-8h14v8" /><rect x="8" y="72" width="30" height="9" rx="2" /><path d="M12 81v14M34 81v14" /><path d="M152 100V48h58v52z" /><rect x="164" y="58" width="34" height="20" rx="3" fill={a} stroke={a} /><path d="M152 100h60" /></>),
  cafe: (a) => (<><path d="M22 88h198v34H22z" /><circle cx="70" cy="44" r="12" /><path d="M54 88c0-13 7-23 16-23s16 10 16 23" /><circle cx="180" cy="52" r="12" /><path d="M164 122c0-16 7-28 16-28s16 12 16 28" /><path d="M104 88V74h16v14z" fill={a} stroke={a} /><path d="M130 88V74h16v14z" fill={a} stroke={a} /><path d="M120 76c5-1 5 8 0 7" /><rect x="30" y="30" width="30" height="20" rx="3" /><path d="M36 50v8M54 50v8" /></>),
  construction: (a) => (<><path d="M12 120h216" /><path d="M148 120V44h62v76z" /><path d="M96 120L112 44M122 120L138 44" /><path d="M100 104h22M104 86h22M108 68h22M112 50h22" /><circle cx="46" cy="60" r="12" /><path d="M32 48h28l-4-8H36z" fill={a} stroke={a} /><path d="M30 120c0-14 7-24 16-24s16 10 16 24" /><circle cx="78" cy="74" r="10" /><path d="M66 64h24l-4-7H70z" fill={a} stroke={a} /><path d="M64 120c0-12 6-21 14-21s14 9 14 21" /><path d="M206 120l9-20 9 20z" fill={a} stroke={a} /></>),
  office: (a) => (<><path d="M12 118h216" /><rect x="30" y="70" width="52" height="16" rx="2" /><path d="M34 86v32M78 86v32" /><rect x="150" y="70" width="52" height="16" rx="2" /><path d="M154 86v32M198 86v32" /><circle cx="56" cy="48" r="11" /><path d="M40 70c0-9 7-16 16-16s16 7 16 16" /><circle cx="176" cy="48" r="11" /><path d="M160 70c0-9 7-16 16-16s16 7 16 16" /><rect x="44" y="60" width="24" height="10" rx="1" fill={a} stroke={a} /><rect x="164" y="60" width="24" height="10" rx="1" fill={a} stroke={a} /><path d="M108 118V50h8v68z" /><rect x="98" y="34" width="28" height="18" rx="2" fill={a} stroke={a} /></>),
  kitchen: (a) => (<><path d="M18 118h204" /><path d="M24 92h84v26H24z" /><path d="M24 92V78h84v14" /><rect x="40" y="80" width="20" height="10" rx="1" fill={a} stroke={a} /><circle cx="86" cy="85" r="4" /><circle cx="150" cy="46" r="12" /><path d="M134 92c0-14 7-24 16-24s16 10 16 24" /><path d="M166 74h12v8" /><rect x="150" y="92" width="60" height="26" rx="2" /><path d="M150 104h60" /><circle cx="180" cy="60" r="7" /><path d="M180 53v-9" /><path d="M120 118V64" stroke={a} /><path d="M114 64h12l-3 12h-6z" fill={a} stroke={a} /></>),
  park: (a) => (<><path d="M10 116h220" /><path d="M60 116V80" /><circle cx="60" cy="60" r="24" fill={a} stroke={a} /><path d="M180 116V84" /><circle cx="180" cy="66" r="20" fill={a} stroke={a} /><circle cx="112" cy="58" r="11" /><path d="M96 92c0-10 7-18 16-18s16 8 16 18" /><path d="M96 92h32v6H96z" /><rect x="20" y="98" width="30" height="8" rx="2" /><path d="M24 106v8M46 106v8" /><path d="M140 116c8-6 20-6 28 0" /></>),
  store: (a) => (<><path d="M16 118h208" /><path d="M40 118V64h70v54z" /><path d="M40 64l10-16h50l10 16" fill={a} stroke={a} /><rect x="56" y="80" width="16" height="18" rx="1" /><rect x="80" y="80" width="16" height="18" rx="1" /><path d="M64 118v-12M88 118v-12" /><circle cx="168" cy="52" r="12" /><path d="M152 100c0-14 7-24 16-24s16 10 16 24" /><path d="M136 92h20l6 8h-26z" /><path d="M138 92l-2-8h18l2 8" fill={a} stroke={a} /></>),
};

export function SceneArt({ name, dark }) {
  const accent = dark ? "#818cf8" : "#4f46e5";
  const ink = dark ? "#d4d4d4" : "#334155";
  const draw = SCENE_ART[name] || SCENE_ART.desk;
  return (
    <svg viewBox="0 0 240 140" className="w-full" aria-hidden="true">
      <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">{draw(accent)}</g>
    </svg>
  );
}

