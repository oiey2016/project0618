import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Settings, Info, X, BookOpen } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Achievements } from './Achievements';

interface BottomNavProps {
  onReset: () => void;
}

export const BottomNav = ({ onReset }: BottomNavProps) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const resetGame = useGameStore((s) => s.resetGame);

  const navItems = [
    {
      icon: BookOpen,
      label: '规则',
      onClick: () => setShowRules(true),
      color: 'text-emerald-500',
    },
    {
      icon: Trophy,
      label: '成就',
      onClick: () => setShowAchievements(true),
      color: 'text-amber-500',
    },
    {
      icon: RotateCcw,
      label: '重置',
      onClick: () => setShowResetConfirm(true),
      color: 'text-red-500',
    },
    {
      icon: Settings,
      label: '设置',
      onClick: () => setShowSettings(true),
      color: 'text-gray-500',
    },
    {
      icon: Info,
      label: '关于',
      onClick: () => setShowAbout(true),
      color: 'text-blue-500',
    },
  ];

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-t border-amber-200"
      >
        <div className="max-w-7xl mx-auto flex justify-around py-3 px-4">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-amber-50 transition-colors group"
            >
              <item.icon
                size={24}
                className={`${item.color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-xs text-gray-600 font-medium">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <Achievements isOpen={showAchievements} onClose={() => setShowAchievements(false)} />

      {showRules && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowRules(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={28} />
                  <div>
                    <h2 className="text-2xl font-bold">游戏规则</h2>
                    <p className="text-white/80 text-sm">快速上手星际蛋工厂</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-xl">👆</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">点击产蛋</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    点击屏幕中央的母鸡即可获得鸡蛋。每次点击获得的鸡蛋数取决于你的「点击产蛋量」，可通过升级提升。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-xl">⚙️</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">科技升级</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    花费鸡蛋购买升级来提升效率。升级分为三类：
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">点击</span>
                      <span>提升每次点击的产蛋量</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">自动</span>
                      <span>每秒自动产出鸡蛋（放置收益）</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">倍率</span>
                      <span>按比例提升所有产蛋效率</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    💡 每次购买升级后价格会递增，合理规划购买顺序很重要！
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-xl">🚀</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">阶段进化</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    累计鸡蛋达到一定数量后，你的养鸡事业将进入全新阶段，解锁更强大的升级选项：
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm"><span>🐔</span><span className="text-gray-700 font-medium">家庭农场</span><span className="text-gray-400">→ 起点</span></div>
                    <div className="flex items-center gap-2 text-sm"><span>🏭</span><span className="text-gray-700 font-medium">鸡蛋工厂</span><span className="text-gray-400">→ 累计 10K 鸡蛋</span></div>
                    <div className="flex items-center gap-2 text-sm"><span>🛸</span><span className="text-gray-700 font-medium">太空站</span><span className="text-gray-400">→ 累计 1M 鸡蛋</span></div>
                    <div className="flex items-center gap-2 text-sm"><span>🌌</span><span className="text-gray-700 font-medium">星际帝国</span><span className="text-gray-400">→ 累计 100M 鸡蛋</span></div>
                    <div className="flex items-center gap-2 text-sm"><span>👑</span><span className="text-gray-700 font-medium">宇宙霸主</span><span className="text-gray-400">→ 累计 10B 鸡蛋</span></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 text-xl">🏆</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">成就系统</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    达成特定目标（点击次数、鸡蛋累计、阶段等）即可解锁成就，并获得一次性鸡蛋奖励。点击底部「成就」按钮查看详情。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 text-xl">💤</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">离线收益</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    关闭游戏后，你的养鸡场仍会持续工作！再次打开游戏时，将根据离线时间和当前每秒产出计算离线收益（最多 8 小时，按 50% 效率计算）。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0 text-xl">💾</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">自动保存</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    游戏进度会自动保存到浏览器本地，无需手动操作。刷新页面或重新打开浏览器即可继续游戏。
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">🎯 游戏目标</p>
                <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                  从一只母鸡开始，通过不断点击和升级，将养鸡事业发展到宇宙规模，成为传说中的宇宙鸡蛋霸主！
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Settings size={24} className="text-gray-500" />
                设置
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">游戏设置功能开发中...</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowAbout(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Info size={24} className="text-blue-500" />
                关于游戏
              </h3>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🐔🥚✨</div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  星际蛋工厂
                </h4>
                <p className="text-gray-500 mt-2">v1.0.0</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 leading-relaxed">
                  从一只母鸡开始，建立你的鸡蛋帝国！点击收集鸡蛋，升级科技，
                  将养鸡事业从地球农场发展到宇宙规模，成为宇宙鸡蛋霸主！
                </p>
              </div>
              <div className="text-center text-xs text-gray-400">
                <p>游戏进度自动保存到本地</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                确认重置游戏？
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                这将删除所有游戏进度，包括鸡蛋、升级和成就。此操作不可撤销！
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  确认重置
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
