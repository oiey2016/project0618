import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import World from '@/components/World';
import PlayerController from '@/components/PlayerController';
import BlockHighlight from '@/components/BlockHighlight';
import StatusBar from '@/components/StatusBar';
import Hotbar from '@/components/Hotbar';
import Crosshair from '@/components/Crosshair';
import HelpModal from '@/components/HelpModal';
import { HitInfo } from '@/types';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export default function GamePage() {
  const navigate = useNavigate();
  const phase = useGameStore((state) => state.phase);
  const [hitInfo, setHitInfo] = useState<HitInfo | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (phase !== 'playing') {
      navigate('/');
    }
  }, [phase, navigate]);

  const handleHitChange = (hit: HitInfo | null) => {
    setHitInfo(hit);
  };

  const highlightPosition = hitInfo
    ? ([hitInfo.blockPosition.x, hitInfo.blockPosition.y, hitInfo.blockPosition.z] as [number, number, number])
    : null;

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        shadows
        gl={{ antialias: true }}
      >
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.5}
          azimuth={0.25}
        />
        
        <ambientLight intensity={0.4} color="#b0c4de" />
        <hemisphereLight
          args={['#87CEEB', '#228B22', 0.6]}
        />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <fog attach="fog" args={['#87CEEB', 40, 80]} />

        <World />
        <BlockHighlight position={highlightPosition} />
        <PlayerController onHitChange={handleHitChange} />
      </Canvas>

      <StatusBar />
      <Hotbar />
      <Crosshair />

      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回菜单</span>
      </button>

      <button
        onClick={() => setShowHelp(true)}
        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
      >
        <HelpCircle className="w-5 h-5" />
        <span>玩法说明</span>
      </button>

      <div className="absolute bottom-4 left-4 z-10 text-white/60 text-xs bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
        WASD 移动 · 空格跳跃 · 鼠标视角 · 左键破坏 · 右键放置
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
