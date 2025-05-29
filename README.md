# 🧩 CLUETHETIMES

## 🗞️ What is ClueTheTimes?

ClueTheTimes is more than a game — it's a real-time knowledge system that turns global news into structured, playable intelligence. Built on top of the Sonar API, it showcases how language models can:

- Parse and extract **contextual meaning** from live news content
- Generate **concise, semantically accurate clues**
- Categorize information across domains like politics, economics, and technology
- Automatically convert unstructured knowledge into a structured, human-friendly experience  

Each time you play, you get a fresh, relevant, and educational word search puzzle based on what’s happening in the world — right now.

---

## 🧠 How It Works

1. User calls the **Perplexity Sonar API** to retrieve trending news topics.
2. Sonar returns:
   - A list of **keywords** (used as the hidden words in the puzzle)
   - A **clue** for each word (displayed as a hint)
   - A short **explanation** of the news context
   - A **category** (e.g., *political*, *economic*, etc.)
3. The game dynamically:
   - Builds a playable word search grid with the keywords
   - Links each word to its clue and explanation
   - Difficulty levels increase after every win

---

## 🛠️ Tech Stack

**Frontend:** React.js  
**Backend/API:** Next.js 15 API Routes  
**AI Integration:** Perplexity Sonar API (prompt-engineered for structured JSON responses)  
**Styling:** Tailwind CSS  

---  

## 📝 TODO / Feature Roadmap

Here are some upcoming features and directions I'm exploring for ClueTheTimes:

### 🎮 Gameplay Features
- [ ] **Multiplayer Mode**: Real-time or turn-based play with friends or global opponents
- [ ] **Timed Challenges**: Solve puzzles against the clock for extra points or streaks
- [ ] **Scheduled Puzzles**: Schedule games in a calendar and send invites to the participants

### 🏫 Educational Mode
- [ ] **Classroom/Thesis Competitions**: Let teachers or researchers create puzzle sets tied to a curriculum, research theme, or news analysis
- [ ] **Student Leaderboards**: Track performance across institutions or groups
- [ ] **Safe/Filtered Content Mode**: Ensure age-appropriate, educational-friendly news topics

### 🧠 AI + UX Enhancements
- [ ] **Keyword Difficulty Scoring**: Auto-label easy/medium/hard clues based on abstraction
- [ ] **Topic Filters**: Let players pick puzzles by category (e.g. politics, tech, health)
- [ ] **Multilingual Support**: Localize puzzles and clues in multiple languages

### 🌐 Community & Sharing
- [ ] **Puzzle Sharing**: Generate links to share and challenge others
- [ ] **User-Curated Topics**: Let users request puzzles based on specific topics or people
- [ ] **Analytics Dashboard**: Track puzzle difficulty, solve rates, and clue effectiveness

### ⚙️ Developer + API Features
- [ ] **Strict Schema Parsing**: Enforce clean JSON from Sonar with schema fallback logic
- [ ] **Offline Mode**: Cache recent puzzles for offline play
- [ ] **Accessibility Improvements**: High-contrast mode, screen reader compatibility

---
### Video Demo

[![Watch the demo below](https://img.youtube.com/vi/H7YjYEl9VVE/hqdefault.jpg)](https://youtu.be/H7YjYEl9VVE)

### HomePage
![HomePage](/public/Homepage.png)

### PuzzlePage
![HomePage](/public/PuzzlePage.png)

## Tech Stack/ Tooling
- Frontend : Next.js 15
- SONAR MODEL


## Project Scripts

In the project directory, you can run the following:
### `npm install`

In your .env.local file add PERPLEXITY_API_KEY=""

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\