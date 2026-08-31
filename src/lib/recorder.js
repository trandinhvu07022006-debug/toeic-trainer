import { useState, useEffect, useMemo, useCallback, useRef } from "react";

export function useRecorder() {
  const [status, setStatus] = useState("idle"); // idle | recording | denied | unsupported
  const [url, setUrl] = useState(null);
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const urlRef = useRef(null);

  const supported = typeof window !== "undefined"
    && typeof navigator !== "undefined"
    && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    && typeof window.MediaRecorder !== "undefined";

  const releaseStream = useCallback(() => {
    try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) { /* bỏ qua */ }
    streamRef.current = null;
  }, []);

  const clearClip = useCallback(() => {
    try { if (urlRef.current) URL.revokeObjectURL(urlRef.current); } catch (e) { /* bỏ qua */ }
    urlRef.current = null;
    setUrl(null);
  }, []);

  const start = useCallback(() => {
    if (!supported) { setStatus("unsupported"); return Promise.resolve(false); }
    clearClip();
    return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      try {
        streamRef.current = stream;
        const rec = new window.MediaRecorder(stream);
        chunksRef.current = [];
        rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
        rec.onstop = () => {
          try {
            const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
            const u = URL.createObjectURL(blob);
            urlRef.current = u;
            setUrl(u);
          } catch (e) { /* bỏ qua */ }
          releaseStream();
        };
        rec.start();
        recRef.current = rec;
        setStatus("recording");
        return true;
      } catch (e) { releaseStream(); setStatus("unsupported"); return false; }
    }).catch(() => { setStatus("denied"); return false; });
  }, [supported, clearClip, releaseStream]);

  const stop = useCallback(() => {
    try { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); }
    catch (e) { releaseStream(); }
    setStatus((s) => (s === "recording" ? "idle" : s));
  }, [releaseStream]);

  useEffect(() => () => {
    try { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); } catch (e) { /* bỏ qua */ }
    try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) { /* bỏ qua */ }
    try { if (urlRef.current) URL.revokeObjectURL(urlRef.current); } catch (e) { /* bỏ qua */ }
  }, []);

  return { status, url, start, stop, supported, clearClip };
}
