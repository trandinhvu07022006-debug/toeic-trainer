import React from "react";

/* ============================================================
   Thành phần dùng chung. Màu nhấn lấy từ biến CSS --accent
   (xanh thông) thay vì mã màu tím cứng như bản cũ.
   ============================================================ */

/* Thanh tiến độ mảnh, bo tròn, tô bằng màu nhấn đặc (không gradient loè). */
export function Bar({ value, T }) {
  return (
    <div className={"w-full h-1.5 rounded-full overflow-hidden " + T.track}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: Math.max(0, Math.min(100, value)) + "%", background: "var(--accent)" }} />
    </div>
  );
}

/* Nút chính: nền màu nhấn đặc, bo vừa phải, đổ bóng nhẹ theo tông xanh.
   Bỏ gradient để trông "chắc" và bớt vẻ mẫu-AI. */
export function Primary({ children, onClick, disabled, className }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ minHeight: 52, background: disabled ? undefined : "var(--accent)" }}
      className={"w-full rounded-xl text-white text-base font-semibold px-5 py-3 shadow-sm active:brightness-95 transition disabled:opacity-40 disabled:bg-slate-400 " + (className || "")}>
      {children}
    </button>
  );
}

/* Nút phụ: viền + nền thẻ, cùng bo góc với nút chính cho nhất quán. */
export function Ghost({ children, onClick, T, className }) {
  return (
    <button onClick={onClick} style={{ minHeight: 48 }}
      className={"rounded-xl border px-4 py-3 text-base font-medium transition-colors " + T.card + " " + T.line + " " + (className || "")}>
      {children}
    </button>
  );
}

/* Nhãn "eyebrow": chữ nhỏ, giãn cách, IN HOA — dùng trên đầu mục để phân tầng
   thông tin theo phong cách trang sách. */
export function Eyebrow({ children, T, className }) {
  return (
    <p className={"text-[11px] font-semibold uppercase tracking-[0.14em] " + T.sub + " " + (className || "")}>
      {children}
    </p>
  );
}

/* Tiêu đề mục: đặt bằng font hiển thị (Fraunces) để mang chất "biên tập". */
export function SectionTitle({ children, T, className }) {
  return <h2 className={"font-display text-xl font-semibold mb-3 " + (className || "")}>{children}</h2>;
}

/* Số thứ tự phần thi, đặt trong khung vuông bo nhẹ — vì Part 1→7 là một chuỗi
   thật nên đánh số ở đây là có nghĩa, không phải trang trí. */
export function PartMark({ n, T, active }) {
  return (
    <span className={"inline-flex items-center justify-center rounded-lg font-display text-sm font-semibold tnum shrink-0 " +
      (active ? "text-white" : "border " + T.line + " " + T.softText)}
      style={{ width: 34, height: 34, background: active ? "var(--accent)" : undefined }}>
      {n}
    </span>
  );
}

/* Đầu trang chuẩn cho các màn cấp một (Nghe, Đọc, Nói, Thi thử, Tiến độ...).
   Có nhãn eyebrow nhỏ phía trên + tiêu đề Fraunces, tạo nhịp phân tầng nhất
   quán giống trang chủ, thay cho <h1> trơ trọi mỗi màn một kiểu. */
export function PageHeader({ eyebrow, title, sub, T, right }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        {eyebrow && <Eyebrow T={T} className="mb-1.5">{eyebrow}</Eyebrow>}
        <h1 className="font-display text-[26px] font-semibold leading-tight">{title}</h1>
        {sub && <p className={"text-sm mt-1 " + T.sub}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* Đầu trang có nút Quay lại — dùng khi đang trong một bài/phần con. */
export function BackHeader({ onBack, title, sub, T }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }}
        className={"flex items-center justify-center rounded-full shrink-0 " + T.soft}>
        <ArrowLeftIcon />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg font-semibold truncate">{title}</p>
        {sub && <p className={"text-sm " + T.sub}>{sub}</p>}
      </div>
    </div>
  );
}

/* Mũi tên quay lại nội tuyến (SVG nhỏ) để BackHeader không phụ thuộc lucide. */
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/* Ô đựng chữ cái đáp án (A/B/C/D). Trạng thái:
   - thường: viền mảnh
   - đang chọn (chưa chấm): nền nhấn, chữ trắng
   - đã chấm đúng: nền xanh lá; đã chấm sai (mình chọn): nền đỏ
   Tách riêng để mọi phần (Nghe, Đọc, Thi thử, Nói) dùng chung một kiểu. */
export function ChoiceBadge({ letter, state, T }) {
  const base = "inline-flex items-center justify-center rounded-lg font-display text-sm font-semibold shrink-0";
  const sz = { width: 30, height: 30 };
  if (state === "correct")
    return <span className={base + " text-white"} style={{ ...sz, background: "#059669" }}>{letter}</span>;
  if (state === "wrong")
    return <span className={base + " text-white"} style={{ ...sz, background: "#e11d48" }}>{letter}</span>;
  if (state === "chosen")
    return <span className={base + " text-white"} style={{ ...sz, background: "var(--accent)" }}>{letter}</span>;
  return <span className={base + " border " + T.line + " " + T.softText} style={sz}>{letter}</span>;
}
