import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Eye, EyeOff, Mic, Volume2 } from "lucide-react";
import { SPEAKING, SPEAK_AGENDA, SPEAK_CRITERIA } from "../data/speaking.js";
import { pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary, SectionTitle , PageHeader } from "../ui/index.jsx";
import { SceneArt } from "../ui/art.jsx";

/* ═══════════════════════════════════════════════════════════════════
   11b. TAB LUYỆN NÓI
   ═══════════════════════════════════════════════════════════════════ */

function useRecorder() {
  const [status, setStatus] = useState("idle"); // idle | recording | denied | unsupported
  const [url, setUrl] = useState(null);
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const urlRef = useRef(null);

  const supported = typeof window !== "undefined"
    && typeof navigator !== "undefined"
    && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    && typeof window.MediaRecorder !== "undefined";

  const releaseStream = useCallback(() => {
    try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) { /* bỏ qua */ }
    streamRef.current = null;
  }, []);

  const clearClip = useCallback(() => {
    try { if (urlRef.current) URL.revokeObjectURL(urlRef.current); } catch (e) { /* bỏ qua */ }
    urlRef.current = null;
    setUrl(null);
  }, []);

  const start = useCallback(() => {
    if (!supported) { setStatus("unsupported"); return Promise.resolve(false); }
    clearClip();
    return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      try {
        streamRef.current = stream;
        const rec = new window.MediaRecorder(stream);
        chunksRef.current = [];
        rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
        rec.onstop = () => {
          try {
            const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
            const u = URL.createObjectURL(blob);
            urlRef.current = u;
            setUrl(u);
          } catch (e) { /* bỏ qua */ }
          releaseStream();
        };
        rec.start();
        recRef.current = rec;
        setStatus("recording");
        return true;
      } catch (e) { releaseStream(); setStatus("unsupported"); return false; }
    }).catch(() => { setStatus("denied"); return false; });
  }, [supported, clearClip, releaseStream]);

  const stop = useCallback(() => {
    try { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); }
    catch (e) { releaseStream(); }
    setStatus((s) => (s === "recording" ? "idle" : s));
  }, [releaseStream]);

  useEffect(() => () => {
    try { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); } catch (e) { /* bỏ qua */ }
    try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) { /* bỏ qua */ }
    try { if (urlRef.current) URL.revokeObjectURL(urlRef.current); } catch (e) { /* bỏ qua */ }
  }, []);

  return { status, url, start, stop, supported, clearClip };
}

/* Tô màu chỗ nối âm và trọng âm trong bài đọc to */
export function MarkedRead({ text, marks, dark }) {
  if (!marks || !marks.length) return <span>{text}</span>;
  let parts = [text];
  marks.forEach((m) => {
    const next = [];
    parts.forEach((p) => {
      if (typeof p !== "string") { next.push(p); return; }
      const i = p.toLowerCase().indexOf(m.p.toLowerCase());
      if (i === -1) { next.push(p); return; }
      next.push(p.slice(0, i));
      next.push({ mark: p.slice(i, i + m.p.length), t: m.t });
      next.push(p.slice(i + m.p.length));
    });
    parts = next;
  });
  const linkCls = "bg-accent-chip";
  const stressCls = dark ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-900";
  return (
    <span>
      {parts.map((p, i) => typeof p === "string"
        ? <span key={i}>{p}</span>
        : <span key={i} className={"px-1 rounded font-semibold " + (p.t === "link" ? linkCls : stressCls)}>{p.mark}</span>)}
    </span>
  );
}

export function AgendaTable({ T, agenda }) {
  const a = agenda || SPEAK_AGENDA;
  return (
    <div className={"rounded-2xl border overflow-hidden " + T.card + " " + T.line}>
      <div className={"px-4 py-3 border-b " + T.line}>
        <p className="text-base font-bold">{a.title}</p>
        <p className={"text-sm " + T.sub}>{a.sub}</p>
      </div>
      {a.rows.map((r, n) => (
        <div key={n} className={"px-4 py-2 flex gap-3 " + (n ? "border-t " + T.line : "")}>
          <span className={"text-sm shrink-0 w-28 " + T.sub}>{r.time}</span>
          <span className="text-base flex-1">{r.item}</span>
          <span className={"text-sm shrink-0 " + T.sub}>{r.by}</span>
        </div>
      ))}
    </div>
  );
}

