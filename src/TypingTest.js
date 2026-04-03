import { useState, useEffect, useRef, useCallback } from "react";

// ─── Word Pools by Difficulty ─────────────────────────────────────────────────
const WORD_POOLS = {
  beginner: [
    "the","of","and","a","to","in","is","you","that","it","he","was","for","on","are",
    "with","as","his","they","be","at","one","have","this","from","or","had","by","but",
    "not","what","all","were","we","when","your","can","said","there","use","an","each",
    "which","she","do","how","their","if","will","up","other","about","out","many","then",
    "them","these","so","some","her","would","make","like","him","into","time","has","look",
    "two","more","go","see","no","way","could","my","than","first","been","call","who",
    "its","now","find","down","day","did","get","come","made","may","part","over","new",
    "take","only","little","work","know","place","live","back","give","most","very","after",
    "just","name","good","where","help","much","before","line","right","too","old","any",
    "same","tell","boy","came","want","show","also","form","three","small","set","put",
    "end","does","well","hand","high","move","try","read","turn","ask","play","open",
  ],
  medium: [
    "about","above","across","action","actually","almost","already","although","always",
    "another","answer","around","because","before","behind","between","beyond","brought",
    "building","business","certain","change","children","coming","complete","consider",
    "continue","control","country","course","current","decided","different","during",
    "easily","either","enough","especially","every","example","experience","explain",
    "family","father","feeling","finally","follow","forward","friend","general","given",
    "government","ground","happen","having","heard","herself","himself","history","house",
    "hundred","important","include","indeed","inside","instead","interest","itself","large",
    "later","learn","leave","level","light","likely","listen","little","living","longer",
    "making","matter","maybe","meant","middle","might","money","month","morning","mother",
    "moving","myself","nature","nearly","never","nothing","number","often","only","order",
    "other","outside","paper","people","perhaps","place","plant","point","possible","power",
    "problem","produce","public","rather","reason","result","return","right","river","running",
    "school","second","should","simple","since","small","social","someone","something","sometimes",
    "sound","space","speak","stand","start","still","story","study","subject","system",
    "taken","talking","thank","their","therefore","things","think","though","through","today",
    "together","toward","turned","under","until","usually","voice","watch","water","whether",
    "while","whole","within","without","women","world","would","write","years","young",
  ],
  hard: [
    "aberration","abysmal","acrimonious","ambiguous","anachronism","anomalous","antithesis",
    "apocryphal","arbitrary","archaic","articulate","ascertain","assiduous","belligerent",
    "benevolent","bureaucratic","cacophony","callous","capricious","catastrophic","clandestine",
    "coercive","cognizant","convoluted","contemptuous","cumbersome","daunting","debilitating",
    "deleterious","deprecate","derogatory","dilapidated","discrepancy","dissonance","ebullient",
    "egregious","eloquent","ephemeral","equivocal","exacerbate","exorbitant","exuberant",
    "facetious","fallacious","fastidious","flabbergasted","fortuitous","frivolous","garrulous",
    "gratuitous","gregarious","hallucinate","hypocritical","idiosyncratic","imbecile","impetuous",
    "inadvertent","incorrigible","indefatigable","indigenous","inefficacious","inexorable",
    "innocuous","intransigent","juxtaposition","labyrinthine","loquacious","magnanimous",
    "malevolent","meticulous","misanthrope","nefarious","nomenclature","obfuscate","obstinate",
    "omnipotent","ostentatious","perfidious","perspicacious","phlegmatic","pragmatic",
    "precarious","pretentious","procrastinate","propitious","querulous","quintessential",
    "recalcitrant","reciprocate","relinquish","reprehensible","resilience","sanguine",
    "surreptitious","tenacious","trepidation","ubiquitous","unequivocal","vacuous",
    "venomous","veracious","vicarious","whimsical","zealous","zealotry",
  ],
};

const DIFFICULTY_META = {
  beginner: { label: "Beginner", color: "#6bffd8", desc: "Common short words" },
  medium:   { label: "Medium",   color: "#e8ff47", desc: "Everyday vocabulary" },
  hard:     { label: "Hard",     color: "#ff6b6b", desc: "Complex & rare words" },
};

const TIME_PRESETS = [15, 30, 60, 120];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWords(difficulty, count = 80) {
  const pool = WORD_POOLS[difficulty] || WORD_POOLS.medium;
  const result = [];
  while (result.length < count) {
    result.push(...shuffle(pool));
  }
  return result.slice(0, count);
}

