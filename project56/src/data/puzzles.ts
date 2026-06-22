import { Puzzle } from '../types/game';

export const puzzles: Record<string, Puzzle> = {
  safe_hall: {
    id: 'safe_hall',
    type: 'password',
    name: '大厅保险箱',
    description: '一个古老的保险箱，上面有一个三位数字密码锁。旁边刻着一行小字："午夜钟声敲响时，指针所指之处。"',
    solution: '1200',
    reward: 'key_bronze',
    hint: '看看大厅里的钟...',
  },
  
  cabinet_kitchen: {
    id: 'cabinet_kitchen',
    type: 'item_use',
    name: '上锁的橱柜',
    description: '一个紧锁的橱柜，需要一把钥匙才能打开。里面似乎藏着什么重要的东西。',
    solution: 'key_bronze',
    reward: 'mushroom_black',
    requiredItem: 'key_bronze',
    hint: '也许大厅里有什么能打开它。',
  },
  
  bookcase_study: {
    id: 'bookcase_study',
    type: 'sequence',
    name: '神秘书架',
    description: '一个塞满古书的书架，有几本书的书脊格外醒目。按正确的顺序抽出它们，也许会有什么发生...',
    solution: ['book_red', 'book_green', 'book_blue'],
    reward: 'key_silver',
    hint: '注意墙上那幅画里的颜色顺序...',
  },
  
  garden_gate: {
    id: 'garden_gate',
    type: 'password',
    name: '花园铁门',
    description: '一扇锈迹斑斑的铁门，上面有一个四字母的密码锁。门旁边刻着一朵玫瑰和一行字："以花之名将你封印。"',
    solution: 'ROSE',
    reward: 'rose_thorn',
    hint: '答案就藏在谜面里...',
  },
  
  cellar_door: {
    id: 'cellar_door',
    type: 'item_use',
    name: '地窖入口',
    description: '通往地窖的厚重木门，门上有一个银色的锁孔。',
    solution: 'key_silver',
    reward: 'sleeping_seeds',
    requiredItem: 'key_silver',
    hint: '需要一把银色的钥匙。',
  },

  mirror_room3: {
    id: 'mirror_room3',
    type: 'item_use',
    name: '诡异的镜子',
    description: '一面古老的镜子，镜面模糊不清。用什么东西擦一擦也许能看到什么...',
    solution: 'crow_feather',
    reward: 'key_gold',
    requiredItem: 'crow_feather',
    hint: '乌鸦的羽毛据说能擦净真相...',
  },

  golden_box: {
    id: 'golden_box',
    type: 'item_use',
    name: '金色宝盒',
    description: '一个精致的金色盒子，上面有一个金锁。里面似乎有什么东西在微微发光。',
    solution: 'key_gold',
    reward: 'truffle_white',
    requiredItem: 'key_gold',
    hint: '需要一把金色的钥匙。',
  },
};

export const getPuzzleById = (id: string): Puzzle | undefined => puzzles[id];
