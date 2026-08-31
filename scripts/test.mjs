// Chạy: npm run build:test && npm test
// Trước khi chạy cần: npx vite build --ssr scripts/entry.js --outDir .ssr
import { JSDOM } from "jsdom";
const w = new JSDOM("", { url: "http://localhost/" }).window;
global.window = w; global.document = w.document; global.localStorage = w.localStorage;
Object.defineProperty(global, "navigator", { value: w.navigator, configurable: true });

const { D, S, C, E, St, U, P } = await import("../.ssr/entry.js");
let fail = 0;
const ok = (name, cond, extra="") => { console.log((cond?"  ✓":"  ✗")+" "+name+(extra?"  "+extra:"")); if(!cond) fail++; };

console.log("DỮ LIỆU");
ok("nạp "+D.VOCAB.length+" từ / "+D.VOCAB_TOPICS.length+" chủ đề", D.VOCAB.length>0 && D.VOCAB_TOPICS.length>0);
ok("id từ vựng không trùng", new Set(D.VOCAB.map(w=>w.id)).size===D.VOCAB.length);
ok("không có từ lặp trong cùng chủ đề", D.VOCAB_TOPICS.every(t=>new Set(t.words.map(w=>w.w.toLowerCase())).size===t.words.length));
{
  const need = ["id","topic","w","ipa","pos","vi","ex","exVi","col"];
  const miss = D.VOCAB.filter(w=>need.some(k=>!w[k] || (k==="col" && !w.col.length)));
  ok("mọi mục đủ trường bắt buộc", miss.length===0, miss.slice(0,3).map(w=>w.w).join(", "));
  const ipa = D.VOCAB.filter(w=>!/^\/.+\/$/.test(w.ipa));
  ok("phiên âm đúng định dạng", ipa.length===0, ipa.slice(0,3).map(w=>w.w).join(", "));
}
// Kiểm theo NGƯỠNG ĐỦ DỰNG ĐỀ thay vì con số cố định, để ngân hàng lớn lên
// mà test không gãy. Một đề Full: RC 30/16/54 câu, LC 6/25/39/30 câu.
ok("ngân hàng đọc "+D.ALL_Q.length+" câu (đủ 1 đề Full RC)", D.ALL_Q.length>=100);
ok("ngân hàng nghe "+D.LISTEN_TOTAL+" câu (đủ 1 đề Full LC)", D.LISTEN_TOTAL>=100);
ok("Part 5 đủ 30 câu cho đề Full", D.P5_POOL.length>=30, D.P5_POOL.length+" câu");
ok("Part 6 đủ 16 câu cho đề Full", D.P6_Q.length>=16, D.P6_Q.length+" câu");
ok("Part 7 chia nhóm đủ dựng đề", D.P7_BY_GROUP.single.length>=8 && D.P7_BY_GROUP.double.length>=3 && D.P7_BY_GROUP.triple.length>=3);
ok("id không trùng", new Set(D.ALL_Q.map(q=>q.id)).size===D.ALL_Q.length);

{
  // Ghi chú phát âm phải là một chuỗi CÓ THẬT trong câu, nếu không sẽ không
  // tô sáng được (dùng dấu "…" trong cụm tách là lỗi hay mắc khi soạn nội dung).
  const bad = [];
  [...D.LISTEN_P3, ...D.LISTEN_P4].forEach(it =>
    it.lines.forEach(l => (l.hard || []).forEach(h => {
      if (!l.en.toLowerCase().includes(h.p.toLowerCase())) bad.push(it.id + " » " + h.p);
    })));
  ok("ghi chú phát âm tô sáng được", bad.length === 0, bad.slice(0, 3).join(" | "));

  // Mỗi dòng thoại phải trỏ tới một người nói có thật
  const sp = [];
  D.LISTEN_P3.forEach(it => it.lines.forEach(l => { if (!it.who[l.sp]) sp.push(it.id); }));
  ok("dòng thoại trỏ đúng người nói", sp.length === 0, sp.slice(0, 3).join(", "));

  // Cấu trúc đúng chuẩn đề thật: P3/P4 ba câu mỗi bài, P6 bốn chỗ trống
  const q3 = [...D.LISTEN_P3, ...D.LISTEN_P4].filter(x => x.questions.length !== 3);
  ok("mỗi bài nghe P3/P4 có đúng 3 câu", q3.length === 0, q3.map(x => x.id).join(", "));
  const q6 = D.PART6_PASSAGES.filter(p =>
    p.questions.length !== 4 || [1, 2, 3, 4].some(n => !p.body.includes("___(" + n + ")___")));
  ok("mỗi bài Part 6 có đủ 4 chỗ trống khớp câu hỏi", q6.length === 0, q6.map(x => x.id).join(", "));

  // Mọi câu phải có giải thích và không có phương án trùng nhau
  const noExp = D.ALL_Q.filter(q => !q.exp);
  ok("mọi câu đọc đều có giải thích", noExp.length === 0, noExp.slice(0, 3).map(q => q.id).join(", "));
  const dupOpt = D.ALL_Q.filter(q => new Set(q.options).size !== q.options.length);
  ok("không có phương án trùng nhau", dupOpt.length === 0, dupOpt.slice(0, 3).map(q => q.id).join(", "));

  // Ngân hàng phải có câu suy luận/hàm ý (dạng "What does the speaker imply...") —
  // đây là dạng khó của Part 3/4, cần có để đề sát thực tế.
  const p34q = [...D.LISTEN_P3, ...D.LISTEN_P4].flatMap(x => x.questions);
  const implied = p34q.filter(q => /\bimply\b|mean when|why does (he|she|the)/i.test(q.text));
  ok("có câu suy luận/hàm ý trong Part 3/4 (" + implied.length + " câu)", implied.length >= 5);
}


