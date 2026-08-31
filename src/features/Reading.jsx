import React from "react";
import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Check, ChevronRight, Clock, Lightbulb, ListChecks, X } from "lucide-react";
import { ALL_Q, GRAMMAR, P5_Q, P6_Q, P7_BY_GROUP, P7_Q, PASSAGE_BY_ID, Q_BY_ID } from "../data/reading.js";
import { LETTERS } from "../lib/utils.js";
import { pct } from "../lib/scoring.js";
import { Bar, Ghost, Primary, SectionTitle, PageHeader, PartMark, ChoiceBadge } from "../ui/index.jsx";

/* ═══════════════════════════════════════════════════════════════════
   6. HIỂN THỊ BÀI ĐỌC & CÂU HỎI
   ═══════════════════════════════════════════════════════════════════ */

export function PassageBox({ passage, T, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  if (!passage) return null;
  const parts = passage.bodyA
    ? [{ label: "Văn bản 1", text: passage.bodyA }, { label: "Văn bản 2", text: passage.bodyB }]
        .concat(passage.bodyC ? [{ label: "Văn bản 3", text: passage.bodyC }] : [])
    : [{ label: null, text: passage.body }];
  return (
    <div className={"rounded-2xl border mb-4 " + T.passage}>
      <button onClick={() => setOpen((o) => !o)} style={{ minHeight: 48 }}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2">
          <span className={"text-xs font-semibold px-2 py-1 rounded-full " + T.accentSoft}>{passage.kind}</span>
          <span className="text-base font-semibold">{passage.title}</span>
        </span>
        <ChevronRight size={20} className={"transition-transform " + (open ? "rotate-90" : "")} />
      </button>
      {open && (
        <div className={"px-4 pb-4 border-t pt-3 " + T.line}>
          {parts.map((p, i) => (
            <div key={i} className={i > 0 ? "mt-4 pt-4 border-t " + T.line : ""}>
              {p.label && <p className={"text-xs font-semibold uppercase tracking-wide mb-2 " + T.sub}>{p.label}</p>}
              <p className="text-base leading-relaxed whitespace-pre-line">{p.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuestionCard({ q, index, total, chosen, reveal, onPick, T, dark, saved, onToggleSave, showSave }) {
  return (
    <div key={q.id} className="animate-fade">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-base font-medium leading-relaxed flex-1">
          <span className={"font-bold mr-2 " + T.accentText}>{typeof index === "number" ? index + 1 + "." : ""}</span>
          {q.text}
        </p>
        {showSave && (
          <button onClick={() => onToggleSave(q.id)} aria-label={saved ? "Bỏ lưu câu này" : "Lưu câu này"} aria-pressed={saved} style={{ minHeight: 44, minWidth: 44 }}
            className={"shrink-0 rounded-full p-3 " + T.soft}>
            {saved ? <BookmarkCheck size={18} className={T.accentText} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = T.card + " " + T.line;
          let badge = "default";
          if (reveal) {
            if (i === q.ans) { cls = T.okBox; badge = "correct"; }
            else if (i === chosen) { cls = T.noBox; badge = "wrong"; }
            else cls = T.card + " " + T.line + " opacity-55";
          } else if (i === chosen) {
            cls = "bg-accent-tint border-accent";
            badge = "chosen";
          }
          return (
            <button key={i} onClick={() => onPick(i)} disabled={reveal} style={{ minHeight: 52 }}
              className={"group w-full text-left rounded-xl border px-3.5 py-3 flex items-center gap-3 transition-all " + (reveal ? "" : "hover:shadow-sm active:scale-[0.995] ") + cls}>
              <ChoiceBadge letter={LETTERS[i]} state={badge} T={T} />
              <span className="text-[15px] leading-relaxed flex-1">{opt}</span>
              {reveal && i === q.ans && <Check size={19} className="shrink-0" />}
              {reveal && i === chosen && i !== q.ans && <X size={19} className="shrink-0" />}
            </button>
          );
        })}
      </div>

      {reveal && (
        <div className={"mt-3 rounded-2xl border p-4 " + T.soft + " " + T.line}>
          <p className={"flex items-center gap-2 text-sm font-semibold mb-2 " + (chosen === q.ans ? T.okText : T.noText)}>
            {chosen === q.ans ? <Check size={16} /> : <X size={16} />}
            {chosen === q.ans ? "Chính xác" : "Đáp án đúng: " + LETTERS[q.ans]}
          </p>
          <p className={"text-base leading-relaxed " + T.softText}>{q.exp}</p>
        </div>
      )}
      {typeof total === "number" && (
        <p className={"text-sm text-center mt-4 " + T.sub}>Câu {index + 1} / {total}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   7. LUYỆN TẬP THEO PART
   ═══════════════════════════════════════════════════════════════════ */

export function PracticeScreen({ part, T, dark, onBack, onAnswer, saved, onToggleSave }) {
  const list = part === 5 ? P5_Q : part === 6 ? P6_Q : P7_Q;
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);
  const q = list[i];
  const passage = q.passageId ? PASSAGE_BY_ID[q.passageId] : null;
  const prevPassage = i > 0 && list[i - 1].passageId === q.passageId;

  const pick = (idx) => {
    if (reveal) return;
    setChosen(idx);
    setReveal(true);
    onAnswer(part, idx === q.ans, q.id);
  };
  const next = () => {
    if (i + 1 >= list.length) { onBack(); return; }
    setI(i + 1); setChosen(null); setReveal(false);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-lg font-bold">Part {part}</p>
          <p className={"text-sm " + T.sub}>Câu {i + 1} / {list.length}</p>
        </div>
      </div>

      <div className="mb-4"><Bar value={((i + (reveal ? 1 : 0)) / list.length) * 100} T={T} /></div>

      {passage && <PassageBox key={passage.id} passage={passage} T={T} defaultOpen={!prevPassage} />}

      <QuestionCard q={q} index={i} chosen={chosen} reveal={reveal} onPick={pick} T={T} dark={dark}
        saved={saved.indexOf(q.id) !== -1} onToggleSave={onToggleSave} showSave />

      <div className="mt-5 mb-4">
        {reveal
          ? <Primary onClick={next}>{i + 1 >= list.length ? "Hoàn thành" : "Câu tiếp theo"}</Primary>
          : <p className={"text-center text-base " + T.sub}>Chọn một đáp án để xem giải thích</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   8. CÂU ĐÃ LƯU
   ═══════════════════════════════════════════════════════════════════ */

export function SavedScreen({ T, dark, onBack, saved, onToggleSave }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-lg font-bold">Câu đã lưu</p>
          <p className={"text-sm " + T.sub}>{saved.length} câu</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className={"rounded-2xl border p-8 text-center " + T.card + " " + T.line}>
          <Bookmark className={"mx-auto mb-3 " + T.sub} size={36} />
          <p className="text-base font-medium mb-1">Chưa lưu câu nào</p>
          <p className={"text-base " + T.sub}>Nhấn biểu tượng dấu trang ở góc phải mỗi câu để lưu lại và ôn sau.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {saved.map((id) => {
            const q = Q_BY_ID[id];
            if (!q) return null;
            const open = openId === id;
            return (
              <div key={id} className={"rounded-2xl border " + T.card + " " + T.line}>
                <button onClick={() => setOpenId(open ? null : id)} style={{ minHeight: 52 }} className="w-full text-left px-4 py-3">
                  <span className={"text-xs font-semibold px-2 py-1 rounded-full mr-2 " + T.accentSoft}>Part {q.part}</span>
                  <span className="text-base">{q.text.length > 70 ? q.text.slice(0, 70) + "…" : q.text}</span>
                </button>
                {open && (
                  <div className={"px-4 pb-4 border-t pt-3 " + T.line}>
                    {q.passageId && <PassageBox passage={PASSAGE_BY_ID[q.passageId]} T={T} defaultOpen={false} />}
                    <div className="space-y-1 mb-3">
                      {q.options.map((o, i2) => (
                        <p key={i2} className={"text-base " + (i2 === q.ans ? "font-semibold " + T.okText : T.softText)}>
                          {LETTERS[i2]}. {o}
                        </p>
                      ))}
                    </div>
                    <div className={"rounded-2xl p-3 mb-3 " + T.soft}>
                      <p className={"text-base leading-relaxed " + T.softText}>{q.exp}</p>
                    </div>
                    <Ghost onClick={() => onToggleSave(id)} T={T} className="w-full">Bỏ lưu câu này</Ghost>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   8b. LUYỆN NGỮ PHÁP
   ═══════════════════════════════════════════════════════════════════ */

export function GrammarScreen({ T, dark, onBack, grammarStats, onGrammarAnswer, saved, onToggleSave }) {
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("theory");
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);

  const topic = openId ? GRAMMAR.filter((g) => g.id === openId)[0] : null;

  const openTopic = (id) => { setOpenId(id); setTab("theory"); setI(0); setChosen(null); setReveal(false); };
  const pick = (idx) => {
    if (reveal) return;
    setChosen(idx); setReveal(true);
    onGrammarAnswer(topic.id, idx === topic.questions[i].ans, topic.questions[i].id);
  };
  const next = () => {
    if (i + 1 >= topic.questions.length) { setI(0); setTab("theory"); setChosen(null); setReveal(false); return; }
    setI(i + 1); setChosen(null); setReveal(false);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* bỏ qua */ }
  };

  if (!topic) {
    const totalQ = GRAMMAR.reduce((n, g) => n + g.questions.length, 0);
    return (
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} aria-label="Quay lại" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-lg font-bold">Ngữ pháp TOEIC</p>
            <p className={"text-sm " + T.sub}>{GRAMMAR.length} chuyên đề · {totalQ} câu luyện</p>
          </div>
        </div>
        <div className={"rounded-2xl p-4 mb-5 flex gap-3 " + T.soft}>
          <Lightbulb size={18} className={"shrink-0 mt-1 " + T.accentText} />
          <p className={"text-base leading-relaxed " + T.softText}>
            Học theo tần suất ra đề: từ loại, liên từ và dạng động từ chiếm gần nửa số câu Part 5. Mỗi chuyên đề gồm bảng dấu hiệu nhận biết, bẫy hay gặp và bài tập chấm ngay.
          </p>
        </div>
        <div className="space-y-3 mb-4">
          {GRAMMAR.map((g) => {
            const s = grammarStats[g.id] || { c: 0, t: 0 };
            return (
              <button key={g.id} onClick={() => openTopic(g.id)}
                className={"w-full text-left rounded-2xl border p-4 " + T.card + " " + T.line}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className="text-base font-semibold">{g.name}</span>
                  <span className={"text-xs shrink-0 px-2 py-1 rounded-full " + T.accentSoft}>{g.freq}</span>
                </div>
                <p className={"text-base mb-3 " + T.sub}>{g.level} · {g.questions.length} câu</p>
                {s.t > 0 ? (
                  <>
                    <Bar value={pct(s.c, s.t)} T={T} />
                    <p className={"text-sm mt-2 " + T.sub}>Đã làm {s.t} câu · đúng {pct(s.c, s.t)}%</p>
                  </>
                ) : <p className={"text-sm " + T.accentText}>Chưa luyện</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const q = topic.questions[i];
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setOpenId(null)} aria-label="Đóng" style={{ minHeight: 44, minWidth: 44 }} className={"rounded-full p-3 " + T.soft}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate">{topic.name}</p>
          <p className={"text-sm " + T.sub}>{topic.freq}</p>
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-1 rounded-2xl p-1 mb-5 " + T.soft}>
        {[["theory", "Lý thuyết"], ["drill", "Luyện tập"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ minHeight: 44 }}
            className={"rounded-xl text-base font-medium transition-colors " +
              (tab === k ? "bg-accent text-white" : T.softText)}>{label}</button>
        ))}
      </div>

      {tab === "theory" ? (
        <div className="animate-fade">
          <p className="text-base leading-relaxed mb-5">{topic.intro}</p>
          {topic.rules.map((r) => (
            <div key={r.h} className={"rounded-2xl border p-4 mb-3 " + T.card + " " + T.line}>
              <p className={"text-sm font-semibold uppercase tracking-wide mb-3 " + T.accentText}>{r.h}</p>
              <ul className="space-y-2">
                {r.lines.map((l) => (
                  <li key={l} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full shrink-0 bg-accent" />
                    <span className="text-base leading-relaxed">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={"rounded-2xl border p-4 mb-4 " + (dark ? "bg-amber-950 border-amber-800" : "bg-amber-50 border-amber-200")}>
            <p className={"text-sm font-semibold uppercase tracking-wide mb-2 " + (dark ? "text-amber-300" : "text-amber-700")}>Bẫy hay gặp</p>
            <ul className="space-y-2">
              {topic.traps.map((t) => (
                <li key={t} className={"text-base leading-relaxed " + (dark ? "text-amber-100" : "text-amber-900")}>• {t}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4"><Primary onClick={() => setTab("drill")}>Làm {topic.questions.length} câu luyện tập</Primary></div>
        </div>
      ) : (
        <div>
          <div className="mb-4"><Bar value={((i + (reveal ? 1 : 0)) / topic.questions.length) * 100} T={T} /></div>
          <QuestionCard q={q} index={i} total={topic.questions.length} chosen={chosen} reveal={reveal}
            onPick={pick} T={T} dark={dark} saved={saved.indexOf(q.id) !== -1} onToggleSave={onToggleSave} showSave />
          <div className="mt-5 mb-4">
            {reveal
              ? <Primary onClick={next}>{i + 1 >= topic.questions.length ? "Hoàn thành chuyên đề" : "Câu tiếp theo"}</Primary>
              : <p className={"text-center text-base " + T.sub}>Chọn một đáp án để xem giải thích</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   10. TAB ĐỌC — luyện theo Part và ngữ pháp
   ═══════════════════════════════════════════════════════════════════ */

export function ReadingScreen({ T, dark, stats, grammarStats, onAnswer, onGrammarAnswer, saved, onToggleSave }) {
  const [view, setView] = useState("menu");

  if (view === "grammar") return <GrammarScreen T={T} dark={dark} onBack={() => setView("menu")}
    grammarStats={grammarStats} onGrammarAnswer={onGrammarAnswer} saved={saved} onToggleSave={onToggleSave} />;
  if (view === "p5") return <PracticeScreen part={5} T={T} dark={dark} onBack={() => setView("menu")} onAnswer={onAnswer} saved={saved} onToggleSave={onToggleSave} />;
  if (view === "p6") return <PracticeScreen part={6} T={T} dark={dark} onBack={() => setView("menu")} onAnswer={onAnswer} saved={saved} onToggleSave={onToggleSave} />;
  if (view === "p7") return <PracticeScreen part={7} T={T} dark={dark} onBack={() => setView("menu")} onAnswer={onAnswer} saved={saved} onToggleSave={onToggleSave} />;
  if (view === "saved") return <SavedScreen T={T} dark={dark} onBack={() => setView("menu")} saved={saved} onToggleSave={onToggleSave} />;

  const cards = [
    { key: "p5", part: 5, name: "Điền vào câu", desc: "Ngữ pháp và từ vựng, mục tiêu 20 giây mỗi câu", n: P5_Q.length },
    { key: "p6", part: 6, name: "Điền vào đoạn", desc: "Có cả dạng chèn nguyên một câu vào đoạn", n: P6_Q.length },
    { key: "p7", part: 7, name: "Đọc hiểu", desc: P7_BY_GROUP.single.length + " single · " + P7_BY_GROUP.double.length + " double · " + P7_BY_GROUP.triple.length + " triple", n: P7_Q.length },
  ];
  const grammarDone = GRAMMAR.reduce((n, g) => n + ((grammarStats[g.id] || { t: 0 }).t), 0);
  const grammarQ = GRAMMAR.reduce((n, g) => n + g.questions.length, 0);

  return (
    <div className="px-4 pt-4">
      <PageHeader T={T} eyebrow="Kỹ năng đọc · Part 5–7"
        title="Luyện đọc"
        sub={ALL_Q.length + " câu · chấm ngay và giải thích tiếng Việt"} />

      <SectionTitle T={T}>Ngữ pháp</SectionTitle>
      <button onClick={() => setView("grammar")} className={"w-full text-left rounded-2xl border p-4 mb-6 " + T.card + " " + T.line}>
        <div className="flex items-start gap-4">
          <span className={"shrink-0 rounded-2xl p-3 " + T.soft}><ListChecks size={22} className={T.accentText} /></span>
          <span className="flex-1 min-w-0">
            <span className="block text-base font-semibold mb-1">{GRAMMAR.length} chuyên đề ngữ pháp</span>
            <span className={"block text-base mb-2 " + T.sub}>Từ loại, dạng động từ, thì, bị động, liên từ, mệnh đề quan hệ, so sánh, đại từ, giả định</span>
            <span className={"block text-sm " + (grammarDone ? T.sub : T.accentText)}>
              {grammarDone ? "Đã làm " + grammarDone + " lượt / " + grammarQ + " câu" : "Bắt đầu từ chuyên đề Từ loại"}
            </span>
          </span>
        </div>
      </button>

      <SectionTitle T={T}>Luyện theo Part</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {cards.map((c) => {
          const s = stats.reading[c.part];
          const done = s.t > 0;
          return (
            <button key={c.key} onClick={() => setView(c.key)}
              className={"group w-full text-left rounded-2xl border p-4 transition-all hover:shadow-sm active:scale-[0.99] " + T.card + " " + T.line}>
              <div className="flex items-start gap-3">
                <PartMark n={c.part} T={T} active={done} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[15px]">{c.name}</span>
                    <span className={"text-[13px] shrink-0 tnum " + T.sub}>{c.n} câu</span>
                  </div>
                  <p className={"text-[13px] mt-0.5 mb-2.5 " + T.sub}>{c.desc}</p>
                  {done ? (
                    <>
                      <Bar value={pct(s.c, s.t)} T={T} />
                      <p className={"text-[13px] mt-1.5 " + T.sub}>Đã làm {s.t} câu · đúng <span className="font-semibold tnum">{pct(s.c, s.t)}%</span></p>
                    </>
                  ) : <p className={"text-[13px] font-medium " + T.accentText}>Chưa luyện — bắt đầu ngay →</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button onClick={() => setView("saved")} style={{ minHeight: 52 }}
        className={"w-full rounded-2xl border px-4 py-3 flex items-center justify-between mb-4 " + T.card + " " + T.line}>
        <span className="flex items-center gap-2 text-base font-medium">
          <BookmarkCheck size={18} className={T.accentText} /> Câu đã lưu
        </span>
        <span className={"text-base " + T.sub}>{saved.length}</span>
      </button>

      <div className={"rounded-2xl p-4 mb-4 flex gap-3 " + T.soft}>
        <Clock size={18} className={"shrink-0 mt-1 " + T.accentText} />
        <p className={"text-base leading-relaxed " + T.softText}>
          Bấm giờ làm đề đã chuyển sang tab Thi thử, tách riêng theo kỹ năng Nghe và Đọc.
        </p>
      </div>
    </div>
  );
}
