/**
 * Tra cứu nhanh từ vựng TOEIC trong ngữ cảnh bài đọc
 * Hỗ trợ nhận diện biến thể từ (chia thì, số nhiều, đuôi từ loại...)
 */

let vocabIndex = null;
let vocabListRef = null;

export function buildVocabIndex(vocabList) {
  if (vocabIndex && vocabListRef === vocabList) return vocabIndex;
  
  const map = new Map();
  vocabListRef = vocabList;

  for (const item of vocabList) {
    if (!item || !item.w) continue;
    const clean = item.w.trim().toLowerCase();
    if (!map.has(clean)) {
      map.set(clean, item);
    }

    // Nếu có collocations hoặc họ từ, index thêm
    if (Array.isArray(item.col)) {
      for (const c of item.col) {
        const cClean = String(c).trim().toLowerCase();
        if (cClean && !map.has(cClean)) {
          map.set(cClean, item);
        }
      }
    }
  }

  vocabIndex = map;
  return map;
}

export function cleanRawWord(raw) {
  if (!raw) return "";
  return String(raw)
    .trim()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
    .toLowerCase();
}

/**
 * Tìm từ vựng phù hợp nhất trong kho từ vựng
 */
export function lookupWord(rawWord, vocabList) {
  const word = cleanRawWord(rawWord);
  if (!word || word.length < 2) return null;

  const index = buildVocabIndex(vocabList);

  // 1. Khớp chính xác
  if (index.has(word)) return index.get(word);

  // 2. Thử các biến thể số nhiều / chia thì thông dụng trong TOEIC
  const stems = [];

  // Bỏ đuôi -s, -es, -ies (categories -> category)
  if (word.endsWith("ies") && word.length > 4) {
    stems.push(word.slice(0, -3) + "y");
  } else if (word.endsWith("es") && word.length > 3) {
    stems.push(word.slice(0, -2));
    stems.push(word.slice(0, -1)); // e.g. changes -> change
  } else if (word.endsWith("s") && word.length > 3) {
    stems.push(word.slice(0, -1));
  }

  // Bỏ đuôi -ed, -d (submitted -> submit, inspected -> inspect)
  if (word.endsWith("ed") && word.length > 4) {
    stems.push(word.slice(0, -2));
    stems.push(word.slice(0, -1)); // moved -> move
    // Gấp đôi phụ âm: stopped -> stop, planned -> plan
    if (word.length > 5 && word[word.length - 3] === word[word.length - 4]) {
      stems.push(word.slice(0, -3));
    }
  }

  // Bỏ đuôi -ing (working -> work, receiving -> receive)
  if (word.endsWith("ing") && word.length > 5) {
    stems.push(word.slice(0, -3));
    stems.push(word.slice(0, -3) + "e");
    if (word[word.length - 4] === word[word.length - 5]) {
      stems.push(word.slice(0, -4));
    }
  }

  // Bỏ đuôi -ly (efficiently -> efficient)
  if (word.endsWith("ly") && word.length > 4) {
    stems.push(word.slice(0, -2));
  }

  // Bỏ đuôi -tion / -sion / -ment
  if (word.endsWith("tion") && word.length > 6) {
    stems.push(word.slice(0, -4) + "te");
    stems.push(word.slice(0, -4));
  }
  if (word.endsWith("ment") && word.length > 6) {
    stems.push(word.slice(0, -4));
  }

  for (const s of stems) {
    if (index.has(s)) return index.get(s);
  }

  // 3. Tìm gần đúng: từ trong kho chứa từ cần tìm hoặc ngược lại
  for (const [w, item] of index.entries()) {
    if (w.length >= 4 && (word.startsWith(w) || w.startsWith(word))) {
      return item;
    }
  }

  return null;
}

