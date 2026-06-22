import { Guest, Dish } from '../types/game';

export const guests: Record<string, Guest> = {
  guest_boar: {
    id: 'guest_boar',
    name: '野猪先生',
    roomId: 'room1',
    description: '一位身材魁梧的客人，穿着昂贵的西装，但眼神中透着贪婪。',
    portrait: '🐗',
    dialogue: [
      '哼...今晚的晚餐是什么？',
      '我只吃最好的东西，明白吗？',
      '快把晚餐端上来，别让我等太久！',
    ],
    servedDialogue: [
      '唔...这道菜闻起来不错...',
      '让我尝尝...嗯...味道...很...特别...',
      '我感觉...有点...困...',
    ],
    requiredDish: 'dish_truffle_meat',
    served: false,
  },
  
  guest_peacock: {
    id: 'guest_peacock',
    name: '孔雀夫人',
    roomId: 'room2',
    description: '一位打扮华丽的女士，总是带着挑剔的眼光审视一切。',
    portrait: '🦚',
    dialogue: [
      '哎呀，这地方真是...不够雅致。',
      '晚餐必须是最精致的，我只吃最美味的食物。',
      '希望厨师的手艺配得上我的身份。',
    ],
    servedDialogue: [
      '这道菜...看起来倒是挺漂亮的...',
      '让我尝尝看...嗯...颜色...很鲜艳...',
      '我的头...怎么...有点晕...',
    ],
    requiredDish: 'dish_rose_salad',
    served: false,
  },
  
  guest_pigeon: {
    id: 'guest_pigeon',
    name: '鸽子小姐',
    roomId: 'room3',
    description: '一位神色忧郁的年轻女子，似乎总是睡不醒的样子。',
    portrait: '🕊️',
    dialogue: [
      '...我好困...但总是睡不着...',
      '晚餐...随便什么都好...',
      '如果能让我好好睡一觉就好了...',
    ],
    servedDialogue: [
      '这是...甜派？闻起来...好香...',
      '让我吃一口...嗯...好甜...好困...',
      '终于...可以...睡了...',
    ],
    requiredDish: 'dish_sleeping_pie',
    served: false,
  },
};

export const dishes: Record<string, Dish> = {
  dish_truffle_meat: {
    id: 'dish_truffle_meat',
    name: '松露烤肉',
    description: '搭配白松露的精致烤肉，香气扑鼻...只是肉的来源有些可疑。',
    ingredients: ['meat_mystery', 'truffle_white'],
    icon: '🍖',
  },
  dish_rose_salad: {
    id: 'dish_rose_salad',
    name: '毒玫瑰沙拉',
    description: '用带刺玫瑰花瓣制作的沙拉，妖艳而危险。',
    ingredients: ['rose_thorn', 'mushroom_black'],
    icon: '🥗',
  },
  dish_sleeping_pie: {
    id: 'dish_sleeping_pie',
    name: '安眠派',
    description: '加入了安眠种子的甜派，吃了会做一个...很长的梦。',
    ingredients: ['sleeping_seeds', 'egg_black'],
    icon: '🥧',
  },
};

export const getGuestById = (id: string): Guest | undefined => guests[id];
export const getDishById = (id: string): Dish | undefined => dishes[id];
