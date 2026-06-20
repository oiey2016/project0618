import { Home, Compass, Target } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavBarProps {
  title: string;
}

export default function NavBar({ title }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md rounded-2xl shadow-card px-6 py-3 flex items-center justify-between">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
      >
        <Home size={22} />
        <span className="font-medium">首页</span>
      </button>

      <h1 className="text-xl font-bold text-gray-800 font-game">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/explore")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            location.pathname === "/explore"
              ? "bg-primary-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Compass size={18} />
          <span className="text-sm font-medium">探索</span>
        </button>
        <button
          onClick={() => navigate("/challenge")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            location.pathname === "/challenge"
              ? "bg-accent-orange text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Target size={18} />
          <span className="text-sm font-medium">挑战</span>
        </button>
      </div>
    </nav>
  );
}
