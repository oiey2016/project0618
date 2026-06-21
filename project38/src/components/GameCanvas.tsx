import { Canvas } from '@react-three/fiber'
import { GameScene } from './GameScene'
import type { TrackSegment } from '../utils/levels'

interface GameCanvasProps {
  segments: TrackSegment[]
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  ballPosition: [number, number, number]
  onBallMove: (position: [number, number, number]) => void
  onGameOver: () => void
  onSuccess: () => void
}

export function GameCanvas({ segments, startPosition, endPosition, ballPosition, onBallMove, onGameOver, onSuccess }: GameCanvasProps) {
  return (
    <Canvas 
      camera={{ position: [10, 10, 10], fov: 60 }}
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}
    >
      <GameScene 
        segments={segments}
        startPosition={startPosition}
        endPosition={endPosition}
        ballPosition={ballPosition}
        onBallMove={onBallMove}
        onGameOver={onGameOver}
        onSuccess={onSuccess}
      />
    </Canvas>
  )
}
