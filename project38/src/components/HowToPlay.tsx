import { useState } from 'react'

interface HowToPlayProps {
  onClose: () => void
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="howtoplay-container">
      <div className="howtoplay-content">
        <h2 className="howtoplay-title">游戏玩法</h2>
        
        <div className="howtoplay-sections">
          <div className="section">
            <h3>🎯 游戏目标</h3>
            <p>控制小球在悬空轨道上滚动，躲避缺口，安全到达终点。</p>
          </div>
          
          <div className="section">
            <h3>🎮 操作方式</h3>
            <div className="controls-grid">
              <div className="control-item">
                <div className="keys">
                  <kbd>W</kbd> 或 <kbd>↑</kbd>
                </div>
                <span>向前滚动</span>
              </div>
              <div className="control-item">
                <div className="keys">
                  <kbd>S</kbd> 或 <kbd>↓</kbd>
                </div>
                <span>向后滚动</span>
              </div>
              <div className="control-item">
                <div className="keys">
                  <kbd>A</kbd> 或 <kbd>←</kbd>
                </div>
                <span>向左滚动</span>
              </div>
              <div className="control-item">
                <div className="keys">
                  <kbd>D</kbd> 或 <kbd>→</kbd>
                </div>
                <span>向右滚动</span>
              </div>
            </div>
          </div>
          
          <div className="section">
            <h3>⚡ 特殊操作</h3>
            <div className="special-controls">
              <div className="special-item">
                <kbd>空格</kbd>
                <span>重置小球位置</span>
              </div>
              <div className="special-item">
                <kbd>ESC</kbd>
                <span>暂停/继续游戏</span>
              </div>
            </div>
          </div>
          
          <div className="section tips">
            <h3>💡 游戏技巧</h3>
            <ul>
              <li>保持平稳，不要急躁</li>
              <li>遇到缺口时减速通过</li>
              <li>弯道处注意调整方向</li>
              <li>掉落后可按空格重置</li>
            </ul>
          </div>
        </div>
        
        <button className="close-button" onClick={onClose}>
          开始游戏
        </button>
      </div>
      
      <style>{`
        .howtoplay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 300;
          font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .howtoplay-content {
          max-width: 600px;
          width: 90%;
          padding: 40px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .howtoplay-title {
          font-size: 2.5rem;
          color: #fff;
          margin: 0 0 30px 0;
          text-align: center;
          background: linear-gradient(135deg, #4fc3f7, #29b6f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .howtoplay-sections {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 30px;
        }
        
        .section {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section h3 {
          font-size: 1.3rem;
          color: #fff;
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }
        
        .controls-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .control-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .keys {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .control-item span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }
        
        .special-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .special-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .special-item span {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .section.tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .section.tips li {
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        
        .section.tips li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #4fc3f7;
          font-size: 1.5rem;
        }
        
        kbd {
          display: inline-block;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-family: monospace;
          font-size: 1rem;
          color: #fff;
          min-width: 40px;
          text-align: center;
        }
        
        .close-button {
          width: 100%;
          padding: 15px 30px;
          background: linear-gradient(135deg, #4fc3f7, #29b6f6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .close-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(79, 195, 247, 0.4);
        }
      `}</style>
    </div>
  )
}

export function useHowToPlay() {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  
  const openHowToPlay = () => setShowHowToPlay(true)
  const closeHowToPlay = () => setShowHowToPlay(false)
  
  return { showHowToPlay, openHowToPlay, closeHowToPlay }
}