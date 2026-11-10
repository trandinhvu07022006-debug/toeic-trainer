import React, { useState, useMemo } from "react";
import { Search, Volume2, X, ArrowLeft, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { VOCAB } from "../data/vocab.js";

/* Tra từ điển: tìm trong ngân hàng 4.500+ từ theo từ tiếng Anh hoặc nghĩa tiếng Việt.
   Hỗ trợ nghe phát âm và Lưu trực tiếp vào bộ nhớ Flashcard SRS để ôn tập. */
export function DictionaryScreen({ T, dark, tts, onBack, srs = {}, onSaveWord, onRemoveWord }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 1) return [];
    const starts = [], contains = [];
    for (const w of VOCAB) {
      const word = w.w.toLowerCase();
      const vi = (w.vi || "").toLowerCase();
      if (word.startsWith(query) || vi.startsWith(query)) starts.push(w);
      else if (word.includes(query) || vi.includes(query)) contains.push(w);
      if (starts.length >= 40) break;
    }
    return starts.concat(contains).slice(0, 40);
  }, [query]);

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <p className="text-lg font-bold">Tra từ điển & Lưu Flashcard</p>
      </div>

      {/* Ô tìm kiếm */}
      <div className={"flex items-center gap-2 rounded-2xl border px-4 mb-5 " + T.card + " " + T.line}>
        <Search size={18} className={T.sub} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Tìm từ" placeholder="Gõ từ tiếng Anh hoặc nghĩa tiếng Việt…"
          style={{ minHeight: 52 }}
          className={"flex-1 bg-transparent outline-none text-base " + (dark ? "text-[#eef2ee] placeholder:text-[#9db0a9]" : "text-[#1a2b26] placeholder:text-[#6b7d76]")}
        />
        {q && (
          <button onClick={() => setQ("")} className={"rounded-full p-1 " + T.sub}><X size={18} /></button>
        )}
      </div>

      {query.length < 1 && (
        <div className={"rounded-2xl border p-6 text-center " + T.card + " " + T.line}>
          <Search size={28} className={"mx-auto mb-2 text-accent"} />
          <p className={"text-sm mb-4 " + T.sub}>
            Nhập một từ để tra trong hơn 4.500 từ vựng TOEIC và lưu vào Flashcards ôn luyện hằng ngày.
          </p>

          <p className={"text-xs font-bold uppercase tracking-wider mb-2.5 " + T.sub}>
            Từ vựng thường gặp trong đề thi TOEIC:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "contract",
              "negotiate",
              "invoice",
              "warranty",
              "itinerary",
              "promotion",
              "facility",
              "reimburse",
              "deadline",
              "candidate",
            ].map((kw) => (
              <button
                key={kw}
                onClick={() => setQ(kw)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 " +
                  (dark
                    ? "bg-[#141923] hover:bg-[#1f283a] border-[#253248] text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800")
                }
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.length >= 1 && results.length === 0 && (
        <div className={"rounded-2xl border p-6 text-center " + T.card + " " + T.line}>
          <p className={"text-sm " + T.sub}>Không tìm thấy “{q}”. Thử từ khác xem sao.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 pb-4 items-start">
        {results.map((w) => {
          const inSrs = !!(srs && srs[w.id]);
          return (
            <div key={w.id} className={"rounded-2xl border p-4 transition-all " + T.card + " " + T.line}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-bold">{w.w}</p>
                    <span className={"text-sm " + T.sub}>{w.ipa}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full " + T.accentSoft}>{w.pos}</span>
                  </div>
                  <p className="text-base font-medium mt-0.5">{w.vi}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    aria-label="Nghe phát âm"
                    onClick={() => tts.speak(w.w, 0.9)}
                    style={{ minHeight: 38, minWidth: 38 }}
                    className={"rounded-full p-2 flex items-center justify-center transition-all " + T.soft + " " + T.softText}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={17} />
                  </button>
                  {onSaveWord && (
                    <button
                      aria-label={inSrs ? "Đã lưu vào Flashcards" : "Lưu vào Flashcards"}
                      onClick={() => {
                        if (inSrs && onRemoveWord) {
                          onRemoveWord(w.id);
                        } else {
                          onSaveWord(w.id);
                        }
                      }}
                      style={{ minHeight: 38, minWidth: 38 }}
                      className={"rounded-full p-2 flex items-center justify-center transition-all " +
                        (inSrs ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-accent/10 text-accent hover:bg-accent/20")}
                      title={inSrs ? "Đã có trong Flashcards (Bấm để gỡ)" : "Thêm vào Flashcard SRS để ôn hằng ngày"}
                    >
                      {inSrs ? <BookmarkCheck size={17} /> : <BookmarkPlus size={17} />}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm mt-2">{w.ex}</p>
              <p className={"text-sm " + T.sub}>{w.exVi}</p>
              {w.col && w.col.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {w.col.map((c) => (
                    <span key={c} className={"px-2.5 py-0.5 rounded-full text-xs " + T.soft + " " + T.softText}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