export function Countdown({ T, label, left, total, tone }) {
  return (
    <div className={"rounded-2xl border p-5 text-center " + T.card + " " + T.line}>
      <p className={"text-sm uppercase tracking-wide font-semibold mb-1 " + T.sub}>{label}</p>
      <p className={"font-display text-5xl font-semibold tnum mb-3 " + (tone === "speak" ? T.accentText : "")}>{left}</p>
      <Bar value={total ? ((total - left) / total) * 100 : 0} T={T} />
    </div>
  );
}

/* ---------- Một câu Speaking ---------- */
export function SpeakQuestion({ item, T, dark, tts, rec, onBack, onNext, onScore, savedScore, isLast }) {
  const [phase, setPhase] = useState(item.read ? "read" : "brief");
  const [left, setLeft] = useState(item.read || 0);
  const [micNote, setMicNote] = useState(false);
  const [scores, setScores] = useState(savedScore || [0, 0, 0, 0]);
  const [showSample, setShowSample] = useState(false);
  const recRef = useRef(rec);
  recRef.current = rec;

  useEffect(() => () => { tts.stop(); try { recRef.current.stop(); } catch (e) { /* bỏ qua */ } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* đồng hồ cho các giai đoạn có đếm ngược */
  useEffect(() => {
    if (phase !== "read" && phase !== "prep" && phase !== "speak") return;
    if (left <= 0) {
      if (phase === "read") { setPhase("brief"); return; }
      if (phase === "prep") { startSpeak(); return; }
      if (phase === "speak") { finish(); return; }
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left]); // eslint-disable-line react-hooks/exhaustive-deps

  const playQuestion = () => {
    const t = item.kind === "read" ? item.text : (item.question || "");
    if (t) tts.speak(t, 1);
  };

  const startPrep = () => {
    tts.stop();
    if (item.question && item.kind !== "read") tts.speak(item.question, 1);
    setPhase("prep");
    setLeft(item.prep);
  };

  const startSpeak = () => {
    tts.stop();
    setPhase("speak");
    setLeft(item.speak);
    rec.start().then((ok) => { if (!ok) setMicNote(true); });
  };

  const finish = () => {
    try { rec.stop(); } catch (e) { /* bỏ qua */ }
    setPhase("done");
  };

  const setCriterion = (i, v) => {
    const next = scores.slice();
    next[i] = v;
    setScores(next);
    onScore(item.id, next);
  };
  const scoreSum = scores.reduce((a, b) => a + b, 0);

  const content = (
    <>
      {item.scenario && (
        <div className={"rounded-2xl p-4 mb-4 " + T.soft}>
          <p className={"text-base leading-relaxed " + T.softText}>{item.scenario}</p>
        </div>
      )}
      {item.kind === "read" && (
        <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
          <p className="text-lg leading-relaxed"><MarkedRead text={item.text} marks={item.marks} dark={dark} /></p>
          <div className={"flex flex-wrap gap-3 mt-3 pt-3 border-t text-sm " + T.line + " " + T.sub}>
            <span className={"px-2 py-1 rounded " + ("bg-accent-chip")}>nối âm</span>
            <span className={"px-2 py-1 rounded " + (dark ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-900")}>trọng âm</span>
          </div>
        </div>
      )}
      {item.kind === "picture" && (
        <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
          <SceneArt name={item.scene} dark={dark} />
        </div>
      )}
      {item.kind === "table" && <div className="mb-4"><AgendaTable T={T} agenda={item.agenda} /></div>}
      {item.question && (
        <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-medium leading-relaxed flex-1">{item.question}</p>
            <button aria-label="Nghe phát âm" onClick={playQuestion} style={{ minHeight: 44, minWidth: 44 }} className={"shrink-0 rounded-full p-3 " + T.soft}>
              <Volume2 size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate">Question {item.no}</p>
          <p className={"text-sm truncate " + T.sub}>{item.group}</p>
        </div>
      </div>

      {phase === "read" && (
        <div className="animate-fade">
          <div className="mb-4"><Countdown T={T} label="Thời gian đọc bảng" left={left} total={item.read} /></div>
          <AgendaTable T={T} agenda={item.agenda} />
          <div className="mt-4 mb-4"><Ghost onClick={() => setLeft(0)} T={T} className="w-full">Đọc xong, sang câu hỏi</Ghost></div>
        </div>
      )}

      {phase === "brief" && (
        <div className="animate-fade">
          <div className={"rounded-2xl p-4 mb-4 flex gap-3 " + T.soft}>
            <Mic size={18} className={"shrink-0 mt-1 " + T.accentText} />
            <p className={"text-base leading-relaxed " + T.softText}>
              {item.task || "Trả lời câu hỏi bằng lời nói."} Chuẩn bị {item.prep} giây, trả lời {item.speak} giây.
            </p>
          </div>
          {content}
          <div className="mb-4"><Primary onClick={startPrep}>Bắt đầu — chuẩn bị {item.prep} giây</Primary></div>
        </div>
      )}

      {phase === "prep" && (
        <div className="animate-fade">
          <div className="mb-4"><Countdown T={T} label="Chuẩn bị" left={left} total={item.prep} /></div>
          {content}
          <div className="mb-4"><Ghost onClick={() => setLeft(0)} T={T} className="w-full">Sẵn sàng, nói luôn</Ghost></div>
        </div>
      )}

      {phase === "speak" && (
        <div className="animate-fade">
          <div className="mb-3"><Countdown T={T} label="Đang trả lời" left={left} total={item.speak} tone="speak" /></div>
          <div className={"rounded-2xl border p-3 mb-4 flex items-center gap-3 " + T.card + " " + T.line}>
            <span className={"h-3 w-3 rounded-full " + (rec.status === "recording" ? "bg-rose-500" : T.track)} />
            <span className={"text-base flex-1 " + T.softText}>
              {rec.status === "recording" ? "Đang ghi âm" : "Chế độ không micro — cứ nói to như thi thật"}
            </span>
          </div>
          {content}
          <div className="mb-4"><Primary onClick={() => setLeft(0)}>Nói xong</Primary></div>
        </div>
      )}

      {phase === "done" && (
        <div className="animate-fade">
          {micNote && (
            <div className={"rounded-2xl p-4 mb-4 flex gap-3 " + T.soft}>
              <Mic size={18} className={"shrink-0 mt-1 " + T.accentText} />
              <p className={"text-base leading-relaxed " + T.softText}>
                {rec.supported
                  ? "Trình duyệt chưa cấp quyền micro nên lượt này không ghi âm. Phần luyện vẫn đầy đủ: countdown, bài mẫu và checklist tự chấm."
                  : "Trình duyệt này không hỗ trợ ghi âm. Bạn vẫn luyện được bình thường với countdown và bài mẫu."}
              </p>
            </div>
          )}
          {rec.url && (
            <div className={"rounded-2xl border p-4 mb-4 " + T.card + " " + T.line}>
              <p className={"text-sm font-semibold uppercase tracking-wide mb-2 " + T.sub}>Bản thu của bạn</p>
              <audio src={rec.url} controls className="w-full" />
              <p className={"text-sm mt-2 " + T.sub}>Bản thu chỉ nằm trong bộ nhớ phiên này, không gửi đi đâu và mất khi tải lại trang.</p>
            </div>
          )}

          <SectionTitle T={T}>Tự chấm</SectionTitle>
          <div className={"rounded-2xl border p-4 mb-5 " + T.card + " " + T.line}>
            {SPEAK_CRITERIA.map((c, n) => (
              <div key={c} className={"flex items-center gap-3 py-2 " + (n ? "border-t " + T.line : "")}>
                <span className="text-base flex-1">{c}</span>
                {[1, 2, 3].map((v) => (
                  <button key={v} onClick={() => setCriterion(n, v)} aria-label={"Chấm " + v + " điểm cho tiêu chí này"} aria-pressed={scores[n] === v} style={{ minHeight: 40, minWidth: 40 }}
                    className={"rounded-xl text-base font-semibold " +
                      (scores[n] === v ? "bg-accent text-white" : T.soft + " " + T.softText)}>{v}</button>
                ))}
              </div>
            ))}
            <p className={"text-sm mt-3 pt-3 border-t " + T.line + " " + T.sub}>
              Tổng {scoreSum}/12 · 1 là chưa đạt, 2 là tạm được, 3 là tốt
            </p>
          </div>

          <button onClick={() => setShowSample((s) => !s)} style={{ minHeight: 52 }}
            className={"w-full rounded-2xl border px-4 py-3 flex items-center justify-between mb-4 " + T.card + " " + T.line}>
            <span className="flex items-center gap-2 text-base font-semibold">
              {showSample ? <EyeOff size={18} className={T.accentText} /> : <Eye size={18} className={T.accentText} />}
              {item.kind === "read" ? "Điểm chấm và phân tích" : "Bài nói mẫu và phân tích"}
            </span>
            <ChevronRight size={18} className={"transition-transform " + (showSample ? "rotate-90" : "")} />
          </button>

          {showSample && (
            <div className="animate-fade mb-4">
              {item.sample && (
                <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className={"text-sm font-semibold uppercase tracking-wide " + T.sub}>Bài mẫu band cao</p>
                    <button aria-label="Nghe phát âm" onClick={() => tts.speak(item.sample, 0.95)} style={{ minHeight: 40, minWidth: 40 }}
                      className={"rounded-full p-2 " + T.soft}><Volume2 size={16} /></button>
                  </div>
                  <p className="text-base leading-relaxed whitespace-pre-line">{item.sample}</p>
                </div>
              )}
              {item.note && (
                <div className={"rounded-2xl p-4 mb-3 " + T.soft}>
                  <p className={"text-base leading-relaxed " + T.softText}>{item.note}</p>
                </div>
              )}
              <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
                <p className={"text-sm font-semibold uppercase tracking-wide mb-2 " + T.accentText}>Dàn ý</p>
                <ul className="space-y-2">
                  {item.outline.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 rounded-full shrink-0 bg-accent" />
                      <span className="text-base leading-relaxed">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
                <p className={"text-sm font-semibold uppercase tracking-wide mb-2 " + T.accentText}>Cụm từ ghi điểm</p>
                <div className="flex flex-wrap gap-2">
                  {item.phrases.map((p) => (
                    <span key={p} className={"px-3 py-1 rounded-full text-sm " + T.soft + " " + T.softText}>{p}</span>
                  ))}
                </div>
              </div>
              <div className={"rounded-2xl border p-4 " + (dark ? "bg-amber-950 border-amber-800" : "bg-amber-50 border-amber-200")}>
                <p className={"text-sm font-semibold uppercase tracking-wide mb-2 " + (dark ? "text-amber-300" : "text-amber-700")}>
                  Lỗi người Việt hay mắc ở dạng này
                </p>
                <ul className="space-y-2">
                  {item.errors.map((e) => (
                    <li key={e} className={"text-base leading-relaxed " + (dark ? "text-amber-100" : "text-amber-900")}>• {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <Primary onClick={onNext}>{isLast ? "Hoàn thành đề" : "Câu tiếp theo"}</Primary>
            <Ghost onClick={() => { rec.clearClip(); setPhase(item.read ? "read" : "brief"); setLeft(item.read || 0); setShowSample(false); setMicNote(false); }}
              T={T} className="w-full">Làm lại câu này</Ghost>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Màn hình chính tab Nói ---------- */
export function SpeakScreen({ T, dark, tts, speakScores, onScore }) {
  const [openId, setOpenId] = useState(null);
  const [setIdx, setSetIdx] = useState(0); // đề đang chọn (0-based)
  const rec = useRecorder();

  // Chia câu thành các đề, mỗi đề 11 câu (theo đúng format TOEIC Speaking)
  const sets = useMemo(() => {
    const out = [];
    for (let i = 0; i < SPEAKING.length; i += 11) out.push(SPEAKING.slice(i, i + 11));
    return out;
  }, []);
  const curSet = sets[setIdx] || sets[0] || [];

  const item = openId ? SPEAKING.filter((s) => s.id === openId)[0] : null;

  if (item) {
    // Tìm câu kế tiếp trong cùng đề
    const idxInSet = curSet.findIndex((s) => s.id === item.id);
    const nextItem = idxInSet >= 0 && idxInSet < curSet.length - 1 ? curSet[idxInSet + 1] : null;
    return (
      <SpeakQuestion key={item.id} item={item} T={T} dark={dark} tts={tts} rec={rec}
        savedScore={speakScores[item.id]}
        isLast={!nextItem}
        onBack={() => { rec.clearClip(); setOpenId(null); }}
        onNext={() => { rec.clearClip(); if (nextItem) setOpenId(nextItem.id); else setOpenId(null); }}
        onScore={onScore} />
    );
  }

  // Gom nhóm trong đề đang chọn
  const groups = curSet.reduce((acc, s) => {
    const g = acc.filter((x) => x.name === s.group)[0];
    if (g) g.items.push(s); else acc.push({ name: s.group, items: [s] });
    return acc;
  }, []);

  const setDoneCount = curSet.filter((s) => speakScores[s.id] && speakScores[s.id].reduce((a, b) => a + b, 0) > 0).length;

  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow="Kỹ năng nói · 11 dạng câu"
        title="Luyện nói"
        sub={sets.length + " bộ đề theo format thật · mỗi đề 11 câu"} />

      {/* Chọn bộ đề */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {sets.map((st, i) => {
          const done = st.filter((s) => speakScores[s.id] && speakScores[s.id].reduce((a, b) => a + b, 0) > 0).length;
          const active = i === setIdx;
          return (
            <button key={i} onClick={() => setSetIdx(i)} style={{ minHeight: 44, background: active ? "var(--accent)" : undefined }}
              className={"shrink-0 rounded-xl px-4 text-sm font-semibold border transition-colors " +
                (active ? "text-white border-transparent" : T.card + " " + T.line + " " + T.sub)}>
              Đề {i + 1}{done === 11 ? " ✓" : done > 0 ? " · " + done + "/11" : ""}
            </button>
          );
        })}
      </div>

      <div className="mb-5"><Bar value={pct(setDoneCount, 11)} T={T} /></div>

      <div className={"rounded-2xl p-4 mb-5 flex gap-3 " + T.soft}>
        <Mic size={18} className={"shrink-0 mt-1 " + T.accentText} />
        <p className={"text-base leading-relaxed " + T.softText}>
          {rec.supported
            ? "App sẽ xin quyền micro khi bạn bắt đầu nói. Từ chối cũng không sao — countdown, bài mẫu và checklist tự chấm vẫn chạy đầy đủ."
            : "Trình duyệt này không ghi âm được, nhưng bạn vẫn luyện đủ với countdown, bài mẫu và checklist tự chấm."}
        </p>
      </div>

      {groups.map((g) => (
        <div key={g.name} className="mb-5">
          <SectionTitle T={T}>{g.name}</SectionTitle>
          <div className="space-y-2">
            {g.items.map((s) => {
              const sc = speakScores[s.id];
              const sum = sc ? sc.reduce((a, b) => a + b, 0) : 0;
              return (
                <button key={s.id} onClick={() => setOpenId(s.id)} style={{ minHeight: 60 }}
                  className={"w-full text-left rounded-2xl border px-4 py-3 flex items-center gap-3 " + T.card + " " + T.line}>
                  <span className={"shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-base font-bold " +
                    (sum > 0 ? "bg-accent text-white" : T.soft + " " + T.sub)}>{s.no}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-base font-medium truncate">{s.title}</span>
                    <span className={"block text-sm " + T.sub}>Chuẩn bị {s.prep}s · nói {s.speak}s</span>
                  </span>
                  {sum > 0
                    ? <span className={"text-sm font-semibold shrink-0 " + T.accentText}>{sum}/12</span>
                    : <ChevronRight size={18} className={T.sub} />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
