import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomTimeModal({ onApply, onClose, T }) {
  const [val, setVal] = useState("2");
  const ref = useRef(null);
  
  useEffect(() => { 
    ref.current?.focus(); 
    ref.current?.select(); 
  }, []);

  const n = parseInt(val, 10);
  const valid = !isNaN(n) && n >= 1 && n <= 60;

  const apply = () => {
    if (valid) { onApply(n * 60); onClose(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: "36px 40px", width: "100%", maxWidth: 420, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <motion.span 
            initial={{ rotate: -20 }} animate={{ rotate: 0 }} transition={{ type: "spring", delay: 0.1 }}
            style={{ fontSize: 26, display: "inline-block" }}
          >⏱</motion.span>
          <h2 style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 500, color: T.textPrimary }}>Custom Time</h2>
        </div>
        <p style={{ fontSize: 13, color: T.textSecondary, marginBottom: 20, fontFamily: "'DM Mono',monospace", lineHeight: 1.7 }}>
          Enter duration in <span style={{ color: "#f7b731", fontWeight: 600 }}>minutes</span> (1 – 60)
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <input
            ref={ref}
            type="number" min={1} max={60}
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") apply(); if (e.key === "Escape") onClose(); e.stopPropagation(); }}
            style={{ flex: 1, background: T.surface2, border: `2px solid ${valid ? "#f7b731" : T.border}`, borderRadius: 12, padding: "13px 16px", color: T.textPrimary, fontFamily: "'DM Mono',monospace", fontSize: 20, outline: "none", transition: "border-color 0.2s" }}
            placeholder="2"
          />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, color: T.textSecondary }}>min</span>
        </div>
        
        <div style={{ height: 24, marginBottom: 12 }}>
          <AnimatePresence mode="wait">
            {valid ? (
               <motion.p key="valid" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} style={{ fontSize: 12, color: T.textMuted, fontFamily: "'DM Mono',monospace" }}>
                {n * 60} seconds total
              </motion.p>
            ) : val !== "" ? (
              <motion.p key="invalid" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} style={{ fontSize: 12, color: "#fc5c65", fontFamily: "'DM Mono',monospace" }}>
                Enter a value between 1 and 60
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flex: 1, padding: "12px", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, color: T.textSecondary, fontFamily: "'DM Mono',monospace", fontSize: 14, cursor: "pointer" }} onClick={onClose}>cancel</motion.button>
          <motion.button whileHover={valid ? { scale: 1.03, boxShadow: "0 0 15px rgba(247, 183, 49, 0.4)" } : {}} whileTap={valid ? { scale: 0.97 } : {}} style={{ flex: 2, padding: "12px", background: valid ? "#f7b731" : T.border, border: "none", borderRadius: 12, color: valid ? "#0e0e12" : T.textMuted, fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed", transition: "background 0.2s, color 0.2s" }} onClick={apply} disabled={!valid}>apply</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
