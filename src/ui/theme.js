import { useState, useEffect, useCallback } from "react";

/* Chế độ nền sáng/tối.
   Hướng thiết kế Parroto/Spotify: Dark-first (Mặc định là Tối) */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("toeic-theme");
      if (saved === "light") return false;
      // Default to true (Dark Space)
      return true;
    } catch { }
    return true;
  });

  useEffect(() => {
    try { localStorage.setItem("toeic-theme", dark ? "dark" : "light"); } catch { }
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
      || document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#050505" : "#f8fafc");
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return [dark, toggle];
}

export function usePrefersDark() {
  const [dark] = useDarkMode();
  return dark;
}

/* ============================================================
   Bảng màu "Spotify x Parroto" Neon Dark Mode.
   Tập trung vào Chiều sâu không gian (Space Dark), Dạ quang (Neon), và Kính mờ (Glassmorphism).
   ============================================================ */
export function theme(d) {
  return {
    // Nền & bề mặt
    // Tối: Đen sâu (#050505), Sáng: Trắng xám (#f8fafc)
    app: d ? "bg-[#050505] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]",
    // Thẻ (Card): Tối: Kính nền mờ / Xám (#171717), Sáng: Trắng tinh
    card: d ? "bg-[#121212] backdrop-blur-xl" : "bg-white shadow-sm",
    bar: d ? "bg-[#000000]" : "bg-white",
    passage: d ? "bg-[#121212] border-[#27272a]" : "bg-white border-[#e2e8f0]",

    // Viền & chữ phụ
    line: d ? "border-[#27272a]" : "border-[#e2e8f0]",
    sub: d ? "text-[#a1a1aa]" : "text-[#64748b]",

    // Nền mềm (chip, ô phụ) + chữ trên nền mềm
    soft: d ? "bg-white/10 hover:bg-white/15" : "bg-[#f1f5f9] hover:bg-[#e2e8f0]",
    softText: d ? "text-[#e4e4e7]" : "text-[#475569]",
    track: d ? "bg-white/10" : "bg-gray-200",

    // Nhấn — KMG Crimson / Neon Red glowing!
    accentText: d ? "text-[#ef4444]" : "text-[#dc2626]",
    accentSoft: d ? "bg-[#ef4444]/15 text-[#f87171]" : "bg-[#dc2626]/10 text-[#b91c1c]",

    // Trạng thái đúng/sai
    okBox: d ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" : "bg-emerald-50 border-emerald-500 text-emerald-800",
    noBox: d ? "bg-red-500/15 border-red-500/40 text-red-300" : "bg-red-50 border-red-500 text-red-800",
    okText: d ? "text-emerald-400" : "text-emerald-600",
    noText: d ? "text-red-400" : "text-red-600",
  };
}
