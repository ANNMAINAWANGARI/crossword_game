import { GameState, Position, WordDirection, WordPlacement } from "@/types/wordSearch";

// export const generateWordSearchGrid = (
//   words: string[],
//   size: number,
//   allowBackwards: boolean
// ): GameState => {
//   // Initialize an empty grid
//   const grid: string[][] = Array(size)
//     .fill(null)
//     .map(() => Array(size).fill(""));

//   const placedWords: WordPlacement[] = [];
  
//   // Used to track occupied positions to avoid placing words too close together
//   const occupiedPositions: Set<string> = new Set();
  
//   // Min distance between words (in grid cells) - increase this to make words more spread out
//   const minDistance = Math.min(1, Math.floor(size / 10));

//   // Shuffle words to randomize placement attempts
//   const shuffledWords = [...words].sort(() => Math.random() - 0.5);

//   // Try to place each word
//   for (const word of shuffledWords) {
//     // Skip if word is longer than grid size
//     if (word.length > size) continue;

//     let placed = false;
//     let attempts = 0;
//     const maxAttempts = 200; // Increase max attempts to find better positions

//     while (!placed && attempts < maxAttempts) {
//       attempts++;

//       // Pick a random direction
//       const directions: WordDirection[] = [
//         "horizontal",
//         "vertical",
//         "diagonal-down",
//         "diagonal-up"
//       ];
//       const direction = directions[Math.floor(Math.random() * directions.length)];

//       // Calculate maximum starting position based on direction and word length
//       let maxRow = size - 1;
//       let maxCol = size - 1;

//       if (direction === "vertical" || direction === "diagonal-down") {
//         maxRow = size - word.length;
//       }
//       if (direction === "horizontal" || direction === "diagonal-down" || direction === "diagonal-up") {
//         maxCol = size - word.length;
//       }
//       if (direction === "diagonal-up") {
//         maxRow = size - 1;
//         // We need to place the word starting from the bottom to go up diagonally
//         // So the minimum row is the word length - 1
//         const minRow = word.length - 1;
//         // Pick a random row between minRow and maxRow
//         const startRow = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
//         const startCol = Math.floor(Math.random() * (maxCol + 1));

//         // Try to place the word
//         if (canPlaceWord(grid, word, startRow, startCol, direction, occupiedPositions, minDistance)) {
//           const positions = placeWord(grid, word, startRow, startCol, direction);
          
//           // Add positions to occupied set
//           positions.forEach(pos => {
//             occupiedPositions.add(`${pos.row},${pos.col}`);
            
//             // Add surrounding positions within minDistance as "occupied" to space out words
//             for (let r = -minDistance; r <= minDistance; r++) {
//               for (let c = -minDistance; c <= minDistance; c++) {
//                 if (r === 0 && c === 0) continue; // Skip the actual word position
//                 const nearbyRow = pos.row + r;
//                 const nearbyCol = pos.col + c;
//                 if (nearbyRow >= 0 && nearbyRow < size && nearbyCol >= 0 && nearbyCol < size) {
//                   // Don't add as occupied if it's actually part of the word
//                   if (!positions.some(p => p.row === nearbyRow && p.col === nearbyCol)) {
//                     occupiedPositions.add(`${nearbyRow},${nearbyCol}`);
//                   }
//                 }
//               }
//             }
//           });
          
//           placedWords.push({
//             word,
//             positions,
//             direction,
//             found: false
//           });
//           placed = true;
//         }
//       } else {
//         // For other directions
//         const startRow = Math.floor(Math.random() * (maxRow + 1));
//         const startCol = Math.floor(Math.random() * (maxCol + 1));

//         // Randomly decide to place word backwards (if allowed)
//         const backwards = allowBackwards && Math.random() > 0.5;
        
//         // Try to place the word
//         if (canPlaceWord(grid, backwards ? reverseString(word) : word, startRow, startCol, direction, occupiedPositions, minDistance)) {
//           const positions = placeWord(grid, backwards ? reverseString(word) : word, startRow, startCol, direction);
          
//           // Add positions to occupied set
//           positions.forEach(pos => {
//             occupiedPositions.add(`${pos.row},${pos.col}`);
            
