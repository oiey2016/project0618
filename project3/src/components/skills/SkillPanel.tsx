import { useGameStore } from '../../store/useGameStore';
import { SkillButton } from './SkillButton';
import { Sparkles, Zap } from 'lucide-react';

export function SkillPanel() {
  const skills = useGameStore(state => state.skills);
  const useSkill = useGameStore(state => state.useSkill);

  const allOnCooldown = skills.every(s => {
    const lastUsed = s.lastUsed;
    const now = Date.now() / 1000;
    return now - lastUsed < s.cooldown;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative px-4 pt-4 pb-3 border-b border-purple-800/30">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-500/40">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-blue-400 font-bold text-base leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  技能
                </h3>
                <p className="text-gray-500 text-[10px]">
                  4个强力技能
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">冷却就绪</div>
              <div className="text-xs text-blue-400 font-medium">
                {skills.filter(s => {
                  const now = Date.now() / 1000;
                  return now - s.lastUsed >= s.cooldown;
                }).length}/{skills.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="grid grid-cols-2 gap-4 justify-items-center">
          {skills.map(skill => (
            <SkillButton key={skill.id} skill={skill} />
          ))}
        </div>

        <button
          onClick={() => {
            skills.forEach(s => {
              useSkill(s.id);
            });
          }}
          disabled={allOnCooldown}
          className={`w-full mt-6 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden ${
            !allOnCooldown
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]'
              : 'bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {!allOnCooldown && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
          <Zap className="w-5 h-5 relative z-10" />
          <span className="relative z-10">释放全部技能</span>
        </button>

        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/40">
          <h4 className="flex items-center gap-2 text-gray-200 font-bold text-sm mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            <Sparkles className="w-4 h-4 text-yellow-400" />
            技能说明
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <span className="text-lg flex-shrink-0">💥</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">狂暴打击</div>
                <div className="text-[10px] text-gray-500">点击伤害大幅提升</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <span className="text-lg flex-shrink-0">🌧️</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">暗影之雨</div>
                <div className="text-[10px] text-gray-500">持续造成大量伤害</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <span className="text-lg flex-shrink-0">💰</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">金币加成</div>
                <div className="text-[10px] text-gray-500">获得双倍金币</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
              <span className="text-lg flex-shrink-0">⚡</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">时间加速</div>
                <div className="text-[10px] text-gray-500">英雄攻击速度翻倍</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
