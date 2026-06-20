import { X, Compass, Target, Heart, Zap, Trophy } from "lucide-react";

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop">
        <div className="bg-gradient-to-r from-primary-400 to-primary-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X size={22} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-5xl">📖</span>
            <div>
              <h2 className="text-3xl font-bold font-game">游戏玩法</h2>
              <p className="text-white/80 mt-1">轻松上手，快乐学习！</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                <Compass size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-game">
                🧭 探索模式
              </h3>
            </div>
            <div className="space-y-2 text-gray-600 pl-2">
              <p>🎯 <strong>点击</strong>地图上的彩色圆点</p>
              <p>📌 查看国家的<strong>名称、国旗、首都</strong>和所属大洲</p>
              <p>🌍 想点哪里点哪里，<strong>自由探索</strong>全世界！</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-accent-orange flex items-center justify-center">
                <Target size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-game">
                🎯 挑战模式
              </h3>
            </div>
            <div className="space-y-2 text-gray-600 pl-2">
              <p>❓ 根据题目提示，<strong>点击正确的国家</strong></p>
              <p>
                <Trophy size={16} className="inline text-accent-yellow" />{" "}
                答对获得 <strong>100 分</strong>
              </p>
              <p>
                <Zap size={16} className="inline text-accent-orange" />{" "}
                <strong>连续答对</strong>有额外连击加分哦！
              </p>
              <p>
                <Heart size={16} className="inline text-accent-red" />{" "}
                你有 <strong>3 条生命</strong>，答错会扣掉 1 条
              </p>
              <p>🏆 共 <strong>10 道题</strong>，看看你能得多少分！</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-gray-800 font-game mb-3 flex items-center gap-2">
              💡 小提示
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center">
                <span className="text-3xl">🗺️</span>
                <p className="text-sm text-gray-600 mt-1">
                  多玩探索模式<br />熟悉国家位置
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <span className="text-3xl">⏱️</span>
                <p className="text-sm text-gray-600 mt-1">
                  不用着急<br />仔细看题再作答
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <span className="text-3xl">🎯</span>
                <p className="text-sm text-gray-600 mt-1">
                  保持连击<br />获得更高分数
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <span className="text-3xl">📚</span>
                <p className="text-sm text-gray-600 mt-1">
                  边玩边记<br />快乐学地理
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-bold text-lg shadow-game hover:shadow-game-hover transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            我知道啦！开始冒险 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
