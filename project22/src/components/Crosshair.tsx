export default function Crosshair() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
      <div className="relative w-6 h-6">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white shadow-lg" />
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 opacity-80" />
      </div>
    </div>
  );
}
