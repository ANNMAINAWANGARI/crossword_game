'use client'
import { GameState, Position } from '@/types/wordSearch';
import React, { useState, useEffect } from 'react';
import { Keyword } from '../api/keywords/route';
import { fetchWords, getDifficultyLevel } from '@/utils/wordUtils';
import { generateWordSearchGrid, getHint } from '@/utils/wordSearchUtils';
import WordSearchGrid from '@/components/WordSearchGrid';
import { toast } from "sonner"
import WordList from '@/components/WordList';

const page = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [wordData, setWordData] = useState<Keyword[]>([]);
  const [wordSummaries, setWordSummaries] = useState<Record<string, string>>({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPositions, setHintPositions] = useState<Position[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const initGame = async (level: number = currentLevel) => {
    try{
      setGameState(prev => prev ? { ...prev, loading: true } : null);
      const difficultyLevel = getDifficultyLevel(level);
      const { words: selectedWords, categories: wordCategories, data } = await fetchWords( difficultyLevel.wordCount,difficultyLevel.gridSize);
      setWordData(data);
      const summaries: Record<string, string> = {};
      data.forEach(item => {
        summaries[item.word] = item.summary || '';
      });
      setWordSummaries(summaries);
      const newGameState = generateWordSearchGrid(
        selectedWords, 
        difficultyLevel.gridSize, 
        true
      );
      const updatedWords = newGameState.words.map(word => {
        const wordInfo = data.find(w => w.word === word.word);
        return {
          ...word,
          category: wordInfo?.category || wordCategories[word.word],
          clue: wordInfo?.clue,
          summary: wordInfo?.summary,
          hint: wordInfo?.clue
        };
      });
      
      setGameState({
        ...newGameState,
        words: updatedWords,
        loading: false
      });
      setHintsUsed(0);
      setHintPositions([]);
    }catch(error){
      console.error("Failed to initialize game:", error);
      setGameState(prev => prev ? { ...prev, loading: false } : null);
    }
  }
  // Initial game setup
  useEffect(() => {
    initGame(currentLevel);
  }, []);

   // Handle level selection
  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    initGame(level);
    toast(`You're now playing level ${level}`);
  };
   // Handle confetti cleanup
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);


  // Handle word found
  const handleWordFound = (word: string, positions: Position[]) => {
    if (!gameState) return;

    setGameState(prevState => {
      if (!prevState) return null;

      const updatedWords = prevState.words.map(w =>
        w.word.toUpperCase() === word.toUpperCase()
          ? { ...w, found: true }
          : w
      );

      const allFound = updatedWords.every(w => w.found);
      
      // Show celebration if all words are found
      if (allFound) {
        setTimeout(() => {
          setShowConfetti(true);
          toast(`Breaking News! 🎉 You've uncovered all news stories! Ready for level ${Math.min(currentLevel + 1, 5)}?`);
        }, 500);
      } else {
        // Regular word found toast
        toast(`Found "${word}"! ${updatedWords.filter(w => w.found).length}/${updatedWords.length} stories uncovered`);
      }

      return {
        ...prevState,
        words: updatedWords,
      };
    });
  };
  // Get a hint
  const handleGetHint = () => {
    if (!gameState) return;
    
    if (hintsUsed >= 3) {
      toast("You've used all your research hints for this article!",);
      return;
    }

    const hint = getHint(gameState);
    
    if (hint) {
      setHintsUsed(prev => prev + 1);
      setHintPositions(prev => [...prev, hint.position]);
      
      // Use custom hint if available from word data
      // const wordObj = gameState.words.find(w => w.word === hint.word);
      // const customHint = wordObj?.clue;
      
      toast( `Our sources suggest looking around "${hint.letter}" for the word "${hint.word.substring(0, 2)}..."`);
      
      // Clear hint after a few seconds
      setTimeout(() => {
        setHintPositions(prev => prev.filter(
          pos => pos.row !== hint.position.row || pos.col !== hint.position.col
        ));
      }, 5000);
    }
  };
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-comic text-game-purple animate-bounce">
          Loading Word Search News...
        </div>
      </div>
    );
  }
  if (gameState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-comic text-game-purple animate-bounce">
          Breaking News... Loading Stories...
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-gradient-to-b from-blue-500 to-gray-100">
      <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <div className="lg:w-2/3">
         <WordSearchGrid gameState={gameState} onWordFound={handleWordFound} hintPositions={hintPositions}/>
        </div>
        <div className="lg:w-1/3 flex flex-col gap-4">
         <WordList words={gameState.words} />
        </div>
      </main>
    </div>
  )
}

export default page