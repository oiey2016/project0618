import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, ActiveCat, PlacedDecoration } from '@/types';
import { DISHES, getDishById } from '@/data/dishes';
import { CATS, getCatById, getCatsByDish } from '@/data/cats';
import { DECORATIONS, getDecorationById } from '@/data/decorations';
import { randomId } from '@/utils';

const SEAT_POSITIONS = [
  { x: 20, y: 50 },
  { x: 40, y: 45 },
  { x: 60, y: 50 },
  { x: 80, y: 45 },
  { x: 30, y: 70 },
  { x: 70, y: 70 },
];

const getInitialState = () => ({
  coins: 200,
  level: 1,
  reputation: 0,
  experience: 0,
  experienceToNextLevel: 100,
  
  unlockedDishes: ['fish-cake'],
  dishLevels: { 'fish-cake': 1 },
  researchingDish: null,
  
  unlockedCats: ['orange-tabby', 'white-cat'],
  catVisitCounts: {},
  totalCatsServed: 0,
  
  ownedDecorations: [],
  placedDecorations: [],
  
  activeCats: [],
  maxActiveCats: 4,
  
  lastSaveTime: Date.now(),
  lastSpawnTime: Date.now(),
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      
      addCoins: (amount: number) => {
        set((state) => ({ coins: state.coins + amount }));
      },
      
      spendCoins: (amount: number): boolean => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },
      
      addExperience: (amount: number) => {
        set((state) => {
          let newExp = state.experience + amount;
          let newLevel = state.level;
          let newExpToNext = state.experienceToNextLevel;
          let newMaxCats = state.maxActiveCats;
          
          while (newExp >= newExpToNext) {
            newExp -= newExpToNext;
            newLevel += 1;
            newExpToNext = Math.floor(newExpToNext * 1.5);
            newMaxCats = Math.min(8, 4 + Math.floor(newLevel / 3));
          }
          
          return {
            experience: newExp,
            level: newLevel,
            experienceToNextLevel: newExpToNext,
            maxActiveCats: newMaxCats,
          };
        });
      },
      
      addReputation: (amount: number) => {
        set((state) => ({ reputation: state.reputation + amount }));
      },
      
      unlockDish: (dishId: string): boolean => {
        const state = get();
        const dish = getDishById(dishId);
        
        if (!dish || state.unlockedDishes.includes(dishId)) {
          return false;
        }
        
        if (state.spendCoins(dish.unlockCost)) {
          set((s) => ({
            unlockedDishes: [...s.unlockedDishes, dishId],
            dishLevels: { ...s.dishLevels, [dishId]: 1 },
          }));
          
          const cats = getCatsByDish(dishId);
          cats.forEach(cat => {
            if (cat.rarity === 'common') {
              get().unlockCat(cat.id);
            }
          });
          
          return true;
        }
        return false;
      },
      
      startResearch: (dishId: string): boolean => {
        const state = get();
        const dish = getDishById(dishId);
        
        if (!dish || state.researchingDish || state.unlockedDishes.includes(dishId)) {
          return false;
        }
        
        if (state.spendCoins(dish.unlockCost)) {
          set({
            researchingDish: {
              dishId,
              startTime: Date.now(),
              duration: dish.unlockTime * 1000,
            },
          });
          return true;
        }
        return false;
      },
      
      completeResearch: () => {
        const state = get();
        if (!state.researchingDish) return;
        
        const dishId = state.researchingDish.dishId;
        if (!state.unlockedDishes.includes(dishId)) {
          set((s) => ({
            unlockedDishes: [...s.unlockedDishes, dishId],
            dishLevels: { ...s.dishLevels, [dishId]: 1 },
            researchingDish: null,
          }));
          
          const cats = getCatsByDish(dishId);
          const commonCats = cats.filter(c => c.rarity === 'common');
          commonCats.forEach(cat => get().unlockCat(cat.id));
        } else {
          set({ researchingDish: null });
        }
      },
      
      unlockCat: (catId: string) => {
        set((state) => {
          if (state.unlockedCats.includes(catId)) return state;
          return {
            unlockedCats: [...state.unlockedCats, catId],
            catVisitCounts: { ...state.catVisitCounts, [catId]: 0 },
          };
        });
      },
      
      incrementCatVisit: (catId: string) => {
        set((state) => ({
          catVisitCounts: {
            ...state.catVisitCounts,
            [catId]: (state.catVisitCounts[catId] || 0) + 1,
          },
          totalCatsServed: state.totalCatsServed + 1,
        }));
      },
      
      buyDecoration: (decorationId: string): boolean => {
        const state = get();
        const decoration = getDecorationById(decorationId);
        
        if (!decoration || state.ownedDecorations.includes(decorationId)) {
          return false;
        }
        
        if (state.spendCoins(decoration.price)) {
          set((s) => ({
            ownedDecorations: [...s.ownedDecorations, decorationId],
          }));
          get().addReputation(decoration.reputationBonus);
          return true;
        }
        return false;
      },
      
      placeDecoration: (decorationId: string, x: number, y: number) => {
        const state = get();
        if (!state.ownedDecorations.includes(decorationId)) return;
        
        const placed: PlacedDecoration = {
          id: randomId(),
          decorationId,
          positionX: x,
          positionY: y,
        };
        
        set((s) => ({
          placedDecorations: [...s.placedDecorations, placed],
        }));
      },
      
      removeDecoration: (placedId: string) => {
        set((state) => ({
          placedDecorations: state.placedDecorations.filter(d => d.id !== placedId),
        }));
      },
      
      spawnCat: (catId: string) => {
        const state = get();
        const cat = getCatById(catId);
        
        if (!cat || state.activeCats.length >= state.maxActiveCats) return;
        
        const availableSeats = SEAT_POSITIONS.filter(
          (_, idx) => !state.activeCats.some(c => c.seatIndex === idx)
        );
        
        if (availableSeats.length === 0) return;
        
        const seatIdx = SEAT_POSITIONS.findIndex(
          (_, idx) => !state.activeCats.some(c => c.seatIndex === idx)
        );
        const seat = SEAT_POSITIONS[seatIdx];
        
        const availableDishes = state.unlockedDishes.filter(dishId => 
          cat.favoriteDishes.includes(dishId)
        );
        
        const orderedDish = availableDishes.length > 0 
          ? availableDishes[Math.floor(Math.random() * availableDishes.length)]
          : state.unlockedDishes[Math.floor(Math.random() * state.unlockedDishes.length)];
        
        const dish = getDishById(orderedDish);
        const coinAmount = cat.coinReward + (dish ? dish.basePrice : 10);
        
        const newCat: ActiveCat = {
          id: randomId(),
          catId,
          orderedDish,
          positionX: -10,
          positionY: seat.y,
          targetX: seat.x,
          targetY: seat.y,
          state: 'walking',
          coinReady: false,
          coinAmount,
          stateTimer: 0,
          seatIndex: seatIdx,
        };
        
        set((s) => ({
          activeCats: [...s.activeCats, newCat],
          lastSpawnTime: Date.now(),
        }));
        
        if (!state.unlockedCats.includes(catId)) {
          get().unlockCat(catId);
        }
      },
      
      collectCoin: (activeCatId: string) => {
        const state = get();
        const cat = state.activeCats.find(c => c.id === activeCatId);
        
        if (!cat || !cat.coinReady) return;
        
        get().addCoins(cat.coinAmount);
        get().addExperience(Math.floor(cat.coinAmount / 5));
        get().incrementCatVisit(cat.catId);
        
        set((s) => ({
          activeCats: s.activeCats.map(c => 
            c.id === activeCatId 
              ? { ...c, state: 'leaving' as const, coinReady: false, stateTimer: 0, targetX: 110, targetY: c.positionY }
              : c
          ),
        }));
      },
      
      updateCats: (deltaTime: number) => {
        const state = get();
        const now = Date.now();
        
        if (state.researchingDish) {
          const elapsed = now - state.researchingDish.startTime;
          if (elapsed >= state.researchingDish.duration) {
            get().completeResearch();
          }
        }
        
        const spawnInterval = Math.max(3000, 8000 - state.level * 300);
        if (now - state.lastSpawnTime > spawnInterval && state.activeCats.length < state.maxActiveCats) {
          const availableCats = CATS.filter(cat => {
            if (cat.rarity === 'common') return true;
            if (cat.rarity === 'rare') return state.level >= 2;
            if (cat.rarity === 'epic') return state.level >= 5;
            if (cat.rarity === 'legendary') return state.level >= 8;
            return false;
          });
          
          const hasFavoriteDish = availableCats.filter(cat =>
            cat.favoriteDishes.some(dishId => state.unlockedDishes.includes(dishId))
          );
          
          if (hasFavoriteDish.length > 0) {
            const weightedCats: string[] = [];
            hasFavoriteDish.forEach(cat => {
              let weight = 1;
              if (cat.rarity === 'common') weight = 10;
              else if (cat.rarity === 'rare') weight = 4;
              else if (cat.rarity === 'epic') weight = 2;
              else if (cat.rarity === 'legendary') weight = 1;
              
              for (let i = 0; i < weight; i++) {
                weightedCats.push(cat.id);
              }
            });
            
            const randomCatId = weightedCats[Math.floor(Math.random() * weightedCats.length)];
            get().spawnCat(randomCatId);
          }
        }
        
        set((s) => ({
          activeCats: s.activeCats
            .map(cat => {
              const catData = getCatById(cat.catId);
              if (!catData) return cat;
              
              let newCat = { ...cat };
              newCat.stateTimer += deltaTime;
              
              const speed = 0.03;
              const dx = newCat.targetX - newCat.positionX;
              const dy = newCat.targetY - newCat.positionY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist > 0.5) {
                newCat.positionX += (dx / dist) * speed * deltaTime * 0.1;
                newCat.positionY += (dy / dist) * speed * deltaTime * 0.1;
              }
              
              if (newCat.state === 'walking' && dist < 1) {
                newCat.state = 'eating';
                newCat.stateTimer = 0;
              }
              
              if (newCat.state === 'eating' && newCat.stateTimer > catData.stayDuration) {
                newCat.coinReady = true;
                newCat.state = 'waiting';
              }
              
              if (newCat.state === 'leaving' && newCat.positionX > 105) {
                return null;
              }
              
              return newCat;
            })
            .filter((cat): cat is ActiveCat => cat !== null),
        }));
      },
      
      saveGame: () => {
        set({ lastSaveTime: Date.now() });
      },
      
      loadGame: (): boolean => {
        const saved = localStorage.getItem('cat-restaurant-storage');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.state) {
              set(data.state);
              return true;
            }
          } catch (e) {
            console.error('Failed to load game:', e);
          }
        }
        return false;
      },
      
      resetGame: () => {
        set(getInitialState());
        localStorage.removeItem('cat-restaurant-storage');
      },
    }),
    {
      name: 'cat-restaurant-storage',
      partialize: (state) => ({
        coins: state.coins,
        level: state.level,
        reputation: state.reputation,
        experience: state.experience,
        experienceToNextLevel: state.experienceToNextLevel,
        unlockedDishes: state.unlockedDishes,
        dishLevels: state.dishLevels,
        unlockedCats: state.unlockedCats,
        catVisitCounts: state.catVisitCounts,
        totalCatsServed: state.totalCatsServed,
        ownedDecorations: state.ownedDecorations,
        placedDecorations: state.placedDecorations,
        maxActiveCats: state.maxActiveCats,
      }),
    }
  )
);
