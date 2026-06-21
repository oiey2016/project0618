import { useState } from 'react'
import { levels } from '../utils/levels'
import { HowToPlay } from './HowToPlay'

interface MenuProps {
  onStartGame: (level: number) => void
  bestTime: number | null
}

export function Menu({ onStartGame, bestTime }: MenuProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="title">平衡球</h1>
        <p className="subtitle">Ballance</p>
        
        {bestTime !== null && (
          <div className="best-time">
            <span>最佳时间: </span>
            <span className="time-value">{formatTime(bestTime)}</span>
          </div>
        )}

        <div className="level-select">
          <h2>选择关卡</h2>
          <div className="levels-grid">
            {levels.map((level) => (
              <button
                key={level.id}
                className="level-button"
                onClick={() => onStartGame(level.id)}
              >
                <span className="level-number">{level.id}</span>
                <span className="level-name">{level.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="howtoplay-button" onClick={() => setShowHowToPlay(true)}>
          📖 游戏玩法
        </button>

        <div className="controls-hint">
          <p>使用 <kbd>W A S D</kbd> 或 <kbd>方向键</kbd> 控制小球</p>
          <p>按 <kbd>空格</kbd> 重置位置</p>
        </div>
      </div>

      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      
      <style>{`
        .menu-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
          z-index: 100;
        }
        
        .menu-content {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .title {
          font-size: 4rem;
          font-weight: bold;
          color: #fff;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, #ff5722, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 40px rgba(255, 87, 34, 0.5);
        }
        
        .subtitle {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 30px 0;
          font-weight: 300;
        }
        
        .best-time {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 30px;
          padding: 10px 20px;
          background: rgba(76, 175, 80, 0.1);
          border-radius: 10px;
          display: inline-block;
        }
        
        .time-value {
          color: #4caf50;
          font-weight: bold;
        }
        
        .level-select h2 {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
          font-size: 1.5rem;
        }
        
        .levels-grid {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        
        .level-button {
          padding: 20px 30px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 120px;
          font-family: inherit;
        }
        
        .level-button:hover {
          background: rgba(255, 87, 34, 0.3);
          border-color: #ff5722;
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(255, 87, 34, 0.3);
        }
        
        .level-number {
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(135deg, #ff5722, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .level-name {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .howtoplay-button {
          margin-bottom: 20px;
          padding: 12px 30px;
          background: rgba(79, 195, 247, 0.15);
          border: 1px solid rgba(79, 195, 247, 0.3);
          border-radius: 10px;
          color: #4fc3f7;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .howtoplay-button:hover {
          background: rgba(79, 195, 247, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 195, 247, 0.2);
        }
        
        .controls-hint {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }
        
        .controls-hint p {
          margin: 5px 0;
        }
        
        kbd {
          display: inline-block;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-family: monospace;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}