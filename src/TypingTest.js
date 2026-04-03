import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEMES } from "./constants/theme";
import { DIFF_META, TIME_PRESETS } from "./constants/words";
import { generateWords } from "./utils/helpers";
import { Header } from "./components/Header";
import { ResultScreen } from "./components/ResultScreen";
import { CustomTimeModal } from "./components/CustomTimeModal";

export default function TypingTest() {
  const [theme,          setTheme]          = useState(localStorage.getItem("trTheme") || "dark");
  const [userName,       setUserName]       = useState(localStorage.getItem("trUser") || "");
  const [editName,       setEditName]       = useState(false);
  const [diff,           setDiff]           = useState("medium");
  const [useNumbers,     setUseNumbers]     = useState(false);
  const [useSymbols,     setUseSymbols]     = useState(false);
  const [totalTime,      setTotalTime]      = useState(30);
  const [timeLeft,       setTimeLeft]       = useState(30);
  const [words,          setWords]          = useState([]);
  const [started,        setStarted]        = useState(false);
  const [finished,       setFinished]       = useState(false);
  const [result,         setResult]         = useState(null);
  const [isFocused,      setIsFocused]      = useState(false);
  const [charStates,     setCharStates]     = useState([]);
  const [wordIdx,        setWordIdx]        = useState(0);
  const [charIdx,        setCharIdx]        = useState(0);
  const [typedTotal,     setTypedTotal]     = useState(0);
  const [correctTotal,   setCorrectTotal]   = useState(0);
  const [errorCount,     setErrorCount]     = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [streak,         setStreak]         = useState(0);
  const [bestStreak,     setBestStreak]     = useState(0);
  const [wpmHistory,     setWpmHistory]     = useState([]);
  const [lastCorrect,    setLastCorrect]    = useState(0);
  const [showModal,      setShowModal]      = useState(false);

  const T = THEMES[theme];

  const inputRef        = useRef(null);
  const timerRef        = useRef(null);
  const sampleRef       = useRef(null);
  const correctTotalRef = useRef(0);
  const lastCorrectRef  = useRef(0);
  const bestStreakRef   = useRef(0);
  const cSnap  = useRef(0), eSnap  = useRef(0), tSnap  = useRef(0);
  const wSnap  = useRef(0), hSnap  = useRef([]), bsSnap = useRef(0);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("trTheme", next);
      return next;
    });
  };

  useEffect(() => { localStorage.setItem("trUser", userName); }, [userName]);
  useEffect(() => { correctTotalRef.current = correctTotal; }, [correctTotal]);
  useEffect(() => { lastCorrectRef.current  = lastCorrect;  }, [lastCorrect]);
  useEffect(() => { cSnap.current  = correctTotal;   }, [correctTotal]);
  useEffect(() => { eSnap.current  = errorCount;     }, [errorCount]);
  useEffect(() => { tSnap.current  = typedTotal;     }, [typedTotal]);
  useEffect(() => { wSnap.current  = wordsCompleted; }, [wordsCompleted]);
  useEffect(() => { hSnap.current  = wpmHistory;     }, [wpmHistory]);
  useEffect(() => { bsSnap.current = bestStreak;     }, [bestStreak]);

  const initTest = useCallback((time = totalTime, d = diff, reuse = false, nums = useNumbers, syms = useSymbols) => {
    clearInterval(timerRef.current); clearInterval(sampleRef.current);
    const ws = reuse && words.length > 0 ? words : generateWords(d, 100, nums, syms);
    const cs = ws.map(w => Array.from({ length: w.length + 1 }, () => ({ status: "pending" })));
    setWords(ws); setCharStates(cs);
    setStarted(false); setFinished(false); setResult(null); setIsFocused(false);
    setTimeLeft(time); setWordIdx(0); setCharIdx(0);
    setTypedTotal(0); setCorrectTotal(0); setErrorCount(0);
    setWordsCompleted(0); setStreak(0); setBestStreak(0);
    setWpmHistory([]); setLastCorrect(0);
    correctTotalRef.current = 0; lastCorrectRef.current = 0; bestStreakRef.current = 0;
    if (inputRef.current) inputRef.current.value = "";
  }, [totalTime, diff, words, useNumbers, useSymbols]);

  // eslint-disable-next-line
  useEffect(() => { initTest(30, "medium", false); }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        initTest(totalTime, diff, true, useNumbers, useSymbols);
        setTimeout(focusInput, 50);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [initTest, totalTime, diff, useNumbers, useSymbols, focusInput]);

  const endTest = useCallback(() => {
    clearInterval(timerRef.current); clearInterval(sampleRef.current);
    const wpm = Math.round((cSnap.current / 5) / (totalTime / 60));
    const acc = tSnap.current > 0 ? Math.round((cSnap.current / tSnap.current) * 100) : 100;
    setFinished(true); setStarted(false);
    setResult({ wpm, accuracy: acc, errors: eSnap.current, wordsCompleted: wSnap.current,
                wpmHistory: hSnap.current, duration: totalTime, streak: bsSnap.current });
  }, [totalTime]);

  const startTimer = useCallback(() => {
    setStarted(true);
    let last = Date.now();
    sampleRef.current = setInterval(() => {
      const now = Date.now(), el = (now - last) / 1000;
      if (el >= 1) {
        const delta = correctTotalRef.current - lastCorrectRef.current;
        setWpmHistory(p => [...p, Math.max(0, Math.round((delta / 5) / (el / 60)))]);
        lastCorrectRef.current = correctTotalRef.current;
        setLastCorrect(correctTotalRef.current);
        last = now;
      }
    }, 1000);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(sampleRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => { if (timeLeft === 0 && started) endTest(); }, [timeLeft, started, endTest]);

  const handleInput = useCallback((e) => {
    if (finished || !words.length) return;
    const val = e.target.value;
    if (val === " ") { e.target.value = ""; return; }
    if (!started) startTimer();
    const word = words[wordIdx];
    if (!word) return;
    if (val.endsWith(" ")) {
      const typed = val.trim();
      e.target.value = "";
      setCharStates(prev => {
        const next = prev.map(w => [...w]);
        for (let ci = 0; ci < word.length; ci++)
          next[wordIdx][ci] = { status: ci < typed.length ? (typed[ci] === word[ci] ? "correct" : "wrong") : "wrong" };
        next[wordIdx][word.length] = { status: "correct" };
        return next;
      });
      if (typed === word) {
        setWordsCompleted(c => c + 1);
        setStreak(s => {
          const ns = s + 1;
          if (ns > bestStreakRef.current) { bestStreakRef.current = ns; setBestStreak(ns); }
          return ns;
        });
        setCorrectTotal(c => { const n = c + word.length + 1; correctTotalRef.current = n; return n; });
      } else { setStreak(0); setErrorCount(c => c + 1); }
      setTypedTotal(c => c + typed.length + 1);
      setWordIdx(i => i + 1); setCharIdx(0);
    } else {
      setCharIdx(val.length);
      setCharStates(prev => {
        const next = prev.map(w => [...w]);
        for (let ci = 0; ci < word.length; ci++)
          next[wordIdx][ci] = ci < val.length
            ? { status: val[ci] === word[ci] ? "correct" : "wrong" }
            : { status: "pending" };
        return next;
      });
    }
  }, [finished, started, words, wordIdx, startTimer]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Tab") { e.preventDefault(); initTest(totalTime, diff, false); }
  }, [initTest, totalTime, diff]);

  const handleDiff    = (d) => { setDiff(d); initTest(totalTime, d, false, useNumbers, useSymbols); setTimeout(focusInput, 50); };
  const handleTime    = (t) => { setTotalTime(t); initTest(t, diff, false, useNumbers, useSymbols); setTimeout(focusInput, 50); };
  const handleNumbers = () => { const n = !useNumbers; setUseNumbers(n); initTest(totalTime, diff, false, n, useSymbols); setTimeout(focusInput, 50); };
  const handleSymbols = () => { const s = !useSymbols; setUseSymbols(s); initTest(totalTime, diff, false, useNumbers, s); setTimeout(focusInput, 50); };

  const elapsed  = Math.max(totalTime - timeLeft, 1);
  const liveWpm  = started ? Math.round((correctTotal / 5) / (elapsed / 60)) : 0;
  const liveAcc  = typedTotal > 0 ? Math.round((correctTotal / typedTotal) * 100) : 100;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const meta     = DIFF_META[diff];
  const isCustomTime = !TIME_PRESETS.includes(totalTime);

  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Inter:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { background: ${T.bg}; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .tr-cur { animation: blink 1s step-start infinite; }
    .tr-pill:hover { opacity: 0.8; }
    .tr-restart:hover svg { color: ${T.textSecondary}; }
  `;

  if (finished && result) {
    return (
      <>
        <style>{globalCSS}</style>
        <ResultScreen
          result={result} diff={diff} userName={userName}
          theme={theme} onToggleTheme={toggleTheme} T={T}
          onRetry={() => { initTest(totalTime, diff, true);  setTimeout(focusInput, 50); }}
          onNew={()   => { initTest(totalTime, diff, false); setTimeout(focusInput, 50); }}
        />
      </>
    );
  }

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" }}>

        <Header 
          T={T} theme={theme} toggleTheme={toggleTheme}
          diff={diff} handleDiff={handleDiff}
          totalTime={totalTime} handleTime={handleTime} isCustomTime={isCustomTime} setShowModal={setShowModal}
          useNumbers={useNumbers} handleNumbers={handleNumbers}
          useSymbols={useSymbols} handleSymbols={handleSymbols}
          userName={userName} setUserName={setUserName} editName={editName} setEditName={setEditName}
          progress={progress} meta={meta}
        />

        {/* ══ STATS ROW ════════════════════════════════════════════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.1 }}
          style={{ width: "100%", maxWidth: 1080, display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}
        >
          {[
            { val: started ? liveWpm : "—",       label: "wpm",    color: meta.accent },
            { val: started ? liveAcc + "%" : "—", label: "acc",    color: liveAcc >= 90 ? "#22d3a5" : liveAcc >= 75 ? "#f7b731" : "#fc5c65" },
            { val: timeLeft,                       label: "sec left", color: timeLeft <= 5 && started ? "#fc5c65" : T.textPrimary, big: true },
            { val: started ? streak : "—",         label: "streak", color: "#a78bfa" },
            { val: started ? wordsCompleted : "—", label: "words",  color: T.textSecondary },
          ].map(({ val, label, color, big }, i) => (
            <motion.div key={label} 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + (i * 0.05) }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: big ? "14px 40px" : "12px 28px", flex: big ? "0 0 auto" : "1 1 80px", minWidth: 80, boxShadow: big ? `0 0 0 2px ${T.border}` : "none" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: big ? 40 : 28, fontWeight: 300, lineHeight: 1, color }}>{val}</span>
              <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginTop: 5 }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ══ TYPING ZONE ══════════════════════════════════════════════════ */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.2 }}
          style={{ width: "100%", maxWidth: 1080, flex: 1, cursor: "text", display: "flex", flexDirection: "column", alignItems: "stretch" }} 
          onClick={() => focusInput()}
        >

          {/* Diff badge */}
          <motion.div 
             key={meta.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
             style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${meta.accent}40`, color: meta.accent, background: meta.accent + "14", padding: "3px 10px", borderRadius: 100, marginBottom: 18, fontFamily: "'DM Mono',monospace" }}
          >
            {meta.label}
          </motion.div>

          {/* Words */}
          <div style={{ position: "relative", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "36px 40px", boxShadow: started ? `0 0 0 2px ${meta.accent}30` : "none", transition: "box-shadow 0.3s" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, lineHeight: "58px", letterSpacing: "0.03em", wordBreak: "break-word", maxHeight: 174, overflow: "hidden", color: T.pending }}>
              {words.map((word, wi) => (
                <span key={wi}>
                  {Array.from(word).map((ch, ci) => {
                    const st = charStates[wi]?.[ci]?.status || "pending";
                    const cur = wi === wordIdx && ci === charIdx;
                    return (
                      <span key={ci} style={{ display: "inline", color: st === "correct" ? T.correct : st === "wrong" ? T.wrong : T.pending, position: "relative", transition: "color 0.04s" }}>
                        {cur && <span className="tr-cur" style={{ position: "absolute", left: -1, top: "12%", bottom: "12%", width: 3, borderRadius: 2, background: meta.accent, boxShadow: `0 0 8px ${meta.accent}` }} />}
                        {ch}
                      </span>
                    );
                  })}
                  <span style={{ color: T.pending, position: "relative" }}>
                    {wi === wordIdx && charIdx === word.length && (
                      <span className="tr-cur" style={{ position: "absolute", left: -1, top: "12%", bottom: "12%", width: 3, borderRadius: 2, background: meta.accent, boxShadow: `0 0 8px ${meta.accent}` }} />
                    )}
                    {" "}
                  </span>
                </span>
              ))}
            </div>

            <input
              ref={inputRef}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              type="text"
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              onChange={handleInput} onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {!isFocused && !started && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: theme === "dark" ? "rgba(14,14,18,0.7)" : "rgba(240,240,244,0.75)", backdropFilter: "blur(3px)", fontSize: 14, color: T.textMuted, fontFamily: "'DM Mono',monospace", gap: 8, pointerEvents: "none" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
                click here or press any key to begin
              </motion.div>
            )}
          </div>

          {/* Restart row */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <motion.button className="tr-restart"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ background: "none", border: "none", color: T.textMuted, padding: "8px 16px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontFamily: "'DM Mono',monospace", transition: "color 0.15s" }}
              onClick={e => { e.stopPropagation(); initTest(totalTime, diff, false); setTimeout(focusInput, 50); }}
              title="Restart"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
              restart
            </motion.button>
          </div>
        </motion.main>

        {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ padding: "20px 0 28px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: T.textMuted, fontFamily: "'DM Mono',monospace" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <kbd style={{ background: T.surface2, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 5, fontSize: 11, color: T.textSecondary }}>tab</kbd>
            restart
          </span>
          <span style={{ color: T.border }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <kbd style={{ background: T.surface2, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 5, fontSize: 11, color: T.textSecondary }}>ctrl</kbd>
            +
            <kbd style={{ background: T.surface2, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 5, fontSize: 11, color: T.textSecondary }}>enter</kbd>
            retry same
          </span>
        </motion.footer>
      </div>

      <AnimatePresence>
        {showModal && <CustomTimeModal onApply={handleTime} onClose={() => setShowModal(false)} T={T} />}
      </AnimatePresence>
    </>
  );
}
