import { useGameStore } from '../../store/useGameStore';
import { formatNumber } from '../../utils/formatter';
import { Coins, Swords, Zap, Layers, HelpCircle } from 'lucide-react';

interface StatusBarProps {
  onOpenRules: () => void;
}

export function StatusBar({ onOpenRules }: StatusBarProps) {
  const gold = useGameStore(state => state.gold);
  const dps = useGameStore(state => state.dps);
  const stage = useGameStore(state => state.stage);
  const monsterIndex = useGameStore(state => state.monsterIndex);
  const clickDamage = useGameStore(state => state.clickDamage);

  const statCardClass = "relative flex items-center gap-3 px-4 py-3 rounded-xl glass-effect group hover:scale-[1.02] transition-all duration-300";

  return (
    <div className="relative z-20 py-3 px-4 lg:px-6 border-b border-purple-800/40">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-indigo-900/60 to-purple-900/70 backdrop-blur-md" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-3 lg:gap-6">
          <button
            onClick={onOpenRules}
            className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 hover:from-purple-500/40 hover:to-indigo-500/40 border border-purple-500/30 hover:border-purple-400/50 flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 hover:scale-105 group z-30"
            title="游戏规则"
          >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>

          <div className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center">
            <div className={`${statCardClass} border-yellow-500/30`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all">
                <Layers className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="min-w-[80px]">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">层数</div>
                <div className="text-yellow-400 font-extrabold text-lg leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  {stage}
                  <span className="text-gray-500 text-xs font-normal ml-1">
                    ({monsterIndex + 1}/10)
                  </span>
                </div>
              </div>
            </div>

            <div className={`${statCardClass} border-yellow-600/30`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-yellow-500/30 transition-all animate-pulse-slow">
                <Coins className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              </div>
              <div className="min-w-[100px]">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">金币</div>
                <div className="text-yellow-400 font-extrabold text-lg leading-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {formatNumber(gold)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center">
            <button
              onClick={onOpenRules}
              className="hidden lg:flex w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 hover:from-purple-500/40 hover:to-indigo-500/40 border border-purple-500/30 hover:border-purple-400/50 items-center justify-center text-purple-300 hover:text-white transition-all duration-300 hover:scale-105 group shadow-lg"
              title="游戏规则"
            >
              <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </button>

            <div className={`${statCardClass} border-blue-500/30`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all">
                <Swords className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-[80px]">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">点击</div>
                <div className="text-blue-400 font-extrabold text-lg leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  {formatNumber(clickDamage)}
                </div>
              </div>
            </div>

            <div className={`${statCardClass} border-red-500/30`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all">
                <Zap className="w-5 h-5 text-red-400 animate-pulse-slow" />
              </div>
              <div className="min-w-[90px]">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">每秒伤害</div>
                <div className="text-red-400 font-extrabold text-lg leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  {formatNumber(dps)}
                  <span className="text-gray-500 text-xs font-normal">/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
