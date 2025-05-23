import { Keyword } from "@/app/api/keywords/route";

type Difficulty = {
  gridSize: number;  
  wordCount: number;
};

export function getDifficultyLevel(level: number): Difficulty {
  const baseGridSize = 8; // starting grid size ( 8x8)
  const baseWordCount = 5;

  const clampedLevel = Math.max(level, 1);
  const gridSize = baseGridSize + Math.floor((clampedLevel - 1) / 2);
  const wordCount = baseWordCount + clampedLevel * 2;

  return { gridSize, wordCount };
}

export const fetchWords = async(wordCount:number): Promise<{
  words: string[];
  data: Keyword[];
  categories: Record<string, string>;
}>=>{
  const wordData = await fetch('/api/keywords', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ levelCount:wordCount }),
  });
  const data = await wordData.json();
  const words = data.keywords.map((item: Keyword) => item.word);
  const categories: Record<string, string> = {};
  data.keywords.forEach((item: Keyword) => {
    categories[item.word] = item.category;
  });
  console.log(words,data,data.keywords,categories)
  return { words, data: data.keywords, categories };
}