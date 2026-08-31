"""Cân bằng vị trí đáp án đúng trong toàn bộ ngân hàng câu hỏi.

Vì sao cần: nếu đáp án đúng dồn vào một chữ cái, người học đoán mò vẫn trúng
và điểm luyện tập mất ý nghĩa. Script trộn lại thứ tự phương án sao cho đáp án
đúng rải đều A/B/C/D, đồng thời ÁNH XẠ LẠI mọi tham chiếu "(A)", "(B)"... trong
phần giải thích để chúng vẫn trỏ đúng phương án như trước.

Chỉ đổi dạng "(A)" đơn lẻ; các cụm như "(văn bản A)" của Part 7 giữ nguyên.
"""
import json, random, re, sys

SKIP = {"p7-13-3"}          # phương án "Both A and B" phụ thuộc thứ tự
REF = re.compile(r'\(([ABCD])\)')

def rebalance(groups, seed=20260829):
    rng = random.Random(seed)
    report, problems = [], []
    for name, qs in groups:
        qs = [q for q in qs if q["id"] not in SKIP and isinstance(q.get("options"), list)]
        if not qs:
            continue
        k = len(qs[0]["options"])
        # Danh sách vị trí mục tiêu rải đều, xáo trộn rồi gán lần lượt
        targets = [i % k for i in range(len(qs))]
        rng.shuffle(targets)
        for q, tgt in zip(qs, targets):
            old = list(q["options"])
            if len(old) != k:
                tgt = tgt % len(old)
            correct = old[q["ans"]]
            others = [o for i, o in enumerate(old) if i != q["ans"]]
            rng.shuffle(others)
            new = others[:tgt] + [correct] + others[tgt:]
            # old index -> new index
            m = {}
            used = set()
            for i, o in enumerate(old):
                for j, o2 in enumerate(new):
                    if j not in used and o2 == o:
                        m[i] = j; used.add(j); break
            exp = q.get("exp", "") or ""
            new_exp = REF.sub(lambda mo: "(" + "ABCD"[m["ABCD".index(mo.group(1))]] + ")", exp)
            # Kiểm chứng: mọi chữ cái được nhắc phải vẫn trỏ đúng nội dung cũ
            for a, b in zip(REF.findall(exp), REF.findall(new_exp)):
                if old["ABCD".index(a)] != new["ABCD".index(b)]:
                    problems.append(f"{q['id']}: ({a})->({b}) trỏ sai nội dung")
            q["options"], q["ans"], q["exp"] = new, tgt, new_exp
        from collections import Counter
        c = Counter(q["ans"] for q in qs)
        report.append((name, len(qs), " ".join(f"{'ABCD'[i]}={c.get(i,0)}" for i in range(k))))
    return report, problems

def main():
    L = json.load(open("src/data/listening.json", encoding="utf-8"))
    R = json.load(open("src/data/reading.json", encoding="utf-8"))
    G = json.load(open("src/data/grammar.json", encoding="utf-8"))
    flat = lambda lst: [q for x in lst for q in x["questions"]]
    groups = [
        ("Part 1", L["part1"]), ("Part 2", L["part2"]),
        ("Part 3", flat(L["part3"])), ("Part 4", flat(L["part4"])),
        ("Part 5", R["part5"]), ("Part 6", flat(R["part6"])),
        ("Part 7", flat(R["part7"])), ("Ngữ pháp", flat(G)),
    ]
    report, problems = rebalance(groups)
    if problems:
        print("DỪNG — phát hiện ánh xạ sai:")
        for p in problems[:10]: print("  ✗", p)
        sys.exit(1)
    json.dump(L, open("src/data/listening.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(R, open("src/data/reading.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(G, open("src/data/grammar.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Phân bố đáp án sau khi cân bằng:")
    for name, n, d in report:
        print(f"  {name:10} n={n:4}  {d}")

if __name__ == "__main__":
    main()
