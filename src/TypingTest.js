import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEMES } from "./constants/theme";
import { DIFF_META, TIME_PRESETS } from "./constants/words";
import { generateWords } from "./utils/helpers";
import { Header } from "./components/Header";
import { ResultScreen } from "./components/ResultScreen";
import { CustomTimeModal } from "./components/CustomTimeModal";

function countCorrectChars(typed, word = "") {
  let correct = 0;
  const limit = Math.min(typed.length, word.length);
  for (let i = 0; i < limit; i++) {
    if (typed[i] === word[i]) correct++;
  }
  return correct;
}

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
  const [currentInput,   setCurrentInput]   = useState("");
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
    setCurrentInput("");
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

  useEffect(() => {
    const fn = (e) => {
      if (editName) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 || e.key === "Backspace") focusInput();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [editName, focusInput]);

  const endTest = useCallback(() => {
    clearInterval(timerRef.current); clearInterval(sampleRef.current);
    const activeWord = words[wordIdx] || "";
    const currentCorrect = countCorrectChars(currentInput, activeWord);
    const finalCorrect = cSnap.current + currentCorrect;
    const finalTyped = tSnap.current + currentInput.length;
    const wpm = Math.round((finalCorrect / 5) / (totalTime / 60));
    const acc = finalTyped > 0 ? Math.round((finalCorrect / finalTyped) * 100) : 100;
    setFinished(true); setStarted(false);
    setResult({ wpm, accuracy: acc, errors: eSnap.current, wordsCompleted: wSnap.current,
                wpmHistory: hSnap.current, duration: totalTime, streak: bsSnap.current });
  }, [currentInput, totalTime, wordIdx, words]);

  const startTimer = useCallback(() => {
    setStarted(true);
    let last = Date.now();
    let lastCorrectCount = correctTotalRef.current;
    sampleRef.current = setInterval(() => {
      const now = Date.now(), el = (now - last) / 1000;
      if (el >= 1) {
        const inputEl = inputRef.current?.value || "";
        const liveWord = words[wordIdx] || "";
        const liveCorrect = correctTotalRef.current + countCorrectChars(inputEl, liveWord);
        const delta = liveCorrect - lastCorrectCount;
        setWpmHistory(p => [...p, Math.max(0, Math.round((delta / 5) / (el / 60)))]);
        lastCorrectCount = liveCorrect;
        lastCorrectRef.current = liveCorrect;
        setLastCorrect(liveCorrect);
        last = now;
      }
    }, 1000);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(sampleRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }, [wordIdx, words]);

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
      setCurrentInput("");
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
      setCurrentInput(val);
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
  const activeWord = words[wordIdx] || "";
  const currentCorrect = countCorrectChars(currentInput, activeWord);
  const displayCorrectTotal = correctTotal + currentCorrect;
  const displayTypedTotal = typedTotal + currentInput.length;
  const liveWpm  = started ? Math.round((displayCorrectTotal / 5) / (elapsed / 60)) : 0;
  const liveAcc  = displayTypedTotal > 0 ? Math.round((displayCorrectTotal / displayTypedTotal) * 100) : 100;
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
      <div style={{ minHeight: "100vh", width: "100%", background: T.bg, color: T.textPrimary, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", alignItems: "stretch", padding: "0 20px 0" }}>

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
          style={{ width: "100%", display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "stretch" }}
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
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: big ? "18px 48px" : "16px 28px", flex: big ? "1.4 1 220px" : "1 1 160px", minWidth: 120, boxShadow: big ? `0 0 0 2px ${T.border}` : "none" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: big ? 40 : 28, fontWeight: 300, lineHeight: 1, color }}>{val}</span>
              <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginTop: 5 }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ══ TYPING ZONE ══════════════════════════════════════════════════ */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.2 }}
          style={{ width: "100%", flex: 1, cursor: "text", display: "flex", flexDirection: "column", alignItems: "stretch" }} 
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
          <div style={{ position: "relative", flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: "48px 56px", boxShadow: started ? `0 0 0 2px ${meta.accent}30` : "none", transition: "box-shadow 0.3s", minHeight: "46vh" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 36, lineHeight: "76px", fontWeight: 500, letterSpacing: "0.035em", wordBreak: "normal", overflowWrap: "normal", maxHeight: "calc(46vh - 40px)", overflow: "hidden", color: T.pending }}>
              {words.map((word, wi) => (
                <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.45ch" }}>
                  {Array.from(word).map((ch, ci) => {
                    const st = charStates[wi]?.[ci]?.status || "pending";
                    const cur = wi === wordIdx && ci === charIdx;
                    const isCurrentWord = wi === wordIdx;
                    const isTypedChar = isCurrentWord && ci < currentInput.length;
                    const isCurrentTarget = isCurrentWord && ci === Math.min(charIdx, word.length - 1) && charIdx <= word.length;
                    return (
                      <span key={ci} style={{
                        display: "inline-block",
                        color: st === "correct" ? T.correct : st === "wrong" ? T.wrong : T.pending,
                        position: "relative",
                        transition: "color 0.04s, background 0.12s, box-shadow 0.12s",
                        background: isCurrentTarget ? meta.accent + "22" : "transparent",
                        borderRadius: 8,
                        boxShadow: isCurrentTarget ? `inset 0 -2px 0 ${meta.accent}` : "none",
                        minWidth: "0.7ch"
                      }}>
                        {cur && <span className="tr-cur" style={{ position: "absolute", left: -3, top: "14%", bottom: "14%", width: 3, borderRadius: 2, background: meta.accent, boxShadow: `0 0 10px ${meta.accent}` }} />}
                        {isCurrentTarget && !isTypedChar && (
                          <span style={{ position: "absolute", inset: 0, borderRadius: 8, background: meta.accent + "14", pointerEvents: "none" }} />
                        )}
                        {ch}
                      </span>
                    );
                  })}
                  {wi === wordIdx && currentInput.length > word.length && (
                    <span style={{ display: "inline-block", marginLeft: 2 }}>
                      {Array.from(currentInput.slice(word.length)).map((ch, extraIdx) => {
                        const isOverflowCaret = extraIdx === currentInput.length - word.length - 1;
                        return (
                          <span key={`extra-${extraIdx}`} style={{ color: T.wrong, position: "relative", display: "inline-block", minWidth: "0.7ch" }}>
                            {isOverflowCaret && (
                              <span className="tr-cur" style={{ position: "absolute", right: -3, top: "14%", bottom: "14%", width: 3, borderRadius: 2, background: meta.accent, boxShadow: `0 0 10px ${meta.accent}` }} />
                            )}
                            {ch}
                          </span>
                        );
                      })}
                    </span>
                  )}
                  <span style={{ color: T.pending, position: "relative" }}>
                    {wi === wordIdx && charIdx === word.length && (
                      <span className="tr-cur" style={{ position: "absolute", left: -2, top: "14%", bottom: "14%", width: 3, borderRadius: 2, background: meta.accent, boxShadow: `0 0 10px ${meta.accent}` }} />
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
              onKeyDownCapture={() => { if (!isFocused) setIsFocused(true); }}
            />

            {!isFocused && !started && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: theme === "dark" ? "rgba(14,14,18,0.7)" : "rgba(240,240,244,0.75)", backdropFilter: "blur(3px)", fontSize: 16, color: T.textSecondary, fontFamily: "'DM Mono',monospace", gap: 8, pointerEvents: "none" }}>
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
