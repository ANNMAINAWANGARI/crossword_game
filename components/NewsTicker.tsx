'use client'
import React, { useState, useEffect } from 'react';

type NewsTickerProps = {
  news: string[];
  summaries?: Record<string, string>;
};

const NewsTicker: React.FC<NewsTickerProps> = ({ news, summaries = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [news.length]);
  
  
  const currentNews = news[currentIndex];
  const currentSummary = summaries[currentNews] ? `${summaries[currentNews]}` : '';
  
  return (
    <div className="bg-red-600 text-white font-bangers py-2 px-3 mt-1 rounded-lg   border-b-4 border-gray-800">
      <div className="flex items-center">
        <div className="mr-2 bg-white text-red-600 px-2 py-0.5 rounded-md">
          LIVE
        </div>
        <div className="break-words  animate-pulse">
          <div className="animate-slide-left">
            {currentSummary}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;