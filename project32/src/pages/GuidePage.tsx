import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Map,
  HelpCircle,
  Coins,
  ShoppingBag,
  Sword,
  Trophy,
  ChevronRight,
  Target,
} from 'lucide-react';
import StarBackground from '@/components/StarBackground';

const steps = [
  {
    icon: <Map className="text-green-400" size={32} />,
    title: '选择关卡',
    description: '从冒险地图上选择已解锁的关卡，每个关卡都有独特的主题和知识领域。',
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
  },
  {
    icon: <HelpCircle className="text-blue-400" size={32} />,
    title: '答题挑战',
    description: '认真阅读题目，从四个选项中选出正确答案。每题答完会显示知识点解析。',
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
  },
  {
    icon: <Coins className="text-yellow-400" size={32} />,
    title: '赚取金币',
    description: '答对题目可以获得金币，幸运属性越高，获得的金币越多！',
    bg: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
  },
  {
    icon: <ShoppingBag className="text-purple-400" size={32} />,
    title: '购买装备',
    description: '用金币在商店购买武器、护甲和饰品，不同装备有不同的属性加成。',
    bg: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
  },
  {
    icon: <Sword className="text-red-400" size={32} />,
    title: '装备提升',
    description: '在背包中穿戴装备，提升攻击、防御和幸运属性，变得更强大！',
    bg: 'from-red-500/20 to-rose-500/20',
    border: 'border-red-500/30',
  },
  {
    icon: <Trophy className="text-orange-400" size={32} />,
    title: '通关冒险',
    description: '一关关挑战，正确率达到 60% 即可通关，解锁新的关卡继续冒险！',
    bg: 'from-orange-500/20 to-pink-500/20',
    border: 'border-orange-500/30',
  },
];

const tips = [
  {
    title: '关于通关',
    content: '每关需要答对 60% 以上的题目才能通关，通关后会解锁下一关并获得金币和经验奖励。',
    icon: '🎯',
  },
  {
    title: '关于属性',
    content: '攻击和防御帮助你应对更难的关卡，幸运可以让你每次答题获得更多金币！',
    icon: '⚔️',
  },
  {
    title: '关于稀有度',
    content: '装备分为普通（灰）、稀有（蓝）、史诗（紫）、传说（金）四种稀有度，越稀有越强！',
    icon: '💎',
  },
  {
    title: '关于存档',
    content: '游戏会自动保存你的进度，下次打开游戏可以继续之前的冒险。',
    icon: '💾',
  },
];

export default function GuidePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回</span>
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center px-4 mb-8">
          <div className="text-5xl mb-4">📖</div>
          <h1
            className="text-4xl font-bold text-gradient-gold text-shadow-glow mb-2"
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
            游戏玩法
          </h1>
          <p className="text-gray-300">简单 6 步，开启你的知识冒险之旅！</p>
        </div>

        <div className="flex-1 px-4 pb-12 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 玩法步骤 */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-yellow-400" size={22} />
                玩法流程
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`game-card bg-gradient-to-br ${step.bg} border-2 ${step.border} relative`}
                  >
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-yellow-500 text-yellow-900 font-bold flex items-center justify-center text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <div className="mb-3">{step.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-300">{step.description}</p>
                    {index < steps.length - 1 && (
                      <ChevronRight
                        className="absolute -right-3 top-1/2 -translate-y-1/2 text-white/30 hidden lg:block"
                        size={28}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 小贴士 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💡 小贴士
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="game-card border-l-4 border-yellow-500"
                  >
                    <div className="flex gap-3">
                      <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                      <div>
                        <h3 className="font-bold mb-1 text-yellow-400">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-300">{tip.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 开始按钮 */}
            <div className="text-center mt-10">
              <button
                onClick={() => navigate('/map')}
                className="btn-primary text-xl px-12 py-4 inline-flex items-center gap-3"
              >
                我明白了，开始冒险！
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
