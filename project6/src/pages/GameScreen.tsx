import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Save, RefreshCw, Info, X } from 'lucide-react';
import StatusPanel from '@/components/status/StatusPanel';
import ChatArea from '@/components/chat/ChatArea';
import ChoiceButtons from '@/components/choices/ChoiceButtons';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useGameStore } from '@/store/useGameStore';

const GameScreen = () => {
  const navigate = useNavigate();
  const { isStarted, endingData, saveGame, resetGame, startNewGame } = useGameStore();
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (!isStarted) {
      navigate('/');
    }
  }, [isStarted, navigate]);

  useEffect(() => {
    if (endingData) {
      navigate('/ending');
    }
  }, [endingData, navigate]);

  const handleBackToMenu = () => {
    saveGame();
    navigate('/');
  };

  const handleSave = () => {
    saveGame();
  };

  const handleRestart = () => {
    if (confirm('确定要重新开始吗？当前进度将会丢失。')) {
      resetGame();
      startNewGame();
    }
  };

  if (!isStarted) return null;

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden scanline-overlay noise-overlay">
      <ParticleBackground />
      
      <div className="relative z-10 flex flex-col h-full">
        <header className="flex-shrink-0 px-4 py-3 border-b border-neon-blue/20 bg-space-950/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <h1 className="font-mono text-sm text-neon-blue tracking-widest">
                通讯频道 · 猎户座七号
              </h1>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowRules(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10 transition-colors"
                title="游戏规则"
              >
                <Info size={18} />
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
                title="保存游戏"
              >
                <Save size={18} />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-orange hover:bg-neon-orange/10 transition-colors"
                title="重新开始"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={handleBackToMenu}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-red hover:bg-neon-red/10 transition-colors"
                title="返回主菜单"
              >
                <Home size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-shrink-0 px-4 py-3 bg-space-950/50">
          <div className="max-w-5xl mx-auto">
            <StatusPanel />
          </div>
        </div>

        <ChatArea />

        <ChoiceButtons />
      </div>

      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-sm">
          <div className="panel-glass p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xl text-neon-purple">
                游戏规则说明
              </h2>
              <button
                onClick={() => setShowRules(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
              <div>
                <h3 className="font-mono text-neon-blue mb-2 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  游戏目标
                </h3>
                <p>
                  你通过卫星通讯与被困在月球背面的宇航员<strong className="text-neon-blue">李航</strong>建立了联系。
                  在对话中帮他分析局势、做出关键抉择，引导他安全获救。
                  每一个选择都会影响他的命运。
                </p>
              </div>
              
              <div>
                <h3 className="font-mono text-neon-green mb-2 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  生存状态
                </h3>
                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-neon-red mt-0.5">❤</span>
                    <div>
                      <span className="text-neon-red font-mono">生命值</span>
                      <span className="text-gray-400">：受伤会降低，归零则李航因伤重不治身亡</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue mt-0.5">💨</span>
                    <div>
                      <span className="text-neon-blue font-mono">氧气</span>
                      <span className="text-gray-400">：移动和行动消耗，归零则李航窒息死亡</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-green mt-0.5">⚡</span>
                    <div>
                      <span className="text-neon-green font-mono">体力</span>
                      <span className="text-gray-400">：体力不足时某些选项将无法选择</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-orange mt-0.5">📡</span>
                    <div>
                      <span className="text-neon-orange font-mono">信号</span>
                      <span className="text-gray-400">：影响通讯和救援几率，决定能否联系上基地</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-mono text-neon-orange mb-2 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  注意事项
                </h3>
                <ul className="space-y-2 ml-1 list-disc list-inside text-gray-400">
                  <li>状态值低于 <span className="text-neon-red font-mono">20%</span> 时会闪烁红色警告</li>
                  <li>每个选项旁可以看到该选择对状态的影响趋势</li>
                  <li>游戏会 <span className="text-neon-green">自动保存</span> 进度，随时可以返回继续</li>
                  <li>共有 <span className="text-neon-blue">5 种以上</span> 结局，多尝试不同选择</li>
                  <li>做决定前仔细阅读李航的情况，不要急于选择</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-mono text-neon-purple mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  操作指南
                </h3>
                <ul className="space-y-2 ml-1 text-gray-400">
                  <li>📱 点击底部选项卡中的文字即可做出回复</li>
                  <li>💾 顶部 <span className="text-neon-blue">保存</span> 按钮可手动存档</li>
                  <li>🔄 <span className="text-neon-orange">重置</span> 按钮可重新开始当前游戏</li>
                  <li>🏠 <span className="text-neon-red">返回</span> 按钮会保存并回到主菜单</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neon-blue/20">
              <button
                onClick={() => setShowRules(false)}
                className="btn-neon btn-neon-blue w-full flex items-center justify-center gap-2"
              >
                明白了，继续游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
