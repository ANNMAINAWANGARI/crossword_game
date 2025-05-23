'use client'
import { Button } from "@/components/ui/button";
import { Sparkle, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"

type GameControlsProps = {
  onNewGame: () => void;
  onGetHint: () => void;
  hintsUsed: number;
  totalWords: number;
  wordsFound: number;
};

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onGetHint,
  hintsUsed,
  totalWords,
  wordsFound
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  

  const handleHint = () => {
    if (wordsFound === totalWords) {
      toast("You found all words!");
      return;
    }
    
    if (hintsUsed >= 3) {
      toast("Hint limit reached",);
      return;
    }
    
    onGetHint();
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        onClick={onNewGame}
        className="bg-game-purple hover:bg-game-purple/80 text-white font-comic font-bold px-6 py-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
      >
        <ArrowRight className="h-5 w-5" />
        New Game
      </Button>
      
      <Button
        onClick={handleHint}
        className="bg-game-orange hover:bg-game-orange/80 text-white font-comic font-bold px-6 py-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
      >
        <Search className="h-5 w-5" />
        Hint ({3 - hintsUsed} left)
      </Button>
    </div>
  );
};

export default GameControls;