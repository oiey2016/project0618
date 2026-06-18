import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatNumber, formatNumberPrecise, formatTime } from '../game/utils';
import { ACHIEVEMENTS } from '../game/config';

export const StatsPanel = () => {
  const state = useGameStore((s) => s.state);

  const achievementCount = state.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  const stats = [
    { label: '当前鸡蛋', value: formatNumber(state.eggs), icon: '🥚', color: 'text-amber-600' },
    { label: '累计鸡蛋', value: formatNumber(state.totalEggs), icon: '📦', color: 'text-orange-600' },
    { label: '总点击数', value: state.totalClicks.toLocaleString(), icon: '👆', color: 'text-blue-600' },
    { label: '每次点击', value: '+' + formatNumber(state.eggsPerClick), icon: '✨', color: 'text-yellow-600' },
    { label: '每秒产出', value: '+' + formatNumberPrecise(state.eggsPerSecond), icon: '⚡', color: 'text-green-600' },
    { label: '效率倍率', value: 'x' + state.multiplier.toFixed(1), icon: '🚀', color: 'text-purple-600' },
    { label: '游戏时间', value: formatTime(state.playTime), icon: '⏰', color: 'text-pink-600' },
    { label: '成就解锁', value: `${achievementCount}/${totalAchievements}`, icon: '🏆', color: 'text-amber-500' },
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="w-80 bg-white/95 backdrop-blur-md border-l border-amber-200 shadow-xl flex flex-col"
    >
      <div className="p-4 border-b border-amber-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          游戏统计
        </h2>
        <p className="text-xs text-gray-500 mt-1">查看你的养鸡帝国数据</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-xl p-3 border border-amber-100"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className={`font-bold text-sm mt-1 ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>🏆</span> 成就进度
          </h3>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(achievementCount / totalAchievements) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            已解锁 {achievementCount} / {totalAchievements} 个成就
          </p>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <h3 className="text-sm font-bold text-purple-700 mb-2">💡 小提示</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {state.eggsPerSecond === 0
              ? '点击中间的母鸡开始收集鸡蛋，然后购买自动喂食器来实现自动化生产！'
              : state.currentStage === 0
              ? '继续积累鸡蛋，当累计达到 10,000 枚时，你的农场将升级为现代化工厂！'
              : state.currentStage < 4
              ? '不断升级你的科技，向宇宙进发！更高阶段将解锁更强大的升级选项。'
              : '恭喜你成为宇宙鸡蛋霸主！你可以继续挑战解锁所有成就！'}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-amber-100 bg-amber-50/50">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="animate-pulse">💾</span>
          <span>游戏自动保存中</span>
        </div>
      </div>
    </motion.div>
  );
};
