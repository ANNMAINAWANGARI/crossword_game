'use client'
import React, { useState } from "react";
import { WordPlacement } from "../types/wordSearch";

type WordListProps = {
  words: WordPlacement[];
};

const WordList: React.FC<WordListProps> = ({ words }) => {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  
  const foundWords = words.filter(word => word.found);
  const unfoundWords = words.filter(word => !word.found);

  // Group found words by category if available
  const groupedWords: Record<string, WordPlacement[]> = {};
  
  foundWords.forEach(word => {
    const category = word.category || 'Other';
    if (!groupedWords[category]) {
      groupedWords[category] = [];
    }
    groupedWords[category].push(word);
  });
  
  // Toggle word details
  const toggleWordDetails = (word: string) => {
    setShowDetails(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border-4 border-game-orange">
      <div className="mb-4">
        <h2 className="text-2xl font-bangers text-game-purple mb-2">
          Word Found: {foundWords.length}/{words.length}
        </h2>
        
        {Object.entries(groupedWords).length > 0 ? (
          Object.entries(groupedWords).map(([category, categoryWords]) => (
            <div key={category} className="mb-4">
              <h3 className="text-lg font-comic font-semibold capitalize text-game-dark mb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {categoryWords.map((word, index) => (
                  <div 
                    key={index}
                    className="font-comic px-2 py-1 rounded animate-pop cursor-pointer"
                    style={{
                      backgroundColor: `${word.color}20`, // 20% opacity
                      color: word.color,
                      border: `2px solid ${word.color}`
                    }}
                    onClick={() => toggleWordDetails(word.word)}
                  >
                    <div className="font-bold">{word.word}</div>
                    {showDetails[word.word] && (
                      <div className="text-sm mt-1 p-1 bg-white bg-opacity-50 rounded">
                        {word.summary && (
                          <div className="mb-1">
                            <strong>Summary:</strong> {word.summary}
                          </div>
                        )}
                        {word.clue && (
                          <div>
                            <strong>Clue:</strong> {word.clue}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-game-dark font-comic">
            No words found yet!
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bangers text-game-orange">Trending Words:</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-2">
          {unfoundWords.map((word, index) => (
            <div
              key={index}
              className="font-comic text-game-dark px-2 py-1 rounded bg-game-yellow text-center"
            >
              {word.found ? word.word : "????"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordList;
