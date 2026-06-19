import { Swords, Users, Sparkles, Shield, Coins, Zap, Clock, HelpCircle } from 'lucide-react';

interface RuleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

function RuleItem({ icon, title, description, accentColor }: RuleItemProps) {
  return (
    <div className="game-card p-4 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function GameRules() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-500/20">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
            欢迎来到点击泰坦！
          </h3>
          <p className="text-sm text-gray-300 mt-1">成为最强的英雄，击败所有泰坦怪物！</p>
        </div>
      </div>

      <div className="space-y-3">
        <RuleItem
          icon={<Swords className="w-5 h-5 text-blue-400" />}
          title="点击攻击"
          description="点击屏幕上的怪物造成伤害。每次点击都会根据你的点击伤害对怪物造成伤害，快速点击可以更快击败敌人！"
          accentColor="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
        />

        <RuleItem
          icon={<Users className="w-5 h-5 text-yellow-400" />}
          title="雇佣英雄"
          description="使用金币雇佣英雄，英雄会自动攻击怪物，每秒造成持续伤害（DPS）。升级英雄可以大幅提高自动伤害！"
          accentColor="bg-gradient-to-br from-yellow-500/20 to-amber-500/20"
        />

        <RuleItem
          icon={<Sparkles className="w-5 h-5 text-blue-400" />}
          title="技能系统"
          description="解锁并升级强力技能，在关键时刻释放技能爆发伤害！每个技能都有冷却时间，合理使用可以事半功倍。"
          accentColor="bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
        />

        <RuleItem
          icon={<Shield className="w-5 h-5 text-green-400" />}
          title="永久强化"
          description="使用金币购买永久强化，可以永久提升点击伤害、英雄伤害、金币掉落等属性，让你的冒险越来越轻松！"
          accentColor="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
        />

        <RuleItem
          icon={<Coins className="w-5 h-5 text-yellow-400" />}
          title="金币与升级"
          description="击败怪物获得金币，用金币升级英雄、技能和强化。怪物越强大，掉落的金币越多！"
          accentColor="bg-gradient-to-br from-amber-500/20 to-yellow-500/20"
        />

        <RuleItem
          icon={<Zap className="w-5 h-5 text-red-400" />}
          title="推进层数"
          description="每层有10只怪物，每10层会遇到一个强大的Boss。击败Boss即可前进到下一层，敌人越来越强，奖励也越来越丰厚！"
          accentColor="bg-gradient-to-br from-red-500/20 to-pink-500/20"
        />

        <RuleItem
          icon={<Clock className="w-5 h-5 text-purple-400" />}
          title="离线收益"
          description="即使关闭游戏，你的英雄仍会继续战斗并获得金币！下次打开游戏时可以领取离线收益，最长计算8小时。"
          accentColor="bg-gradient-to-br from-purple-500/20 to-violet-500/20"
        />
      </div>

      <div className="pt-2">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20">
          <h4 className="text-sm font-bold text-purple-300 mb-2">💡 小提示</h4>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>游戏会每10秒自动保存进度，关闭页面也不用担心丢失</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>优先升级已解锁的英雄，性价比最高</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>遇到Boss打不过时，回去刷前面的怪物攒金币升级</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
