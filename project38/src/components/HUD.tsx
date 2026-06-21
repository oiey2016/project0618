import { useState } from 'react'
import { HowToPlay } from './HowToPlay'

interface HUDProps {
  time: number
  level: number
  onPause: () => void
}

export function HUD({ time, level, onPause }: HUDProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <div className="hud-container">
        <div className="hud-left">
          <div className="hud-item">
            <span className="hud-label">关卡</span>
            <span className="hud-value">{level}</span>
          </div>
        </div>
        
        <div className="hud-center">
          <div className="hud-item time">
            <span className="hud-value">{formatTime(time)}</span>
          </div>
        </div>
        
        <div className="hud-right">
          <button className="help-button" onClick={() => setShowHelp(true)} title="查看玩法">
            ❓
          </button>
          <button className="pause-button" onClick={onPause} title="暂停游戏">
            ⏸
          </button>
        </div>
      </div>

      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      
      <style>{`
        .hud-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          pointer-events: none;
          z-index: 50;
        }
        
        .hud-left, .hud-center, .hud-right {
          pointer-events: auto;
        }
        
        .hud-item {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .hud-item.time {
          padding: 15px 30px;
        }
        
        .hud-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .hud-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          font-family: 'Courier New', monospace;
        }
        
        .hud-item.time .hud-value {
          font-size: 2rem;
          color: #ff5722;
        }
        
        .hud-right {
          display: flex;
          gap: 10px;
        }
        
        .help-button, .pause-button {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 10px 15px;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .help-button:hover, .pause-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }
      `}</style>
    </>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}