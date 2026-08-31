const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/listening.json');

try {
    let db = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    // --- PART 1 ---
    const extraPart1 = [
        {
            "id": "l1-kmg-1",
            "scene": "guitar",
            "caption": "Một người đang đánh đàn Guitar",
            "options": [
                "He is tuning an instrument.",
                "The man is playing an electric guitar.",
                "A microphone is being packed away.",
                "The stage has been cleared."
            ],
            "ans": 1,
            "exp": "(B) Đúng: Người đàn ông đang chơi đàn. (A) Sai: tune (chỉnh dây) chứ không phải chơi. (C) và (D) không hề có trong cảnh."
        },
        {
            "id": "l1-kmg-2",
            "scene": "studio",
            "caption": "Phòng thu âm với tai nghe",
            "options": [
                "A musician is recording vocals.",
                "Headphones are placed on a desk.",
                "Some cables are being untangled.",
                "The soundboard is completely empty."
            ],
            "ans": 1,
            "exp": "(B) Đúng: Tai nghe (headphones) được đặt trên bàn. (A) Sai: không có nhạc sĩ nào đang thu âm trong hình. (C) Sai: không ai đang gỡ cáp."
        },
        {
            "id": "l1-kmg-3",
            "scene": "concert",
            "caption": "Ban nhạc biểu diễn trên sân khấu",
            "options": [
                "The audience is taking their seats.",
                "Instruments have been left unattended.",
                "A band is performing live on stage.",
                "Tickets are being sold at the entrance."
            ],
            "ans": 2,
            "exp": "(C) Đúng: Ban nhạc đang biểu diễn trực tiếp (performing live) trên sân khấu."
        },
        {
            "id": "l1-kmg-4",
            "scene": "amplifier",
            "caption": "Bộ bốc âm thanh (Amp) trên mặt đất",
            "options": [
                "An amplifier is positioned on the floor.",
                "Speaker cables are being replaced.",
                "A guitarist is plugging in his cord.",
                "The equipment is being loaded onto a truck."
            ],
            "ans": 0,
            "exp": "(A) Đúng: Amply (amplifier) được đặt dưới sàn. (B, C, D) dùng thì hiện tại tiếp diễn chỉ hành động đang xảy ra, nhưng trong hình tĩnh không có con người thực hiện."
        },
        {
            "id": "l1-kmg-5",
            "scene": "drums",
            "caption": "Bộ trống đã setup xong",
            "options": [
                "The drum set is ready for a performance.",
                "A drummer is striking the cymbals.",
                "Drumsticks are being handed out.",
                "The instruments are covered with a tarp."
            ],
            "ans": 0,
            "exp": "(A) Đúng: Bộ trống (drum set) đã sẵn sàng. Tránh bẫy (B) vì không có người đánh trống (drummer)."
        }
    ];

    // --- PART 2 ---
    const extraPart2 = [
        {
            "id": "l2-kmg-1",
            "question": "What time is the band rehearsal scheduled to start?",
            "options": [
                "At the underground studio.",
                "By 6:00 PM on Friday.",
                "Yes, I memorized the lyrics."
            ],
            "ans": 1,
            "exp": "Hỏi 'What time' -> Trواب bằng thời điểm 'By 6:00 PM'."
        },
        {
            "id": "l2-kmg-2",
            "question": "Where should I set up the amplifier?",
            "options": [
                "It amplifies the bass.",
                "Right next to the drum kit.",
                "We set off entirely too late."
            ],
            "ans": 1,
            "exp": "Hỏi 'Where' -> Trả lời nơi chốn 'Right next to the drum kit'."
        },
        {
            "id": "l2-kmg-3",
            "question": "Who's replacing the lead guitarist for tonight's show?",
            "options": [
                "I think Martin is stepping in.",
                "The guitar solo was amazing.",
                "No, it was a replacement part."
            ],
            "ans": 0,
            "exp": "Hỏi 'Who' -> Trả lời chỉ tên người 'Martin is stepping in'."
        },
        {
            "id": "l2-kmg-4",
            "question": "Have you reviewed the setlist for the concert yet?",
            "options": [
                "I set the boxes down.",
                "There's a list on the table.",
                "Yes, we'll open with our new song."
            ],
            "ans": 2,
            "exp": "Câu hỏi Yes/No -> 'Yes, we'll open with our new song' hợp ngữ cảnh setlist."
        },
        {
            "id": "l2-kmg-5",
            "question": "How long will the soundcheck take?",
            "options": [
                "It sounds great to me.",
                "About thirty minutes or so.",
                "I've written a check for it."
            ],
            "ans": 1,
            "exp": "Hỏi bao lâu ('How long') -> Trả lời 'About thirty minutes'."
        }
    ];

    // --- PART 3 ---
    const extraPart3 = [
        {
            "id": "l3-kmg-1",
            "audio": "/audio/p3_kmg_1.mp3",
            "transcript": "W: Hi, this is Sarah from KMG Club. We're looking to book a rehearsal studio for next Thursday evening.\nM: Thanks for calling, Sarah. We do have Studio B available at 7 PM. It comes equipped with a drum kit and two guitar amps.\nW: Perfect. How much is the hourly rate for Studio B? We'll probably need it for three hours to prepare for our acoustic gig.\nM: It's $25 per hour. If you book for three hours, I can throw in free microphone rentals.",
            "questions": [
                {
                    "id": "q-kmg-3-1",
                    "q": "Why is the woman calling?",
                    "options": [
                        "To book a rehearsal space",
                        "To buy new music instruments",
                        "To complain about noise",
                        "To cancel a performance"
                    ],
                    "ans": 0,
                    "exp": "Cô gái mở đầu bằng: 'We're looking to book a rehearsal studio'."
                },
                {
                    "id": "q-kmg-3-2",
                    "q": "What event is the woman preparing for?",
                    "options": [
                        "An acoustic gig",
                        "A studio album recording",
                        "A charity fundraiser",
                        "A music festival"
                    ],
                    "ans": 0,
                    "exp": "Cô gái nói dọ chuẩn bị cho 'our acoustic gig'."
                },
                {
                    "id": "q-kmg-3-3",
                    "q": "What does the man offer for free?",
                    "options": [
                        "Extra studio time",
                        "Guitar amplifiers",
                        "Microphone rentals",
                        "Drum setups"
                    ],
                    "ans": 2,
                    "exp": "Người đàn ông hứa 'throw in free microphone rentals'."
                }
            ]
        }
    ];

    db.part1.push(...extraPart1);
    db.part2.push(...extraPart2);
    db.part3.push(...extraPart3);

    fs.writeFileSync(targetPath, JSON.stringify(db, null, 1));
    console.log(`\n✅ THÀNH CÔNG: Đã thêm ${extraPart1.length} câu Part 1, ${extraPart2.length} câu Part 2, và ${extraPart3.length} nhóm Part 3 vào Kho Dữ liệu TOEIC!`);
    console.log(`Các câu hỏi được thiết kế độc quyền 100% xoay quanh chủ đề BAND NHẠC, PHÒNG THU, GUITAR dành riêng cho KMG Club! 🎸\n`);

} catch (err) {
    console.error("LỖI: ", err);
}
