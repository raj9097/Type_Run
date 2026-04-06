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
  const nameDisplay = userName.trim() !== "" ? userName.trim() + " | " : "";

  const getPerformanceMessage = (wpm, acc) => {
    if (acc < 80) return { msg: "Focus on accuracy before speed!", emoji: "Target", color: "#fc5c65" };
    if (wpm < 20) return { msg: "Slow and steady! Keep practicing.", emoji: "Warmup", color: T.textSecondary };
    if (wpm < 40) return { msg: "Good job! You're getting the hang of it.", emoji: "Stable", color: "#f7b731" };
    if (wpm < 60) return { msg: "Great work! Solid, above-average speed.", emoji: "Fast", color: "#22d3a5" };
    if (wpm < 80) return { msg: "Amazing! Your fingers are flying.", emoji: "Rapid", color: "#00d2d3" };
    if (wpm < 100) return { msg: "Elite tier! Are you part machine?", emoji: "Elite", color: "#a78bfa" };
    return { msg: "Top tier speed. Keep this level consistent.", emoji: "Max", color: "#ff9f43" };
  };

  const perf = getPerformanceMessage(result.wpm, result.accuracy);
  const showCheers = result.wpm >= 40 && result.accuracy >= 90;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ minHeight: "100vh", width: "100%", background: T.bg, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", fontFamily: "'Inter',sans-serif", padding: "32px 24px", position: "relative", overflow: "hidden" }}
    >
      {showCheers && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} gravity={0.15} initialVelocityY={20} />}

      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 10 }}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} T={T} />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" style={{ width: "100%", maxWidth: 1100, margin: "0 auto", zIndex: 1 }}>
        <motion.p variants={itemVars} style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: T.textMuted, marginBottom: 8 }}>
          {nameDisplay}<span style={{ color: meta.accent }}>{meta.label}</span> | {fmtTime(result.duration)}
        </motion.p>

        <motion.div variants={itemVars} style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flex: "1 1 280px", minWidth: 260 }}>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 124, fontWeight: 300, lineHeight: 0.9, color: meta.accent }}
            >
              {result.wpm}
            </motion.span>
            <div style={{ paddingBottom: 18 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, color: T.textMuted }}>WPM</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: T.textSecondary, marginTop: 6 }}>
                average typing speed
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 0.95, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ height: 180, flex: "1.2 1 460px", minWidth: 300, padding: "16px 18px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18 }}
          >
            <WpmGraph data={result.wpmHistory} accent={meta.accent} />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVars} style={{ height: 1, background: T.border, margin: "24px 0" }} />

        <motion.div
          variants={itemVars}
          whileHover={{ scale: 1.01 }}
          style={{ background: perf.color + "15", border: `1px solid ${perf.color}50`, borderRadius: 16, padding: "18px 22px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            style={{ minWidth: 72, fontFamily: "'DM Mono',monospace", fontSize: 18, color: perf.color, fontWeight: 600 }}
          >
            {perf.emoji}
          </motion.div>
          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: perf.color, marginBottom: 5, fontWeight: 600 }}>Performance Assessment</div>
            <div style={{ fontSize: 18, color: T.textPrimary, fontWeight: 500 }}>{perf.msg}</div>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18, marginBottom: 28 }}>
          {[
            { v: result.accuracy + "%", l: "accuracy" },
            { v: result.wordsCompleted, l: "words" },
            { v: result.errors, l: "errors" },
            { v: fmtTime(result.duration), l: "duration" },
            { v: result.streak, l: "best streak" },
            { v: meta.label, l: "difficulty", color: meta.accent },
          ].map(({ v, l, color }) => (
            <motion.div key={l} variants={itemVars} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 40, fontWeight: 400, lineHeight: 1, color: color || T.textPrimary }}>{v}</div>
              <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 7 }}>{l}</div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVars} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${meta.accent}66` }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: meta.accent, color: "#0e0e12", fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            onClick={onRetry}
          >retry <span style={{ fontSize: 10, opacity: 0.6 }}>ctrl+enter</span></motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: "13px 28px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.surface, color: T.textSecondary, fontFamily: "'DM Mono',monospace", fontSize: 14, cursor: "pointer" }}
            onClick={onNew}
          >new test</motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
