import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  active: boolean;
  pieces?: number;
}

const COLORS = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#7BED9F', '#AA96DA', '#FFA502'];

export const Confetti: React.FC<ConfettiProps> = ({ active, pieces = 50 }) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: pieces }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      }));
      setConfettiPieces(newPieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [active, pieces]);

  if (!active && confettiPieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};
