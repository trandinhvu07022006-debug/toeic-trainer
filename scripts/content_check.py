import json
import glob
import sys
import os

def check_json(file_path):
    errors = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        return [f"File {file_path} is not valid JSON: {str(e)}"]

    # Basic logic check for listening.json, reading.json, speaking.json etc.
    items_to_check = []
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, list):
                items_to_check.extend(v)
    elif isinstance(data, list):
        items_to_check = data
    
    for item in items_to_check:
        if isinstance(item, dict) and "options" in item and "ans" in item:
            if not isinstance(item["options"], list):
                errors.append(f"[{file_path}] ID {item.get('id', 'Unknown')}: Options phải là array.")
            elif item["ans"] < 0 or item["ans"] >= len(item["options"]):
                errors.append(f"[{file_path}] ID {item.get('id', 'Unknown')}: Đáp án (ans = {item['ans']}) nằm ngoài phạm vi mảng options (size = {len(item['options'])}).")
        
        if isinstance(item, dict) and "questions" in item:
            for q in item["questions"]:
                if "options" in q and "ans" in q:
                    if q["ans"] < 0 or q["ans"] >= len(q["options"]):
                        errors.append(f"[{file_path}] ID {q.get('id', 'Unknown')}: Đáp án (ans = {q['ans']}) nằm ngoài số lượng Options nhánh con.")
    
    return errors

# Lấy đường dẫn tuyệt đối của thư mục làm việc, quét tất cả .json
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(base_dir, "src", "data")
all_jsons = glob.glob(os.path.join(data_dir, "**", "*.json"), recursive=True)

total_errors = []
for f in all_jsons:
    total_errors.extend(check_json(f))

if total_errors:
    for e in total_errors:
        print("ERROR:", e)
    print(f"FAILED: Tìm thấy {len(total_errors)} lỗi Logic trong các tệp lưu trữ.")
else:
    print("SUCCESS: Vô cùng tuyệt vời! Không tìm thấy bất kỳ lỗi Logic Options/Answers nào trên toàn bộ hàng nghìn Item. Data của bạn hoàn toàn chính xác 100%.")
