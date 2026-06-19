import type { Card, StatMeta } from "@/types";

export const STAT_META: Record<string, StatMeta> = {
  church: {
    key: "church",
    name: "教会",
    emoji: "⛪",
    color: "#8B5CF6",
    bgClass: "bg-purple-500",
    barClass: "bg-gradient-to-r from-purple-700 via-purple-500 to-violet-400",
    deathLow: "教会失去了所有信徒，宗教改革将你赶下王位……",
    deathHigh: "教会权力过大，教皇宣布你为异端，将你废黜……",
  },
  people: {
    key: "people",
    name: "人民",
    emoji: "👥",
    color: "#10B981",
    bgClass: "bg-emerald-500",
    barClass: "bg-gradient-to-r from-emerald-700 via-emerald-500 to-green-400",
    deathLow: "民不聊生，起义军攻破王宫，你被送上断头台……",
    deathHigh: "人民呼声过高，民主派议员逼迫你签署退位诏书……",
  },
  army: {
    key: "army",
    name: "军队",
    emoji: "⚔️",
    color: "#EF4444",
    bgClass: "bg-rose-500",
    barClass: "bg-gradient-to-r from-rose-700 via-rose-500 to-red-400",
    deathLow: "无兵可用，邻国大军压境，国破家亡……",
    deathHigh: "军权旁落，将军发动兵变，你被囚禁至死……",
  },
  wealth: {
    key: "wealth",
    name: "财富",
    emoji: "💰",
    color: "#F59E0B",
    bgClass: "bg-amber-500",
    barClass: "bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400",
    deathLow: "国库空虚，你因拖欠债务被贵族联手推翻……",
    deathHigh: "横征暴敛，人人欲得而诛之，你在宝库中被乱剑刺死……",
  },
};

