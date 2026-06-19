import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RotateCcw, Heart, Skull, Rocket, Sparkles } from 'lucide-react';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useGameStore } from '@/store/useGameStore';
import { formatTime } from '@/utils/format';

const endingConfig = {
  survive: {
    icon: Rocket,
    titleColor: 'text-neon-blue',
    glowClass: 'text-glow-blue',
    bgColor: 'bg-neon-blue/10',
    borderColor: 'border-neon-blue/50',
    label: '成功幸存',
  },
  rescue: {
    icon: Heart,
    titleColor: 'text-neon-green',
    glowClass: 'text-glow-green',
    bgColor: 'bg-neon-green/10',
    borderColor: 'border-neon-green/50',
    label: '成功救援',
  },
  death: {
    icon: Skull,
    titleColor: 'text-neon-red',
    glowClass: 'text-glow-red',
    bgColor: 'bg-neon-red/10',
    borderColor: 'border-neon-red/50',
    label: '任务失败',
  },
  sacrifice: {
    icon: Sparkles,
    titleColor: 'text-neon-purple',
    glowClass: '',
    bgColor: 'bg-neon-purple/10',
    borderColor: 'border-neon-purple/50',
    label: '未知命运',
  },
};

const EndingScreen = () => {
  const navigate = useNavigate();
  const { endingData, choices, startTime, astronautStatus, resetGame, startNewGame } = useGameStore();

  useEffect(() => {
    if (!endingData) {
      navigate('/');
    }
  }, [endingData, navigate]);

  if (!endingData) return null;

  const config = endingConfig[endingData.type];
  const Icon = config.icon;
  const gameDuration = Date.now() - startTime;

  const handleRestart = () => {
    resetGame();
    startNewGame();
    navigate('/game');
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="relative h-full w-full overflow-hidden scanline-overlay noise-overlay">
      <ParticleBackground />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 overflow-y-auto py-8">
        <div className="max-w-2xl w-full">
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor} mb-8`}>
            <div className={`w-2 h-2 rounded-full ${config.titleColor.replace('text-', 'bg-')} animate-pulse`} />
            <span className={`font-mono text-sm tracking-wider ${config.titleColor}`}>
              {config.label}
            </span>
          </div>

          <div className={`w-24 h-24 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center mb-8 mx-auto`}>
            <Icon size={48} className={`${config.titleColor} ${config.glowClass}`} />
          </div>

          <h1 className={`font-mono text-4xl md:text-5xl font-bold text-center mb-6 ${config.titleColor} ${config.glowClass}`}>
            {endingData.title}
          </h1>

          <div className="panel-glass p-6 mb-8">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {endingData.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="panel-glass p-4 text-center">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                游戏时长
              </p>
              <p className="font-mono text-xl text-neon-blue">
                {formatTime(gameDuration)}
              </p>
            </div>
            <div className="panel-glass p-4 text-center">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                做出选择
              </p>
              <p className="font-mono text-xl text-neon-green">
                {choices.length} 次
              </p>
            </div>
            <div className="panel-glass p-4 text-center">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                最终生命
              </p>
              <p className={`font-mono text-xl ${astronautStatus.health > 50 ? 'text-neon-green' : 'text-neon-red'}`}>
                {astronautStatus.health}%
              </p>
            </div>
            <div className="panel-glass p-4 text-center">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                最终信号
              </p>
              <p className="font-mono text-xl text-neon-orange">
                {astronautStatus.signal}%
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="btn-neon btn-neon-blue flex items-center justify-center gap-3"
            >
              <RotateCcw size={18} />
              再来一次
            </button>
            <button
              onClick={handleBackToMenu}
              className="btn-neon btn-neon-green flex items-center justify-center gap-3"
            >
              <Home size={18} />
              返回主菜单
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-xs text-gray-600 tracking-wider">
              感谢你的游玩 · 每一次选择都塑造了不同的命运
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingScreen;