// ─── WPM Graph ────────────────────────────────────────────────────────────────
function WpmGraph({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * 2; canvas.height = H * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const step = W / (data.length - 1);
    ctx.beginPath();
    ctx.fillStyle = "rgba(232,255,71,0.08)";
    data.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 12) - 6;
      if (i === 0) { ctx.moveTo(x, H); ctx.lineTo(x, y); } else ctx.lineTo(x, y);
    });
    ctx.lineTo((data.length - 1) * step, H); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#e8ff47"; ctx.lineWidth = 2;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    data.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 12) - 6;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [data]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", borderRadius: 8 }} />;
}

// ─── Result Overlay ───────────────────────────────────────────────────────────
function ResultOverlay({ result, difficulty, onRetry, onNew }) {
  if (!result) return null;
  const meta = DIFFICULTY_META[difficulty];
  return (
    <div style={S.overlay}>
      <div style={S.resultCard}>
        <p style={S.resultLabel}>Test Complete</p>
        <div style={{ ...S.resultWpm, color: meta.color }}>{result.wpm}</div>
        <p style={S.resultWpmSub}>words per minute</p>
        <div style={{ height: 72, marginBottom: 20 }}>
          <WpmGraph data={result.wpmHistory} />
        </div>
        <div style={S.resultGrid}>
          {[
            { val: result.accuracy + "%", label: "Accuracy" },
            { val: result.wordsCompleted,  label: "Words" },
            { val: result.errors,          label: "Errors" },
            { val: result.duration + "s",  label: "Duration" },
            { val: meta.label,             label: "Level", color: meta.color },
            { val: result.streak,          label: "Best Streak" },
          ].map(({ val, label, color }) => (
            <div key={label} style={S.miniStat}>
              <div style={{ ...S.miniVal, ...(color ? { color } : {}) }}>{val}</div>
              <div style={S.miniLabel}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button style={S.btnGhost} onClick={onRetry}>↺ Retry</button>
          <button style={{ ...S.btnPrimary, background: meta.color }} onClick={onNew}>New Test ↗</button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Time Input ────────────────────────────────────────────────────────
function CustomTimeInput({ onApply, currentTime, presets }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef(null);
  const isCustom = !presets.includes(currentTime);

  const apply = () => {
    const n = parseInt(val, 10);
    if (!val) { setErr("Enter seconds"); return; }
    if (isNaN(n) || n < 5)  { setErr("Min 5s"); return; }
    if (n > 600)             { setErr("Max 600s"); return; }
    setErr("");
    setVal("");
    onApply(n);
    inputRef.current?.blur();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1px solid ${isCustom ? "#e8ff47" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 100, overflow: "hidden",
        background: isCustom ? "rgba(232,255,71,0.08)" : "transparent",
        transition: "all 0.2s",
      }}>
        <input
          ref={inputRef}
          type="number"
          min={5} max={600}
          placeholder="custom"
          value={val}
          onChange={e => { setVal(e.target.value); setErr(""); }}
          onKeyDown={e => { if (e.key === "Enter") apply(); e.stopPropagation(); }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: isCustom ? "#e8ff47" : "rgba(255,255,255,0.6)",
            fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500,
            width: 72, padding: "5px 10px 5px 12px",
            MozAppearance: "textfield",
          }}
        />
        <button
          onClick={e => { e.stopPropagation(); apply(); }}
          style={{
            background: "transparent", border: "none",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
            padding: "5px 10px", fontSize: 12, lineHeight: 1,
            transition: "color 0.15s",
          }}
          title="Apply custom time"
        >↵</button>
      </div>
      {isCustom && (
        <span style={{
          position: "absolute", top: -18, left: 0, fontSize: 10,
          color: "#e8ff47", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace",
        }}>{currentTime}s active</span>
      )}
      {err && (
        <span style={{
          position: "absolute", top: -18, left: 0, fontSize: 10,
          color: "#ff6b6b", whiteSpace: "nowrap",
        }}>{err}</span>
      )}
    </div>
  );
}

// ─── Difficulty Selector ──────────────────────────────────────────────────────
function DifficultySelector({ current, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Object.entries(DIFFICULTY_META).map(([key, meta]) => {
        const active = current === key;
        return (
          <button
            key={key}
            title={meta.desc}
            onClick={e => { e.stopPropagation(); onChange(key); }}
            style={{
              padding: "5px 14px", borderRadius: 100,
              fontSize: 13, fontWeight: 500,
              border: `1px solid ${active ? meta.color : "rgba(255,255,255,0.1)"}`,
              background: active ? `${meta.color}18` : "transparent",
              color: active ? meta.color : "rgba(255,255,255,0.5)",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TypingTest() {
  const [totalTime,      setTotalTime]      = useState(30);
  const [timeLeft,       setTimeLeft]       = useState(30);
  const [difficulty,     setDifficulty]     = useState("medium");
  const [words,          setWords]          = useState([]);
  const [started,        setStarted]        = useState(false);
  const [finished,       setFinished]       = useState(false);
  const [isFocused,      setIsFocused]      = useState(false);
  const [result,         setResult]         = useState(null);
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

  const inputRef         = useRef(null);
  const timerRef         = useRef(null);
  const sampleRef        = useRef(null);
  const correctTotalRef  = useRef(0);
  const lastCorrectRef   = useRef(0);
  const bestStreakRef     = useRef(0);

  useEffect(() => { correctTotalRef.current = correctTotal; }, [correctTotal]);
  useEffect(() => { lastCorrectRef.current  = lastCorrect;  }, [lastCorrect]);

  const initTest = useCallback((time = totalTime, diff = difficulty, reuse = false) => {
    clearInterval(timerRef.current);
    clearInterval(sampleRef.current);
    const newWords   = reuse && words.length > 0 ? words : generateWords(diff, 80);
    const initStates = newWords.map(w => Array.from({ length: w.length + 1 }, () => ({ status: "pending" })));
    setWords(newWords); setCharStates(initStates);
    setStarted(false); setFinished(false); setIsFocused(false); setResult(null);
    setTimeLeft(time); setWordIdx(0); setCharIdx(0);
    setTypedTotal(0); setCorrectTotal(0); setErrorCount(0);
    setWordsCompleted(0); setStreak(0); setBestStreak(0);
    setWpmHistory([]); setLastCorrect(0);
    correctTotalRef.current = 0; lastCorrectRef.current = 0; bestStreakRef.current = 0;
    if (inputRef.current) inputRef.current.value = "";
  }, [totalTime, difficulty, words]);

  useEffect(() => { initTest(30, "medium", false); }, []); // eslint-disable-line

  // ─── Snap refs for interval closure ────────────────────────────────────────
  const cSnap = useRef(0), eSnap = useRef(0), tSnap = useRef(0), wSnap = useRef(0), hSnap = useRef([]), bsSnap = useRef(0);
  useEffect(() => { cSnap.current  = correctTotal;   }, [correctTotal]);
  useEffect(() => { eSnap.current  = errorCount;     }, [errorCount]);
  useEffect(() => { tSnap.current  = typedTotal;     }, [typedTotal]);
  useEffect(() => { wSnap.current  = wordsCompleted; }, [wordsCompleted]);
  useEffect(() => { hSnap.current  = wpmHistory;     }, [wpmHistory]);
  useEffect(() => { bsSnap.current = bestStreak;     }, [bestStreak]);

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
    let lastSample = Date.now();
    sampleRef.current = setInterval(() => {
      const now = Date.now(), elapsed = (now - lastSample) / 1000;
      if (elapsed >= 1) {
        const delta = correctTotalRef.current - lastCorrectRef.current;
        setWpmHistory(p => [...p, Math.max(0, Math.round((delta / 5) / (elapsed / 60)))]);
        lastCorrectRef.current = correctTotalRef.current;
        setLastCorrect(correctTotalRef.current);
        lastSample = now;
      }
    }, 1000);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); clearInterval(sampleRef.current); return 0; } return t - 1; });
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
        for (let ci = 0; ci < word.length; ci++) {
          next[wordIdx][ci] = { status: ci < typed.length ? (typed[ci] === word[ci] ? "correct" : "wrong") : "wrong" };
        }
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
      } else {
        setStreak(0); setErrorCount(c => c + 1);
      }
      setTypedTotal(c => c + typed.length + 1);
      setWordIdx(i => i + 1); setCharIdx(0);
    } else {
      setCharIdx(val.length);
      setCharStates(prev => {
        const next = prev.map(w => [...w]);
        for (let ci = 0; ci < word.length; ci++) {
          next[wordIdx][ci] = ci < val.length
            ? { status: val[ci] === word[ci] ? "correct" : "wrong" }
            : { status: "pending" };
        }
        return next;
      });
    }
  }, [finished, started, words, wordIdx, startTimer]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Tab") { e.preventDefault(); initTest(totalTime, difficulty, false); }
  }, [initTest, totalTime, difficulty]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    initTest(totalTime, d, false);
    setTimeout(focusInput, 50);
  };

  const handleTimeChange = (t) => {
    setTotalTime(t);
    initTest(t, difficulty, false);
    setTimeout(focusInput, 50);
  };

  const elapsed  = Math.max(totalTime - timeLeft, 1);
  const liveWpm  = started ? Math.round((correctTotal / 5) / (elapsed / 60)) : 0;
  const liveAcc  = typedTotal > 0 ? Math.round((correctTotal / typedTotal) * 100) : 100;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const meta     = DIFFICULTY_META[difficulty];

  return (
    <div style={S.root}>
      <div style={S.wrap}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div style={S.logo}>type<span style={{ color: "#e8ff47" }}>.</span>run</div>
          <DifficultySelector current={difficulty} onChange={handleDifficultyChange} />
        </div>

        {/* ── Toolbar: time presets + custom input ── */}
        <div style={S.toolbar}>
          <span style={S.toolbarLabel}>Time</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {TIME_PRESETS.map(t => (
              <button
                key={t}
                style={{ ...S.pill, ...(totalTime === t && !false ? S.pillActive : {}) }}
                onClick={e => { e.stopPropagation(); handleTimeChange(t); }}
              >
                {t}s
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
            <CustomTimeInput
              currentTime={totalTime}
              presets={TIME_PRESETS}
              onApply={handleTimeChange}
            />
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={S.statsRow}>
          {[
            { val: liveWpm,        label: "WPM",      color: meta.color },
            { val: liveAcc + "%",  label: "Accuracy", color: "#6bffd8" },
            { val: timeLeft,       label: "Time",      color: "rgba(255,255,255,0.95)" },
            { val: streak,         label: "Streak",    color: "#ff9f43" },
          ].map(({ val, label, color }) => (
            <div key={label} style={S.statCard}>
              <div style={{ ...S.statVal, color }}>{val}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Progress Bar ── */}
        <div style={S.progressWrap}>
          <div style={{ ...S.progressBar, width: progress + "%", background: meta.color }} />
        </div>

        {/* ── Typing Zone ── */}
        <div
          style={{ ...S.typeZone, ...(started ? { borderColor: `${meta.color}40` } : {}) }}
          onClick={e => { e.stopPropagation(); focusInput(); }}
        >
          {/* Difficulty badge */}
          <div style={{ ...S.diffBadge, color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}10` }}>
            {meta.label}
          </div>

          <div style={S.wordsContainer}>
            {words.map((word, wi) => (
              <span key={wi}>
                {Array.from(word).map((ch, ci) => {
                  const st = charStates[wi]?.[ci]?.status || "pending";
                  const isCursor = wi === wordIdx && ci === charIdx;
                  return (
                    <span key={ci} style={{ ...S.char, color: st === "correct" ? "#6bffd8" : st === "wrong" ? "#ff6b6b" : "rgba(255,255,255,0.28)", position: "relative" }}>
                      {isCursor && <span className="cursor-blink" style={{ ...S.cursor, background: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />}
                      {ch}
                    </span>
                  );
                })}
                <span style={{ color: "rgba(255,255,255,0.28)", position: "relative" }}>
                  {wi === wordIdx && charIdx === word.length && (
                    <span className="cursor-blink" style={{ ...S.cursor, background: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
                  )}
                  {" "}
                </span>
              </span>
            ))}
          </div>

          <input
            ref={inputRef}
            style={S.hiddenInput}
            type="text"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {!isFocused && !started && !finished && (
            <div style={S.focusHint}>
              Click or press <kbd style={S.kbd}>any key</kbd> to start
            </div>
          )}
        </div>

        {/* ── Bottom Row ── */}
        <div style={S.bottomRow}>
          <div style={S.extraStats}>
            <span>Words <span style={S.extraVal}>{wordsCompleted}</span></span>
            <span>Errors <span style={{ ...S.extraVal, color: errorCount > 0 ? "#ff6b6b" : undefined }}>{errorCount}</span></span>
            <span>Best Streak <span style={{ ...S.extraVal, color: "#ff9f43" }}>{bestStreak}</span></span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btnGhost}   onClick={e => { e.stopPropagation(); initTest(totalTime, difficulty, true);  setTimeout(focusInput, 50); }}>↺ Redo</button>
            <button style={{ ...S.btnPrimary, background: meta.color }} onClick={e => { e.stopPropagation(); initTest(totalTime, difficulty, false); setTimeout(focusInput, 50); }}>New Test ↗</button>
          </div>
        </div>

        <p style={S.hint}>Press <kbd style={S.kbd}>Tab</kbd> to restart · Difficulty changes reset the test</p>
      </div>

      <ResultOverlay
        result={result} difficulty={difficulty}
        onRetry={() => { initTest(totalTime, difficulty, true);  setTimeout(focusInput, 50); }}
        onNew={()   => { initTest(totalTime, difficulty, false); setTimeout(focusInput, 50); }}
      />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: "100vh", background: "#0d0d0f", color: "rgba(255,255,255,0.95)",
    fontFamily: "'Syne','Segoe UI',sans-serif", display: "flex",
    flexDirection: "column", alignItems: "center", padding: "2rem 1rem",
  },
  wrap: { width: "100%", maxWidth: 820 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: -1 },
  toolbar: {
    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    background: "#161618", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "10px 16px", marginBottom: "1.25rem",
  },
  toolbarLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginRight: 2 },
  pill: {
    padding: "5px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500,
    border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
    color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
  },
  pillActive: { background: "#e8ff47", color: "#000", borderColor: "#e8ff47" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.25rem" },
  statCard: {
    background: "#161618", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "14px 16px", textAlign: "center",
  },
  statVal: { fontFamily: "'DM Mono','Courier New',monospace", fontSize: 28, fontWeight: 500, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" },
  progressWrap: { height: 2, background: "#1e1e21", borderRadius: 2, marginBottom: "1.25rem", overflow: "hidden" },
  progressBar: { height: "100%", borderRadius: 2, transition: "width 0.3s linear" },
  typeZone: {
    background: "#161618", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "2rem", marginBottom: "1.25rem",
    cursor: "text", position: "relative", transition: "border-color 0.2s", minHeight: 160,
  },
  diffBadge: {
    position: "absolute", top: 12, right: 14, fontSize: 11, fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    border: "1px solid", padding: "2px 8px", borderRadius: 100,
  },
  wordsContainer: {
    fontFamily: "'DM Mono','Courier New',monospace", fontSize: 20,
    lineHeight: 2.1, letterSpacing: "0.01em",
    userSelect: "none", wordBreak: "break-word",
    maxHeight: 200, overflow: "hidden",
  },
  char: { display: "inline", transition: "color 0.05s" },
  cursor: { position: "absolute", left: -1, top: 3, bottom: 3, width: 2, borderRadius: 2 },
  hiddenInput: { position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0, border: "none", outline: "none" },
  focusHint: {
    position: "absolute", inset: 0, display: "flex", alignItems: "center",
    justifyContent: "center", borderRadius: 16, background: "rgba(13,13,15,0.75)",
    backdropFilter: "blur(2px)", fontSize: 14, color: "rgba(255,255,255,0.55)", gap: 8, pointerEvents: "none",
  },
  kbd: {
    background: "#1e1e21", border: "1px solid rgba(255,255,255,0.1)",
    padding: "2px 8px", borderRadius: 6, fontFamily: "'DM Mono',monospace",
    fontSize: 12, color: "rgba(255,255,255,0.85)",
  },
  bottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: "0.75rem" },
  extraStats: { display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.35)" },
  extraVal: { color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono',monospace" },
  btnPrimary: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
    borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: "inherit",
    cursor: "pointer", border: "none", color: "#000", transition: "opacity 0.15s",
  },
  btnGhost: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
    borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: "inherit",
    cursor: "pointer", background: "#161618", color: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s",
  },
  hint: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: "0.25rem" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(13,13,15,0.92)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem",
  },
  resultCard: {
    background: "#161618", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 480, textAlign: "center",
  },
  resultLabel: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" },
  resultWpm: { fontFamily: "'DM Mono',monospace", fontSize: 80, fontWeight: 300, lineHeight: 1, marginBottom: 4 },
  resultWpmSub: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" },
  miniStat: { background: "#1e1e21", borderRadius: 10, padding: 14 },
  miniVal: { fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 400, marginBottom: 4, color: "rgba(255,255,255,0.9)" },
  miniLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" },
};