//             // Add surrounding positions within minDistance as "occupied" to space out words
//             for (let r = -minDistance; r <= minDistance; r++) {
//               for (let c = -minDistance; c <= minDistance; c++) {
//                 if (r === 0 && c === 0) continue; // Skip the actual word position
//                 const nearbyRow = pos.row + r;
//                 const nearbyCol = pos.col + c;
//                 if (nearbyRow >= 0 && nearbyRow < size && nearbyCol >= 0 && nearbyCol < size) {
//                   // Don't add as occupied if it's actually part of the word
//                   if (!positions.some(p => p.row === nearbyRow && p.col === nearbyCol)) {
//                     occupiedPositions.add(`${nearbyRow},${nearbyCol}`);
//                   }
//                 }
//               }
//             }
//           });
          
//           placedWords.push({
//             word,
//             positions,
//             direction,
//             found: false
//           });
//           placed = true;
//         }
//       }
//     }
//   }

//   // Fill the remaining empty cells with random letters
//   fillEmptyCells(grid);

//   return {
//     grid,
//     words: placedWords,
//     size,
//     startPosition: null,
//     currentPosition: null,
//     selectedPositions: [],
//     loading: false
//   };
// };

// Helper to reverse a string
const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};









function isPlacementTooCloseForHV(
  wordToPlace: string,
  pRow: number, // Start row for wordToPlace[0]
  pCol: number, // Start col for wordToPlace[0]
  pDirection: WordDirection,
  gridSize: number,
  existingPlacedWords: WordPlacement[]
): boolean { // true if too close, false otherwise

  const isProspectiveHorizontal = pDirection === "horizontal";
  const isProspectiveVertical = pDirection === "vertical";

  // This rule only applies if the word being placed is horizontal or vertical
  if (!isProspectiveHorizontal && !isProspectiveVertical) {
    return false;
  }

  const prospectivePath: { row: number; col: number }[] = [];
  for (let i = 0; i < wordToPlace.length; i++) {
    let r = pRow;
    let c = pCol;
    if (pDirection === "horizontal") {
      c += i;
    } else if (pDirection === "vertical") {
      r += i;
    }
    // Ensure path generation is within bounds; if not, it's an invalid placement anyway.
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        // This scenario should ideally be caught by canPlaceWord or earlier bounds checks
        return true; // Treat as "too close" if path goes out of bounds
    }
    prospectivePath.push({ row: r, col: c });
  }

  for (const existingWord of existingPlacedWords) {
    const isExistingHorizontal = existingWord.direction === "horizontal";
    const isExistingVertical = existingWord.direction === "vertical";

    // This rule only cares about H/V adjacency to other H/V words
    if (!isExistingHorizontal && !isExistingVertical) {
      continue;
    }

    for (const prospectiveCell of prospectivePath) {
      for (const existingCell of existingWord.positions) {
        const dr = Math.abs(prospectiveCell.row - existingCell.row);
        const dc = Math.abs(prospectiveCell.col - existingCell.col);

        // Check for direct cardinal adjacency (Manhattan distance of 1)
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
          return true; // Found a forbidden adjacency
        }
      }
    }
  }
  return false; // No forbidden H/V adjacencies found
}