{
  // Đáp án đúng phải rải đều; nếu dồn vào một chữ cái thì đoán mò cũng trúng
  // và điểm luyện tập mất ý nghĩa.
  const share = (qs) => {
    const c = {};
    qs.forEach(q => { c[q.ans] = (c[q.ans] || 0) + 1; });
    return Math.max(...Object.values(c)) / qs.length;
  };
  const groups = [
    ["Đọc", D.ALL_Q],
    ["Nghe P1", D.LISTEN_P1],
    ["Nghe P2", D.LISTEN_P2],
    ["Nghe P3", D.LISTEN_P3.flatMap(x => x.questions)],
    ["Nghe P4", D.LISTEN_P4.flatMap(x => x.questions)],
  ];
  groups.forEach(([name, qs]) => {
    const s = share(qs);
    ok(name + " — đáp án rải đều (" + Math.round(s * 100) + "% cho chữ cái nhiều nhất)", s <= 0.4);
  });
}


console.log("SPACED REPETITION");
let card;
card = S.review(undefined, 2); ok("thuộc lần đầu → hộp 1, hạn +1 ngày", card.box===1 && card.due===S.today()+86400000);
card = S.review(card, 2);      ok("thuộc lần hai → hộp 2, hạn +3 ngày", card.box===2);
card = S.review(card, 0);      ok("sai → về hộp 0, hạn hôm nay", card.box===0 && S.isDue(card));
let c3 = {box:3,due:S.today()+7*86400000,seen:5,right:4};
ok("hộp 3 tính là đã thuộc", S.isLearned(c3));
ok("hộp 3 chưa tới hạn thì không hiện", !S.isDue(c3));
const srs = { v01:{box:0,due:S.today(),seen:1,right:0}, v02:c3 };
const q = S.buildQueue(D.VOCAB, srs, 20, 8);
ok("hàng hôm nay ưu tiên thẻ đến hạn rồi bù từ mới ("+q.length+" thẻ)", q.length===9 && q[0].id==="v01");
ok("streak 3 ngày liên tiếp", S.streakOf([S.dayKey(), S.dayKey(Date.now()-86400000), S.dayKey(Date.now()-2*86400000)])===3);
ok("streak đứt thì reset", S.streakOf([S.dayKey(Date.now()-5*86400000)])===0);

console.log("ĐIỂM");
ok("89/100 LC ≈ 455", C.estimateLC(89,100)===455);
ok("89/100 RC ≈ 425", C.estimateRC(89,100)===425);
ok("mục tiêu lộ trình ra 560–660", (C.estimateLC(61,100)+C.estimateRC(55,100))===560 && (C.estimateLC(69,100)+C.estimateRC(66,100))===660);
ok("CEFR theo điểm tổng", C.cefrOf(990)==="C1" && C.cefrOf(800)==="B2" && C.cefrOf(625)==="B1");
ok("điểm luôn bội số 5", [13,47,89].every(n=>C.estimateRC(n,100)%5===0));