export const CARDS: Card[] = [
  {
    id: "c001",
    title: "大主教求见",
    character: "红衣主教",
    emoji: "⛪",
    description: "大主教希望你能公开支持新教义，并捐赠国库的十分之一修缮大教堂。",
    leftChoice: {
      label: "拒绝捐款",
      effect: { church: -15, wealth: 8, people: 5 },
    },
    rightChoice: {
      label: "慷慨捐赠",
      effect: { church: 20, wealth: -18, army: -5 },
    },
  },
  {
    id: "c002",
    title: "丰收之年",
    character: "农业大臣",
    emoji: "🌾",
    description: "今年风调雨顺，粮食大丰收。是否开仓减税以收买民心？",
    leftChoice: {
      label: "照常征税",
      effect: { people: -12, wealth: 15 },
    },
    rightChoice: {
      label: "减免赋税",
      effect: { people: 18, wealth: -10, church: 5 },
    },
  },
  {
    id: "c003",
    title: "边境告急",
    character: "大将军",
    emoji: "🛡️",
    description: "北方蛮族屡屡骚扰边境，将军要求增兵并扩充军费。",
    leftChoice: {
      label: "和谈绥靖",
      effect: { army: -15, wealth: 10, people: -8 },
    },
    rightChoice: {
      label: "全力备战",
      effect: { army: 20, wealth: -18, people: -10 },
    },
  },
  {
    id: "c004",
    title: "金矿发现",
    character: "探险队",
    emoji: "⛏️",
    description: "西部山区发现一座金矿，但需投入大量资金开采。",
    leftChoice: {
      label: "谨慎搁置",
      effect: { wealth: 5, people: 5 },
    },
    rightChoice: {
      label: "大举开采",
      effect: { wealth: 25, people: -15, army: -5 },
    },
  },
  {
    id: "c005",
    title: "异端审判",
    character: "宗教法庭",
    emoji: "🔥",
    description: "宗教法庭指控一名贵族为异端，要求你批准处以火刑。",
    leftChoice: {
      label: "拒绝处决",
      effect: { church: -18, people: 10, wealth: 5 },
    },
    rightChoice: {
      label: "批准火刑",
      effect: { church: 18, people: -15, army: 5 },
    },
  },
  {
    id: "c006",
    title: "瘟疫蔓延",
    character: "御医",
    emoji: "🦠",
    description: "首都爆发瘟疫，需要从国库拨款购买药材并隔离患者。",
    leftChoice: {
      label: "封锁消息",
      effect: { people: -22, wealth: 5, church: -8 },
    },
    rightChoice: {
      label: "全力救治",
      effect: { people: 20, wealth: -20, army: -5 },
    },
  },
  {
    id: "c007",
    title: "贵族逼宫",
    character: "议会代表",
    emoji: "🏰",
    description: "大贵族们要求你签署《大宪章》，限制王权并交出部分税收权。",
    leftChoice: {
      label: "断然拒绝",
      effect: { wealth: 10, army: 10, people: -18 },
    },
    rightChoice: {
      label: "妥协签字",
      effect: { wealth: -15, people: 20, church: 5 },
    },
  },
  {
    id: "c008",
    title: "公主婚事",
    character: "外交使臣",
    emoji: "👑",
    description: "邻国王子前来提亲，联姻可换取和平，但嫁妆不菲。",
    leftChoice: {
      label: "拒绝联姻",
      effect: { army: -10, church: -5, people: 8 },
    },
    rightChoice: {
      label: "风光出嫁",
      effect: { army: 15, wealth: -20, church: 10 },
    },
  },
  {
    id: "c009",
    title: "修建宫殿",
    character: "宫廷建筑师",
    emoji: "🏛️",
    description: "建筑师提议扩建王宫，以彰显国威，但耗资巨大。",
    leftChoice: {
      label: "维持现状",
      effect: { wealth: 10, people: 8 },
    },
    rightChoice: {
      label: "大兴土木",
      effect: { wealth: -22, church: -5, army: 10, people: -10 },
    },
  },
  {
    id: "c010",
    title: "海盗袭扰",
    character: "海军司令",
    emoji: "⚓",
    description: "海盗频繁劫掠商船，海军司令要求拨款建造新战舰。",
    leftChoice: {
      label: "花钱消灾",
      effect: { wealth: -10, army: -8, people: -5 },
    },
    rightChoice: {
      label: "组建舰队",
      effect: { wealth: -18, army: 20, people: 10 },
    },
  },
  {
    id: "c011",
    title: "农民暴动",
    character: "地方官员",
    emoji: "🔨",
    description: "东部农民因赋税过重发动暴动，是派兵镇压还是安抚？",
    leftChoice: {
      label: "血腥镇压",
      effect: { army: 10, people: -25, wealth: 8 },
    },
    rightChoice: {
      label: "减税安抚",
      effect: { people: 22, wealth: -12, army: -8 },
    },
  },
  {
    id: "c012",
    title: "十字军东征",
    character: "教皇使者",
    emoji: "✝️",
    description: "教皇号召各国组建十字军，你是否响应号召派兵出征？",
    leftChoice: {
      label: "婉拒出兵",
      effect: { church: -20, army: 5, wealth: 10 },
    },
    rightChoice: {
      label: "御驾亲征",
      effect: { church: 25, army: -15, wealth: -20, people: -8 },
    },
  },
  {
    id: "c013",
    title: "学者新论",
    character: "皇家学院",
    emoji: "📜",
    description: "学者提出日心说，教会斥为异端，要求你禁止其研究。",
    leftChoice: {
      label: "支持学者",
      effect: { church: -18, people: 10, wealth: 5 },
    },
    rightChoice: {
      label: "查禁著作",
      effect: { church: 18, people: -10, wealth: -5 },
    },
  },
  {
    id: "c014",
    title: "铸造新币",
    character: "财政大臣",
    emoji: "🪙",
    description: "财政大臣建议降低货币含金量以弥补国库亏空。",
    leftChoice: {
      label: "保持币值",
      effect: { wealth: -8, people: 8, church: 5 },
    },
    rightChoice: {
      label: "通货膨胀",
      effect: { wealth: 22, people: -18, army: -5 },
    },
  },
  {
    id: "c015",
    title: "将军凯旋",
    character: "凯旋将军",
    emoji: "🏆",
    description: "将军大胜而归，声望如日中天，是否赏赐封地？",
    leftChoice: {
      label: "明升暗降",
      effect: { army: -15, wealth: 5, church: 8 },
    },
    rightChoice: {
      label: "大加封赏",
      effect: { army: 20, wealth: -15, people: -8 },
    },
  },
  {
    id: "c016",
    title: "孤儿救济",
    character: "修道院院长",
    emoji: "🧒",
    description: "战争孤儿流离失所，修道院请求拨款建立孤儿院。",
    leftChoice: {
      label: "无力资助",
      effect: { church: -8, people: -12, wealth: 8 },
    },
    rightChoice: {
      label: "大力捐助",
      effect: { church: 12, people: 18, wealth: -15 },
    },
  },
  {
    id: "c017",
    title: "商路开通",
    character: "商会会长",
    emoji: "🐫",
    description: "商会提议出资开辟东方商路，但需军队保护商队。",
    leftChoice: {
      label: "暂缓开拓",
      effect: { wealth: 5, army: 5 },
    },
    rightChoice: {
      label: "全力支持",
      effect: { wealth: 25, army: -12, people: 8 },
    },
  },
  {
    id: "c018",
    title: "阴谋败露",
    character: "秘密警察",
    emoji: "🕵️",
    description: "破获一起刺杀你的阴谋，主谋是一位手握兵权的亲王。",
    leftChoice: {
      label: "秘密处决",
      effect: { army: -12, church: -8, people: 8 },
    },
    rightChoice: {
      label: "公开审判",
      effect: { army: -18, church: 10, people: 15, wealth: 8 },
    },
  },
  {
    id: "c019",
    title: "新酒税法",
    character: "税务官",
    emoji: "🍷",
    description: "对贵族的葡萄园征收新税，可大幅增加收入。",
    leftChoice: {
      label: "取消议案",
      effect: { wealth: -5, church: 10, army: 8 },
    },
    rightChoice: {
      label: "强制推行",
      effect: { wealth: 18, church: -10, army: -10, people: 10 },
    },
  },
  {
    id: "c020",
    title: "皇子降生",
    character: "王后",
    emoji: "👶",
    description: "王后诞下龙子，举办满月庆典可大大增加王室威望。",
    leftChoice: {
      label: "简朴庆祝",
      effect: { wealth: 5, people: -5, church: 5 },
    },
    rightChoice: {
      label: "举国欢庆",
      effect: { wealth: -18, people: 20, church: 12, army: 5 },
    },
  },
  {
    id: "c021",
    title: "蛮族进贡",
    character: "蛮族使者",
    emoji: "🐺",
    description: "昔日敌国派使者前来进贡，但要求娶一位王室公主和亲。",
    leftChoice: {
      label: "拒绝羞辱",
      effect: { army: 15, church: 5, wealth: -10, people: 8 },
    },
    rightChoice: {
      label: "接受和亲",
      effect: { army: -5, wealth: 20, people: -8, church: 8 },
    },
  },
  {
    id: "c022",
    title: "皇家狩猎",
    character: "狩猎总管",
    emoji: "🏹",
    description: "狩猎季到来，举办大型狩猎大会可彰显尚武精神。",
    leftChoice: {
      label: "取消狩猎",
      effect: { army: -8, wealth: 8, people: 10 },
    },
    rightChoice: {
      label: "隆重大办",
      effect: { army: 15, wealth: -12, church: -5, people: -5 },
    },
  },
  {
    id: "c023",
    title: "修道院土地",
    character: "地方领主",
    emoji: "🗺️",
    description: "领主指控修道院侵占私产，要求你出面裁决。",
    leftChoice: {
      label: "支持领主",
      effect: { church: -15, wealth: 10, army: 10 },
    },
    rightChoice: {
      label: "支持教会",
      effect: { church: 18, wealth: -8, people: -8 },
    },
  },
  {
    id: "c024",
    title: "大学建校",
    character: "饱学之士",
    emoji: "🎓",
    description: "学者们请求拨款建立王国第一所大学。",
    leftChoice: {
      label: "经费紧张",
      effect: { wealth: 5, church: 5, people: -12 },
    },
    rightChoice: {
      label: "慷慨解囊",
      effect: { wealth: -20, people: 18, church: 10, army: -5 },
    },
  },
  {
    id: "c025",
    title: "黑市交易",
    character: "情报官",
    emoji: "🗡️",
    description: "情报官抓获一批走私犯，货物可充公，但涉及某位重臣。",
    leftChoice: {
      label: "严格执法",
      effect: { wealth: 12, people: 15, army: -10 },
    },
    rightChoice: {
      label: "私下摆平",
      effect: { wealth: 20, people: -12, church: -8 },
    },
  },
  {
    id: "c026",
    title: "圣物归还",
    character: "修道院长",
    emoji: "🩸",
    description: "传说中的圣物被寻回，举办盛大仪式可大大提升教会威望。",
    leftChoice: {
      label: "低调供奉",
      effect: { church: 8, wealth: 5 },
    },
    rightChoice: {
      label: "举国朝圣",
      effect: { church: 25, wealth: -15, people: 10, army: -8 },
    },
  },
  {
    id: "c027",
    title: "老兵抚恤",
    character: "退伍老兵",
    emoji: "🎖️",
    description: "一批伤残老兵跪在宫前请求发放拖欠的军饷。",
    leftChoice: {
      label: "驱散老兵",
      effect: { army: -22, wealth: 5, people: -12 },
    },
    rightChoice: {
      label: "补发军饷",
      effect: { army: 22, wealth: -18, people: 12 },
    },
  },
  {
    id: "c028",
    title: "运河开凿",
    character: "工程师",
    emoji: "🚣",
    description: "开凿南北大运河可促进贸易，但需征用大量民力。",
    leftChoice: {
      label: "暂不开工",
      effect: { wealth: 8, people: 10, army: 5 },
    },
    rightChoice: {
      label: "立即开工",
      effect: { wealth: -22, people: -18, church: 5, army: 15 },
    },
  },
  {
    id: "c029",
    title: "女巫审判",
    character: "猎巫人",
    emoji: "🧙",
    description: "猎巫人指控村中多名女子为女巫，要求你批准烧死她们。",
    leftChoice: {
      label: "禁止猎巫",
      effect: { church: -15, people: 15, army: 5 },
    },
    rightChoice: {
      label: "批准火刑",
      effect: { church: 20, people: -18, wealth: 8 },
    },
  },
  {
    id: "c030",
    title: "加冕五十周年",
    character: "典礼官",
    emoji: "🎊",
    description: "你的加冕五十周年庆典即将到来，举办何种规模？",
    leftChoice: {
      label: "一切从简",
      effect: { wealth: 10, church: 5, people: -8 },
    },
    rightChoice: {
      label: "普天同庆",
      effect: { wealth: -25, church: 15, people: 20, army: 10 },
    },
  },
  {
    id: "c031",
    title: "雇佣兵团",
    character: "佣兵队长",
    emoji: "💰",
    description: "著名的佣兵队长愿为你效力，但佣金昂贵。",
    leftChoice: {
      label: "不用外兵",
      effect: { wealth: 10, army: -8, church: 8 },
    },
    rightChoice: {
      label: "重金雇佣",
      effect: { wealth: -20, army: 25, people: -5 },
    },
  },
  {
    id: "c032",
    title: "通商条约",
    character: "外国商人",
    emoji: "🤝",
    description: "邻国希望与你签订通商条约，给予对方最惠国待遇。",
    leftChoice: {
      label: "贸易保护",
      effect: { wealth: -5, people: 10, army: 5 },
    },
    rightChoice: {
      label: "开放市场",
      effect: { wealth: 22, people: -8, church: 5 },
    },
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
