import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Target, Sparkles, HelpCircle } from "lucide-react";
import WorldMap from "@/components/WorldMap";
import HowToPlayModal from "@/components/HowToPlayModal";

export default function Home() {
  const navigate = useNavigate();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-cream overflow-hidden">
      <div className="absolute top-10 left-10 text-5xl animate-float opacity-60">☁️</div>
      <div className="absolute top-20 right-20 text-4xl animate-float opacity-50" style={{ animationDelay: "1s" }}>☁️</div>
      <div className="absolute top-40 left-1/4 text-3xl animate-float opacity-40" style={{ animationDelay: "0.5s" }}>☁️</div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full px-5 py-2.5 shadow-card hover:shadow-game-hover transition-all hover:scale-105 active:scale-95"
          >
            <HelpCircle size={20} className="text-primary-500" />
            <span className="font-medium text-gray-700">玩法说明</span>
          </button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-card">
            <Sparkles size={18} className="text-accent-yellow" />
            <span className="text-sm font-medium text-gray-600">边玩边学，快乐成长</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3 font-game">
            🌍 地理大冒险
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            戳戳地图，认识国家，记住首都！
            <br />
            一起探索神奇的世界吧！
          </p>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6 items-center max-w-6xl mx-auto w-full">
          <div className="h-80 lg:h-96 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <WorldMap interactive={false} />
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
              选择你的冒险模式
            </h2>

            <button
              onClick={() => navigate("/explore")}
              className="w-full bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white rounded-3xl p-6 shadow-game hover:shadow-game-hover transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass size={36} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold mb-1 font-game">探索模式</h3>
                  <p className="text-white/80 text-sm">
                    自由点击地图，认识每个国家和它的首都
                  </p>
                </div>
                <div className="text-4xl group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/challenge")}
              className="w-full bg-gradient-to-br from-accent-orange to-accent-yellow hover:from-orange-500 hover:to-yellow-500 text-white rounded-3xl p-6 shadow-game hover:shadow-game-hover transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target size={36} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold mb-1 font-game">挑战模式</h3>
                  <p className="text-white/80 text-sm">
                    答题闯关，看看你能得多少分！
                  </p>
                </div>
                <div className="text-4xl group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </button>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-500">
                🎮 适合 6-12 岁小朋友
              </p>
              <p className="text-sm text-gray-500">
                📚 学习世界国家和首都知识
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>🌟 点击地图上的国家开始你的地理大冒险！</p>
        </div>
      </div>

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
