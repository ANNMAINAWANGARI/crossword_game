# 🧩 CLUETHETIMES

---
## 🗞️ What is ClueTheTimes?

ClueTheTimes is a web-based word search game that generates puzzles from **real-time news stories**, using the **Perplexity Sonar API** to:

- Extract trending keywords
- Generate puzzle-style clues
- Provide short news summaries
- Categorize each word (e.g., political, tech, economic)

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
### Video Demo

[![Watch the demo](https://img.youtube.com/vi/H7YjYEl9VVE/hqdefault.jpg)](https://youtu.be/H7YjYEl9VVE)

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