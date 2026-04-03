import React from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { DIFF_META, TIME_PRESETS } from "../constants/words";
import { fmtTime } from "../utils/helpers";

export function Header({
  T, theme, toggleTheme,
  diff, handleDiff,
  totalTime, handleTime, isCustomTime, setShowModal,
  useNumbers, handleNumbers,
  useSymbols, handleSymbols,
  userName, setUserName, editName, setEditName,
  progress, meta
}) {
  return (
    <header style={{ width: "100%", maxWidth: 1080, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "0 0 22px 22px", marginBottom: 28, overflow: "hidden", boxShadow: theme === "dark" ? "0 4px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", gap: 16, flexWrap: "wrap" }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <motion.div whileHover={{ rotate: 10, scale: 1.05 }} style={{ width: 50, height: 50, background: T.surface2, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}`, flexShrink: 0 }}>
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
              <rect x="0"  y="0"  width="7"  height="12" rx="2" fill={meta.accent} />
              <rect x="10" y="0"  width="16" height="4"  rx="2" fill={meta.accent} opacity="0.9"/>
              <rect x="10" y="8"  width="11" height="4"  rx="2" fill={meta.accent} opacity="0.65"/>
              <rect x="0"  y="16" width="26" height="4"  rx="2" fill={meta.accent} opacity="0.4"/>
            </svg>
          </motion.div>
          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 24, fontWeight: 500, letterSpacing: -1, color: T.textPrimary, lineHeight: 1.1 }}>
              type<span style={{ color: meta.accent }}>.</span>run
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2, fontFamily: "'DM Mono',monospace" }}>
              speed · accuracy · flow
            </div>
          </div>
        </motion.div>

        {/* Center: mode + extras + time pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, background: T.surface2, borderRadius: 12, padding: "6px 10px", border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 6, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>mode</span>
            {Object.entries(DIFF_META).map(([key, m]) => {
              const on = diff === key;
              return (
                <motion.button key={key} className="tr-pill"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleDiff(key)}
                  style={{ background: on ? m.accent + "20" : "transparent", border: `1px solid ${on ? m.accent : "transparent"}`, borderRadius: 8, padding: "5px 13px", fontSize: 12, color: on ? m.accent : T.textMuted, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                >{m.label}</motion.button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 28, background: T.border }} />

          {/* Extras: numbers + symbols */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, background: T.surface2, borderRadius: 12, padding: "6px 10px", border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 6, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>extras</span>
            <motion.button className="tr-pill" onClick={handleNumbers}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ background: useNumbers ? meta.accent + "20" : "transparent", border: `1px solid ${useNumbers ? meta.accent : "transparent"}`, borderRadius: 8, padding: "5px 13px", fontSize: 12, color: useNumbers ? meta.accent : T.textMuted, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 14 }}>🔢</span> nums
            </motion.button>
            <motion.button className="tr-pill" onClick={handleSymbols}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ background: useSymbols ? meta.accent + "20" : "transparent", border: `1px solid ${useSymbols ? meta.accent : "transparent"}`, borderRadius: 8, padding: "5px 13px", fontSize: 12, color: useSymbols ? meta.accent : T.textMuted, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 14 }}>!@#</span> syms
            </motion.button>
          </div>

          <div style={{ width: 1, height: 28, background: T.border }} />

          {/* Time */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, background: T.surface2, borderRadius: 12, padding: "6px 10px", border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 6, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>time</span>
            {TIME_PRESETS.map(t => {
              const on = totalTime === t;
              return (
                <motion.button key={t} className="tr-pill"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleTime(t)}
                  style={{ background: on ? meta.accent + "20" : "transparent", border: `1px solid ${on ? meta.accent : "transparent"}`, borderRadius: 8, padding: "5px 13px", fontSize: 12, color: on ? meta.accent : T.textMuted, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                >{fmtTime(t)}</motion.button>
              );
            })}
            <motion.button className="tr-pill"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              style={{ background: isCustomTime ? meta.accent + "20" : "transparent", border: `1px solid ${isCustomTime ? meta.accent : "transparent"}`, borderRadius: 8, padding: "5px 13px", fontSize: 12, color: isCustomTime ? meta.accent : T.textMuted, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", minWidth: 60 }}
            >{isCustomTime ? fmtTime(totalTime) : "custom"}</motion.button>
          </div>
        </div>

        {/* Right: theme + user */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} T={T} />
          {editName ? (
            <motion.input
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              autoFocus
              value={userName}
              onChange={e => setUserName(e.target.value)}
              onBlur={() => setEditName(false)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditName(false); e.stopPropagation(); }}
              onClick={e => e.stopPropagation()}
              style={{ background: T.surface2, border: `1.5px solid ${meta.accent}`, borderRadius: 12, padding: "8px 14px", color: T.textPrimary, fontFamily: "'DM Mono',monospace", fontSize: 13, outline: "none", width: 150, textAlign: "center" }}
              placeholder="optional name"
            />
          ) : (
            <motion.button onClick={() => setEditName(true)} title="Set your name"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer", transition: "all 0.15s" }}
            >
              {userName.trim() ? (
                <>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: meta.accent + "28", color: meta.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {userName.trim()[0].toUpperCase()}
                  </div>
                  <span style={{ color: T.textPrimary, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{userName.trim()}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </>
              ) : (
                <span style={{ color: T.textSecondary, fontSize: 13, fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Add Name
                </span>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: T.surface2 }}>
        <div style={{ height: "100%", width: progress + "%", background: meta.accent, transition: "width 0.4s linear" }} />
      </div>
    </header>
  );
}
