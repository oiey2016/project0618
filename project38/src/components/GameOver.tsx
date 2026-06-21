interface GameOverProps {
  time: number
  onRestart: () => void
  onMenu: () => void
}

export function GameOver({ time, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="overlay-container">
      <div className="overlay-content gameover">
        <div className="icon">💥</div>
        <h2 className="overlay-title">游戏结束</h2>
        <p className="time-display">用时: {formatTime(time)}</p>
        <div className="button-group">
          <button className="overlay-button primary" onClick={onRestart}>
            再试一次
          </button>
          <button className="overlay-button" onClick={onMenu}>
            返回菜单
          </button>
        </div>
      </div>
      
      <style>{`
        .overlay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 200;
          font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .overlay-content {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .overlay-content.gameover {
          border-color: rgba(255, 87, 34, 0.3);
        }
        
        .icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }
        
        .overlay-title {
          font-size: 2.5rem;
          color: #ff5722;
          margin: 0 0 20px 0;
        }
        
        .time-display {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 30px 0;
        }
        
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .overlay-button {
          padding: 15px 40px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .overlay-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .overlay-button.primary {
          background: linear-gradient(135deg, #ff5722, #ff9800);
          border: none;
        }
        
        .overlay-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 87, 34, 0.4);
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
