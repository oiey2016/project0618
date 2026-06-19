import { X, BookOpen, Church, Users, Swords, Coins } from "lucide-react";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function RulesModal({ open, onClose }: RulesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md max-h-[85vh] animate-bounceIn">
        <div className="relative ornate-border bg-parchment rounded-[24px] shadow-card overflow-hidden flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between p-5 md:p-6 pb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-900 ring-2 ring-gold-500/50 flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-gold-300" strokeWidth={1.8} />
              </div>
              <h2 className="font-display text-xl md:text-2xl font-black text-ink-900 tracking-wider">
                游戏规则
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-ink-900/10 hover:bg-ink-900/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-ink-700" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 md:px-6 pb-6">
            <div className="space-y-5">
              <section>
                <h3 className="font-display text-sm font-black text-royal-700 tracking-widest uppercase mb-2">
                  王的使命
                </h3>
                <p className="text-ink-700 text-sm leading-relaxed font-body">
                  你是一位中世纪的国王，需要在各方势力之间权衡抉择。每张卡牌代表一个事件，你必须做出选择——左滑拒绝，右滑应允。每一个决定都会影响四大势力的平衡。
                </p>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-gold-700/30 to-transparent" />

              <section>
                <h3 className="font-display text-sm font-black text-royal-700 tracking-widest uppercase mb-3">
                  四大势力
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                      <Church className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 text-sm">教会</div>
                      <div className="text-ink-700 text-xs leading-relaxed mt-0.5">
                        宗教势力的影响力。教会过低则信仰崩塌，过高则教权凌驾王权。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 text-sm">人民</div>
                      <div className="text-ink-700 text-xs leading-relaxed mt-0.5">
                        民众对你的支持度。民怨沸腾将引爆革命，民意过盛则民主倒逼退位。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shrink-0">
                      <Swords className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-bold text-rose-900 text-sm">军队</div>
                      <div className="text-ink-700 text-xs leading-relaxed mt-0.5">
                        军事力量的忠诚度。军力空虚则外敌入侵，军权过重则兵变夺权。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                      <Coins className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 text-sm">财富</div>
                      <div className="text-ink-700 text-xs leading-relaxed mt-0.5">
                        国库的充盈程度。国库见底则债台高筑，横征暴敛则民怨沸腾。
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-gold-700/30 to-transparent" />

              <section>
                <h3 className="font-display text-sm font-black text-royal-700 tracking-widest uppercase mb-2">
                  覆灭条件
                </h3>
                <div className="p-3 rounded-xl bg-rose-900/10 ring-1 ring-rose-900/20">
                  <p className="text-ink-700 text-sm leading-relaxed font-body">
                    任何一项势力数值<strong className="text-rose-900">降至 0</strong> 或<strong className="text-rose-900">飙升至 100</strong>，你的统治即宣告终结。数值进入危险区（≤20 或 ≥80）时，进度条会闪烁警示。
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-display text-sm font-black text-royal-700 tracking-widest uppercase mb-2">
                  操作方式
                </h3>
                <div className="space-y-2 text-sm text-ink-700 font-body">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100/70 text-rose-900 text-xs font-bold ring-1 ring-rose-700/20">
                      ◀ 左滑
                    </span>
                    <span>或点击红色「拒绝」按钮</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900 text-xs font-bold ring-1 ring-emerald-700/20">
                      右滑 ▶
                    </span>
                    <span>或点击绿色「应允」按钮</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
