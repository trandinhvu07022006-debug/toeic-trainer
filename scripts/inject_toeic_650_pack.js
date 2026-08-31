const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/listening.json');
const readingPath = path.join(__dirname, '../src/data/reading.json');

try {
    let dbListen = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    let dbRead = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

    // --- PART 2 (TOEIC 650-700 Level - Format ETS) ---
    const part2_650 = [
        {
            "id": "l2-ets-1",
            "question": "Has the manufacturing report been finalized, or is it still being reviewed?",
            "options": [
                "It's on the manager's desk for final approval.",
                "They manufacture heavy machinery.",
                "Yes, I reviewed it last week."
            ],
            "ans": 0,
            "exp": "Bẫy từ vựng 'manufacture / review'. Đáp án A là câu trả lời gián tiếp rất phổ biến trong TOEIC mục tiêu 700: 'Nó đang nằm trên bàn sếp để duyệt cuối cùng' (tức là still being reviewed)."
        },
        {
            "id": "l2-ets-2",
            "question": "Who's handling the vendor negotiations for the software upgrade?",
            "options": [
                "I'll handle the software installation.",
                "A new vendor just arrived.",
                "Actually, Ms. Peterson took over that project."
            ],
            "ans": 2,
            "exp": "Hỏi 'Who' (Ai làm thương lượng). C bẫy gián tiếp 'Thực ra bà Peterson đã tiếp quản dự án đó rồi'. A và B lặp từ bẫy 'handle / vendor'."
        },
        {
            "id": "l2-ets-3",
            "question": "Why don't we schedule the client meeting for Thursday morning?",
            "options": [
                "Thursday's flight departs at 8 AM.",
                "I've got a scheduling conflict until noon.",
                "Yes, nice to meet you too."
            ],
            "ans": 1,
            "exp": "Câu đề nghị (Why don't we). Người nghe từ chối khéo: 'Tôi bị kẹt lịch trình đến tận trưa' (scheduling conflict). Đáp án B là cấu trúc điển hình Toeic 650+."
        },
        {
            "id": "l2-ets-4",
            "question": "Could you let me know when the marketing budget is approved?",
            "options": [
                "Sure, I'll send you an email right away.",
                "The market is quite competitive right now.",
                "It's approximately five thousand dollars."
            ],
            "ans": 0,
            "exp": "Câu nhờ vả 'Could you let me know'. A đồng ý: 'Chắc chắn rồi, tớ sẽ email cậu ngay'."
        }
    ];

    // --- PART 3 (TOEIC 650-700 Level) ---
    const part3_650 = [
        {
            "id": "l3-ets-1",
            "audio": "",
            "transcript": "M: Excuse me, I received this invoice for the office supplies we ordered last Monday, but the total amount seems incorrect. We were quoted $150, but we've been billed for $200.\nW: Let me check your account, Mr. Harrison. Ah, I see the issue. The initial quote didn't include the expedited shipping fee you requested over the phone on Tuesday.\nM: Oh, you're right. I completely forgot I asked for overnight delivery. I'll pass this along to our accounting department to process the payment today.",
            "questions": [
                {
                    "id": "q-ets-3-1",
                    "q": "Why is the man talking to the woman?",
                    "options": [
                        "To place an order for supplies",
                        "To question a billing amount",
                        "To expedite a delivery",
                        "To open a new corporate account"
                    ],
                    "ans": 1,
                    "exp": "Anh ấy nói 'the total amount seems incorrect' -> Question a billing amount."
                },
                {
                    "id": "q-ets-3-2",
                    "q": "What caused the price difference?",
                    "options": [
                        "A late payment fee",
                        "An error in the computer system",
                        "An extra charge for fast shipping",
                        "A missing discount code"
                    ],
                    "ans": 2,
                    "exp": "Cô gái giải thích: 'didn't include the expedited shipping fee'."
                },
                {
                    "id": "q-ets-3-3",
                    "q": "What will the man do next?",
                    "options": [
                        "Call the shipping company",
                        "Send the document to accounting",
                        "Cancel the current order",
                        "Sign a new contract"
                    ],
                    "ans": 1,
                    "exp": "Anh ấy nói 'pass this along to our accounting department'."
                }
            ]
        }
    ];

    // --- PART 5 (READING TOEIC 650-700) ---
    const part5_650 = [
        {
            "id": "r5-ets-1",
            "q": "Employees are reminded that all vacation requests must be submitted to the HR manager ------- two weeks in advance.",
            "options": ["at least", "almost", "soon", "before"],
            "ans": 0,
            "exp": "Cụm từ cố định 'at least + khoảng thời gian + in advance': Trước ít nhất bao lâu đó."
        },
        {
            "id": "r5-ets-2",
            "q": "The new marketing strategy is expected to be more ------- than the previous one, targeting a wider demographic.",
            "options": ["effectively", "effective", "effectiveness", "effects"],
            "ans": 1,
            "exp": "Cấu trúc 'be + more + Adj'. Chọn tính từ 'effective'."
        },
        {
            "id": "r5-ets-3",
            "q": "------- the heavy rain delay, the construction crew managed to finish laying the foundation on schedule.",
            "options": ["Even though", "However", "Despite", "While"],
            "ans": 2,
            "exp": "Phía sau chỗ trống là danh từ/cụm danh từ 'the heavy rain delay', mang nghĩa nhượng bộ nên dùng 'Despite'. (Even though / While đi với mệnh đề)."
        }
    ];

    dbListen.part2.push(...part2_650);
    dbListen.part3.push(...part3_650);

    if (dbRead.part5) {
        dbRead.part5.push(...part5_650);
    }

    fs.writeFileSync(targetPath, JSON.stringify(dbListen, null, 1));
    fs.writeFileSync(readingPath, JSON.stringify(dbRead, null, 1));

    console.log(`\n✅ THÀNH CÔNG: Đã bơm bộ Đề Chuẩn ETS (Mục tiêu 650-700) vào kho luyện thi!`);
    console.log(`Đã thêm ${part2_650.length} câu Listening P2, ${part3_650.length} bài hội thoại P3, và ${part5_650.length} câu Reading P5.`);

} catch (err) {
    console.error("LỖI: ", err);
}
