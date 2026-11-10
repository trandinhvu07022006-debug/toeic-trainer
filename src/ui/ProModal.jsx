import React, { useState, useEffect } from "react";
import { Crown, Check, X, Sparkles, Zap, BookOpen, PenTool, FileText, ArrowRight } from "lucide-react";
import { ParrotoMascot } from "./ParrotoMascot.jsx";

export function ProModal({ onClose, dark, T }) {
  const [selectedPlan, setSelectedPlan] = useState("6m");
  const [activated, setActivated] = useState(false);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const plans = [
    {
      id: "1m",
      name: "Gói 1 Tháng",
      price: "99.000₫",
      sub: "99k / tháng",
      desc: "Trải nghiệm đầy đủ tính năng trong 30 ngày",
    },
    {
      id: "6m",
      name: "Gói 6 Tháng",
      price: "299.000₫",
      sub: "Chỉ ~49k / tháng",
      badge: "PHỔ BIẾN NHẤT",
      badgeColor: "bg-gradient-to-r from-red-600 to-rose-600 text-white",
      desc: "Tiết kiệm 50% chi phí, lộ trình bứt phá mục tiêu",
      recommended: true,
    },
    {
      id: "life",
      name: "Trọn Đời (Lifetime)",
      price: "599.000₫",
      sub: "Thanh toán 1 lần duy nhất",
      badge: "TIẾT KIỆM 75%",
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      desc: "Sở hữu vĩnh viễn mọi bản cập nhật và dữ liệu mới",
    },
  ];

  const perks = [
    {
      Icon: BookOpen,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
      title: "Trọn bộ 4.568+ từ vựng & 64+ chủ đề Parroto",
      desc: "Học theo Spaced Repetition (SRS Leitner) kèm audio chuẩn bản ngữ và 5 chế độ tương tác.",
    },
    {
      Icon: PenTool,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Phòng Luyện Tập Viết thông minh không giới hạn",
      desc: "3 phương pháp rèn trí nhớ cơ bắp: Gõ chính tả (Spelling), Điền từ ngữ cảnh (Cloze) & Ghép câu.",
    },
    {
      Icon: FileText,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Đọc hiểu Split-View Part 5, 6, 7 chuyên sâu",
      desc: "Giao diện 2 cột chuẩn thi máy, chạm từ tra từ điển tức thì và lưu thẻ ôn tập 1 chạm.",
    },
    {
      Icon: Zap,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Đồng bộ đa thiết bị & Báo cáo năng lực chuyên sâu",
      desc: "Không giới hạn lượt học, không quảng cáo, cập nhật liên tục ngân hàng câu hỏi mới nhất.",
    },
  ];

  const handleActivate = () => {
    setActivated(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all " +
          (dark
            ? "bg-[#0d121a] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900")
        }
      >
        {/* Header với Gradient KMG Club & Linh vật Parroto */}
        <div className="relative p-6 sm:p-8 rounded-t-3xl overflow-hidden bg-gradient-to-br from-red-700 via-rose-700 to-red-950 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
            <div className="shrink-0 p-2 bg-black/30 rounded-2xl border border-white/20 shadow-lg">
              <ParrotoMascot size={80} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
                <Crown size={14} className="fill-current" />
                <span>KMG CLUB PRO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Mở Khóa Toàn Diện 3 Trụ Cột
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md">
                Chuyên sâu Học Từ Vựng · Luyện Tập Viết · Luyện Đọc Hiểu cho học viên KMG Club.
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* 4 Lợi ích cốt lõi */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Quyền lợi hội viên PRO
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {perks.map((p, idx) => {
                const Icon = p.Icon;
                return (
                  <div
                    key={idx}
                    className={
                      "p-3.5 rounded-2xl border flex items-start gap-3 transition-colors " +
                      (dark ? "bg-white/[0.03] border-white/5" : "bg-gray-50 border-gray-100")
                    }
                  >
                    <div className={"p-2 rounded-xl border shrink-0 " + p.color}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-[13px] leading-snug mb-1">{p.title}</p>
                      <p className={"text-[11px] leading-relaxed " + T.sub}>{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chọn gói tài khoản */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Chọn gói đăng ký phù hợp
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {plans.map((pl) => {
                const isSelected = selectedPlan === pl.id;
                return (
                  <button
                    key={pl.id}
                    onClick={() => setSelectedPlan(pl.id)}
                    className={
                      "relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between active:scale-[0.98] " +
                      (isSelected
                        ? "border-red-500 bg-red-600/10 ring-2 ring-red-500/40 shadow-lg shadow-red-500/15"
                        : dark
                        ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                        : "bg-white border-gray-200 hover:border-gray-300 shadow-sm")
                    }
                  >
                    {pl.badge && (
                      <span
                        className={
                          "absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm " +
                          pl.badgeColor
                        }
                      >
                        {pl.badge}
                      </span>
                    )}
                    <div>
                      <p className="font-bold text-xs sm:text-sm mb-1">{pl.name}</p>
                      <p className="text-lg sm:text-xl font-extrabold text-accent mb-0.5">
                        {pl.price}
                      </p>
                      <p className={"text-[11px] font-medium " + T.sub}>{pl.sub}</p>
                    </div>
                    <p className={"text-[10px] mt-3 pt-2 border-t " + (dark ? "border-white/5 " : "border-gray-100 ") + T.sub}>
                      {pl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="pt-2">
            {activated ? (
              <div className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 animate-scale-up">
                <Check size={20} strokeWidth={3} />
                <span>KÍCH HOẠT PRO THÀNH CÔNG! ĐANG TẢI DỮ LIỆU...</span>
              </div>
            ) : (
              <button
                onClick={handleActivate}
                style={{ minHeight: 52 }}
                className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Crown size={18} className="text-amber-200" />
                <span>KÍCH HOẠT PRO NGAY — TRẢI NGHIỆM ĐỈNH CAO</span>
                <ArrowRight size={17} />
              </button>
            )}

            <p className={"text-center text-[11px] mt-2.5 " + T.sub}>
              Cam kết hoàn tiền 100% trong 7 ngày nếu không hài lòng · Hỗ trợ kỹ thuật 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
