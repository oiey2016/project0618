import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getSceneById } from '../../data/scenes';
import { Hotspot } from './Hotspot';
import { NavButtons } from './NavButtons';

export const Scene: React.FC = () => {
  const { currentScene, sceneTransitioning } = useGameStore();
  const scene = getSceneById(currentScene);

  if (!scene) {
    return (
      <div className="w-full h-full flex items-center justify-center text-parchment">
        场景加载失败...
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${scene.backgroundClass} ${
        sceneTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } transition-all duration-500`}
    >
      {/* 场景装饰元素 */}
      <SceneDecorations sceneId={currentScene} />
      
      {/* 场景名称 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="px-6 py-2 bg-shadow-black/60 backdrop-blur-sm rounded border border-rust-mid/50">
          <h2 className="font-gothic text-xl text-parchment text-glow">
            {scene.name}
          </h2>
        </div>
      </div>

      {/* 可点击热点 */}
      {scene.hotspots.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} />
      ))}

      {/* 导航按钮 */}
      <NavButtons exits={scene.exits} />

      {/* 场景描述（底部） */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 max-w-xl">
        <p className="text-center text-parchment/60 text-sm italic font-serif-old">
          {scene.description}
        </p>
      </div>

      {/* 前景装饰 - 暗角效果由全局vignette提供 */}
    </div>
  );
};

// 场景装饰组件 - 根据不同场景显示不同的装饰元素
const SceneDecorations: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const decorations: Record<string, React.ReactNode> = {
    hall: (
      <>
        {/* 吊灯 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="w-1 h-20 bg-rust-mid" />
          <div className="w-16 h-8 bg-gradient-to-b from-rust-mid to-rust-dark rounded-b-full -mt-1 -ml-6">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-candle-orange/80 rounded-full blur-sm animate-flicker" />
          </div>
        </div>
        
        {/* 地板纹理 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-rust-dark/80 to-transparent" />
        
        {/* 墙壁装饰线 */}
        <div className="absolute top-1/3 left-0 right-0 h-1 bg-rust-mid/30" />
      </>
    ),
    kitchen: (
      <>
        {/* 灶台轮廓 */}
        <div className="absolute bottom-1/3 left-1/4 right-1/4 h-8 bg-rust-deep border-t-2 border-rust-mid rounded-t" />
        
        {/* 挂着的厨具 */}
        <div className="absolute top-1/4 right-1/4 flex gap-4">
          <div className="w-2 h-12 bg-rust-mid rounded" />
          <div className="w-3 h-10 bg-rust-mid rounded-full" />
        </div>
        
        {/* 地板 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-rust-dark to-transparent" />
      </>
    ),
    study: (
      <>
        {/* 书架轮廓 */}
        <div className="absolute top-1/4 left-10 w-1/4 h-1/2 bg-rust-deep/50 border-2 border-rust-mid/30 rounded">
          <div className="h-1/3 border-b border-rust-mid/20" />
          <div className="h-1/3 border-b border-rust-mid/20" />
          <div className="h-1/3" />
        </div>
        
        {/* 书桌 */}
        <div className="absolute bottom-1/3 right-1/4 w-1/4 h-6 bg-rust-mid rounded-t" />
      </>
    ),
    garden: (
      <>
        {/* 草地 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-moss-dark to-moss-green/30" />
        
        {/* 远处的树影 */}
        <div className="absolute top-1/4 left-10 w-12 h-32 bg-moss-dark/50 rounded-t-full" />
        <div className="absolute top-1/3 right-20 w-16 h-24 bg-moss-dark/40 rounded-t-full" />
        
        {/* 月亮 */}
        <div className="absolute top-10 right-10 w-12 h-12 bg-parchment/20 rounded-full blur-sm">
          <div className="absolute top-1 right-1 w-10 h-10 bg-shadow-black/80 rounded-full" />
        </div>
      </>
    ),
    cellar: (
      <>
        {/* 石墙纹理 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-rust-mid/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-rust-mid/50" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-rust-mid/50" />
        </div>
        
        {/* 架子 */}
        <div className="absolute top-1/3 left-10 w-1/4 h-1 bg-rust-mid" />
        <div className="absolute top-1/2 left-10 w-1/4 h-1 bg-rust-mid" />
        
        {/* 地面 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-shadow-black to-transparent" />
      </>
    ),
    room1: (
      <>
        {/* 大床轮廓 */}
        <div className="absolute bottom-1/3 left-10 w-1/4 h-20 bg-rust-deep border-2 border-rust-mid rounded">
          <div className="absolute top-0 left-0 right-0 h-4 bg-rust-mid/50 rounded-t" />
        </div>
        
        {/* 椅子 */}
        <div className="absolute top-1/2 left-1/2 w-12 h-16 bg-rust-deep border border-rust-mid rounded-t" />
        
        {/* 桌子 */}
        <div className="absolute bottom-1/3 right-1/4 w-1/5 h-3 bg-rust-mid rounded-t" />
      </>
    ),
    room2: (
      <>
        {/* 梳妆台 */}
        <div className="absolute top-1/4 left-1/5 w-1/4 h-1/3">
          <div className="absolute top-0 left-1/4 w-1/2 h-2/3 bg-parchment/10 border-2 border-rust-mid/50 rounded" />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-rust-deep border border-rust-mid rounded" />
        </div>
        
        {/* 花瓶 */}
        <div className="absolute top-1/3 right-1/4">
          <div className="w-8 h-12 bg-rust-mid rounded-b-full" />
        </div>
      </>
    ),
    room3: (
      <>
        {/* 床 */}
        <div className="absolute top-1/2 left-1/3 w-1/3 h-16 bg-rust-deep border border-rust-mid rounded">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-parchment/5 rounded-t" />
        </div>
        
        {/* 镜子 */}
        <div className="absolute top-1/5 left-1/6 w-12 h-20 bg-rust-mid/30 border-2 border-rust-mid rounded">
          <div className="absolute inset-2 bg-parchment/10 rounded-sm" />
        </div>
        
        {/* 窗帘阴影 */}
        <div className="absolute top-0 right-10 w-16 h-full bg-gradient-to-b from-shadow-black/80 via-shadow-black/60 to-shadow-black/80" />
      </>
    ),
  };

  return <>{decorations[sceneId] || null}</>;
};
