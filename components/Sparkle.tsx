'use client'
import React, { useEffect, useState } from "react";
import { Sparkle as SparkleIcon } from "lucide-react";

type SparkleProps = {
  position: { x: number; y: number };
  size?: number;
  color?: string;
  duration?: number;
};

const Sparkle: React.FC<SparkleProps> = ({
  position,
  size = 20,
  color = "#FFC700",
  duration = 1000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className="absolute pointer-events-none animate-sparkle"
      style={{
        left: position.x - size / 2,
        top: position.y - size / 2,
        zIndex: 100,
      }}
    >
      <SparkleIcon
        size={size}
        color={color}
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </div>
  );
};

export default Sparkle;
