# 🚀 RecallRocket — SM-2 Spaced Repetition & Campus Mastery

> **Combat the Ebbinghaus forgetting curve with intelligent SuperMemo-2 (SM-2) scheduling, daily study streaks, and cohort leaderboards.**

![Light Theme](https://img.shields.io/badge/Theme-Crisp%20Light-4f46e5?style=flat-square)
![SM-2 Algorithm](https://img.shields.io/badge/Algorithm-SuperMemo--2%20(SM--2)-059669?style=flat-square)
![Streak Gamification](https://img.shields.io/badge/Streak-Flame%20Badges-ea580c?style=flat-square)
![Campus Leaderboard](https://img.shields.io/badge/Cohort-Campus%20Leaderboard-7c3aed?style=flat-square)

---

## 🎯 Problem & Purpose

College students preparing for competitive exams and technical interviews often resort to cramming. Psychological research shows that **up to 70% of newly learned concepts are forgotten within 48 hours** without structured review. 

Traditional flashcard applications lack adaptive scheduling, forcing students to review easy concepts repeatedly while neglecting challenging topics. Furthermore, they lack social gamification incentives like consecutive streaks and peer leaderboards needed to sustain daily study consistency.

**RecallRocket** solves this by implementing the algorithmic foundation of the **SuperMemo-2 (SM-2)** spaced repetition algorithm paired with an interactive 3D card flip interface, study streaks, and a campus leaderboard.

---

## ✨ Core Features

### 1. 🧠 SuperMemo-2 (SM-2) Spaced Repetition Engine
- Calculates optimal next-review intervals based on recall grades ($q \in \{0, 1, 2, 3, 4, 5\}$):
  - **Grade 5:** Perfect immediate recall
  - **Grade 4:** Correct response after hesitation
  - **Grade 3:** Correct response recalled with serious difficulty
  - **Grade 2:** Incorrect response; correct answer seemed easy
  - **Grade 1:** Incorrect response; correct answer remembered
  - **Grade 0:** Complete blackout
- **Adaptive Ease Factor (EF) recalculation:**
  $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
  - Enforces a **strict floor of $EF \ge 1.3$** to prevent card trapping.
- **Interval scheduling:**
  - If $q < 3$ (failure): repetitions reset to $0$, interval resets to $1$ day.
  - If $q \ge 3$ (success):
    - 1st repetition: interval = $1$ day
    - 2nd repetition: interval = $6$ days
    - $n$-th repetition: interval = $\text{round}(\text{previous\_interval} \times EF')$
- **Live Preview Badges:** Every rating button displays the exact calculated next interval before rating!

### 2. 🎴 Interactive 3D Flashcard Flip UI
- Smooth CSS 3D hardware-accelerated transforms (`perspective: 1200px`, `transform-style: preserve-3d`, `backface-visibility: hidden`).
- **Front Face:** Question prompt, subject tags, audio pronunciation button, and flip hints.
- **Back Face:** Rich answer, formatted syntax-highlighted code blocks, and 6 rating buttons with interval forecasts.
- **Keyboard Shortcuts:**
  - `Space` or `Enter`: Flip card
  - `0`, `1`, `2`, `3`, `4`, `5`: Select recall rating
  - `R`: Listen to text-to-speech pronunciation
  - `Esc`: Exit study session

### 3. 📅 Daily Due Review Queue
- Automatically queries cards where `nextReviewDate <= today` using UTC ISO date normalization (`YYYY-MM-DD`) to avoid timezone drift across midnight boundaries.
- Live progress indicator showing card count, completion percentage, and accuracy.

### 4. 🔥 Daily Study Streak Counter & Badges
- Computes consecutive active calendar study days.
- Animated flame counter in the header.
- Milestone badges:
  - ⚡ *First Spark* (Completed first review session)
  - 🔥 *3-Day Fire* (3 consecutive active days)
  - 🏆 *7-Day Consistent Scholar* (Unlocked upon completing today's demo session!)

### 5. 🏛️ Campus Cohort Leaderboard
- Ranks students across peer institutions (MIT, Stanford, UC Berkeley, Carnegie Mellon, Tsinghua, ETH Zürich).
- Weighted scoring based on cards reviewed, active streak, and retention points.
- Real-time rank jump celebration overlay and animated header upgrade when passing cohort peers!

### 6. 📈 Ebbinghaus Retention Decay Curve & Forecasts
- Interactive **Chart.js** visualization comparing traditional cramming decay ($R = e^{-t/S}$) against SM-2 spaced repetition checkpoints.
- 7-day upcoming review workload forecast.

### 7. ✨ AI Flashcard Generator
- Heuristic NLP card generator extracting 5 structured Q&A flashcards from any pasted lecture note, textbook excerpt, or technical article.
- Pre-fill button with sample computer science lecture notes.

### 8. 📥 Anki / CSV Import & Export
- Export any deck as Anki-compatible CSV or structured JSON.
- Import custom decks via CSV format (`Question,Answer,Tags`).

### 9. 🔊 Audio Pronunciation Playback
- Integrated Web Speech API (`SpeechSynthesisUtterance`) with markdown cleaning to naturally read questions and answers aloud.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+ Modules), HTML5, CSS3 with CSS Custom Properties and 3D transforms.
- **Backend:** Node.js with Express providing RESTful endpoints for deck synchronization, SM-2 processing, and leaderboard ranking.
- **Visualizations:** Chart.js & Canvas Confetti.
- **Persistence:** Local atomic JSON store (`data/database.json`) seeded with 40+ Computer Science interview concepts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd Recallrocket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🎬 What a Good Demo Looks Like (Step-by-Step)

1. **Open Dashboard:**
   - Notice the light theme, the header showing `🔥 6 Days` streak and `🥉 #3 Alex Chen (2,450 pts)`.
   - The *Algorithms* deck displays **5 cards due today**.
2. **Start Study Session:**
   - Click **"Study (5 Due)"** on the Algorithms deck.
   - Card 1 appears: *"What is the time complexity of QuickSort?"*.
3. **Inspect & Flip:**
   - Click the card or press `Space` to smoothly flip in 3D to the back face.
   - Review the detailed breakdown (Best/Avg $\mathcal{O}(n \log n)$, Worst $\mathcal{O}(n^2)$).
   - Notice the rating buttons: button `5 - Perfect` projects **6d** next review!
4. **Rate Grade 5:**
   - Click `5 - Perfect` (or press `5` on your keyboard).
   - The SM-2 scheduling engine recalculates: interval expands from **1 day to 6 days** ($EF = 2.60$, Reps = 2).
5. **Complete the 5 Cards:**
   - Rate the remaining 4 cards.
   - Upon completing the 5th card:
     - Confetti explodes!
     - The **"🔥 7-Day Consistent Scholar"** milestone badge is unlocked!
     - A rank upgrade overlay announces: **"Rank jumped from #3 to #2 on the Campus Leaderboard!"**
6. **Campus Leaderboard:**
   - Click **"View Campus Leaderboard"** to see Alex Chen now holding the #2 spot with 2,750+ points!
7. **Retention Curve:**
   - Click **"Retention Curve"** to view the Ebbinghaus forgetting curve with SM-2 checkpoints.
8. **Reset Demo:**
   - Click **"🔄 Reset Demo"** in the top navigation at any time to restore the exact initial 5-card demo state.
