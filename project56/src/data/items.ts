import { Item } from '../types/game';

export const items: Record<string, Item> = {
  // 基础物品
  key_bronze: {
    id: 'key_bronze',
    name: '青铜钥匙',
    description: '一把锈迹斑斑的青铜钥匙，上面刻着奇怪的符号。',
    icon: '🗝️',
  },
  key_silver: {
    id: 'key_silver',
    name: '银色钥匙',
    description: '一把精致的银色钥匙，散发着微弱的冷光。',
    icon: '🔑',
  },
  key_gold: {
    id: 'key_gold',
    name: '金色钥匙',
    description: '一把华丽的金色钥匙，镶嵌着微小的红宝石。',
    icon: '🔐',
  },
  note_torn: {
    id: 'note_torn',
    name: '撕碎的纸条',
    description: '一张被撕碎的纸条，上面写着："...晚餐...必须完美..."',
    icon: '📜',
  },
  candle: {
    id: 'candle',
    name: '蜡烛',
    description: '一根白色的蜡烛，还带着淡淡的蜂蜡香气。',
    icon: '🕯️',
  },
  matches: {
    id: 'matches',
    name: '火柴',
    description: '一盒木质火柴，画着诡异的骷髅图案。',
    icon: '🔥',
  },
  
  // 食材
  mushroom_black: {
    id: 'mushroom_black',
    name: '黑色蘑菇',
    description: '一朵散发着诡异气息的黑色蘑菇，据说有神奇的功效。',
    icon: '🍄',
  },
  rose_thorn: {
    id: 'rose_thorn',
    name: '带刺玫瑰',
    description: '一朵血红的玫瑰，锋利的刺上似乎还沾着什么。',
    icon: '🌹',
  },
  meat_mystery: {
    id: 'meat_mystery',
    name: '神秘肉块',
    description: '一块来源不明的肉，纹理...似乎不太寻常。',
    icon: '🥩',
  },
  truffle_white: {
    id: 'truffle_white',
    name: '白松露',
    description: '一颗珍贵的白松露，散发着浓郁的香气。',
    icon: '🥔',
  },
  sleeping_seeds: {
    id: 'sleeping_seeds',
    name: '安眠种子',
    description: '传说中能让人沉睡不醒的种子，碾碎后是淡紫色的粉末。',
    icon: '🌰',
  },
  wine_old: {
    id: 'wine_old',
    name: '陈酿红酒',
    description: '一瓶年代久远的红酒，瓶身上的标签已经模糊不清。',
    icon: '🍷',
  },
  egg_black: {
    id: 'egg_black',
    name: '黑鸟蛋',
    description: '一颗漆黑的鸟蛋，表面泛着诡异的油光。',
    icon: '🥚',
  },
  
  // 成品菜肴
  dish_truffle_meat: {
    id: 'dish_truffle_meat',
    name: '松露烤肉',
    description: '搭配白松露的精致烤肉，香气扑鼻...只是肉的来源有些可疑。',
    icon: '🍖',
  },
  dish_rose_salad: {
    id: 'dish_rose_salad',
    name: '毒玫瑰沙拉',
    description: '用带刺玫瑰花瓣制作的沙拉，妖艳而危险。',
    icon: '🥗',
  },
  dish_sleeping_pie: {
    id: 'dish_sleeping_pie',
    name: '安眠派',
    description: '加入了安眠种子的甜派，吃了会做一个...很长的梦。',
    icon: '🥧',
  },

  // 其他道具
  crow_feather: {
    id: 'crow_feather',
    name: '乌鸦羽毛',
    description: '一根漆黑的乌鸦羽毛，拿在手里感觉凉飕飕的。',
    icon: '🪶',
  },
  pocket_watch: {
    id: 'pocket_watch',
    name: '怀表',
    description: '一块停止的怀表，指针永远指着午夜十二点。',
    icon: '⏱️',
  },
  skull_small: {
    id: 'skull_small',
    name: '小骷髅',
    description: '一个手掌大小的骷髅摆件，眼眶里似乎有什么在动。',
    icon: '💀',
  },
};

export const getItemById = (id: string): Item | undefined => items[id];
