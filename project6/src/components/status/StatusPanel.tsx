import { Heart, Wind, Zap, Radio } from 'lucide-react';
import StatusBar from './StatusBar';
import { useGameStore } from '@/store/useGameStore';

const StatusPanel = () => {
  const { astronautStatus } = useGameStore();

  return (
    <div className="panel-glass px-4 py-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
        <StatusBar
          label="生命"
          value={astronautStatus.health}
          icon={Heart}
          color="red"
        />
        <StatusBar
          label="氧气"
          value={astronautStatus.oxygen}
          icon={Wind}
          color="blue"
        />
        <StatusBar
          label="体力"
          value={astronautStatus.stamina}
          icon={Zap}
          color="green"
        />
        <StatusBar
          label="信号"
          value={astronautStatus.signal}
          icon={Radio}
          color="orange"
        />
      </div>
    </div>
  );
};

export default StatusPanel;
