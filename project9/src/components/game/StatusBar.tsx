import { useState } from 'react';
import { Calendar, Fuel, Coins, Sparkles, Save, Home, RotateCcw, HelpCircle, Map, AlertTriangle, Backpack, X, type LucideIcon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import GoldButton from '@/components/common/GoldButton';
import Modal from '@/components/common/Modal';

function StatBar({
  icon: Icon,
  label,
  value,
  max,
  colorClass,
  showMax = true,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  max?: number;
  colorClass: string;
  showMax?: boolean;
}) {
  const pct = max ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div className="flex items-center gap-3">
      <div className={cn('shrink-0', colorClass)}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-mono uppercase tracking-widest text-space-200">
            {label}
          </span>
          <span
            className={cn(
              'font-mono font-bold',
              colorClass
            )}
          >
            {value}
            {showMax && max ? ` / ${max}` : ''}
          </span>
        </div>
        {max !== undefined && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-space-600">
            <div
              className={cn('h-full transition-all duration-500', colorClass.replace('text-', 'bg-'))}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatusBar() {
  const {
    daysRemaining,
    currentDay,
    stardust,
    fuel,
    morale,
    currentPlanet,
    saveGame,
    returnToTitle,
    restartGame,
  } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="relative z-20 flex h-20 shrink-0 items-center gap-4 border-b border-stardust-400/20 bg-space-700/60 px-4 backdrop-blur-md md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-8">
          <div className="hidden md:block">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-plasma-300">
              当前位置
            </div>
            <div className="font-display text-lg font-bold text-stardust-100">
              {currentPlanet?.name ?? '—'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 md:grid-cols-4 md:gap-6">
            <StatBar
              icon={Calendar}
              label="剩余天数"
              value={daysRemaining}
              max={80}
              colorClass={
                daysRemaining > 20
                  ? 'text-plasma-300'
                  : daysRemaining > 10
                  ? 'text-stardust-300'
                  : 'text-alert-400'
              }
            />
            <StatBar
              icon={Fuel}
              label="燃料"
              value={fuel}
              max={100}
              colorClass={fuel > 30 ? 'text-plasma-300' : 'text-alert-400'}
            />
            <StatBar
              icon={Coins}
              label="星币"
              value={stardust}
              colorClass="text-stardust-300"
              showMax={false}
            />
            <StatBar
              icon={Sparkles}
              label="士气"
              value={morale}
              max={100}
              colorClass={morale > 40 ? 'text-stardust-300' : 'text-alert-400'}
            />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <div className="mr-2 rounded border border-space-300/30 bg-space-500/40 px-3 py-1.5 font-mono text-xs text-space-100">
            DAY {currentDay.toString().padStart(2, '0')}/80
          </div>
          <GoldButton size="sm" variant="ghost" onClick={saveGame} icon={Save}>
            保存
          </GoldButton>
          <GoldButton size="sm" variant="ghost" onClick={() => setShowHelp(true)} icon={HelpCircle}>
            游戏规则
          </GoldButton>
          <GoldButton size="sm" variant="secondary" onClick={restartGame} icon={RotateCcw}>
            重新开始
          </GoldButton>
          <GoldButton size="sm" variant="danger" onClick={returnToTitle} icon={Home}>
            返回首页
          </GoldButton>
        </div>
      </header>

      <Modal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="游戏规则说明"
      >
        <div className="space-y-6 text-space-100">
          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Map size={18} className="text-plasma-300" />
              目标
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              在 <span className="text-stardust-300 font-bold">80 天</span> 内从首都星球
              Londinium Prime 出发，环游已知星系后返回起点。成功返回即获胜！
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-stardust-300" />
              航线规划三要素
            </h3>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <span className="font-mono text-xs text-plasma-300">时</span>
                </div>
                <div>
                  <div className="font-semibold text-plasma-200 text-sm">时间</div>
                  <p className="font-serif text-sm text-space-200">
                    每条航线消耗不同天数，80 天内不返回 Londinium Prime 即失败。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <Fuel size={12} className="text-plasma-300" />
                </div>
                <div>
                  <div className="font-semibold text-plasma-200 text-sm">燃料</div>
                  <p className="font-serif text-sm text-space-200">
                    燃料不足将无法启航。可以在旅途中通过物品或事件补充。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <Coins size={12} className="text-stardust-300" />
                </div>
                <div>
                  <div className="font-semibold text-stardust-200 text-sm">星币</div>
                  <p className="font-serif text-sm text-space-200">
                    支付航线费用的货币，星币不足也无法出发。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Backpack size={18} className="text-stardust-300" />
              行李管理
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              行李舱共 <span className="text-stardust-300 font-bold">8 格</span>
              ，装有用消耗品（燃料补剂、星币袋、神经镇静剂等）和装备类物品。合理使用道具可以化险为夷！
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-plasma-300" />
              随机事件
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              航行途中会遇到各种各样的随机事件——友善的商人、壮丽的星云、海盗袭击、超新星风暴……
              每个选择都会影响资源和士气，带来机遇与挑战。谨慎决策是成功的关键！
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowHelp(false)}
              className="w-full flex items-center justify-center gap-2 rounded-sm border border-stardust-400/40 bg-stardust-400/10 py-3 font-display font-semibold text-stardust-200 transition-all hover:bg-stardust-400/20 hover:shadow-gold"
            >
              <X size={16} />
              了解了
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
