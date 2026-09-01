import vocabV2 from "./vocab_v2.json";

const vocabModules = import.meta.glob("./vocab/*.json", { eager: true });

const oldVocabTopics = Object.keys(vocabModules)
  .sort()
  .map((path) => {
    const mod = vocabModules[path].default || vocabModules[path];
    return { key: path.replace("./vocab/", "").replace(".json", ""), topic: mod.topic, words: mod.words };
  });

const newVocabTopics = vocabV2.lessons.map(lesson => {
  return {
    key: `lesson_${lesson.lesson_id}`,
    topic: `${lesson.title}`,
    words: lesson.words.map(w => {
      // Map part of speech
      let pos = "n";
      if (w.part_of_speech.includes("verb")) pos = "v";
      else if (w.part_of_speech.includes("adjective")) pos = "adj";
      else if (w.part_of_speech.includes("adverb")) pos = "adv";

      return {
        id: w.word_id,
        topic: lesson.title,
        w: w.word,
        ipa: "", // Add IPA if available later
        pos: pos,
        vi: w.vietnamese_meaning,
        ex: w.examples && w.examples.length > 0 ? w.examples[0] : "",
        exVi: w.definition,
        col: w.word_family ? w.word_family.map(f => f.word) : []
      };
    })
  };
});

export const VOCAB_TOPICS = [...oldVocabTopics, ...newVocabTopics];

export const VOCAB = VOCAB_TOPICS.flatMap((t) => t.words);
export const VOCAB_BY_ID = Object.fromEntries(VOCAB.map((w) => [w.id, w]));
