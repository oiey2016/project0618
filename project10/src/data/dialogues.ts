export interface ChatMessage {
  id: string
  characterId: string
  content: string
  type: 'npc' | 'system'
  suspicionId?: string
  delay: number
  groupId: string
  order: number
}

export interface ChatOption {
  id: string
  groupId: string
  text: string
  nextGroupId: string
  unlockNoteId?: string
  triggerSuspicionId?: string
  order: number
}

export interface DialogueGroup {
  id: string
  characterId: string
  messages: ChatMessage[]
  options: ChatOption[]
}

export const dialogueGroups: DialogueGroup[] = [

  {
    id: 'lin-g1',
    characterId: 'lin-xiaoyu',
    messages: [
      { id: 'lin-m1-1', characterId: 'lin-xiaoyu', content: '你好……你是来调查爸爸的事的吧', type: 'npc', delay: 1200, groupId: 'lin-g1', order: 1 },
      { id: 'lin-m1-2', characterId: 'lin-xiaoyu', content: '我还在学校，接到电话就赶回来了。到现在都像做梦一样', type: 'npc', delay: 2000, groupId: 'lin-g1', order: 2 }
    ],
    options: [
      { id: 'lin-o1-1', groupId: 'lin-g1', text: '节哀顺变，你和父亲关系怎么样？', nextGroupId: 'lin-g2', unlockNoteId: 'note-lin-1', order: 1 },
      { id: 'lin-o1-2', groupId: 'lin-g1', text: '你是什么时候知道出事的？', nextGroupId: 'lin-g3', order: 2 },
      { id: 'lin-o1-3', groupId: 'lin-g1', text: '先别急，慢慢说', nextGroupId: 'lin-g2', order: 3 }
    ]
  },
  {
    id: 'lin-g2',
    characterId: 'lin-xiaoyu',
    messages: [
      { id: 'lin-m2-1', characterId: 'lin-xiaoyu', content: '我和爸爸……怎么说呢， complicated', type: 'npc', delay: 1500, groupId: 'lin-g2', order: 1 },
      { id: 'lin-m2-2', characterId: 'lin-xiaoyu', content: '自从妈妈走了以后，他就像变了一个人，整天把自己关在画室里', type: 'npc', delay: 2000, groupId: 'lin-g2', order: 2 },
      { id: 'lin-m2-3', characterId: 'lin-xiaoyu', content: '我知道他是爱我的，只是不知道怎么表达', type: 'npc', delay: 1800, groupId: 'lin-g2', order: 3 }
    ],
    options: [
      { id: 'lin-o2-1', groupId: 'lin-g2', text: '听说你父亲想修改遗嘱？', nextGroupId: 'lin-g3', triggerSuspicionId: 'sus-4', order: 1 },
      { id: 'lin-o2-2', groupId: 'lin-g2', text: '他的画室平时都有谁去？', nextGroupId: 'lin-g4', order: 2 }
    ]
  },
  {
    id: 'lin-g3',
    characterId: 'lin-xiaoyu',
    messages: [
      { id: 'lin-m3-1', characterId: 'lin-xiaoyu', content: '……你怎么知道的？', type: 'npc', delay: 2000, groupId: 'lin-g3', order: 1 },
      { id: 'lin-m3-2', characterId: 'lin-xiaoyu', content: '没错，他是想改遗嘱。把大部分财产捐出去，只给我留一小部分', type: 'npc', delay: 2500, groupId: 'lin-g3', order: 2, suspicionId: 'sus-4' },
      { id: 'lin-m3-3', characterId: 'lin-xiaoyu', content: '但我不是因为这个才……我是他女儿啊', type: 'npc', delay: 1800, groupId: 'lin-g3', order: 3 }
    ],
    options: [
      { id: 'lin-o3-1', groupId: 'lin-g3', text: '你听到遗嘱的事之后，有什么反应？', nextGroupId: 'lin-g4', unlockNoteId: 'note-lin-2', order: 1 },
      { id: 'lin-o3-2', groupId: 'lin-g3', text: '出事那晚你在哪里？', nextGroupId: 'lin-g4', order: 2 }
    ]
  },
  {
    id: 'lin-g4',
    characterId: 'lin-xiaoyu',
    messages: [
      { id: 'lin-m4-1', characterId: 'lin-xiaoyu', content: '那天晚上我在家，大约十一点的时候听到画室那边有动静', type: 'npc', delay: 2000, groupId: 'lin-g4', order: 1 },
      { id: 'lin-m4-2', characterId: 'lin-xiaoyu', content: '我往那边看了一眼，灯是亮的，好像还有一个人影', type: 'npc', delay: 2200, groupId: 'lin-g4', order: 2 },
      { id: 'lin-m4-3', characterId: 'lin-xiaoyu', content: '但我没有过去……如果那时候我去了，也许爸爸就不会死', type: 'npc', delay: 2500, groupId: 'lin-g4', order: 3 }
    ],
    options: [
      { id: 'lin-o4-1', groupId: 'lin-g4', text: '你看到的那个人影是谁？', nextGroupId: 'lin-g5', unlockNoteId: 'note-lin-3', order: 1 },
      { id: 'lin-o4-2', groupId: 'lin-g4', text: '你为什么没有过去看看？', nextGroupId: 'lin-g5', order: 2 }
    ]
  },
  {
    id: 'lin-g5',
    characterId: 'lin-xiaoyu',
    messages: [
      { id: 'lin-m5-1', characterId: 'lin-xiaoyu', content: '我没看清，以为是赵叔叔，他经常来找爸爸', type: 'npc', delay: 1500, groupId: 'lin-g5', order: 1 },
      { id: 'lin-m5-2', characterId: 'lin-xiaoyu', content: '我……不太想继续说了。如果你要查，去找其他人吧。我只是个失去父亲的女儿', type: 'npc', delay: 2000, groupId: 'lin-g5', order: 2 }
    ],
    options: [
      { id: 'lin-o5-1', groupId: 'lin-g5', text: '好的，感谢你的配合', nextGroupId: 'lin-g1', order: 1 }
    ]
  },

  {
    id: 'zhao-g1',
    characterId: 'zhao-minghui',
    messages: [
      { id: 'zhao-m1-1', characterId: 'zhao-minghui', content: '你好你好，我是远舟的经纪人赵明辉，跟了他十八年了', type: 'npc', delay: 1000, groupId: 'zhao-g1', order: 1 },
      { id: 'zhao-m1-2', characterId: 'zhao-minghui', content: '我跟远舟是多年的老交情了，他的事就是我的事', type: 'npc', delay: 1800, groupId: 'zhao-g1', order: 2 }
    ],
    options: [
      { id: 'zhao-o1-1', groupId: 'zhao-g1', text: '案发当晚你在哪里？', nextGroupId: 'zhao-g2', order: 1 },
      { id: 'zhao-o1-2', groupId: 'zhao-g1', text: '你和林远舟最近有什么业务往来？', nextGroupId: 'zhao-g3', unlockNoteId: 'note-zhao-1', order: 2 },
      { id: 'zhao-o1-3', groupId: 'zhao-g1', text: '你对画室的情况了解吗？', nextGroupId: 'zhao-g2', order: 3 }
    ]
  },
  {
    id: 'zhao-g2',
    characterId: 'zhao-minghui',
    messages: [
      { id: 'zhao-m2-1', characterId: 'zhao-minghui', content: '那天晚上？我在家看电视，九点就睡了', type: 'npc', delay: 1500, groupId: 'zhao-g2', order: 1 },
      { id: 'zhao-m2-2', characterId: 'zhao-minghui', content: '我根本没去过画室，远舟晚上创作的时候不喜欢有人打扰', type: 'npc', delay: 2000, groupId: 'zhao-g2', order: 2, suspicionId: 'sus-1' },
      { id: 'zhao-m2-3', characterId: 'zhao-minghui', content: '你要相信我，我绝对没有去过', type: 'npc', delay: 1500, groupId: 'zhao-g2', order: 3 }
    ],
    options: [
      { id: 'zhao-o2-1', groupId: 'zhao-g2', text: '你确定？听说画室窗户下面发现了脚印', nextGroupId: 'zhao-g4', triggerSuspicionId: 'sus-1', unlockNoteId: 'note-zhao-2', order: 1 },
      { id: 'zhao-o2-2', groupId: 'zhao-g2', text: '你手机定位那晚有段空白期', nextGroupId: 'zhao-g5', triggerSuspicionId: 'sus-7', order: 2 }
    ]
  },
  {
    id: 'zhao-g3',
    characterId: 'zhao-minghui',
    messages: [
      { id: 'zhao-m3-1', characterId: 'zhao-minghui', content: '业务往来就是那些拍卖啊展览啊，远舟的作品一直很抢手', type: 'npc', delay: 1500, groupId: 'zhao-g3', order: 1 },
      { id: 'zhao-m3-2', characterId: 'zhao-minghui', content: '去年秋拍成绩不错，三幅画总共拍了八百多万', type: 'npc', delay: 2000, groupId: 'zhao-g3', order: 2 }
    ],
    options: [
      { id: 'zhao-o3-1', groupId: 'zhao-g3', text: '拍卖款都到林远舟账户了吗？', nextGroupId: 'zhao-g4', triggerSuspicionId: 'sus-5', order: 1 },
      { id: 'zhao-o3-2', groupId: 'zhao-g3', text: '你对画室很熟悉吧？', nextGroupId: 'zhao-g2', order: 2 },
      { id: 'zhao-o3-3', groupId: 'zhao-g3', text: '继续聊聊最近的事', nextGroupId: 'zhao-g4', order: 3 }
    ]
  },
  {
    id: 'zhao-g4',
    characterId: 'zhao-minghui',
    messages: [
      { id: 'zhao-m4-1', characterId: 'zhao-minghui', content: '这个问题……涉及到一些商业机密，不太方便说', type: 'npc', delay: 2000, groupId: 'zhao-g4', order: 1 },
      { id: 'zhao-m4-2', characterId: 'zhao-minghui', content: '我只是个经纪人，该我赚的佣金我赚了，其他的我不清楚', type: 'npc', delay: 2200, groupId: 'zhao-g4', order: 2, suspicionId: 'sus-5' },
      { id: 'zhao-m4-3', characterId: 'zhao-minghui', content: '你别盯着我问，我真的很忙，还要处理远舟的身后事', type: 'npc', delay: 1800, groupId: 'zhao-g4', order: 3 }
    ],
    options: [
      { id: 'zhao-o4-1', groupId: 'zhao-g4', text: '拍卖行转账记录和你说的不一样', nextGroupId: 'zhao-g5', unlockNoteId: 'note-zhao-3', order: 1 },
      { id: 'zhao-o4-2', groupId: 'zhao-g4', text: '你还有什么要补充的吗？', nextGroupId: 'zhao-g5', order: 2 }
    ]
  },
  {
    id: 'zhao-g5',
    characterId: 'zhao-minghui',
    messages: [
      { id: 'zhao-m5-1', characterId: 'zhao-minghui', content: '我没什么好说的了，我跟远舟的交情不是你们能理解的', type: 'npc', delay: 1500, groupId: 'zhao-g5', order: 1 },
      { id: 'zhao-m5-2', characterId: 'zhao-minghui', content: '你要是没别的事，我先走了。远舟的画还需要我处理', type: 'npc', delay: 2000, groupId: 'zhao-g5', order: 2 }
    ],
    options: [
      { id: 'zhao-o5-1', groupId: 'zhao-g5', text: '好的，有需要再联系你', nextGroupId: 'zhao-g1', order: 1 }
    ]
  },

  {
    id: 'su-g1',
    characterId: 'su-wanqing',
    messages: [
      { id: 'su-m1-1', characterId: 'su-wanqing', content: '你是来调查远舟的事的？', type: 'npc', delay: 1500, groupId: 'su-g1', order: 1 },
      { id: 'su-m1-2', characterId: 'su-wanqing', content: '我刚从法国回来没几天，没想到就发生了这种事', type: 'npc', delay: 2000, groupId: 'su-g1', order: 2 }
    ],
    options: [
      { id: 'su-o1-1', groupId: 'su-g1', text: '你为什么回国？', nextGroupId: 'su-g2', order: 1 },
      { id: 'su-o1-2', groupId: 'su-g1', text: '你和林远舟的关系是？', nextGroupId: 'su-g3', unlockNoteId: 'note-su-1', order: 2 },
      { id: 'su-o1-3', groupId: 'su-g1', text: '案发当晚你在哪？', nextGroupId: 'su-g2', order: 3 }
    ]
  },
  {
    id: 'su-g2',
    characterId: 'su-wanqing',
    messages: [
      { id: 'su-m2-1', characterId: 'su-wanqing', content: '我回国……是想看看远舟，毕竟曾经夫妻一场', type: 'npc', delay: 1800, groupId: 'su-g2', order: 1 },
      { id: 'su-m2-2', characterId: 'su-wanqing', content: '我在法国听说他身体不太好，就想回来看看', type: 'npc', delay: 2200, groupId: 'su-g2', order: 2, suspicionId: 'sus-2' },
      { id: 'su-m2-3', characterId: 'su-wanqing', content: '我回来得太晚了……', type: 'npc', delay: 1500, groupId: 'su-g2', order: 3 }
    ],
    options: [
      { id: 'su-o2-1', groupId: 'su-g2', text: '你回国的时间恰好和他想改遗嘱的时间重合', nextGroupId: 'su-g3', triggerSuspicionId: 'sus-2', order: 1 },
      { id: 'su-o2-2', groupId: 'su-g2', text: '你有没有去见过他？', nextGroupId: 'su-g4', order: 2 }
    ]
  },
  {
    id: 'su-g3',
    characterId: 'su-wanqing',
    messages: [
      { id: 'su-m3-1', characterId: 'su-wanqing', content: '你说什么？遗嘱？他要改遗嘱？', type: 'npc', delay: 2000, groupId: 'su-g3', order: 1 },
      { id: 'su-m3-2', characterId: 'su-wanqing', content: '这和我没关系，我回来不是为了遗嘱的事', type: 'npc', delay: 2200, groupId: 'su-g3', order: 2 },
      { id: 'su-m3-3', characterId: 'su-wanqing', content: '我是为了那幅画，那是我的权利', type: 'npc', delay: 1800, groupId: 'su-g3', order: 3 }
    ],
    options: [
      { id: 'su-o3-1', groupId: 'su-g3', text: '什么画？', nextGroupId: 'su-g4', unlockNoteId: 'note-su-2', order: 1 },
      { id: 'su-o3-2', groupId: 'su-g3', text: '你见到他了？', nextGroupId: 'su-g4', order: 2 }
    ]
  },
  {
    id: 'su-g4',
    characterId: 'su-wanqing',
    messages: [
      { id: 'su-m4-1', characterId: 'su-wanqing', content: '那天晚上我去了画室找他，我们喝了杯茶，聊了很多', type: 'npc', delay: 2000, groupId: 'su-g4', order: 1 },
      { id: 'su-m4-2', characterId: 'su-wanqing', content: '他说想把画捐给基金会，我不同意，我们吵了一架', type: 'npc', delay: 2200, groupId: 'su-g4', order: 2 },
      { id: 'su-m4-3', characterId: 'su-wanqing', content: '但我离开的时候他还活着，我可以发誓', type: 'npc', delay: 1800, groupId: 'su-g4', order: 3 }
    ],
    options: [
      { id: 'su-o4-1', groupId: 'su-g4', text: '你几点离开画室的？', nextGroupId: 'su-g5', order: 1 },
      { id: 'su-o4-2', groupId: 'su-g4', text: '离开后你去了哪里？', nextGroupId: 'su-g5', unlockNoteId: 'note-su-3', order: 2 }
    ]
  },
  {
    id: 'su-g5',
    characterId: 'su-wanqing',
    messages: [
      { id: 'su-m5-1', characterId: 'su-wanqing', content: '大概十点左右离开的，之后我就回了酒店', type: 'npc', delay: 1500, groupId: 'su-g5', order: 1 },
      { id: 'su-m5-2', characterId: 'su-wanqing', content: '不管你信不信，我对远舟还有感情，只是回不去了。别再来问我了', type: 'npc', delay: 2000, groupId: 'su-g5', order: 2 }
    ],
    options: [
      { id: 'su-o5-1', groupId: 'su-g5', text: '好的，谢谢配合', nextGroupId: 'su-g1', order: 1 }
    ]
  },

  {
    id: 'chen-g1',
    characterId: 'chen-mo',
    messages: [
      { id: 'chen-m1-1', characterId: 'chen-mo', content: '……你好', type: 'npc', delay: 1500, groupId: 'chen-g1', order: 1 },
      { id: 'chen-m1-2', characterId: 'chen-mo', content: '老师他……对我很好', type: 'npc', delay: 2000, groupId: 'chen-g1', order: 2 }
    ],
    options: [
      { id: 'chen-o1-1', groupId: 'chen-g1', text: '你跟林远舟学了多久？', nextGroupId: 'chen-g2', unlockNoteId: 'note-chen-1', order: 1 },
      { id: 'chen-o1-2', groupId: 'chen-g1', text: '你了解他最后那幅画吗？', nextGroupId: 'chen-g3', order: 2 },
      { id: 'chen-o1-3', groupId: 'chen-g1', text: '案发那晚你在做什么？', nextGroupId: 'chen-g2', order: 3 }
    ]
  },
  {
    id: 'chen-g2',
    characterId: 'chen-mo',
    messages: [
      { id: 'chen-m2-1', characterId: 'chen-mo', content: '三年……老师收留我的时候，我什么都不会', type: 'npc', delay: 1800, groupId: 'chen-g2', order: 1 },
      { id: 'chen-m2-2', characterId: 'chen-mo', content: '他教我画画，给我住的地方，每个月还给我生活费', type: 'npc', delay: 2000, groupId: 'chen-g2', order: 2 },
      { id: 'chen-m2-3', characterId: 'chen-mo', content: '我欠老师的，一辈子都还不完', type: 'npc', delay: 1500, groupId: 'chen-g2', order: 3 }
    ],
    options: [
      { id: 'chen-o2-1', groupId: 'chen-g2', text: '老师最后在画什么？', nextGroupId: 'chen-g3', order: 1 },
      { id: 'chen-o2-2', groupId: 'chen-g2', text: '你有没有趁夜去过画室？', nextGroupId: 'chen-g4', order: 2 }
    ]
  },
  {
    id: 'chen-g3',
    characterId: 'chen-mo',
    messages: [
      { id: 'chen-m3-1', characterId: 'chen-mo', content: '老师最后那幅画……是一幅自画像', type: 'npc', delay: 2000, groupId: 'chen-g3', order: 1 },
      { id: 'chen-m3-2', characterId: 'chen-mo', content: '他把自己画成站在悬崖边的人，背后是黑暗，面前有一线光', type: 'npc', delay: 2500, groupId: 'chen-g3', order: 2, suspicionId: 'sus-3' },
      { id: 'chen-m3-3', characterId: 'chen-mo', content: '右下角……还没有画完', type: 'npc', delay: 1800, groupId: 'chen-g3', order: 3 }
    ],
    options: [
      { id: 'chen-o3-1', groupId: 'chen-g3', text: '你怎么能描述得这么详细？你不是说没看过吗？', nextGroupId: 'chen-g4', triggerSuspicionId: 'sus-3', unlockNoteId: 'note-chen-2', order: 1 },
      { id: 'chen-o3-2', groupId: 'chen-g3', text: '那天晚上你真的没去画室？', nextGroupId: 'chen-g4', order: 2 }
    ]
  },
  {
    id: 'chen-g4',
    characterId: 'chen-mo',
    messages: [
      { id: 'chen-m4-1', characterId: 'chen-mo', content: '……好吧，我承认我偷偷看过那幅画', type: 'npc', delay: 2500, groupId: 'chen-g4', order: 1 },
      { id: 'chen-m4-2', characterId: 'chen-mo', content: '那天凌晨两点，我忍不住去了画室，想再看一眼', type: 'npc', delay: 2000, groupId: 'chen-g4', order: 2 },
      { id: 'chen-m4-3', characterId: 'chen-mo', content: '但是我到了之后……老师已经倒在画架旁边了', type: 'npc', delay: 2200, groupId: 'chen-g4', order: 3 }
    ],
    options: [
      { id: 'chen-o4-1', groupId: 'chen-g4', text: '你第一时间报警了吗？', nextGroupId: 'chen-g5', unlockNoteId: 'note-chen-3', order: 1 },
      { id: 'chen-o4-2', groupId: 'chen-g4', text: '你临摹过他的画吗？', nextGroupId: 'chen-g5', order: 2 }
    ]
  },
  {
    id: 'chen-g5',
    characterId: 'chen-mo',
    messages: [
      { id: 'chen-m5-1', characterId: 'chen-mo', content: '我……我太害怕了，愣了好久才跑出去叫人', type: 'npc', delay: 1500, groupId: 'chen-g5', order: 1 },
      { id: 'chen-m5-2', characterId: 'chen-mo', content: '老师走了，我什么都没了。请别再问了', type: 'npc', delay: 2000, groupId: 'chen-g5', order: 2 }
    ],
    options: [
      { id: 'chen-o5-1', groupId: 'chen-g5', text: '好的，保重', nextGroupId: 'chen-g1', order: 1 }
    ]
  },

  {
    id: 'zhou-g1',
    characterId: 'zhou-jingguan',
    messages: [
      { id: 'zhou-m1-1', characterId: 'zhou-jingguan', content: '你好，我是负责这起案件的周警官', type: 'npc', delay: 1000, groupId: 'zhou-g1', order: 1 },
      { id: 'zhou-m1-2', characterId: 'zhou-jingguan', content: '案情还在调查中，有些信息暂时不能公开', type: 'npc', delay: 1800, groupId: 'zhou-g1', order: 2 }
    ],
    options: [
      { id: 'zhou-o1-1', groupId: 'zhou-g1', text: '能说说现场的基本情况吗？', nextGroupId: 'zhou-g2', unlockNoteId: 'note-zhou-1', order: 1 },
      { id: 'zhou-o1-2', groupId: 'zhou-g1', text: '你们发现了什么可疑的？', nextGroupId: 'zhou-g3', order: 2 },
      { id: 'zhou-o1-3', groupId: 'zhou-g1', text: '死亡原因确定了吗？', nextGroupId: 'zhou-g2', order: 3 }
    ]
  },
  {
    id: 'zhou-g2',
    characterId: 'zhou-jingguan',
    messages: [
      { id: 'zhou-m2-1', characterId: 'zhou-jingguan', content: '死者林远舟被发现倒在画室画架旁，初步判断是中毒身亡', type: 'npc', delay: 2000, groupId: 'zhou-g2', order: 1 },
      { id: 'zhou-m2-2', characterId: 'zhou-jingguan', content: '画室门从内部反锁，窗户关闭但未上锁，看起来像密室', type: 'npc', delay: 2200, groupId: 'zhou-g2', order: 2 },
      { id: 'zhou-m2-3', characterId: 'zhou-jingguan', content: '不过嘛，密室这种事，往往不是真的密室', type: 'npc', delay: 1800, groupId: 'zhou-g2', order: 3 }
    ],
    options: [
      { id: 'zhou-o2-1', groupId: 'zhou-g2', text: '现场有没有什么细节值得注意？', nextGroupId: 'zhou-g3', triggerSuspicionId: 'sus-6', order: 1 },
      { id: 'zhou-o2-2', groupId: 'zhou-g2', text: '毒物来源查到了吗？', nextGroupId: 'zhou-g4', order: 2 }
    ]
  },
  {
    id: 'zhou-g3',
    characterId: 'zhou-jingguan',
    messages: [
      { id: 'zhou-m3-1', characterId: 'zhou-jingguan', content: '有一个细节很有意思——画室里的茶具，有两个杯子', type: 'npc', delay: 2000, groupId: 'zhou-g3', order: 1 },
      { id: 'zhou-m3-2', characterId: 'zhou-jingguan', content: '其中一个杯子上有两组指纹，说明当晚有人陪林远舟喝了茶', type: 'npc', delay: 2200, groupId: 'zhou-g3', order: 2, suspicionId: 'sus-6' },
      { id: 'zhou-m3-3', characterId: 'zhou-jingguan', content: '但那个人是谁，我还暂时保密', type: 'npc', delay: 1500, groupId: 'zhou-g3', order: 3 }
    ],
    options: [
      { id: 'zhou-o3-1', groupId: 'zhou-g3', text: '指纹比对结果呢？', nextGroupId: 'zhou-g4', unlockNoteId: 'note-zhou-2', order: 1 },
      { id: 'zhou-o3-2', groupId: 'zhou-g3', text: '还有别的发现吗？', nextGroupId: 'zhou-g4', order: 2 }
    ]
  },
  {
    id: 'zhou-g4',
    characterId: 'zhou-jingguan',
    messages: [
      { id: 'zhou-m4-1', characterId: 'zhou-jingguan', content: '指纹的事我暂时不能多说，但我可以告诉你，那个人不是陌生人', type: 'npc', delay: 2000, groupId: 'zhou-g4', order: 1 },
      { id: 'zhou-m4-2', characterId: 'zhou-jingguan', content: '另外，我们对画室做了更细致的勘查，发现了一个……有意思的东西', type: 'npc', delay: 2200, groupId: 'zhou-g4', order: 2 },
      { id: 'zhou-m4-3', characterId: 'zhou-jingguan', content: '具体是什么，等时机成熟我会公布的', type: 'npc', delay: 1800, groupId: 'zhou-g4', order: 3 }
    ],
    options: [
      { id: 'zhou-o4-1', groupId: 'zhou-g4', text: '画室还有别的出口？', nextGroupId: 'zhou-g5', unlockNoteId: 'note-zhou-3', order: 1 },
      { id: 'zhou-o4-2', groupId: 'zhou-g4', text: '你觉得密室是伪造的？', nextGroupId: 'zhou-g5', order: 2 }
    ]
  },
  {
    id: 'zhou-g5',
    characterId: 'zhou-jingguan',
    messages: [
      { id: 'zhou-m5-1', characterId: 'zhou-jingguan', content: '这个案子的水比你想的深，别急着下结论', type: 'npc', delay: 1500, groupId: 'zhou-g5', order: 1 },
      { id: 'zhou-m5-2', characterId: 'zhou-jingguan', content: '有新进展我会通知你，现在请配合我们的工作', type: 'npc', delay: 2000, groupId: 'zhou-g5', order: 2 }
    ],
    options: [
      { id: 'zhou-o5-1', groupId: 'zhou-g5', text: '好的，辛苦了', nextGroupId: 'zhou-g1', order: 1 }
    ]
  }
]
