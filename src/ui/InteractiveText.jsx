import React from "react";

/**
 * Hiển thị văn bản bài đọc dạng tương tác:
 * - Chế độ Tra từ: Bấm vào bất kỳ từ nào để tra nghĩa, nghe phát âm và lưu Flashcard SRS.
 * - Chế độ Bút dạ quang (Highlight): Bấm vào từ để làm nổi bật từ khóa manh mối trong bài.
 */
export function InteractiveText({
  text,
  interactive = true,
  onWordClick,
  className = "",
  highlightedIndices = new Set(),
  onToggleHighlight,
  highlightMode = false,
}) {
  if (!text) return null;

  // Tách thành các đoạn văn để giữ nguyên cấu trúc dòng
  const paragraphs = text.split(/\n+/);
  let globalWordCounter = 0;

  return (
    <div className={"space-y-4 " + className}>
      {paragraphs.map((p, pIdx) => {
        // Tách từ và khoảng trắng / dấu câu
        const tokens = p.split(/([a-zA-Z0-9'-]+)/g);

        return (
          <p key={pIdx} className="leading-relaxed">
            {tokens.map((token, tIdx) => {
              const isWord = /^[a-zA-Z0-9'-]{2,}$/.test(token);

              if (!isWord) {
                return <span key={tIdx}>{token}</span>;
              }

              const wordKey = `${pIdx}-${tIdx}`;
              const isHighlighted = highlightedIndices.has(wordKey);

              const handleClick = (e) => {
                e.stopPropagation();
                if (highlightMode && onToggleHighlight) {
                  onToggleHighlight(wordKey);
                } else if (interactive && onWordClick) {
                  onWordClick(token);
                }
              };

              let highlightClass = "";
              if (isHighlighted) {
                highlightClass = "bg-amber-300 text-gray-950 dark:bg-amber-400 dark:text-gray-950 font-semibold px-1 rounded shadow-sm";
              } else if (highlightMode) {
                highlightClass = "cursor-crosshair hover:bg-amber-300/40 rounded px-0.5 transition-colors";
              } else if (interactive) {
                highlightClass = "cursor-pointer rounded px-0.5 transition-all hover:bg-accent/25 hover:text-accent hover:underline underline-offset-2 active:scale-95";
              }

              return (
                <span
                  key={tIdx}
                  onClick={handleClick}
                  className={highlightClass}
                  title={
                    highlightMode
                      ? `Bấm để ${isHighlighted ? "bỏ highlight" : "highlight"} từ "${token}"`
                      : `Tra từ: "${token}"`
                  }
                >
                  {token}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
