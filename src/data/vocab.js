/* Dữ liệu từ vựng — tách riêng để chỉ tải khi mở màn Từ vựng.
   Mỗi chủ đề một file trong vocab/; thêm chủ đề chỉ cần thả file .json mới. */
const vocabModules = import.meta.glob("./vocab/*.json", { eager: true });

export const VOCAB_TOPICS = Object.keys(vocabModules)
  .sort()
  .map((path) => {
    const mod = vocabModules[path].default || vocabModules[path];
    return { key: path.replace("./vocab/", "").replace(".json", ""), topic: mod.topic, words: mod.words };
  });

export const VOCAB = VOCAB_TOPICS.flatMap((t) => t.words);
export const VOCAB_BY_ID = Object.fromEntries(VOCAB.map((w) => [w.id, w]));
