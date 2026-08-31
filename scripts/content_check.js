const fs = require('fs');
const path = require('path');
const glob = require('glob'); // May not be installed, we can just use recursive fs.readdir

function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.json')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const dataDir = path.join(__dirname, '../src/data');
const allJsons = getAllFiles(dataDir);
let totalErrors = [];

allJsons.forEach(filePath => {
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        let itemsToCheck = [];

        if (Array.isArray(data)) {
            itemsToCheck = data;
        } else if (typeof data === 'object') {
            for (let k in data) {
                if (Array.isArray(data[k])) {
                    itemsToCheck = itemsToCheck.concat(data[k]);
                }
            }
        }

        itemsToCheck.forEach(item => {
            if (item && item.options && typeof item.ans === 'number') {
                if (item.ans < 0 || item.ans >= item.options.length) {
                    totalErrors.push(`[${filePath}] ID ${item.id || 'Unknown'}: Đáp án (ans=${item.ans}) lệch khỏi options (size=${item.options.length}).`);
                }
            }
            if (item && item.questions) {
                item.questions.forEach(q => {
                    if (q.options && typeof q.ans === 'number') {
                        if (q.ans < 0 || q.ans >= q.options.length) {
                            totalErrors.push(`[${filePath}] ID ${q.id || 'Unknown'}: Đáp án nhánh con (ans=${q.ans}) lệch khỏi options.`);
                        }
                    }
                });
            }
        });
    } catch (e) {
        totalErrors.push(`Lỗi đọc file ${filePath}: ${e.message}`);
    }
});

if (totalErrors.length > 0) {
    totalErrors.forEach(e => console.error("ERROR:", e));
    console.error(`FAILED: Tìm thấy ${totalErrors.length} lỗi Logic trong dữ liệu học.`);
} else {
    console.log("SUCCESS: Dữ liệu chuẩn xác 100%! Không tìm thấy lỗi chỉ mục đáp án nào.");
}
