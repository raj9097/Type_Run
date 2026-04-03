import { WORD_POOLS, NUMBER_TOKENS, SYMBOL_TOKENS } from "../constants/words";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateWords(diff, count = 100, useNumbers = false, useSymbols = false) {
  const pool = WORD_POOLS[diff] || WORD_POOLS.medium;
  const out = [];
  while (out.length < count) out.push(...shuffle(pool));
  const words = out.slice(0, count);

  // Inject numbers: ~1 in every 5 words
  if (useNumbers) {
    const nums = shuffle([...NUMBER_TOKENS]);
    let ni = 0;
    for (let i = 2; i < words.length; i += 4 + Math.floor(Math.random() * 3)) {
      words.splice(i, 0, nums[ni % nums.length]);
      ni++;
    }
  }

  // Inject symbols: ~1 in every 6 words
  if (useSymbols) {
    const syms = shuffle([...SYMBOL_TOKENS]);
    let si = 0;
    for (let i = 3; i < words.length; i += 5 + Math.floor(Math.random() * 4)) {
      words.splice(i, 0, syms[si % syms.length]);
      si++;
    }
  }

  return words.slice(0, count);
}

export function fmtTime(secs) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60), s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}
