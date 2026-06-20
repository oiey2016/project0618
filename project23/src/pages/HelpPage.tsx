import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowLeftCircle, Space, Keyboard, Package } from 'lucide-react'
import { ITEMS } from '@/data/items'

const CONTROLS = [
  { icon: <ArrowLeftCircle size={24} />, label: '← 方向键', desc: '向左移动' },
  { icon: <ArrowRight size={24} />, label: '→ 方向键', desc: '向右移动' },
  { icon: <Space size={24} />, label: '空格键', desc: '跳跃' },
  { icon: <Keyboard size={24} />, label: '输入框', desc: '输入物品名称召唤物品' },
]

export default function HelpPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-amber-50 to-sky-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn-paper p-2 rounded-xl bg-white/80 hover:bg-white transition-colors"
          >
            <ArrowLeft size={24} className="text-[#3D2B1F]" />
          </button>
          <h1 className="font-fredoka text-4xl text-[#7BC67E]">操作说明</h1>
        </div>

        <div className="bg-[#FFF8F0] rounded-2xl p-6 border-2 border-amber-200 mb-6">
          <h2 className="font-fredoka text-2xl text-[#FF8C42] mb-4">基本操作</h2>
          <div className="grid gap-3">
            {CONTROLS.map((ctrl) => (
              <div
                key={ctrl.label}
                className="flex items-center gap-4 bg-white rounded-xl p-3 border border-amber-100"
              >
                <div className="text-[#FF8C42]">{ctrl.icon}</div>
                <div>
                  <p className="font-nunito font-bold text-[#3D2B1F]">{ctrl.label}</p>
                  <p className="font-nunito text-sm text-gray-500">{ctrl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF8F0] rounded-2xl p-6 border-2 border-amber-200">
          <h2 className="font-fredoka text-2xl text-[#5CC8FF] mb-4">物品图鉴</h2>
          <div className="grid gap-3">
            {ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-xl p-3 border border-amber-100"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-fredoka text-sm"
                  style={{ backgroundColor: item.color }}
                >
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-nunito font-bold text-[#3D2B1F]">
                    {item.name}
                    <span className="text-xs text-gray-400 ml-2">
                      关键词: {item.keywords.join('、')}
                    </span>
                  </p>
                  <p className="font-nunito text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
