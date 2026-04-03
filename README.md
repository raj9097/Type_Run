# type.run — Typing Speed Test App

A modern, dark-themed typing speed test built with **React**. Features difficulty levels, live WPM tracking, custom timer, and a detailed results screen.

---

## Screenshots

```
┌────────────────────────────────────────────────────────────┐
│  type.run          [Beginner]  [Medium]  [Hard]            │
│  ──────────────────────────────────────────────────────    │
│  Time │ 15s  30s  60s  120s  │ [custom] ↵                  │
│  ──────────────────────────────────────────────────────    │
│  [ 87 WPM ]  [ 96% Acc ]  [ 28s ]  [ 🔥 12 Streak ]       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░    │
│  ┌──────────────────────────────────────────────────┐      │
│  │ the  quick  brown  fox  jumps  over  the  lazy   │      │
│  │ dog  and  some  more  words  keep  coming  here  │      │
│  └──────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Details |
|---|---|
| **Difficulty Levels** | Beginner (short common words), Medium (everyday vocabulary), Hard (complex rare words) |
| **Preset Timers** | 15s, 30s, 60s, 120s quick-select pills |
| **Custom Timer** | Type any value from 5–600 seconds and press Enter or ↵ |
| **Live Stats** | Real-time WPM, accuracy, time left, streak counter |
| **Colour-coded Typing** | Teal = correct, Red = incorrect, cursor highlights current position |
| **Progress Bar** | Visual timer progress that changes colour by difficulty |
| **Results Screen** | WPM graph over time, accuracy, words, errors, duration, best streak |
| **Redo / New Test** | Redo same words or generate fresh random words |
| **Keyboard Shortcut** | `Tab` to instantly restart at any time |

---

## Quick Start

### Prerequisites
- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **npm** v8 or higher (comes with Node.js)

### 1. Install dependencies

```bash
cd typing-test-app
npm install
```

### 2. Start the development server

```bash
npm start
```

The app opens automatically at **http://localhost:3000**

### 3. Build for production (optional)

```bash
npm run build
```

Output goes to the `build/` folder — deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Project Structure

```
typing-test-app/
├── public/
│   └── index.html          # HTML shell with Google Fonts (DM Mono + Syne)
├── src/
│   ├── index.js            # React root entry point
│   ├── App.js              # Root component (renders TypingTest)
│   └── TypingTest.js       # Main app — all logic + UI + styles
├── .gitignore
├── package.json
└── README.md
```

---

## How to Use

1. **Choose a difficulty** — click Beginner, Medium, or Hard in the top-right
2. **Set a timer** — click a preset (15s / 30s / 60s / 120s) or type a custom value and press Enter
3. **Click the text area** (or press any key) to focus and start typing
4. **Type the words** — space advances to the next word
5. **Results** appear automatically when the timer hits zero

### Keyboard Shortcuts
| Key | Action |
|---|---|
| `Tab` | Reset and start a new test immediately |
| `Enter` (in custom time box) | Apply custom time |
| `Space` | Advance to next word |

---

## Difficulty Details

### Beginner
Short, high-frequency English words (2–6 letters). Good for warming up or beginners learning touch typing.
> Examples: `the`, `and`, `work`, `make`, `they`

### Medium
Common everyday vocabulary (5–10 letters). Balanced challenge for intermediate typists.
> Examples: `history`, `complete`, `consider`, `experience`

### Hard
Complex, rare, and long words (8–15 letters). Designed to challenge advanced typists.
> Examples: `ubiquitous`, `labyrinthine`, `perspicacious`, `idiosyncratic`

---

## Tech Stack

- **React 18** — hooks-based component architecture
- **No external UI library** — all styles are plain JavaScript style objects
- **Canvas API** — WPM graph drawn natively
- **Google Fonts** — DM Mono (typing area) + Syne (UI)

---

## Customisation

### Add more words
Edit the `WORD_POOLS` object in `src/TypingTest.js`:
```js
const WORD_POOLS = {
  beginner: ["your", "words", "here", ...],
  medium:   [...],
  hard:     [...],
};
```

### Change default settings
At the top of the `TypingTest` component:
```js
const [totalTime,  setTotalTime]  = useState(30);   // default timer in seconds
const [difficulty, setDifficulty] = useState("medium"); // default difficulty
```

### Change accent colours
In `DIFFICULTY_META`:
```js
const DIFFICULTY_META = {
  beginner: { label: "Beginner", color: "#6bffd8", ... },
  medium:   { label: "Medium",   color: "#e8ff47", ... },
  hard:     { label: "Hard",     color: "#ff6b6b", ... },
};
```

---

## License

MIT — free to use, modify, and distribute.
