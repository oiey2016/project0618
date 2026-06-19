import { useMemo } from 'react';
import { MapPin, BookOpen } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { PLANETS, ROUTES } from '@/data/planets';
import type { Planet, Route } from '@/types';

const PLANET_COLORS: Record<Planet['type'], { dot: string; ring: string; glow: string }> = {
  start: { dot: 'bg-stardust-400', ring: 'ring-stardust-400/50', glow: 'shadow-[0_0_20px_rgba(212,175,55,0.6)]' },
  hub: { dot: 'bg-plasma-400', ring: 'ring-plasma-400/50', glow: 'shadow-[0_0_16px_rgba(0,212,255,0.5)]' },
  waypoint: { dot: 'bg-space-100', ring: 'ring-space-200/50', glow: '' },
  end: { dot: 'bg-stardust-400', ring: 'ring-stardust-400/50', glow: 'shadow-[0_0_20px_rgba(212,175,55,0.6)]' },
};

export default function StarMap() {
  const {
    currentPlanetId,
    visitedPlanetIds,
    selectedRouteId,
    selectRoute,
    availableRoutes,
    fuel,
    stardust,
    daysRemaining,
  } = useGameStore();

  const availableRouteSet = useMemo(
    () => new Set(availableRoutes.map((r) => r.id)),
    [availableRoutes]
  );

  const visitedSet = useMemo(
    () => new Set(visitedPlanetIds),
    [visitedPlanetIds]
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-space-300/30 bg-space-600/40">
      <div className="flex items-center justify-between border-b border-stardust-400/20 px-5 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-stardust-300 shrink-0" />
          <h2 className="font-display text-base font-bold text-stardust-200 tracking-wider">
            银河星图
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-space-200">
            <span className="h-2 w-2 rounded-full bg-plasma-400" /> 枢纽
          </div>
          <div className="flex items-center gap-1.5 text-space-200">
            <span className="h-2 w-2 rounded-full bg-space-100" /> 途径
          </div>
          <div className="flex items-center gap-1.5 text-space-200">
            <span className="h-2 w-2 rounded-full bg-stardust-400" /> 起点/终点
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {ROUTES.map((route: Route) => {
            const from = PLANETS.find((p) => p.id === route.fromId);
            const to = PLANETS.find((p) => p.id === route.toId);
            if (!from || !to) return null;

            const isAvailable = availableRouteSet.has(route.id);
            const isSelected = selectedRouteId === route.id;
            const bothVisited = visitedSet.has(from.id) || visitedSet.has(to.id);
            const canAfford =
              fuel >= route.fuelCost &&
              stardust >= route.stardustCost &&
              daysRemaining >= route.travelDays;

            return (
              <line
                key={route.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={cn(
                  'transition-all duration-300',
                  isSelected
                    ? 'stroke-stardust-400 stroke-[0.5] drop-shadow-[0_0_3px_rgba(212,175,55,0.8)]'
                    : isAvailable && canAfford
                    ? 'stroke-plasma-400/60 stroke-[0.25] hover:stroke-plasma-300 cursor-pointer'
                    : bothVisited
                    ? 'stroke-space-200/25 stroke-[0.2]'
                    : 'stroke-space-300/10 stroke-[0.15] stroke-dasharray-[1,1]'
                )}
                onClick={() => isAvailable && canAfford && selectRoute(route.id)}
              />
            );
          })}
        </svg>

        {PLANETS.map((planet) => {
          const isCurrent = planet.id === currentPlanetId;
          const isVisited = visitedSet.has(planet.id);
          const colors = PLANET_COLORS[planet.type];

          return (
            <div
              key={planet.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
            >
              <div className="relative">
                {isCurrent && (
                  <div className="absolute inset-0 -m-2 rounded-full ring-2 ring-stardust-300/60 animate-pulse-slow" />
                )}
                <div
                  className={cn(
                    'h-4 w-4 rounded-full ring-2 transition-all duration-300',
                    colors.dot,
                    colors.ring,
                    isVisited || isCurrent ? colors.glow : 'opacity-70',
                    isCurrent && 'scale-125'
                  )}
                />
                {isCurrent && (
                  <MapPin
                    size={14}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-stardust-300 animate-float"
                  />
                )}
              </div>
              <div
                className={cn(
                  'absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap',
                  'font-display text-[10px] transition-all',
                  isCurrent
                    ? 'text-stardust-200 font-bold'
                    : isVisited
                    ? 'text-space-100'
                    : 'text-space-200/60'
                )}
              >
                {planet.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
