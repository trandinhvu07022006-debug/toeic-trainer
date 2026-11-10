import React from "react";

/**
 * Mascot chú chim xanh đeo kính thổi kèn chúc mừng
 * Tái hiện chính xác hình ảnh mascot của Parroto nhưng được tinh chỉnh
 * cho nền màu KMG Club.
 */
export function ParrotoMascot({ size = 150, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Linh vật học tập chúc mừng"
    >
      {/* Pháo hoa / Confetti xung quanh */}
      <circle cx="28" cy="34" r="3.5" fill="#f59e0b" />
      <polygon points="135,26 141,32 135,38 129,32" fill="#ef4444" />
      <circle cx="144" cy="62" r="3" fill="#38bdf8" />
      <polygon points="22,72 27,67 32,72 27,77" fill="#10b981" />
      <circle cx="45" cy="20" r="2.5" fill="#ec4899" />
      <polygon points="115,18 120,23 115,28 110,23" fill="#fbbf24" />

      {/* Thân chú chim tròn mập dễ thương */}
      <ellipse cx="78" cy="88" rx="42" ry="46" fill="#38bdf8" />
      {/* Bụng chim sáng màu */}
      <ellipse cx="78" cy="98" rx="30" ry="32" fill="#7dd3fc" opacity="0.65" />

      {/* Hai chân cam */}
      <ellipse cx="64" cy="136" rx="9" ry="5" fill="#f97316" />
      <ellipse cx="92" cy="136" rx="9" ry="5" fill="#f97316" />

      {/* Gọng kính đen tròn to ngộ nghĩnh */}
      <circle cx="65" cy="74" r="14" fill="#ffffff" stroke="#1e293b" strokeWidth="3.5" />
      <circle cx="95" cy="74" r="14" fill="#ffffff" stroke="#1e293b" strokeWidth="3.5" />
      {/* Cầu kính */}
      <path d="M79 74H81" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      {/* Càng kính */}
      <path d="M51 74H43" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M109 74H116" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

      {/* Mắt to đen láy có đốm sáng */}
      <circle cx="67" cy="74" r="5.5" fill="#0f172a" />
      <circle cx="69" cy="72" r="1.8" fill="#ffffff" />
      <circle cx="97" cy="74" r="5.5" fill="#0f172a" />
      <circle cx="99" cy="72" r="1.8" fill="#ffffff" />

      {/* Chùm lông trên đầu */}
      <path d="M74 44C74 37 78 33 82 31C82 37 80 43 78 44" fill="#0284c7" />
      <path d="M80 44C82 35 88 31 92 33C90 39 86 44 82 45" fill="#0369a1" />

      {/* Mỏ chim cam */}
      <polygon points="77,83 85,83 81,90" fill="#f97316" />

      {/* Kèn thổi tiệc sinh nhật (Party Horn) */}
      <rect
        x="80"
        y="83"
        width="12"
        height="6"
        rx="2"
        fill="#ef4444"
        transform="rotate(12 80 83)"
      />
      <path
        d="M90 85L120 72L124 96L92 89Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      {/* Sọc đỏ KMG trên kèn tiệc */}
      <path d="M100 81L103 91" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 77L113 93" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

      {/* Cánh chim vỗ nhẹ */}
      <ellipse
        cx="40"
        cy="94"
        rx="8"
        ry="18"
        fill="#0284c7"
        transform="rotate(15 40 94)"
      />
    </svg>
  );
}

