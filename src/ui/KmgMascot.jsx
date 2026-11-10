import React from "react";

/**
 * Linh vật & Biểu tượng vinh danh học tập độc quyền KMG CLUB:
 * Phượng hoàng lửa & Vương miện vàng KMG vươn cánh,
 * biểu trưng cho sự bứt phá mục tiêu điểm số và làm chủ tiếng Anh.
 */
export function KmgMascot({ size = 150, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Biểu tượng vinh danh KMG Club"
    >
      {/* Hiệu ứng hào quang / Glow nền */}
      <circle cx="80" cy="80" r="70" fill="url(#kmgGlow)" opacity="0.4" />

      {/* Pháo hoa ngôi sao & hạt sáng vinh quang KMG */}
      <polygon points="80,10 83,18 91,20 84,24 86,32 80,27 74,32 76,24 69,20 77,18" fill="#fbbf24" />
      <polygon points="26,38 28,43 33,44 29,47 30,52 26,49 22,52 23,47 19,44 24,43" fill="#ef4444" />
      <polygon points="134,38 136,43 141,44 137,47 138,52 134,49 130,52 131,47 127,44 132,43" fill="#f59e0b" />
      <circle cx="28" cy="80" r="3" fill="#ef4444" />
      <circle cx="132" cy="80" r="3" fill="#10b981" />
      <circle cx="44" cy="24" r="2.5" fill="#38bdf8" />
      <circle cx="116" cy="24" r="2.5" fill="#fbbf24" />

      {/* Vòng nguyệt quế vinh quang bao quanh (Laurel Wreath) */}
      <path
        d="M38 116C32 98 34 76 46 60C48 57 46 54 43 56C30 73 28 98 35 118C36 121 39 120 38 116Z"
        fill="url(#goldGrad)"
      />
      <path
        d="M122 116C128 98 126 76 114 60C112 57 114 54 117 56C130 73 132 98 125 118C124 121 121 120 122 116Z"
        fill="url(#goldGrad)"
      />
      {/* Lá nguyệt quế trái */}
      <ellipse cx="36" cy="72" rx="6" ry="3.5" transform="rotate(-35 36 72)" fill="#f59e0b" />
      <ellipse cx="34" cy="90" rx="6" ry="3.5" transform="rotate(-15 34 90)" fill="#f59e0b" />
      <ellipse cx="38" cy="106" rx="6" ry="3.5" transform="rotate(10 38 106)" fill="#f59e0b" />
      {/* Lá nguyệt quế phải */}
      <ellipse cx="124" cy="72" rx="6" ry="3.5" transform="rotate(35 124 72)" fill="#f59e0b" />
      <ellipse cx="126" cy="90" rx="6" ry="3.5" transform="rotate(15 126 90)" fill="#f59e0b" />
      <ellipse cx="122" cy="106" rx="6" ry="3.5" transform="rotate(-10 122 106)" fill="#f59e0b" />

      {/* Khiên danh dự KMG (Shield Crest) */}
      <path
        d="M80 34L112 48V84C112 108 98 128 80 138C62 128 48 108 48 84V48L80 34Z"
        fill="url(#kmgShieldGrad)"
        stroke="url(#goldGrad)"
        strokeWidth="3"
      />

      {/* Đôi cánh Phượng Hoàng / Đại bàng vươn cao */}
      <path
        d="M50 56C36 44 22 52 14 64C22 68 34 68 46 64L50 56Z"
        fill="url(#wingGradLeft)"
      />
      <path
        d="M110 56C124 44 138 52 146 64C138 68 126 68 114 64L110 56Z"
        fill="url(#wingGradRight)"
      />

      {/* Vương miện KMG Crown trên đỉnh khiên */}
      <path
        d="M68 56L72 44L80 50L88 44L92 56H68Z"
        fill="url(#goldGrad)"
        stroke="#b45309"
        strokeWidth="1"
      />
      <circle cx="72" cy="43" r="2" fill="#ef4444" />
      <circle cx="80" cy="49" r="2.5" fill="#ffffff" />
      <circle cx="88" cy="43" r="2" fill="#ef4444" />

      {/* Chữ lồng & Biểu trưng KMG */}
      <text
        x="80"
        y="82"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="2"
        fill="#ffffff"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
      >
        KMG
      </text>

      {/* Ngôi sao 5 cánh trung tâm phía dưới */}
      <polygon
        points="80,92 82.5,99 90,99 84,103.5 86,110.5 80,106.5 74,110.5 76,103.5 70,99 77.5,99"
        fill="url(#goldGrad)"
        stroke="#b45309"
        strokeWidth="0.8"
      />

      {/* Dải ruy băng vinh danh dưới chân khiên */}
      <path
        d="M54 130L80 124L106 130L98 140L80 134L62 140L54 130Z"
        fill="url(#ribbonGrad)"
        stroke="#7f1d1d"
        strokeWidth="1"
      />
      <text
        x="80"
        y="132"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="1.2"
        fill="#fef08a"
      >
        EXCELLENCE
      </text>

      {/* Định nghĩa Gradient KMG */}
      <defs>
        <radialGradient id="kmgGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#dc2626" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0b0f15" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="80%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id="kmgShieldGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="45%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>

        <linearGradient id="wingGradLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        <linearGradient id="wingGradRight" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Giữ alias cho trường hợp import cũ
export const ParrotoMascot = KmgMascot;