console.log("DỰNG ĐỀ");
for (const [name, spec, want] of [
  ["Mini Reading", {p5:16,p6:8,p7:{single:16,double:0,triple:0}}, 40],
  ["Full Reading", {p5:30,p6:16,p7:{single:24,double:15,triple:15}}, 100]]) {
  let bad=0, dup=0;
  for (let i=0;i<200;i++){ const t=E.buildTest(spec); if(t.length!==want)bad++; if(new Set(t.map(q=>q.id)).size!==t.length)dup++; }
  ok(name+" luôn ra "+want+" câu, không lặp", bad===0&&dup===0);
}
for (const [name, spec, want] of [
  ["Mini Listening", {p1:3,p2:8,p3:2,p4:1}, 20],
  ["Nửa đề Listening", {p1:6,p2:16,p3:3,p4:3}, 40],
  ["Full Listening", {p1:6,p2:25,p3:13,p4:10}, 100]]) {
  let bad=0;
  for (let i=0;i<200;i++){ if(E.examQuestionCount(E.buildListeningExam(spec))!==want)bad++; }
  ok(name+" luôn ra "+want+" câu", bad===0);
}

console.log("KẾ HOẠCH HẰNG NGÀY");
{
  const emptyStats = { listening:{1:{c:0,t:0},2:{c:0,t:0},3:{c:0,t:0},4:{c:0,t:0}}, reading:{5:{c:0,t:0},6:{c:0,t:0},7:{c:0,t:0}} };
  // Người mới: chưa có srs, chưa có thống kê → vẫn phải có nhiệm vụ từ vựng + 1 dạng bài
  const p1 = P.buildDailyPlan({ totalWords: 3000, srs: {}, stats: emptyStats, dateStr: "2026-08-25", doneToday: {} });
  ok("người mới vẫn có nhiệm vụ", p1.tasks.length>=2 && p1.tasks[0].id==="vocab");
  ok("nhiệm vụ từ vựng gợi ý học từ mới", p1.tasks[0].desc.includes("từ mới"));
  // Có phần yếu (Part 5 đúng 40%) → phải xuất hiện nhiệm vụ ôn phần yếu đó
  const weakStats = JSON.parse(JSON.stringify(emptyStats));
  weakStats.reading[5] = { c: 4, t: 10 };
  const p2 = P.buildDailyPlan({ totalWords: 3000, srs: {}, stats: weakStats, dateStr: "2026-08-25", doneToday: {} });
  ok("phát hiện phần yếu để ôn", p2.tasks.some(t=>t.id==="weak" && t.label.includes("Part 5")));
  // Đánh dấu xong đếm đúng và allDone khi đủ
  const allDone = {}; p2.tasks.forEach(t=>allDone[t.id]=true);
  const p3 = P.buildDailyPlan({ totalWords: 3000, srs: {}, stats: weakStats, dateStr: "2026-08-25", doneToday: allDone });
  ok("đếm hoàn thành đúng", p3.doneCount===p3.total && p3.allDone===true);
  // Có thẻ đến hạn → nhiệm vụ từ vựng phải nói tới việc ôn
  const dueSrs = { w1:{box:1,due:0,seen:2,right:1}, w2:{box:1,due:0,seen:2,right:1} };
  const p4 = P.buildDailyPlan({ totalWords: 3000, srs: dueSrs, stats: emptyStats, dateStr: "2026-08-25", doneToday: {} });
  ok("có thẻ đến hạn thì nhắc ôn", p4.tasks[0].desc.includes("đến hạn"));
}

console.log("LƯU TRỮ");
const blank = St.load();
ok("khởi tạo trạng thái rỗng", blank.srs && blank.days.length===0);
blank.srs.v01 = {box:2,due:123,seen:3,right:2}; blank.days.push("2026-08-25");
ok("ghi xuống localStorage", St.save(blank));
const back = St.load();
ok("đọc lại đúng nguyên vẹn", back.srs.v01.box===2 && back.days[0]==="2026-08-25");
ok("xuất/nhập JSON khứ hồi", St.importJSON(St.exportJSON(back)).srs.v01.box===2);
ok("xoá sạch dữ liệu", St.reset().days.length===0 && St.load().days.length===0);

console.log("TIỆN ÍCH");
const d = U.diffWords("Please send me the updated figures before the end of the day.","please send me the updated figure before the end of day");
ok("chép chính tả bắt đúng 2 từ sai", d.words.filter((_,i)=>!d.mark[i]).join(" ")==="figures the");
{
  const fail = D.VOCAB.filter(v=>!U.blankSentence(v).text.includes("_______"));
  ok("khoét được chỗ trống cho cả "+D.VOCAB.length+" từ", fail.length===0, fail.slice(0,5).map(w=>w.w).join(", "));
}

