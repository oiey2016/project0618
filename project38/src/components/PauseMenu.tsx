interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onMenu: () => void
}

export function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <h2 className="overlay-title">游戏暂停</h2>
        <div className="button-group">
          <button className="overlay-button primary" onClick={onResume}>
            继续游戏
          </button>
          <button className="overlay-button" onClick={onRestart}>
            重新开始
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
        
        .overlay-title {
          font-size: 2rem;
          color: #fff;
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