export const generateWordSearchGrid = (
  words: string[],
  size: number,
  allowBackwards: boolean
): GameState => {
  const grid: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));

  const placedWords: WordPlacement[] = [];
  const occupiedPositions: Set<string> = new Set();
  const minDistance = Math.min(1, Math.floor(size / 10)); // Or your preferred minDistance logic
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  for (const word of shuffledWords) {
    // Only skip genuinely empty words. Words longer than 'size' will be handled below.
    if (word.length === 0) continue;

    let placed = false;
    let attempts = 0;
    const maxAttempts = 200;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      let availableDirections: WordDirection[];
      if (word.length > size) {
        // If word is longer than grid dimension, only attempt diagonal placement.
        // Note: It will still not fit if word.length > size.
        availableDirections = ["diagonal-down", "diagonal-up"];
      } else {
        availableDirections = [
          "horizontal",
          "vertical",
          "diagonal-down",
          "diagonal-up",
        ];
      }
      const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];

      let actualStartRow: number;
      let actualStartCol: number;
      let wordToUse = word;

      if (direction === "diagonal-up") {
        const minPossibleStartRow = word.length - 1;
        const maxPossibleStartCol = size - word.length;

        if (minPossibleStartRow >= size || maxPossibleStartCol < 0) {
          continue; // Word cannot fit this way
        }
        actualStartRow = minPossibleStartRow + Math.floor(Math.random() * (size - minPossibleStartRow));
        actualStartCol = Math.floor(Math.random() * (maxPossibleStartCol + 1));
        wordToUse = word; // Diagonal-up not typically reversed by simple 'allowBackwards'
      } else { // "horizontal", "vertical", "diagonal-down"
        let maxPossibleStartRow = size - 1;
        let maxPossibleStartCol = size - 1;

        if (direction === "vertical" || direction === "diagonal-down") {
          maxPossibleStartRow = size - word.length;
        }
        if (direction === "horizontal" || direction === "diagonal-down") {
          maxPossibleStartCol = size - word.length;
        }

        if (maxPossibleStartRow < 0 || maxPossibleStartCol < 0) {
          continue; // Word cannot fit this way
        }
        actualStartRow = Math.floor(Math.random() * (maxPossibleStartRow + 1));
        actualStartCol = Math.floor(Math.random() * (maxPossibleStartCol + 1));

        const shouldReverse = allowBackwards &&
                              (direction === "horizontal" || direction === "vertical" || direction === "diagonal-down") &&
                              Math.random() > 0.5;
        if (shouldReverse) {
          wordToUse = reverseString(word);
        } else {
          wordToUse = word;
        }
      }
      
      // This check might be redundant if previous logic is sound, but good for safety.
      if (wordToUse.length === 0) continue;


      let placementIsValid = true;

      if (direction === "horizontal" || direction === "vertical") {
        if (isPlacementTooCloseForHV(wordToUse, actualStartRow, actualStartCol, direction, size, placedWords)) {
          placementIsValid = false;
        }
      }

      if (placementIsValid) {
        if (!canPlaceWord(grid, wordToUse, actualStartRow, actualStartCol, direction, occupiedPositions, minDistance)) {
          placementIsValid = false;
        }
      }

      if (placementIsValid) {
        const positions = placeWord(grid, wordToUse, actualStartRow, actualStartCol, direction);
        
        positions.forEach(pos => {
          occupiedPositions.add(`${pos.row},${pos.col}`);
          if (minDistance > 0) {
            for (let r_off = -minDistance; r_off <= minDistance; r_off++) {
              for (let c_off = -minDistance; c_off <= minDistance; c_off++) {
                if (r_off === 0 && c_off === 0) continue;
                const nearbyRow = pos.row + r_off;
                const nearbyCol = pos.col + c_off;
                if (nearbyRow >= 0 && nearbyRow < size && nearbyCol >= 0 && nearbyCol < size) {
                  if (!positions.some(p => p.row === nearbyRow && p.col === nearbyCol)) {
                    occupiedPositions.add(`${nearbyRow},${nearbyCol}`);
                  }
                }
              }
            }
          }
        });
        
        placedWords.push({
          word: word,
          positions,
          direction,
          found: false,
        });
        placed = true;
      }
    }
  }

  fillEmptyCells(grid);

  return {
    grid,
    words: placedWords,
    size,
    startPosition: null,
    currentPosition: null,
    selectedPositions: [],
    loading: false,
  };
};































