import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { calculateMonsterDamage } from '../utils/battle';
import type { DamageNumber, BattleLog, FloatingText } from '../types/game';

interface UseBattleReturn {
  damageNumbers: DamageNumber[];
  floatingTexts: FloatingText[];
  battleLogs: BattleLog[];
  playerAnimating: boolean;
  monsterAnimating: boolean;
  playerHit: boolean;
  monsterHit: boolean;
}

export function useBattle(): UseBattleReturn {
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [playerAnimating, setPlayerAnimating] = useState(false);
  const [monsterAnimating, setMonsterAnimating] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [monsterHit, setMonsterHit] = useState(false);

  const battleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const damageIdRef = useRef(0);
  const logIdRef = useRef(0);

  const isPaused = useGameStore((s) => s.isPaused);
  const isAutoBattle = useGameStore((s) => s.isAutoBattle);
  const battleSpeed = useGameStore((s) => s.battleSpeed);

  const addDamageNumber = useCallback((value: number, isCrit: boolean, target: 'player' | 'monster') => {
    const id = `dmg_${damageIdRef.current++}`;
    const x = target === 'monster' ? 65 + Math.random() * 20 : 15 + Math.random() * 20;
    const y = 30 + Math.random() * 20;
    setDamageNumbers((prev) => [...prev, { id, value, isCrit, x, y, target }]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 1000);
  }, []);

  const addFloatingText = useCallback((text: string, icon?: string, x = 50, y = 50) => {
    const id = `float_${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, icon, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== id));
    }, 800);
  }, []);

  const addBattleLog = useCallback((message: string, type: BattleLog['type']) => {
    const id = `log_${logIdRef.current++}`;
    setBattleLogs((prev) => [{ id, message, type, timestamp: Date.now() }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (isPaused || !isAutoBattle) {
      if (battleTimeoutRef.current) {
        clearTimeout(battleTimeoutRef.current);
        battleTimeoutRef.current = null;
      }
      return;
    }

    const baseInterval = 1200;
    const interval = baseInterval / battleSpeed;

    const executePlayerTurn = () => {
      const state = useGameStore.getState();
      let monster = state.currentMonster;

      if (!monster) {
        state.spawnMonster();
        battleTimeoutRef.current = setTimeout(executePlayerTurn, interval * 0.5);
        return;
      }

      setPlayerAnimating(true);
      setTimeout(() => setPlayerAnimating(false), 300);

      const { damage, isCrit } = state.attack();

      setMonsterHit(true);
      setTimeout(() => setMonsterHit(false), 200);

      addDamageNumber(damage, isCrit, 'monster');

      if (isCrit) {
        addBattleLog(`💥 暴击！对${monster.name}造成 ${damage} 点伤害！`, 'damage');
      } else {
        addBattleLog(`⚔️ 对${monster.name}造成 ${damage} 点伤害`, 'damage');
      }

      if (monster.hp - damage <= 0) {
        const goldDrop = monster.goldDrop;
        const expDrop = monster.expDrop;
        addBattleLog(`🎉 击败了${monster.name}！获得 ${goldDrop} 金币，${expDrop} 经验`, 'gold');
        addFloatingText(`+${goldDrop}`, '💰', 65, 60);
        battleTimeoutRef.current = setTimeout(executePlayerTurn, interval * 0.5);
      } else {
        battleTimeoutRef.current = setTimeout(executeMonsterTurn, interval * 0.4);
      }
    };

    const executeMonsterTurn = () => {
      const state = useGameStore.getState();
      const monster = state.currentMonster;
      const playerStats = state.getPlayerTotalStats();

      if (!monster || monster.hp <= 0) {
        battleTimeoutRef.current = setTimeout(executePlayerTurn, interval * 0.2);
        return;
      }

      setMonsterAnimating(true);
      setTimeout(() => setMonsterAnimating(false), 300);

      const damage = calculateMonsterDamage(monster, playerStats);
      state.takeDamage(damage);

      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 200);

      addDamageNumber(damage, false, 'player');
      addBattleLog(`👊 ${monster.name}对你造成 ${damage} 点伤害`, 'damage');

      const newPlayerHp = useGameStore.getState().player.hp;
      if (newPlayerHp <= 0) {
        addBattleLog(`💀 你被击败了！回到第 ${Math.max(1, state.currentStage - 1)} 层`, 'info');
        battleTimeoutRef.current = setTimeout(executePlayerTurn, interval * 0.8);
      } else {
        battleTimeoutRef.current = setTimeout(executePlayerTurn, interval * 0.4);
      }
    };

    battleTimeoutRef.current = setTimeout(executePlayerTurn, interval);

    return () => {
      if (battleTimeoutRef.current) {
        clearTimeout(battleTimeoutRef.current);
        battleTimeoutRef.current = null;
      }
    };
  }, [isPaused, isAutoBattle, battleSpeed, addDamageNumber, addBattleLog, addFloatingText]);

  return {
    damageNumbers,
    floatingTexts,
    battleLogs,
    playerAnimating,
    monsterAnimating,
    playerHit,
    monsterHit,
  };
}
