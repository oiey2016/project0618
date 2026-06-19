import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { 
  isSkillActive, 
  isSkillOnCooldown, 
  getSkillCooldownRemaining, 
  getSkillDurationRemaining,
  calculateSkillCost 
} from '../../utils/calculator';
import { formatNumber, formatTime } from '../../utils/formatter';
import { Skill } from '../../types/game';
import { ArrowUp } from 'lucide-react';

interface SkillButtonProps {
  skill: Skill;
}

export function SkillButton({ skill }: SkillButtonProps) {
  const gold = useGameStore(state => state.gold);
  const useSkill = useGameStore(state => state.useSkill);
  const upgradeSkill = useGameStore(state => state.upgradeSkill);

  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(timer);
  }, []);

  const active = isSkillActive(skill);
  const onCooldown = isSkillOnCooldown(skill);
  const canUse = !onCooldown;
  const cost = calculateSkillCost(skill);
  const canAfford = gold >= cost;

  const cooldownRemaining = getSkillCooldownRemaining(skill);
  const durationRemaining = getSkillDurationRemaining(skill);
  const cooldownPercent = onCooldown ? (cooldownRemaining / skill.cooldown) * 100 : 0;
  const durationPercent = active ? (durationRemaining / skill.duration) * 100 : 0;

  return (
    <div className="relative group flex flex-col items-center">
      <button
        onClick={() => useSkill(skill.id)}
        disabled={!canUse}
        className={`relative w-24 h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          active
            ? 'border-yellow-400 bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-yellow-500/30 shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105'
            : onCooldown
            ? 'border-gray-600/60 bg-gray-800/50'
            : canUse
            ? 'border-blue-400/50 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-blue-600/20 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:scale-105'
            : 'border-gray-600/60 bg-gray-800/50'
        } ${canUse && !active ? 'cursor-pointer active:scale-95' : active ? 'cursor-default' : 'cursor-not-allowed'}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-5xl transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : ''}`}>
            {skill.icon}
          </span>
        </div>

        {onCooldown && !active && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(0,0,0,0.7)"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(59,130,246,0.5)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - cooldownPercent / 100)}`}
              className="transition-all duration-100"
            />
          </svg>
        )}

        {active && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 animate-pulse" />
        )}

        {onCooldown && !active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="backdrop-blur-sm">
              <span className="text-white font-extrabold text-lg drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                {formatTime(cooldownRemaining)}
              </span>
            </div>
          </div>
        )}

        {active && (
          <div className="absolute left-2 right-2 bottom-2 h-1.5 bg-gray-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-100 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
              style={{ width: `${durationPercent}%` }}
            />
          </div>
        )}

        <div className="absolute -top-2 -left-2 z-10">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/30" style={{ fontFamily: 'Cinzel, serif' }}>
            Lv.{skill.level}
          </div>
        </div>
      </button>

      <div className="mt-2 text-center">
        <div className="text-sm font-bold text-gray-200 truncate max-w-[96px]" style={{ fontFamily: 'Cinzel, serif' }}>
          {skill.name}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          upgradeSkill(skill.id);
        }}
        disabled={!canAfford}
        className={`w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
          canAfford
            ? 'bg-gradient-to-r from-blue-600/60 to-indigo-600/60 text-white hover:from-blue-500/70 hover:to-indigo-500/70 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 border border-blue-500/30'
            : 'bg-gray-800/40 text-gray-500 cursor-not-allowed border border-gray-700/40'
        }`}
      >
        <ArrowUp className="w-3 h-3" />
        <span>升级</span>
        <span className="opacity-70">{formatNumber(cost)}</span>
      </button>
    </div>
  );
}
