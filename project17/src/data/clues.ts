import { Clue, ClueConnection } from '../types/game';

export const clues: Clue[] = [
  {
    id: 'clue-birthday',
    title: '生日记录',
    content: '在一张泛黄的纸上写着："她的生日：1965/08/23，永远的天使。"',
    relatedClues: ['clue-diary-3', 'clue-basement-door'],
    found: false,
  },
  {
    id: 'clue-diary-1',
    title: '日记片段',
    content: '"我把最重要的东西藏在了只有我们知道的地方。那个数字，是我们的开始..."',
    relatedClues: ['clue-photo', 'clue-safe'],
    found: false,
  },
  {
    id: 'clue-diary-2',
    title: '日记片段',
    content: '"医生说她的病越来越重了。我必须想办法，哪怕是违背常理..."',
    relatedClues: ['clue-newspaper'],
    found: false,
  },
  {
    id: 'clue-diary-3',
    title: '日记片段',
    content: '"地下室的密码，是她来到这个世界的日子。我永远不会忘记..."',
    relatedClues: ['clue-birthday', 'clue-basement-door'],
    found: false,
  },
  {
    id: 'clue-photo',
    title: '照片背面的字',
    content: '老照片背面写着："结婚纪念日 1987/03/15"。这是他们故事的开始。',
    relatedClues: ['clue-diary-1', 'clue-safe'],
    found: false,
  },
  {
    id: 'clue-newspaper',
    title: '旧报纸',
    content: '1987年的报纸头条："老宅火灾，女主人不幸身亡"。日期是1987年3月20日。',
    relatedClues: ['clue-diary-2'],
    found: false,
  },
  {
    id: 'clue-safe',
    title: '保险箱提示',
    content: '保险箱旁边刻着一行小字："我们的开始，四位数，月和日。"',
    relatedClues: ['clue-photo', 'clue-diary-1'],
    found: false,
  },
  {
    id: 'clue-basement-door',
    title: '地下室门',
    content: '地下室的门上有一个四位数密码锁。需要找到正确的密码。',
    relatedClues: ['clue-birthday', 'clue-diary-3'],
    found: false,
  },
  {
    id: 'clue-bookshelf',
    title: '书架的秘密',
    content: '书架上的书似乎有特定的排列顺序：《春》《夏》《秋》《冬》，但现在是乱的。',
    relatedClues: [],
    found: false,
  },
];

export const clueConnections: ClueConnection[] = [
  {
    from: 'clue-photo',
    to: 'clue-diary-1',
    result: '你发现日记中提到的"开始"指的就是结婚纪念日！保险箱的密码可能是 0315。',
    unlocks: {
      type: 'password',
      value: '0315',
    },
    discovered: false,
  },
  {
    from: 'clue-photo',
    to: 'clue-safe',
    result: '"我们的开始"就是结婚纪念日！保险箱密码是 0315（月+日）。',
    unlocks: {
      type: 'password',
      value: '0315',
    },
    discovered: false,
  },
  {
    from: 'clue-diary-1',
    to: 'clue-safe',
    result: '结合保险箱上的提示，密码应该是结婚纪念日：0315。',
    unlocks: {
      type: 'password',
      value: '0315',
    },
    discovered: false,
  },
  {
    from: 'clue-birthday',
    to: 'clue-diary-3',
    result: '"她来到这个世界的日子"就是她的生日！地下室密码应该是 0823。',
    unlocks: {
      type: 'password',
      value: '0823',
    },
    discovered: false,
  },
  {
    from: 'clue-birthday',
    to: 'clue-basement-door',
    result: '四位数生日密码：0823。试试看！',
    unlocks: {
      type: 'password',
      value: '0823',
    },
    discovered: false,
  },
  {
    from: 'clue-diary-3',
    to: 'clue-basement-door',
    result: '密码是她的生日，你需要先找到生日记录。',
    unlocks: {
      type: 'hint',
      value: '找找看有没有记录生日的线索。',
    },
    discovered: false,
  },
  {
    from: 'clue-diary-2',
    to: 'clue-newspaper',
    result: '原来女主人在火灾中去世了...这栋房子一定隐藏着什么秘密。',
    discovered: false,
  },
];

export const getClueById = (id: string): Clue | undefined => {
  return clues.find(clue => clue.id === id);
};

export const getConnectionBetween = (id1: string, id2: string): ClueConnection | undefined => {
  return clueConnections.find(
    conn => 
      (conn.from === id1 && conn.to === id2) || 
      (conn.from === id2 && conn.to === id1)
  );
};
