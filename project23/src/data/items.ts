export interface ItemPhysics {
  isStatic: boolean
  density: number
  friction: number
  restitution: number
  buoyancy?: number
  windForce?: number
}

export interface ItemDefinition {
  id: string
  name: string
  keywords: string[]
  width: number
  height: number
  color: string
  physics: ItemPhysics
  drawStyle: 'rect' | 'circle' | 'triangle' | 'custom'
  description: string
}

export const ITEMS: ItemDefinition[] = [
  {
    id: 'box',
    name: '箱子',
    keywords: ['箱子', 'box', '木箱', '方块'],
    width: 60,
    height: 60,
    color: '#A0522D',
    physics: {
      isStatic: false,
      density: 0.005,
      friction: 0.6,
      restitution: 0.1,
    },
    drawStyle: 'rect',
    description: '结实耐用的木箱，可以垫脚或堆叠',
  },
  {
    id: 'balloon',
    name: '气球',
    keywords: ['气球', 'balloon', '热气球', '飞球'],
    width: 40,
    height: 50,
    color: '#FF6B6B',
    physics: {
      isStatic: false,
      density: 0.001,
      friction: 0.1,
      restitution: 0.8,
      buoyancy: 0.003,
    },
    drawStyle: 'circle',
    description: '轻盈的气球，可以飘向空中',
  },
  {
    id: 'spring',
    name: '弹簧',
    keywords: ['弹簧', 'spring', '蹦床', '弹跳'],
    width: 50,
    height: 30,
    color: '#FFD700',
    physics: {
      isStatic: false,
      density: 0.003,
      friction: 0.8,
      restitution: 1.5,
    },
    drawStyle: 'custom',
    description: '弹性十足的弹簧，可以弹飞物体',
  },
  {
    id: 'bridge',
    name: '桥',
    keywords: ['桥', 'bridge', '木板', '桥梁'],
    width: 120,
    height: 15,
    color: '#DEB887',
    physics: {
      isStatic: false,
      density: 0.002,
      friction: 0.7,
      restitution: 0.05,
    },
    drawStyle: 'rect',
    description: '长条木板，可以架在缝隙上当桥',
  },
  {
    id: 'wall',
    name: '墙',
    keywords: ['墙', 'wall', '墙壁', '挡板'],
    width: 20,
    height: 100,
    color: '#808080',
    physics: {
      isStatic: true,
      density: 0,
      friction: 0.8,
      restitution: 0.05,
    },
    drawStyle: 'rect',
    description: '坚固的墙壁，可以阻挡物体移动',
  },
  {
    id: 'fan',
    name: '风扇',
    keywords: ['风扇', 'fan', '吹风机', '风'],
    width: 50,
    height: 50,
    color: '#4FC3F7',
    physics: {
      isStatic: true,
      density: 0,
      friction: 0,
      restitution: 0,
      windForce: 0.002,
    },
    drawStyle: 'triangle',
    description: '强力风扇，可以吹动附近的物体',
  },
  {
    id: 'ice',
    name: '冰块',
    keywords: ['冰块', 'ice', '冰', '冰砖'],
    width: 60,
    height: 60,
    color: '#B3E5FC',
    physics: {
      isStatic: false,
      density: 0.004,
      friction: 0.02,
      restitution: 0.3,
    },
    drawStyle: 'rect',
    description: '光滑的冰块，表面非常滑',
  },
]

export function getItemByKeyword(keyword: string): ItemDefinition | undefined {
  return ITEMS.find((item) =>
    item.keywords.some((k) => k.toLowerCase() === keyword.toLowerCase())
  )
}
