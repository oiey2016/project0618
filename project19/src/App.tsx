import React from 'react';
import { useGameStore } from './game/store';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';

export default function App() {
  const phase = useGameStore((state) => state.phase);

  if (phase === 'start') {
    return <StartScreen />;
  }

  return <GameScreen />;
}
