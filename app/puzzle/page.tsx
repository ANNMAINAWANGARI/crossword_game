'use client'
import { GameState, Position } from '@/types/wordSearch';
import React, { useState, useEffect } from 'react';
import { Keyword } from '../api/keywords/route';
import { fetchWords, getDifficultyLevel } from '@/utils/wordUtils';
import { generateWordSearchGrid } from '@/utils/wordSearchUtils';

const page = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [wordData, setWordData] = useState<Keyword[]>([]);
  const [wordSummaries, setWordSummaries] = useState<Record<string, string>>({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPositions, setHintPositions] = useState<Position[]>([]);
  const initGame = async (level: number = currentLevel) => {
    try{
      setGameState(prev => prev ? { ...prev, loading: true } : null);
      const difficultyLevel = getDifficultyLevel(level);
      const { words: selectedWords, categories: wordCategories, data } = await fetchWords( difficultyLevel.wordCount);
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
    <div>page</div>
  )
}

export default page