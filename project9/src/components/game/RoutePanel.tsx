import { Map, Calendar, Fuel as FuelIcon, Coins, AlertTriangle, Rocket } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { PLANETS } from '@/data/planets';
import type { Route } from '@/types';
import { cn } from '@/lib/utils';
import DecorativeCard from '@/components/common/DecorativeCard';
import GoldButton from '@/components/common/GoldButton';

const riskColors: Record<Route['riskLevel'], string> = {
  low: 'bg-emerald-500/80',
  mid: 'bg-amber-400/80',
  high: 'bg-rose-500/80',
};

const riskLabels: Record<Route['riskLevel'], string> = {
  low: '低风险',
  mid: '中风险',
  high: '高风险',
};

const typeLabels: Record<string, string> = {
  start: '起点',
  hub: '枢纽',
  waypoint: '航点',
  end: '终点',
};

export const RoutePanel: React.FC = () => {
  const {
    availableRoutes,
    selectedRouteId,
    selectRoute,
    travel,
    daysRemaining,
    stardust,
    fuel,
  } = useGameStore();

  const selectedRoute = availableRoutes.find((r) => r.id === selectedRouteId);
  const canTravel = !!selectedRoute &&
    daysRemaining >= selectedRoute.travelDays &&
    stardust >= selectedRoute.stardustCost &&
    fuel >= selectedRoute.fuelCost;

  return (
    <DecorativeCard
      title="航线规划"
      icon={Map}
      className="h-full flex flex-col"
    >
      <div className="space-y-2.5 mb-3">
        {availableRoutes.length === 0 && (
          <div className="text-center text-space-200/60 py-6 font-display text-sm tracking-wider">
            暂无可用航线
          </div>
        )}
        {availableRoutes.map((route) => {
          const planet = PLANETS.find((p) => p.id === route.toId);
          const isSelected = selectedRouteId === route.id;
          const insufficient =
            daysRemaining < route.travelDays ||
            stardust < route.stardustCost ||
            fuel < route.fuelCost;

          return (
            <div
              key={route.id}
              onClick={() => selectRoute(isSelected ? '' : route.id)}
              className={cn(
                'relative cursor-pointer rounded-sm p-3 border transition-all duration-300',
                'bg-space-500/60 backdrop-blur-sm',
                isSelected
                  ? 'border-stardust-400 shadow-gold bg-stardust-500/10 animate-glow-gold'
                  : insufficient
                  ? 'border-alert-400/30 hover:border-alert-400/50'
                  : 'border-space-300/30 hover:border-plasma-400/50 hover:shadow-plasma/30'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-stardust-100 text-sm tracking-wider truncate">
                    {planet?.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-display',
                      planet?.type === 'start'
                        ? 'bg-stardust-500/20 text-stardust-200 border border-stardust-400/30'
                        : planet?.type === 'hub'
                        ? 'bg-plasma-500/20 text-plasma-100 border border-plasma-400/30'
                        : planet?.type === 'end'
                        ? 'bg-alert-500/20 text-alert-300 border border-alert-400/30'
                        : 'bg-space-300/20 text-space-100 border border-space-300/30'
                    )}>
                      {typeLabels[planet?.type ?? 'waypoint']}
                    </span>
                    <span className="text-[10px] text-space-200/70 font-display truncate">
                      {planet?.faction}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'flex items-center gap-1 shrink-0 px-2 py-1 rounded-sm',
                  riskColors[route.riskLevel],
                  'text-space-900 text-[10px] font-bold tracking-wider font-display'
                )}>
                  <AlertTriangle className="w-3 h-3" />
                  {riskLabels[route.riskLevel]}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs pt-2 border-t border-space-300/20">
                <div className={cn(
                  'flex items-center gap-1',
                  daysRemaining < route.travelDays ? 'text-alert-400' : 'text-space-100/80'
                )}>
                  <Calendar className="w-3 h-3" />
                  <span className="font-mono">{route.travelDays}d</span>
                </div>
                <div className={cn(
                  'flex items-center gap-1',
                  fuel < route.fuelCost ? 'text-alert-400' : 'text-space-100/80'
                )}>
                  <FuelIcon className="w-3 h-3" />
                  <span className="font-mono">{route.fuelCost}</span>
                </div>
                <div className={cn(
                  'flex items-center gap-1',
                  stardust < route.stardustCost ? 'text-alert-400' : 'text-space-100/80'
                )}>
                  <Coins className="w-3 h-3" />
                  <span className="font-mono">{route.stardustCost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-3 border-t border-stardust-400/20">
        <GoldButton
          variant="primary"
          size="md"
          icon={Rocket}
          iconPosition="left"
          className="w-full"
          disabled={!canTravel}
          onClick={travel}
        >
          启航 Travel
        </GoldButton>
      </div>
    </DecorativeCard>
  );
};

export default RoutePanel;
