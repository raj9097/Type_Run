# ⌨️ Type.Run

> **A minimal, highly dynamic, and buttery-smooth typing test application built for speed.**

![Type.Run Demo](https://i.imgur.com/rN55h2S.png) *(Note: Replace with your actual project screenshot link)*

Type.Run isn't just about measuring WPM—it's about creating a typing experience that feels physically rewarding, exceptionally fluid, and perfectly frictionless. Inspired by modern minimalist design, it focuses entirely on the flow of typing while leveraging modern UI physics to respond to your performance.

---

## ✨ Key Features

*   **⚡️ Framer Motion Physics**: Interactions don't just happen; they pop, scale, and bounce with natural spring physics. Every button press gives tactile visual feedback.
*   **📊 Dynamic Performance Assessment**: Your results screen grades you in real-time. If you type like a 🐢, it'll tell you. But if you hit 100+ WPM? 👑 **GODLIKE** animations await.
*   **🎉 Confetti Micro-interactions**: Fast typists (40+ WPM, 90%+ Accuracy) are rewarded with an explosive, full-screen particle layout powered by `react-confetti`.
*   **⏱️ Custom Timers**: Choose from standard 15s/30s/60s presets, or open the custom spring modal to set your own grueling time limits up to 60 minutes.
*   **🔢 Adaptive Word Pools & Extras**: Toggle on Numbers (🔢) and Symbols (!@#) on the fly to rigorously test your true bottom-row and shift-key accuracy.
*   **🌗 Instant Theming**: Pure CSS-in-JS dark and light mode rendering that saves to your local storage instantly.

## 🛠️ Tech Stack

*   **Frontend Library:** React 18
*   **Animation Engine:** Framer Motion (`framer-motion`)
*   **Particle Effects:** React Confetti (`react-confetti`)
*   **Architecture:** Component-driven, modular folder structure
*   **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)

## 📂 Architecture overview

The application has been explicitly structured to separate layout components from heavy data constants, keeping the main logic readable:

```text
src/
├── components/
│   ├── CustomTimeModal.js  # Animated custom time selector
│   ├── Header.js           # Live stats and config toggles
│   ├── ResultScreen.js     # Post-test dynamic performance renderer
│   ├── ThemeToggle.js      # App-wide light/dark toggle switcher
│   └── WpmGraph.js         # Canvas-drawn sparkline graph
├── constants/
│   ├── theme.js            # Unified color dictionary 
│   └── words.js            # Vast dictionaries, number & symbol maps
├── utils/
│   └── helpers.js          # Shuffling logic, formatting magic
├── App.js                  # App Entry Point
└── TypingTest.js           # Core Game Logic & Input Handling
```

## 🚀 Local Development

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Type_Run.git
   ```
2. **Install exact dependencies:**
   *(Ensure you use a complete clean install so lock files don't conflict)*
   ```bash
   npm install
   ```
3. **Run the local development server:**
   ```bash
   npm start
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## ⌨️ Keyboard Shortcuts

We believe real typists shouldn't use a mouse.
*   `Tab` : Instantly restart a new test (shuffles words).
*   `Ctrl + Enter` : Retry the exact same test sequence you just typed.
*   `Escape` : Close the custom time modal.

## 🤝 Contributing
Feel free to fork the project and submit a Pull Request! Whether it's adding new Themes, creating highly specific word pools (e.g. "Coding keywords only"), or improving the WPM calculation accuracy—all contributions are welcome!

---
*Built with ❤️ and a lot of key-presses.*
