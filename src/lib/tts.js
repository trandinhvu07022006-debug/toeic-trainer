import { useState, useEffect, useMemo, useCallback, useRef } from "react";

export function useTTS() {
  const [voices, setVoices] = useState([]);
  const [supported, setSupported] = useState(true);
  const seqRef = useRef({ cancelled: true });

  useEffect(() => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) { setSupported(false); return; }
      const load = () => { try { setVoices(window.speechSynthesis.getVoices() || []); } catch (e) { /* bỏ qua */ } };
      load();
      const t1 = setTimeout(load, 400);
      const t2 = setTimeout(load, 1500);
      if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener("voiceschanged", load);
      return () => {
        clearTimeout(t1); clearTimeout(t2);
        try {
          if (window.speechSynthesis.removeEventListener) window.speechSynthesis.removeEventListener("voiceschanged", load);
          seqRef.current.cancelled = true;
          window.speechSynthesis.cancel();
        } catch (e) { /* bỏ qua */ }
      };
    } catch (e) { setSupported(false); }
  }, []);

  /* Giọng tiếng Anh, ưu tiên en-US; trả về mảng để đổi giọng giữa hai người nói */
  const enVoices = useMemo(() => {
    const list = voices || [];
    const us = list.filter((v) => /^en-US/i.test(v.lang));
    const other = list.filter((v) => /^en-/i.test(v.lang) && !/^en-US/i.test(v.lang));
    return us.concat(other);
  }, [voices]);

  const voiceAt = useCallback((i) => {
    if (!enVoices.length) return null;
    return enVoices[Math.min(i || 0, enVoices.length - 1)];
  }, [enVoices]);

  const stop = useCallback(() => {
    try {
      seqRef.current.cancelled = true;
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch (e) { /* bỏ qua */ }
  }, []);

  const speak = useCallback((text, rate, vIdx) => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
      seqRef.current.cancelled = true;
      window.speechSynthesis.cancel();
      const u = new window.SpeechSynthesisUtterance(text);
      const v = voiceAt(vIdx);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
      u.rate = rate || 1;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }, [voiceAt]);

  /* Phát lần lượt nhiều câu, có khoảng nghỉ; huỷ được giữa chừng */
  const speakMany = useCallback((items, rate, opts) => {
    const o = opts || {};
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) { if (o.onDone) o.onDone(); return false; }
      const state = { cancelled: false };
      seqRef.current.cancelled = true;
      seqRef.current = state;
      window.speechSynthesis.cancel();
      let idx = 0;
      const step = () => {
        if (state.cancelled) return;
        if (idx >= items.length) { if (o.onDone) o.onDone(); return; }
        const it = items[idx];
        if (o.onStep) o.onStep(idx);
        let u;
        try { u = new window.SpeechSynthesisUtterance(it.text); }
        catch (e) { idx += 1; step(); return; }
        const v = voiceAt(it.v);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
        u.rate = rate || 1;
        const advance = () => {
          if (state.cancelled) return;
          idx += 1;
          setTimeout(step, it.gap === undefined ? 380 : it.gap);
        };
        u.onend = advance;
        u.onerror = advance;
        try { window.speechSynthesis.speak(u); } catch (e) { advance(); }
      };
      step();
      return true;
    } catch (e) { if (o.onDone) o.onDone(); return false; }
  }, [voiceAt]);

  const pause = useCallback(() => {
    try { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.pause(); }
    catch (e) { /* bỏ qua */ }
  }, []);
  const resume = useCallback(() => {
    try { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.resume(); }
    catch (e) { /* bỏ qua */ }
  }, []);

  return { speak, speakMany, stop, pause, resume, supported, hasEnVoice: enVoices.length > 0, voiceCount: enVoices.length };
}
