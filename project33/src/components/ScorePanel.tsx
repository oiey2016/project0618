import { Heart, Zap, Trophy } from "lucide-react";

interface ScorePanelProps {
  score: number;
  combo: number;
  lives: number;
}

export default function ScorePanel({ score, combo, lives }: ScorePanelProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-2xl shadow-card px-4 py-2 flex items-center gap-2">
          <Trophy size={20} className="text-accent-yellow" />
          <span className="font-bold text-gray-800">{score}</span>
        </div>

        {combo > 1 && (
          <div className="bg-gradient-to-r from-accent-orange to-accent-yellow rounded-2xl shadow-card px-4 py-2 flex items-center gap-2 animate-pop">
            <Zap size={18} className="text-white" />
            <span className="font-bold text-white">
              {combo} 连击!
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            size={28}
            className={`transition-all duration-300 ${
              i < lives
                ? "text-accent-red fill-accent-red scale-100"
                : "text-gray-300 scale-90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
