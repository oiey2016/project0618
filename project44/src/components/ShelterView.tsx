import { useGameStore } from '../store/useGameStore';
import { BUILDING_CONFIGS } from '../data/buildings';
import { Swords, Shield } from 'lucide-react';

export const ShelterView = () => {
  const { buildings, getPlayerAttack, getPlayerDefense, phase, isUnderAttack, day } = useGameStore();

  const buildingConfigsWithLevel = BUILDING_CONFIGS.map(config => {
    const building = buildings.find(b => b.id === config.id);
    return { ...config, level: building?.level || 0 };
  });

  const builtBuildings = buildingConfigsWithLevel.filter(b => b.level > 0);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-rust-400 flex items-center gap-2">
          <span>🏚️</span>
          <span>庇护所</span>
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-wasteland-surface rounded border border-wasteland-border">
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-sm text-wasteland-muted">攻击</span>
            <span className="text-sm font-bold text-red-400">{getPlayerAttack()}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-wasteland-surface rounded border border-wasteland-border">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-wasteland-muted">防御</span>
            <span className="text-sm font-bold text-blue-400">{getPlayerDefense()}</span>
          </div>
        </div>
      </div>

      <div className={`
        flex-1 rounded-lg border-2 relative overflow-hidden transition-all duration-1000
        ${phase === 'day' ? 'bg-gradient-to-b from-amber-900/20 to-wasteland-bg border-amber-900/50' : 'bg-gradient-to-b from-indigo-900/30 to-wasteland-bg border-indigo-900/50'}
        ${isUnderAttack ? 'border-red-600 animate-pulse' : ''}
      `}>
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute inset-0 ${phase === 'day' ? 'bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.1),_transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.1),_transparent_70%)]'}`} />
        </div>

        {isUnderAttack && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 bg-red-900/80 border border-red-500 rounded-lg animate-pulse">
              <span className="text-red-300 font-bold">⚠️ 僵尸来袭！</span>
            </div>
          </div>
        )}

        <div className="relative h-full flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-lg">
            {builtBuildings.length === 0 ? (
              <div className="col-span-3 text-center text-wasteland-muted py-12">
                <p className="text-4xl mb-2">🏚️</p>
                <p>点击下方"建造"开始建设你的庇护所</p>
              </div>
            ) : (
              builtBuildings.map(building => (
                <div
                  key={building.id}
                  className="
                    relative p-4 rounded-lg border transition-all
                    bg-wasteland-surface/80 border-wasteland-border
                    hover:border-rust-600 hover:shadow-rust-glow/30
                    flex flex-col items-center gap-2
                  "
                >
                  <span className="text-4xl">{building.icon}</span>
                  <span className="text-sm font-medium text-wasteland-text">{building.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-wasteland-muted">等级</span>
                    <span className="text-sm font-bold text-rust-400">{building.level}</span>
                    <span className="text-xs text-wasteland-muted">/ {building.maxLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between text-sm">
            <div className="text-wasteland-muted">
              建筑数量: <span className="text-wasteland-text">{builtBuildings.length}</span>
            </div>
            <div className="text-wasteland-muted">
              生存天数: <span className="text-rust-400 font-bold">{day}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
