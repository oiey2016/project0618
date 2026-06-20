import { useGameStore } from '../store/useGameStore'
import { GameScene } from '../game/GameScene'
import { MainMenu } from '../components/MainMenu'
import { HUD } from '../components/HUD'
import { VictoryScreen } from '../components/VictoryScreen'

export const Game = () => {
  const gamePhase = useGameStore(state => state.gamePhase)

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <GameScene className="w-full h-full" />

      {gamePhase === 'menu' && <MainMenu />}

      {gamePhase === 'playing' && <HUD />}

      {gamePhase === 'victory' && <VictoryScreen />}
    </div>
  )
}
