import React from "react";
import { cn } from "@/lib/utils";

interface NeonLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "red" | "blue" | "pink" | "amber";
  flicker?: boolean;
}

const NeonLogo: React.FC<NeonLogoProps> = ({
  size = "lg",
  color = "red",
  flicker = true,
  className,
  ...props
}) => {
  const sizeClass = {
    sm: "text-3xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-6xl",
    xl: "text-6xl md:text-7xl"
  };

  const colorClass = {
    red: "neon-text",
    blue: "neon-text blue",
    pink: "neon-text pink",
    amber: "neon-text amber",
  };

  return (
    <div
      className={cn(
        "tracking-wider",
        sizeClass[size],
        colorClass[color],
        flicker && "animate-neon-flicker",
        className
      )}
      {...props}
    >
      ClueTheTimes
    </div>
  );
};

export default NeonLogo;