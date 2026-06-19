import { Monster } from './Monster';

export function BattleArea() {
  return (
    <div className="flex-1 h-full w-full relative bg-gradient-to-b from-purple-950 via-indigo-950 to-purple-950 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 92, 246, 0.03) 50px, rgba(139, 92, 246, 0.03) 51px),
          repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 92, 246, 0.03) 50px, rgba(139, 92, 246, 0.03) 51px)
        `,
      }} />

      <Monster />
    </div>
  );
}