console.log("KHẢ NĂNG TIẾP CẬN");
{
  // Quét mã nguồn: mọi nút icon-only (có minWidth, tức chỉ chứa icon) phải có
  // aria-label, nếu không trình đọc màn hình sẽ đọc trống. Test này chốt để
  // lần sau thêm nút mới mà quên nhãn sẽ bị bắt ngay.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = "src";
  const files = [];
  const walk = (d) => fs.readdirSync(d).forEach((f) => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== "data") walk(p); }
    else if (f.endsWith(".jsx")) files.push(p);
  });
  walk(dir);
  const unlabeled = [];
  for (const f of files) {
    const lines = fs.readFileSync(f, "utf-8").split("\n");
    lines.forEach((l, i) => {
      if (l.includes("minWidth:") && l.includes("<button") && !l.includes("aria-label")) {
        unlabeled.push(f + ":" + (i + 1));
      }
    });
  }
  ok("mọi nút icon-only đều có aria-label", unlabeled.length === 0, unlabeled.slice(0, 4).join(", "));

  // Điều hướng phải đánh dấu trang hiện tại cho trình đọc màn hình
  const app = fs.readFileSync("src/App.jsx", "utf-8");
  ok('điều hướng có aria-current đánh dấu trang', app.includes('aria-current'));
  ok('vùng nav có nhãn', (app.match(/nav aria-label/g) || []).length >= 2);
}

console.log("NÓI (Speaking)");
{
  const SP = D.SPEAKING;
  // Màn Nói chia set bằng slice(i, i+11) nên tổng số câu phải chia hết cho 11
  ok("số câu Nói chia hết thành set (" + SP.length + " câu = " + (SP.length/11) + " set)", SP.length % 11 === 0);

  // Mỗi set phải có đúng 11 câu theo thứ tự no = 1..11 (nếu lệch, giao diện gán sai câu)
  let setBad = [];
  for (let i = 0; i < SP.length; i += 11) {
    const nos = SP.slice(i, i + 11).map(x => x.no).join(",");
    if (nos !== "1,2,3,4,5,6,7,8,9,10,11") setBad.push("set@" + i + ": " + nos);
  }
  ok("mỗi set đủ 11 câu đúng thứ tự", setBad.length === 0, setBad.slice(0, 2).join(" | "));

  // Field bắt buộc theo từng dạng — thiếu 'read' ở câu table từng làm Q9/Q10 bỏ qua
  // giai đoạn đọc bảng 45 giây (bug đã sửa). Test này chốt để không tái diễn.
  const REQ = {
    read: ["text", "marks", "outline", "prep", "speak"],
    picture: ["scene", "frame", "vocab", "sample", "outline"],
    qa: ["scenario", "question", "sample", "outline"],
    table: ["scenario", "question", "sample", "agenda", "read", "outline"],
    opinion: ["question", "sample", "outline"],
  };
  let fieldBad = [];
  SP.forEach(x => (REQ[x.kind] || []).forEach(f => {
    const v = x[f];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) fieldBad.push(x.id + "»" + f);
  }));
  ok("mọi câu Nói đủ field bắt buộc theo dạng", fieldBad.length === 0, fieldBad.slice(0, 4).join(", "));

  // Mỗi câu table phải có agenda RIÊNG với title + rows (sửa lỗi 3 set dùng chung 1 lịch)
  const tables = SP.filter(x => x.kind === "table");
  const agBad = tables.filter(x => !x.agenda || !x.agenda.title || !(x.agenda.rows && x.agenda.rows.length));
  ok("mỗi câu bảng có agenda riêng hợp lệ", agBad.length === 0, agBad.map(x => x.id).join(", "));

  // Tranh mô tả (Q3–4) phải trỏ tới scene CÓ THẬT, nếu không sẽ về hình mặc định
  const SCENES = new Set(["desk","meeting","boxes","platform","cafe","construction","office","kitchen","park","store"]);
  const sceneBad = SP.filter(x => x.kind === "picture" && !SCENES.has(x.scene));
  ok("tranh mô tả trỏ đúng scene có sẵn", sceneBad.length === 0, sceneBad.map(x => x.id + "(" + x.scene + ")").join(", "));

  // ID không trùng
  ok("id câu Nói không trùng", new Set(SP.map(x => x.id)).size === SP.length);
}

console.log(fail ? "\n"+fail+" KIỂM THỬ HỎNG" : "\nTẤT CẢ KIỂM THỬ ĐẠT");
process.exit(fail?1:0);
