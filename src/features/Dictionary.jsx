import React, { useState, useMemo } from "react";
import { Search, Volume2, X, ArrowLeft } from "lucide-react";
import { VOCAB } from "../data/vocab.js";

/* Tra từ điển: tìm trong ngân hàng 3.000+ từ theo từ tiếng Anh hoặc nghĩa tiếng Việt.
   Là một màn riêng (lazy-load) nên chỉ nạp dữ liệu từ vựng khi người dùng mở. */
export function DictionaryScreen({ T, dark, tts, onBack }) {
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
        <p className="text-lg font-bold">Tra từ điển</p>
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
          <Search size={28} className={"mx-auto mb-2 " + T.sub} />
          <p className={"text-sm " + T.sub}>Nhập một từ để tra trong hơn 3.000 từ vựng TOEIC.</p>
        </div>
      )}

      {query.length >= 1 && results.length === 0 && (
        <div className={"rounded-2xl border p-6 text-center " + T.card + " " + T.line}>
          <p className={"text-sm " + T.sub}>Không tìm thấy “{q}”. Thử từ khác xem sao.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 pb-4 items-start">
        {results.map((w) => (
          <div key={w.id} className={"rounded-2xl border p-4 " + T.card + " " + T.line}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-lg font-bold">{w.w}</p>
                  <span className={"text-sm " + T.sub}>{w.ipa}</span>
                  <span className={"text-xs px-2 py-0.5 rounded-full " + T.accentSoft}>{w.pos}</span>
                </div>
                <p className="text-base font-medium mt-0.5">{w.vi}</p>
              </div>
              <button aria-label="Nghe phát âm" onClick={() => tts.speak(w.w, 0.9)} style={{ minHeight: 40, minWidth: 40 }}
                className="shrink-0 rounded-full bg-accent text-white flex items-center justify-center active:brightness-95">
                <Volume2 size={17} />
              </button>
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
        ))}
      </div>
    </div>
  );
}
