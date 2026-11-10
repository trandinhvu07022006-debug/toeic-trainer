import React from "react";
import { Volume2, X, BookmarkCheck, BookmarkPlus, ExternalLink, Sparkles } from "lucide-react";

export function WordLookupModal({
  word,
  rawQuery,
  onClose,
  T,
  dark,
  tts,
  srs = {},
  onSaveWord,
  onRemoveWord,
}) {
  if (!word && !rawQuery) return null;

  const targetWord = word ? word.w : rawQuery;
  const inSrs = word && !!(srs && srs[word.id]);
  const srsBox = inSrs ? (srs[word.id]?.box ?? 0) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tra cứu từ vựng"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <div
        className={
          "w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border p-6 shadow-2xl transition-all animate-pop " +
          T.card + " " + T.line
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className={"p-1.5 rounded-lg " + T.accentSoft}>
              <Sparkles size={16} className={T.accentText} />
            </span>
            <span className={"text-xs font-bold uppercase tracking-wider " + T.sub}>
              {word ? "Từ vựng TOEIC trong bài" : "Tra cứu từ trong bài"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className={"rounded-full p-2 hover:opacity-80 transition-opacity " + T.soft}
          >
            <X size={18} />
          </button>
        </div>

        {/* Word Title & Audio */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-2xl font-bold tracking-tight">{targetWord}</h3>
              {word && word.pos && (
                <span className={"text-xs px-2 py-0.5 rounded-full font-semibold " + T.accentSoft}>
                  {word.pos}
                </span>
              )}
            </div>
            {word && word.ipa && (
              <p className={"text-sm mt-0.5 font-mono " + T.sub}>{word.ipa}</p>
            )}
          </div>

          <button
            aria-label="Nghe phát âm"
            onClick={() => tts && tts.speak(targetWord, 0.9)}
            className="shrink-0 h-11 w-11 rounded-full bg-accent text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Word Meaning */}
        {word ? (
          <div className="space-y-3.5 mb-5">
            <div className={"rounded-2xl p-4 " + T.soft}>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-70">
                Nghĩa tiếng Việt
              </p>
              <p className="text-lg font-semibold text-accent leading-snug">{word.vi}</p>
            </div>

            {word.ex && (
              <div className={"rounded-2xl border p-4 " + (dark ? "bg-white/[0.02] border-white/5" : "bg-gray-50/70 border-gray-200/80")}>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1.5 opacity-70">
                  Câu ví dụ trong đề thi
                </p>
                <p className="text-sm leading-relaxed mb-1 font-medium">{word.ex}</p>
                {word.exVi && (
                  <p className={"text-xs leading-relaxed " + T.sub}>{word.exVi}</p>
                )}
              </div>
            )}

            {word.col && word.col.length > 0 && (
              <div>
                <p className={"text-xs uppercase tracking-wider font-semibold mb-1.5 " + T.sub}>
                  Cụm từ / Họ từ hay gặp
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {word.col.map((c) => (
                    <span
                      key={c}
                      className={"text-xs px-2.5 py-1 rounded-full border " + T.soft + " " + T.line}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={"rounded-2xl p-5 mb-5 text-center " + T.soft}>
            <p className="text-sm font-medium mb-1">
              Chưa có dữ liệu chi tiết cho từ “{rawQuery}”.
            </p>
            <p className={"text-xs leading-relaxed " + T.sub}>
              Bạn vẫn có thể nghe phát âm chuẩn bằng nút loa ở góc phải.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {word && onSaveWord && (
            <button
              onClick={() => {
                if (inSrs && onRemoveWord) {
                  onRemoveWord(word.id);
                } else {
                  onSaveWord(word.id);
                }
              }}
              style={{ minHeight: 48 }}
              className={
                "w-full rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all " +
                (inSrs
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25"
                  : "bg-accent text-white hover:brightness-110 active:scale-[0.99] shadow-lg shadow-accent/25")
              }
            >
              {inSrs ? (
                <>
                  <BookmarkCheck size={18} />
                  <span>Đã có trong Flashcard (Hộp {srsBox}) · Nhấn để gỡ</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} />
                  <span>⭐ Lưu vào Flashcard SRS để ôn hằng ngày</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            style={{ minHeight: 44 }}
            className={"w-full rounded-2xl text-sm font-medium transition-colors " + T.soft + " " + T.sub}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

