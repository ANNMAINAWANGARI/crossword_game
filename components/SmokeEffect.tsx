'use client'

import { useEffect, useRef } from "react";

interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  element: HTMLDivElement;
}

const SmokeEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  const createParticle = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particle = document.createElement("div");
    particle.classList.add("smoke-particle", "animate-smoke-float");
    
    const size = Math.random() * 40 + 10;
    const x = Math.random() * container.offsetWidth;
    const y = container.offsetHeight + Math.random() * 20;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.bottom = `${-10}px`;
    particle.style.opacity = (Math.random() * 0.2).toString();
    
    container.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    }, 8000);
  };

  useEffect(() => {
    const interval = setInterval(createParticle, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default SmokeEffect;