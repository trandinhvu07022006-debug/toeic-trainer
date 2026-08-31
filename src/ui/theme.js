import { useState, useEffect, useCallback } from "react";

/* Chế độ nền sáng/tối.
   Hướng thiết kế mới lấy "trang giấy" làm chủ đạo nên MẶC ĐỊNH là nền SÁNG.
   Vẫn nhớ lựa chọn của người dùng qua localStorage. */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("toeic-theme");
      if (saved === "light") return false;
      if (saved === "dark") return true;
    } catch { /* bỏ qua */ }
    return false; // mặc định sáng (phòng đọc)
  });
  useEffect(() => {
    try { localStorage.setItem("toeic-theme", dark ? "dark" : "light"); } catch { /* bỏ qua */ }
    // Cập nhật màu thanh trạng thái trình duyệt cho khớp nền
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
      || document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#14201d" : "#faf7f0");
  }, [dark]);
  const toggle = useCallback(() => setDark((d) => !d), []);
  return [dark, toggle];
}

/* Giữ tên cũ cho tương thích */
export function usePrefersDark() {
  const [dark] = useDarkMode();
  return dark;
}

/* ============================================================
   Bảng màu "mực & giấy" + nhấn xanh thông.
   Giữ nguyên TÊN token để mọi màn dùng lại không cần sửa,
   chỉ thay GIÁ TRỊ cho diện mạo mới.

   Sáng: nền giấy ấm (#faf7f0), thẻ trắng ngà, chữ mực xanh đen.
   Tối : than pha xanh thông (#14201d), thẻ nhỉnh hơn nền một bậc.
   ============================================================ */
export function theme(d) {
  return {
    // Nền & bề mặt
    app: d ? "bg-[#14201d] text-[#eef2ee]" : "bg-[#faf7f0] text-[#1a2b26]",
    card: d ? "bg-[#1c2a26]" : "bg-white",
    bar: d ? "bg-[#111b18]" : "bg-[#fbf9f4]",
    passage: d ? "bg-[#1c2a26] border-[#2c3e39]" : "bg-white border-[#e7e0d3]",

    // Viền & chữ phụ
    line: d ? "border-[#2c3e39]" : "border-[#e7e0d3]",
    sub: d ? "text-[#9db0a9]" : "text-[#6b7d76]",

    // Nền mềm (chip, ô phụ) + chữ trên nền mềm
    soft: d ? "bg-white/[0.05]" : "bg-[#f1ede3]",
    softText: d ? "text-[#c7d3ce]" : "text-[#3c4f49]",
    track: d ? "bg-white/10" : "bg-[#e7e0d3]",

    // Nhấn — xanh thông
    accentText: d ? "text-[#5cae95]" : "text-[#1f6b57]",
    accentSoft: d ? "bg-[#5cae95]/15 text-[#8fd0ba]" : "bg-[#1f6b57]/10 text-[#175544]",

    // Trạng thái đúng/sai (đáp án)
    okBox: d ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-100" : "bg-emerald-50 border-emerald-600 text-emerald-900",
    noBox: d ? "bg-rose-500/15 border-rose-500/50 text-rose-100" : "bg-rose-50 border-rose-500 text-rose-900",
    okText: d ? "text-emerald-400" : "text-emerald-700",
    noText: d ? "text-rose-400" : "text-rose-600",
  };
}
