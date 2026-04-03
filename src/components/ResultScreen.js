import React from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { WpmGraph } from "./WpmGraph";
import { DIFF_META } from "../constants/words";
import { fmtTime } from "../utils/helpers";

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } }
};

export function ResultScreen({ result, diff, userName, onRetry, onNew, theme, onToggleTheme, T }) {
  const meta = DIFF_META[diff];
  // Username is optional; if empty don't show a fallback name
  const nameDisplay = userName.trim() !== "" ? userName.trim() + " · " : "";
  
  // Custom message logic based on WPM and Accuracy
  const getPerformanceMessage = (wpm, acc) => {
    if (acc < 80) return { msg: "Focus on accuracy before speed!", emoji: "🎯", color: "#fc5c65" };
    if (wpm < 20) return { msg: "Slow and steady! Keep practicing.", emoji: "🐢", color: T.textSecondary };
    if (wpm < 40) return { msg: "Good job! You're getting the hang of it.", emoji: "👍", color: "#f7b731" };
    if (wpm < 60) return { msg: "Great work! Solid, above-average speed.", emoji: "🔥", color: "#22d3a5" };
    if (wpm < 80) return { msg: "Amazing! Your fingers are flying.", emoji: "⚡", color: "#00d2d3" };
    if (wpm < 100) return { msg: "Elite tier! Are you part machine?", emoji: "🤖", color: "#a78bfa" };
    return { msg: "GODLIKE! Absolute perfection.", emoji: "👑", color: "#ff9f43" };
  };

  const perf = getPerformanceMessage(result.wpm, result.accuracy);
  
  // Cheers logic: good accuracy and wpm triggers confetti
  const showCheers = result.wpm >= 40 && result.accuracy >= 90;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", padding: "40px 24px", position: "relative", overflow: "hidden" }}
    >
      {showCheers && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} gravity={0.15} initialVelocityY={20} />}
      
      {/* Theme toggle */}
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 10 }}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} T={T} />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" style={{ width: "100%", maxWidth: 700, zIndex: 1 }}>
        {/* Header */}
        <motion.p variants={itemVars} style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
          {nameDisplay}<span style={{ color: meta.accent }}>{meta.label}</span> &nbsp;·&nbsp; {fmtTime(result.duration)}
        </motion.p>

        <motion.div variants={itemVars} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <motion.span 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.3 }}
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 100, fontWeight: 300, lineHeight: 1, color: meta.accent }}
            >
              {result.wpm}
            </motion.span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: T.textMuted, paddingBottom: 18 }}>wpm</span>
          </div>
          <motion.div 
            initial={{ opacity: 0, filter: "blur(5px)" }} animate={{ opacity: 0.9, filter: "blur(0px)" }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ height: 80, width: 220, paddingTop: 8 }}
          >
            <WpmGraph data={result.wpmHistory} accent={meta.accent} />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVars} style={{ height: 1, background: T.border, margin: "24px 0" }} />

        {/* Dynamic Performance Message */}
        <motion.div 
          variants={itemVars} 
          whileHover={{ scale: 1.02 }}
          style={{ 
            background: perf.color + "15", 
            border: `1px solid ${perf.color}50`, 
            borderRadius: 16, 
            padding: "16px 24px", 
            marginBottom: 36, 
            display: "flex", 
            alignItems: "center", 
            gap: 16 
          }}
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            style={{ fontSize: 40, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }}
          >
            {perf.emoji}
          </motion.div>
          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: perf.color, marginBottom: 4, fontWeight: 600 }}>Performance Assessment</div>
            <div style={{ fontSize: 16, color: T.textPrimary, fontWeight: 500 }}>{perf.msg}</div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          {[
            { v: result.accuracy + "%", l: "accuracy" },
            { v: result.wordsCompleted, l: "words" },
            { v: result.errors,         l: "errors" },
            { v: fmtTime(result.duration), l: "duration" },
            { v: result.streak,         l: "best streak" },
            { v: meta.label,            l: "difficulty", color: meta.accent },
          ].map(({ v, l, color }, i) => (
            <motion.div key={l} variants={itemVars}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 36, fontWeight: 400, lineHeight: 1, color: color || T.textPrimary }}>{v}</div>
              <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>{l}</div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <motion.div variants={itemVars} style={{ display: "flex", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${meta.accent}66` }} whileTap={{ scale: 0.95 }}
            style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: meta.accent, color: "#0e0e12", fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            onClick={onRetry}
          >↺ retry <span style={{ fontSize: 10, opacity: 0.6 }}>ctrl+enter</span></motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ padding: "13px 28px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.surface, color: T.textSecondary, fontFamily: "'DM Mono',monospace", fontSize: 14, cursor: "pointer" }}
            onClick={onNew}
          >new test</motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
