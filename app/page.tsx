'use client'
import { useState, useEffect } from "react";
import NeonLogo from "@/components/NeonLogo";
import SmokeEffect from "@/components/SmokeEffect";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';


const loadingMessages = [
  "Sharpening pencils...",
  "Filling in the blanks...",
  "Thesaurus in overdrive...",
  "Hiding the answer key...",
  "Crossing words and fingers...",
  "Warming up the brain cells...",
  "Untangling anagrams...",
];

export default function Home() {
  const navigate = useRouter();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(loadingMessages[0]);
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.push("/puzzle");
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 2.5;
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return nextProgress;
      });

      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-500 to-gray-100 p-4">
      <SmokeEffect />

      <h1 className="mb-1 neon-font text-sm uppercase tracking-widest text-black">Welcome to</h1>
      <div className="relative animate-fade-in">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-comedy-red to-comedy-neon-pink blur"></div>
        <NeonLogo size="xl" flicker={true} className="relative neon-font" />
      </div>
      <p className="text-md text-black neon-font pt-5 mb-8">Keep up with the blue dot in the cosmos.</p>
      
      <div className="w-full max-w-md animate-fade-in">
        <Progress value={progress} className="h-3 bg-comedy-charcoal" />
      </div>
      
      <p className="mt-6 animate-fade-in text-center text-sm italic text-black">
        {message}
      </p>
     
    </div>
  );
}