import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-amber-100 to-sky-200 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="float-icon float-icon-1 absolute text-6xl opacity-20">📦</div>
      <div className="float-icon float-icon-2 absolute text-5xl opacity-20">🎈</div>
      <div className="float-icon float-icon-3 absolute text-4xl opacity-20">🌀</div>
      <div className="float-icon float-icon-4 absolute text-5xl opacity-15">🪵</div>
      <div className="float-icon float-icon-5 absolute text-4xl opacity-20">💨</div>
      <div className="float-icon float-icon-6 absolute text-3xl opacity-15">🧊</div>

      <h1 className="font-fredoka text-7xl text-[#FF8C42] title-sway mb-4 drop-shadow-lg">
        字造万物
      </h1>
      <p className="font-nunito text-xl text-[#3D2B1F] mb-12 opacity-80">
        打字出东西，东西帮过关
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/game/1')}
          className="btn-paper w-full py-4 rounded-2xl bg-[#FF8C42] text-white font-nunito font-bold text-2xl hover:bg-orange-500 transition-all shadow-lg"
        >
          开始游戏
        </button>
        <button
          onClick={() => navigate('/levels')}
          className="btn-paper w-full py-3 rounded-2xl bg-[#5CC8FF] text-white font-nunito font-bold text-xl hover:bg-blue-400 transition-all shadow-lg"
        >
          关卡选择
        </button>
        <button
          onClick={() => navigate('/help')}
          className="btn-paper w-full py-3 rounded-2xl bg-[#7BC67E] text-white font-nunito font-bold text-xl hover:bg-green-500 transition-all shadow-lg"
        >
          操作说明
        </button>
      </div>
    </div>
  )
}
