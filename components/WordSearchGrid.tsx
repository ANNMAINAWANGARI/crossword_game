'use client'
import React, { useState, useEffect } from "react";
import { Position, GameState } from "../types/wordSearch";
import Sparkle from "./Sparkle";

type WordSearchGridProps = {
  gameState: GameState;
  onWordFound: (word: string, positions: Position[]) => void;
  hintPositions: Position[];
};

const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  gameState,
  onWordFound,
  hintPositions,
}) => {
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Position | null>(null);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number; color: string }[]>([]);

  // Handle mouse down to start selection
  const handleMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
  };

  // Handle mouse enter to continue selection
  const handleMouseEnter = (row: number, col: number) => {
    if (!selecting || !startCell) return;

    // Only allow selection in straight lines (horizontal, vertical, diagonal)
    const newPosition = { row, col };
    
    // If this is a new cell and we're selecting in a line
    if (!selectedCells.some(cell => cell.row === row && cell.col === col)) {
      // Check if this new position maintains a straight line from the start
      const isInLine = (startPos: Position, newPos: Position) => {
        // Same row (horizontal)
        if (newPos.row === startPos.row) return true;
        
        // Same column (vertical)
        if (newPos.col === startPos.col) return true;
        
        // Diagonal - check if the slope is the same
        const rowDiff = Math.abs(newPos.row - startPos.row);
        const colDiff = Math.abs(newPos.col - startPos.col);
        
        // Perfect diagonal has equal row and column differences
        return rowDiff === colDiff;
      };
      
      if (isInLine(startCell, newPosition)) {
        // Get all cells in the line between startCell and new position
        const getCellsInLine = (start: Position, end: Position): Position[] => {
          const cells: Position[] = [];
          
          const rowDiff = end.row - start.row;
          const colDiff = end.col - start.col;
          
          const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
          
          const rowIncrement = rowDiff === 0 ? 0 : rowDiff / steps;
          const colIncrement = colDiff === 0 ? 0 : colDiff / steps;
          
          for (let i = 0; i <= steps; i++) {
            const currentRow = Math.round(start.row + i * rowIncrement);
            const currentCol = Math.round(start.col + i * colIncrement);
            cells.push({ row: currentRow, col: currentCol });
          }
          
          return cells;
        };
        
        setSelectedCells(getCellsInLine(startCell, newPosition));
      }
    }
  };

  // Handle mouse up to end selection
  const handleMouseUp = () => {
    setSelecting(false);
    
    // Check if the selected cells form a word
    if (selectedCells.length >= 2) {
      const selectedWord = selectedCells.map(
        cell => gameState.grid[cell.row][cell.col]
      ).join("");
      
      const reversedSelectedWord = [...selectedWord].reverse().join("");
      
      // Check if this word or its reverse is in our word list
      const foundWordPlacement = gameState.words.find(
        word => 
          !word.found && 
          (word.word.toUpperCase() === selectedWord || 
           word.word.toUpperCase() === reversedSelectedWord)
      );
      
      if (foundWordPlacement) {
        // Generate a random color if one isn't assigned
        if (!foundWordPlacement.color) {
          foundWordPlacement.color = getRandomWordColor(foundWordPlacement.category);
        }
        
        onWordFound(foundWordPlacement.word, selectedCells);
        
        // Create sparkles at random positions along the found word with the word's color
        const sparkleColor = foundWordPlacement.color;
        const newSparkles = selectedCells.map((cell, index) => {
          const cellElement = document.querySelector(
            `[data-row="${cell.row}"][data-col="${cell.col}"]`
          );
          
          if (cellElement) {
            const rect = cellElement.getBoundingClientRect();
            return {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              id: Date.now() + index,
              color: sparkleColor
            };
          }
          return null;
        }).filter(Boolean) as { x: number; y: number; id: number; color: string }[];
        
        setSparkles(prev => [...prev, ...newSparkles]);
        
        // Remove sparkles after animation
        setTimeout(() => {
          setSparkles(prev => 
            prev.filter(s => !newSparkles.find(ns => ns.id === s.id))
          );
        }, 1000);
      }
    }
    
    // Clear selection if no word was found
    setSelectedCells([]);
    setStartCell(null);
  };

  // Get a color based on word category, or random if none
  const getRandomWordColor = (category?: string) => {
    const categoryColors = {
      'sports': '#43a047', // Green
      'technological': '#1e88e5', // Blue
      'political': '#e53935', // Red
      'financial': '#fb8c00', // Orange
      'health': '#00acc1', // Teal
      'environmental': '#2e7d32', // Dark green
      'entertainment': '#8e24aa', // Purple
      'science': '#3949ab', // Indigo
      'business': '#6d4c41', // Brown
    };
    
    if (category && categoryColors[category as keyof typeof categoryColors]) {
      return categoryColors[category as keyof typeof categoryColors];
    }
    
    // Random color if no category or unknown category
    const colors = [
      '#e53935', '#8e24aa', '#1e88e5', '#43a047', 
      '#fb8c00', '#00acc1', '#3949ab', '#6d4c41'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle touch events for mobile
  const handleTouchStart = (row: number, col: number) => {
    handleMouseDown(row, col);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault(); // Prevent scrolling while selecting
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const row = parseInt(element.getAttribute("data-row") || "-1");
      const col = parseInt(element.getAttribute("data-col") || "-1");
      
      if (row !== -1 && col !== -1) {
        handleMouseEnter(row, col);
      }
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Cleanup effect
  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (selecting) {
        setSelecting(false);
        setSelectedCells([]);
        setStartCell(null);
      }
    };

    window.addEventListener("mouseup", handleMouseUpOutside);
    return () => window.removeEventListener("mouseup", handleMouseUpOutside);
  }, [selecting]);
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  

  return (
    <div 
      className="relative bg-white rounded-xl p-3 shadow-lg border-4 border-game-purple"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid gap-1 md:gap-2" 
        style={{ 
          gridTemplateColumns: `repeat(${gameState.size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gameState.size}, minmax(0, 1fr))`,
        }}
      >
        {gameState.grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            // Check if this cell is selected
            const isSelected = selectedCells.some(
              cell => cell.row === rowIndex && cell.col === colIndex
            );
            
            // Check if this cell is part of a found word
            const foundWord = gameState.words
              .filter(word => word.found)
              .find(word =>
                word.positions.some(
                  pos => pos.row === rowIndex && pos.col === colIndex
                )
              );
              
            // Check if this cell is a hint
            const isHint = hintPositions.some(
              pos => pos.row === rowIndex && pos.col === colIndex
            );
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-xl font-bold cursor-pointer select-none transition-all duration-300 border border-purple-200 bg-white rounded-md shadow-sm font-comic ${
                  isSelected ? "background-game-purple text-white transform scale-105" : ""
                } ${
                  isHint ? "bg-yellow-200" : ""
                }`}
                style={{
                  backgroundColor: foundWord ? hexToRgba(foundWord.color as string, 0.4) : '',
                  color: foundWord ? 'white' : '',
                }}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                onTouchMove={handleTouchMove}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          position={{ x: sparkle.x, y: sparkle.y }}
          color={sparkle.color}
        />
      ))}
    </div>
  );
};

export default WordSearchGrid;