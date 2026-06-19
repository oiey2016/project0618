import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Info, X } from 'lucide-react';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useGameStore } from '@/store/useGameStore';
import { hasSave } from '@/utils/storage';

const MainMenu = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    setHasExistingSave(hasSave());
  }, []);

  const handleNewGame = () => {
    startNewGame();
    navigate('/game');
  };

  const handleContinue = () => {
    const success = loadGame();
    if (success) {
      navigate('/game');
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden scanline-overlay noise-overlay">
      <ParticleBackground />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center gap-2 text-neon-blue/60 font-mono text-sm tracking-[0.3em] mb-4">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              SATELLITE CONNECTION ESTABLISHED
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            </div>
          </div>
          
          <h1 className="font-mono text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
            <span className="text-neon-blue text-glow-blue">星</span>
            <span className="text-white">际</span>
            <span className="text-neon-blue text-glow-blue">信</span>
            <span className="text-white">号</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-neon-blue/50" />
            <p className="font-mono text-sm text-gray-400 tracking-widest">
              COSMIC · SIGNAL
            </p>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-neon-blue/50" />
          </div>
          
          <p className="mt-8 text-gray-400 max-w-md mx-auto leading-relaxed">
            月球背面，一名宇航员的飞船坠毁。
            <br />
            他唯一的希望——就是你。
          </p>
          
          <span className="inline-block mt-6 h-5 w-0.5 bg-neon-blue animate-blink" />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {hasExistingSave && (
            <button
              onClick={handleContinue}
              className="btn-neon btn-neon-green flex items-center justify-center gap-3 w-full"
            >
              <Play size={18} />
              继续游戏
            </button>
          )}
          
          <button
            onClick={handleNewGame}
            className="btn-neon btn-neon-blue flex items-center justify-center gap-3 w-full"
          >
            <BookOpen size={18} />
            新的冒险
          </button>
          
          <button
            onClick={() => setShowAbout(true)}
            className="btn-neon border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300 hover:bg-gray-800/30 flex items-center justify-center gap-3 w-full"
          >
            <Info size={18} />
            游戏说明
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="font-mono text-xs text-gray-600 tracking-wider">
            v1.0.0 · LUNAR SURVIVAL PROTOCOL
          </p>
        </div>
      </div>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-sm">
          <div className="panel-glass p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xl text-neon-blue text-glow-blue">
                游戏说明
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <div>
                <h3 className="font-mono text-neon-green mb-2">关于游戏</h3>
                <p>
                  《星际信号》是一款致敬《生命线》的文字冒险游戏。你将通过卫星通讯，
                  与被困在月球背面的宇航员李航建立联系，帮助他做出关键抉择，
                  决定他的生死存亡。
                </p>
              </div>
              
              <div>
                <h3 className="font-mono text-neon-green mb-2">生存状态</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center gap-2">
                    <span className="text-neon-red">●</span>
                    <span className="text-neon-red font-mono">生命值</span>
                    <span>：受伤会降低，归零则死亡</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon-blue">●</span>
                    <span className="text-neon-blue font-mono">氧气</span>
                    <span>：活动消耗，归零则死亡</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon-green">●</span>
                    <span className="text-neon-green font-mono">体力</span>
                    <span>：移动和行动消耗</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon-orange">●</span>
                    <span className="text-neon-orange font-mono">信号</span>
                    <span>：影响通讯和救援几率</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-mono text-neon-green mb-2">玩法提示</h3>
                <ul className="space-y-2 ml-4 list-disc list-inside">
                  <li>每个选择都会影响李航的生存状态</li>
                  <li>思考清楚再做决定，有些选择可能有去无回</li>
                  <li>游戏会自动保存进度，可以随时返回继续</li>
                  <li>多种结局等你探索，试试不同的选择</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
