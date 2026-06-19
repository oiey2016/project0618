import { useGameStore } from '@/store/gameStore';
import type { ItemEffect } from '@/types';
import { cn } from '@/lib/utils';
import Modal from '@/components/common/Modal';
import GoldButton from '@/components/common/GoldButton';
import {
  Coins,
  Fuel,
  Heart,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

const getOptionVariant = (effect: ItemEffect): 'primary' | 'secondary' | 'danger' | 'ghost' => {
  const positive =
    (effect.stardust ?? 0) +
    (effect.fuel ?? 0) +
    (effect.morale ?? 0) -
    (effect.days ?? 0);

  if (positive > 30) return 'primary';
  if (positive < -30) return 'danger';
  if ((effect.days ?? 0) > 0) return 'secondary';
  return 'secondary';
};

const EffectBadge: React.FC<{ value: number; label: string; icon: typeof Coins; isDays?: boolean }> = ({
  value,
  label,
  icon: Icon,
  isDays,
}) => {
  if (value === 0) return null;

  const isPositive = isDays ? value < 0 : value > 0;
  const displayValue = isDays ? -value : value;
  const Arrow = isPositive ? TrendingUp : value === 0 ? Minus : TrendingDown;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-display font-semibold',
        'border backdrop-blur-sm',
        isPositive
          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
          : value === 0
          ? 'border-space-300/30 bg-space-400/20 text-space-200'
          : 'border-alert-400/40 bg-alert-500/10 text-alert-300'
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
      <Arrow className="w-3 h-3" />
      <span className="font-mono">{displayValue}</span>
    </div>
  );
};

export const EventModal: React.FC = () => {
  const { activeEvent, resolveEventOption } = useGameStore();

  return (
    <Modal
      open={!!activeEvent}
      onClose={() => {}}
      maxWidth="max-w-3xl"
      className="overflow-hidden"
    >
      {activeEvent && (
        <div className="flex flex-col gap-5">
          <div className="text-center relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-stardust-400/50 to-transparent" />
            <div className="relative inline-block">
              <Sparkles className="absolute -top-3 -left-5 w-4 h-4 text-stardust-400 animate-twinkle" />
              <Sparkles className="absolute -top-2 -right-5 w-3.5 h-3.5 text-plasma-400 animate-twinkle" />
              <h2 className="text-gold-gradient font-display text-3xl font-bold tracking-[0.15em] uppercase px-6 py-1">
                {activeEvent.title}
              </h2>
            </div>
          </div>

          <div className="ornate-border rounded-sm p-6 parchment-bg">
            <p
              className="text-space-900 text-lg leading-relaxed font-serif"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '18px' }}
            >
              {activeEvent.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-stardust-300/80">
              <div className="h-px flex-1 bg-gradient-to-r from-stardust-400/30 to-transparent" />
              <span className="text-xs uppercase tracking-[0.2em] font-display">
                ▸ 请做出选择 ◂
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-stardust-400/30 to-transparent" />
            </div>

            <div className="space-y-2.5">
              {activeEvent.options.map((option, idx) => {
                const variant = getOptionVariant(option.effect);
                const eff = option.effect;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      'group relative rounded-sm p-4 border transition-all duration-300 cursor-pointer',
                      'bg-space-500/70 backdrop-blur-sm',
                      variant === 'primary'
                        ? 'border-stardust-400/40 hover:border-stardust-400 hover:shadow-gold/50'
                        : variant === 'danger'
                        ? 'border-alert-400/40 hover:border-alert-400 hover:shadow-[0_0_20px_rgba(255,77,109,0.3)]'
                        : variant === 'secondary'
                        ? 'border-plasma-400/40 hover:border-plasma-400 hover:shadow-plasma/50'
                        : 'border-space-300/30 hover:border-space-200/50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <p
                        className={cn(
                          'font-serif leading-relaxed flex-1',
                          variant === 'primary'
                            ? 'text-stardust-100'
                            : variant === 'danger'
                            ? 'text-alert-200'
                            : variant === 'secondary'
                            ? 'text-plasma-100'
                            : 'text-space-100'
                        )}
                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '16px' }}
                      >
                        <span className="font-display font-bold opacity-70 mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {option.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex flex-wrap gap-1.5">
                        <EffectBadge
                          value={eff.stardust ?? 0}
                          label="星币"
                          icon={Coins}
                        />
                        <EffectBadge
                          value={eff.fuel ?? 0}
                          label="燃料"
                          icon={Fuel}
                        />
                        <EffectBadge
                          value={eff.morale ?? 0}
                          label="士气"
                          icon={Heart}
                        />
                        <EffectBadge
                          value={eff.days ?? 0}
                          label="天数"
                          icon={Calendar}
                          isDays
                        />
                        {eff.special && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-display font-semibold border border-purple-400/40 bg-purple-500/10 text-purple-300">
                            <Sparkles className="w-3 h-3" />
                            <span>特殊</span>
                          </div>
                        )}
                      </div>

                      <GoldButton
                        size="sm"
                        variant={variant}
                        onClick={() => resolveEventOption(idx)}
                        className="shrink-0"
                      >
                        决定
                      </GoldButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EventModal;
