import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '@/data/levels';
import { useGameStore } from '@/store/useGameStore';
import { LevelCard } from '@/components/LevelCard';
import { PixelButton } from '@/components/ui/PixelButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedLevels, soundEnabled, setSoundEnabled, resetProgress } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleLevelClick = (levelId: number) => {
    navigate(`/game/${levelId}`);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-pixel mb-4 rainbow-stripe">
            像素拼图
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            🧩 把彩色小方块拖到正确位置，拼出可爱图案
          </p>
          <p className="text-gray-500">
            规则超简单：看一眼目标图案，然后把打乱的方块拼回去就好啦！
          </p>
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? '音效开' : '音效关'}
          </PixelButton>
          
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-1"
          >
            <Info size={18} />
            关于
          </PixelButton>
          
          <PixelButton
            variant="danger"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1"
          >
            <RotateCcw size={18} />
            重置进度
          </PixelButton>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🎮</span> 选择关卡
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEVELS.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                completedInfo={completedLevels[level.id]}
                completedLevels={completedLevels}
                onClick={() => handleLevelClick(level.id)}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-12">
          <p>💡 小提示：仔细观察目标图案的颜色分布，先拼边框或大块颜色会更容易哦！</p>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="pixel-border bg-white p-6 max-w-sm w-full animate-pop">
            <h3 className="text-xl font-bold mb-4 text-center">⚠️ 确认重置</h3>
            <p className="text-gray-600 mb-6 text-center">
              确定要重置所有游戏进度吗？此操作不可撤销！
            </p>
            <div className="flex gap-3">
              <PixelButton
                variant="ghost"
                size="md"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1"
              >
                取消
              </PixelButton>
              <PixelButton
                variant="danger"
                size="md"
                onClick={handleReset}
                className="flex-1"
              >
                确认重置
              </PixelButton>
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="pixel-border bg-white p-6 max-w-md w-full animate-pop">
            <h3 className="text-2xl font-bold mb-4 text-center rainbow-stripe">
              关于像素拼图
            </h3>
            <div className="text-gray-600 space-y-3">
              <p>🎨 <strong>玩法：</strong>观察左上角的目标图案，从下方托盘中拖拽彩色方块到网格的正确位置。</p>
              <p>⭐ <strong>评分：</strong>根据用时和错误次数获得1-3星评价。</p>
              <p>💡 <strong>提示：</strong>卡住时可以点击提示按钮查看下一个方块的位置。</p>
              <p>🔊 <strong>音效：</strong>可以在右上角开关游戏音效。</p>
              <p className="text-center text-sm text-gray-400 mt-4">
                一款考验耐心和细心的休闲小游戏 ❤️
              </p>
            </div>
            <div className="mt-6">
              <PixelButton
                variant="primary"
                size="md"
                onClick={() => setShowAbout(false)}
                className="w-full"
              >
                知道啦
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
