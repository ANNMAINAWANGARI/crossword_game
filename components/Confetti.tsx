'use client'
import React, { useEffect, useState } from 'react';

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  speedX: number;
  speedY: number;
};

type ConfettiProps = {
  count?: number;
  duration?: number;
};

const colors = ['#FFC700', '#FF6B6B', '#4ECDC4', '#9B87F5', '#F97316'];

const Confetti: React.FC<ConfettiProps> = ({ count = 100, duration = 3000 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * -100 - 50, // Start above the viewport
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 3 + 2,
      });
    }
    
    setPieces(newPieces);
    
    const interval = setInterval(() => {
      setPieces(prev => 
        prev.map(piece => ({
          ...piece,
          y: piece.y + piece.speedY,
          x: piece.x + piece.speedX,
          rotation: piece.rotation + 1,
        }))
      );
    }, 16); // ~60fps
    
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPieces([]);
    }, duration);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [count, duration]);
  
  if (pieces.length === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;