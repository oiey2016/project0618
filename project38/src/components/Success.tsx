import { levels } from '../utils/levels'

interface SuccessProps {
  level: number
  time: number
  score: number
  bestTime: number | null
  onNextLevel: () => void
  onRestart: () => void
  onMenu: () => void
}

export function Success({ level, time, score, bestTime, onNextLevel, onRestart, onMenu }: SuccessProps) {
  const hasNextLevel = level < levels.length
  const isNewRecord = bestTime === time

  return (
    <div className="overlay-container">
      <div className="overlay-content success">
        <div className="icon">🎉</div>
        <h2 className="overlay-title">恭喜通关!</h2>
        
        {isNewRecord && (
          <div className="new-record">新纪录!</div>
        )}
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">关卡</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">用时</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">得分</span>
            <span className="stat-value score">{score}</span>
          </div>
        </div>
        
        <div className="button-group">
          {hasNextLevel && (
            <button className="overlay-button primary" onClick={onNextLevel}>
              下一关
            </button>
          )}
          <button className="overlay-button" onClick={onRestart}>
            再玩一次
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
          background: rgba(0, 0, 0, 0.7);
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
        
        .overlay-content.success {
          border-color: rgba(76, 175, 80, 0.3);
        }
        
        .icon {
          font-size: 4rem;
          margin-bottom: 20px;
          animation: bounce 1s ease infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .overlay-title {
          font-size: 2.5rem;
          color: #4caf50;
          margin: 0 0 10px 0;
        }
        
        .new-record {
          font-size: 1.2rem;
          color: #ffeb3b;
          font-weight: bold;
          margin-bottom: 20px;
          animation: pulse 1s ease infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          font-family: 'Courier New', monospace;
        }
        
        .stat-value.score {
          color: #ffeb3b;
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
          background: linear-gradient(135deg, #4caf50, #8bc34a);
          border: none;
        }
        
        .overlay-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
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