// Check if a word can be placed at a given position and direction
const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: WordDirection,
  occupiedPositions: Set<string> = new Set(),
  minDistance: number = 0
): boolean => {
  const size = grid.length;
  
  for (let i = 0; i < word.length; i++) {
    let currentRow = row;
    let currentCol = col;

    if (direction === "horizontal") {
      currentCol += i;
    } else if (direction === "vertical") {
      currentRow += i;
    } else if (direction === "diagonal-down") {
      currentRow += i;
      currentCol += i;
    } else if (direction === "diagonal-up") {
      currentRow -= i;
      currentCol += i;
    }

    // Check boundaries
    if (
      currentRow < 0 ||
      currentRow >= size ||
      currentCol < 0 ||
      currentCol >= size
    ) {
      return false;
    }

    // Position key for lookup
    const posKey = `${currentRow},${currentCol}`;

    // Check if cell has a letter already
    if (grid[currentRow][currentCol] !== "") {
      // If cell has a different letter, can't place
      if (grid[currentRow][currentCol] !== word[i].toUpperCase()) {
        return false;
      }
      // If the letters match, it's okay (intersection)
    } 
    // If cell is empty but is marked as occupied in our proximity map
    // We still allow shared letters (intersections) by not checking occupiedPositions for intersections
    else if (occupiedPositions.has(posKey) && minDistance > 0) {
      return false;
    }
  }

  return true;
};

// Place a word on the grid and return its positions
const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: WordDirection
): Position[] => {
  const positions: Position[] = [];

  for (let i = 0; i < word.length; i++) {
    let currentRow = row;
    let currentCol = col;

    if (direction === "horizontal") {
      currentCol += i;
    } else if (direction === "vertical") {
      currentRow += i;
    } else if (direction === "diagonal-down") {
      currentRow += i;
      currentCol += i;
    } else if (direction === "diagonal-up") {
      currentRow -= i;
      currentCol += i;
    }

    grid[currentRow][currentCol] = word[i].toUpperCase();
    positions.push({ row: currentRow, col: currentCol });
  }

  return positions;
};

// Fill empty cells with random letters
const fillEmptyCells = (grid: string[][]) => {
  const size = grid.length;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === "") {
        const randomIndex = Math.floor(Math.random() * letters.length);
        grid[row][col] = letters[randomIndex];
      }
    }
  }
};

// Check if the selected positions form a word in the list
export const checkForFoundWord = (
  gameState: GameState,
  selectedPositions: Position[]
): string | null => {
  if (selectedPositions.length < 2) return null;

  for (const wordPlacement of gameState.words) {
    if (wordPlacement.found) continue;

    // Check if selected positions match this word's positions
    if (positionsMatch(selectedPositions, wordPlacement.positions)) {
      return wordPlacement.word;
    }
  }

  return null;
};

// Check if two sets of positions are the same (regardless of order)
const positionsMatch = (positions1: Position[], positions2: Position[]): boolean => {
  if (positions1.length !== positions2.length) return false;

  // Create a string representation of each position for easy comparison
  const pos1Strings = positions1.map(p => `${p.row},${p.col}`).sort();
  const pos2Strings = positions2.map(p => `${p.row},${p.col}`).sort();

  return pos1Strings.every((pos, i) => pos === pos2Strings[i]);
};

// Generate a hint for a random unfound word
export const getHint = (gameState: GameState): { word: string; letter: string; position: Position } | null => {
  const unfoundWords = gameState.words.filter(w => !w.found);
  if (unfoundWords.length === 0) return null;
  
  const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
  const randomPositionIndex = Math.floor(Math.random() * randomWord.positions.length);
  const hintPosition = randomWord.positions[randomPositionIndex];
  
  return {
    word: randomWord.word,
    letter: gameState.grid[hintPosition.row][hintPosition.col],
    position: hintPosition
  };
};

// Check if positions are in a straight line
export const arePositionsInLine = (positions: Position[]): boolean => {
  if (positions.length <= 2) return true;
  
  const first = positions[0];
  const last = positions[positions.length - 1];
  
  // Check if vertical
  if (first.col === last.col) {
    return positions.every(p => p.col === first.col);
  }
  
  // Check if horizontal
  if (first.row === last.row) {
    return positions.every(p => p.row === first.row);
  }
  
  // Check if diagonal
  const slope = (last.row - first.row) / (last.col - first.col);
  
  for (let i = 1; i < positions.length - 1; i++) {
    const currentSlope = (positions[i].row - first.row) / (positions[i].col - first.col);
    if (Math.abs(currentSlope - slope) > 0.01) return false;
  }
  
  return true;
};
