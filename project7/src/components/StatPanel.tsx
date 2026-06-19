import { StatBar } from "./StatBar";

export function StatPanel() {
  return (
    <div className="w-full max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-4 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-black/30 backdrop-blur-sm ring-1 ring-gold-500/20 shadow-innerGlow">
      <StatBar statKey="church" />
      <StatBar statKey="people" />
      <StatBar statKey="army" />
      <StatBar statKey="wealth" />
    </div>
  );
}
