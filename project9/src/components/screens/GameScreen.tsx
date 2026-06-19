import StarField from '@/components/common/StarField';
import StatusBar from '@/components/game/StatusBar';
import RoutePanel from '@/components/game/RoutePanel';
import StarMap from '@/components/game/StarMap';
import InventoryPanel from '@/components/game/InventoryPanel';
import StoryLog from '@/components/game/StoryLog';
import EventModal from '@/components/game/EventModal';

export default function GameScreen() {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <StarField />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,3,10,0.5) 85%, rgba(1,2,6,0.85) 100%)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />

        <main className="grid grid-cols-12 gap-4 p-4 flex-1 min-h-0">
          <div className="col-span-12 lg:col-span-3 h-full min-h-0">
            <RoutePanel />
          </div>
          <div className="col-span-12 lg:col-span-6 h-full min-h-0">
            <StarMap />
          </div>
          <div className="col-span-12 lg:col-span-3 h-full min-h-0">
            <InventoryPanel />
          </div>
        </main>

        <div className="h-48 shrink-0 mx-4 mb-4">
          <StoryLog />
        </div>
      </div>

      <EventModal />
    </div>
  );
}
