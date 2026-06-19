import { StoryNode, Item } from '../types';

export const ITEMS: Record<string, Item> = {
  FLASHLIGHT: {
    id: 'flashlight',
    name: '手电筒',
    description: '一把破旧但还能用的LED手电筒，照亮黑暗的角落。',
    icon: '🔦',
  },
  RATION: {
    id: 'ration',
    name: '能量棒',
    description: '赛博朋克标准口粮，高卡路里，味道像合成草莓。',
    icon: '🍫',
  },
  KEYCARD: {
    id: 'keycard',
    name: '门禁卡',
    description: '一张脏兮兮的门禁卡，上面印着"新伊甸企业"的logo。',
    icon: '💳',
  },
  PHOTO: {
    id: 'photo',
    name: '老照片',
    description: '一张褪色的照片，上面是两个小女孩在游乐园里笑着。',
    icon: '📷',
  },
  MEDKIT: {
    id: 'medkit',
    name: '应急医疗包',
    description: '黑市出品的医疗包，里面有绷带、止疼药和止血剂。',
    icon: '💊',
  },
};

export const STORY_NODES: StoryNode[] = [
  {
    id: 'start',
    type: 'message',
    messages: [
      { sender: 'system', type: 'text', content: '【系统】检测到未知设备接入通讯网络...' },
      { sender: 'system', type: 'text', content: '【系统】正在建立加密连接... ████████ 100%' },
    ],
    nextNodeId: 'intro_1',
    delay: 1200,
  },
  {
    id: 'intro_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'voice', content: '（颤抖的呼吸声）喂...喂？有人吗？拜托...回答我...', voiceDuration: 4 },
    ],
    nextNodeId: 'intro_2',
    delay: 2000,
  },
  {
    id: 'intro_2',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '谢天谢地...终于有人接通了。我叫零。我不知道自己在哪，只记得醒来时就在这个地方...' },
      { sender: 'zero', type: 'image', content: '昏暗的房间，生锈的铁床，墙上贴着霓虹海报', imageUrl: 'room' },
    ],
    nextNodeId: 'intro_3',
    effects: { hunger: -5 },
    delay: 3000,
  },
  {
    id: 'intro_3',
    type: 'choice',
    prompt: '零正紧张地等待你的回复...',
    choices: [
      { id: 'calm', text: '"别慌，慢慢说。你还记得什么？"', nextNodeId: 'path_calm_1', effects: { trust: 10 }, playerResponse: '别慌，慢慢说。你还记得什么？' },
      { id: 'direct', text: '"你先看看周围有没有出口。"', nextNodeId: 'path_direct_1', effects: { trust: -5, hunger: -5 }, playerResponse: '你先看看周围有没有出口。' },
      { id: 'suspicious', text: '"这是恶作剧吗？我怎么知道你不是骗子。"', nextNodeId: 'path_suspicious_1', effects: { trust: -15 }, playerResponse: '这是恶作剧吗？我怎么知道你不是骗子。' },
    ],
  },
  {
    id: 'path_calm_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '嗯...我记得下班回家，然后有人从后面捂住了我的嘴...等醒来就在这里了。' },
      { sender: 'zero', type: 'text', content: '这个房间...墙上有面破镜子，角落里有个铁柜子。门是锁着的。' },
    ],
    nextNodeId: 'search_room',
    delay: 2500,
  },
  {
    id: 'path_direct_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '好、好的，我看看...' },
      { sender: 'zero', type: 'voice', content: '（脚步声）门...门是锁着的，纹丝不动。窗户被焊死了。', voiceDuration: 3 },
      { sender: 'zero', type: 'text', content: '有个铁柜子，还有面破镜子。' },
    ],
    nextNodeId: 'search_room',
    delay: 2500,
  },
  {
    id: 'path_suspicious_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '...你觉得我在骗你？' },
      { sender: 'zero', type: 'image', content: '一个瘦弱的女孩，脸上有淤青，眼神充满恐惧', imageUrl: 'zero_face' },
      { sender: 'zero', type: 'text', content: '你看...我没有理由开这种玩笑。拜托，我真的需要帮助。' },
    ],
    nextNodeId: 'search_room',
    delay: 2500,
  },
  {
    id: 'search_room',
    type: 'choice',
    prompt: '该让零先检查什么？',
    choices: [
      { id: 'check_cabinet', text: '检查那个铁柜子', nextNodeId: 'cabinet_1', playerResponse: '先检查那个铁柜子，说不定有东西。' },
      { id: 'check_mirror', text: '仔细看看那面镜子', nextNodeId: 'mirror_1', playerResponse: '看看镜子后面，有时候墙是空心的。' },
      { id: 'check_door', text: '再研究一下门锁', nextNodeId: 'door_1', playerResponse: '再看看门锁，能撬开吗？' },
    ],
  },
  {
    id: 'cabinet_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '柜子...没锁。里面有个手电筒，还有一根能量棒！' },
      { sender: 'zero', type: 'text', content: '下面还有个抽屉...拉开了，有张老照片。' },
      { sender: 'zero', type: 'image', content: '两个小女孩在游乐园的合影，已经褪色', imageUrl: 'photo' },
    ],
    nextNodeId: 'after_search_1',
    giveItem: ITEMS.FLASHLIGHT,
    effects: { hunger: 5 },
    delay: 3000,
  },
  {
    id: 'mirror_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '镜子...镜框有点松，我试试把它拆下来...' },
      { sender: 'zero', type: 'voice', content: '（金属摩擦声）后面有个暗格！有个手电筒和一些药！', voiceDuration: 5 },
    ],
    nextNodeId: 'after_search_1',
    giveItem: ITEMS.MEDKIT,
    effects: { trust: 5 },
    delay: 3000,
  },
  {
    id: 'door_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '门锁是电子锁，上面有个刷卡器...我身上没有卡。' },
      { sender: 'zero', type: 'text', content: '等等，门框下面好像塞着什么...是张门禁卡！' },
      { sender: 'zero', type: 'text', content: '门边的地毯下面还有根能量棒，估计是之前关在这里的人留下的。' },
    ],
    nextNodeId: 'after_search_1',
    giveItem: ITEMS.KEYCARD,
    effects: { hunger: 5 },
    delay: 3000,
  },
  {
    id: 'after_search_1',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '有东西在动...外面走廊传来脚步声！' },
      { sender: 'system', type: 'text', content: '【警告】检测到外部威胁接近' },
    ],
    nextNodeId: 'hide_choice',
    delay: 2000,
  },
  {
    id: 'hide_choice',
    type: 'choice',
    prompt: '脚步声越来越近，只有几秒钟时间！',
    choices: [
      { id: 'hide_bed', text: '躲到床底下', nextNodeId: 'hide_bed_result', effects: { health: -10 }, playerResponse: '快躲到床底下！' },
      { id: 'hide_cabinet', text: '躲进铁柜子里', nextNodeId: 'hide_cabinet_result', playerResponse: '进铁柜子，快！' },
      { id: 'confront', text: '拿武器准备反击', nextNodeId: 'confront_result', effects: { health: -30, trust: 10 }, playerResponse: '找个东西当武器，准备反击！' },
    ],
  },
  {
    id: 'hide_bed_result',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'voice', content: '（沉重的呼吸）我、我进来了...床下全是灰，好挤。', voiceDuration: 4 },
      { sender: 'zero', type: 'text', content: '门开了...是个穿黑色大衣的男人。他站在门口看了一圈...' },
      { sender: 'zero', type: 'text', content: '他踢了踢床腿...我的胳膊被刮到了，但没出声。' },
      { sender: 'zero', type: 'text', content: '...他走了。刚才好险。' },
    ],
    nextNodeId: 'after_hide',
    delay: 3500,
  },
  {
    id: 'hide_cabinet_result',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '柜子门刚好能关上，好窄...' },
      { sender: 'zero', type: 'text', content: '有人进来了。脚步声停在柜子前...' },
      { sender: 'zero', type: 'voice', content: '（极低的声音）他拉了一下柜门...幸好我从里面按住了。', voiceDuration: 3 },
      { sender: 'zero', type: 'text', content: '他骂了一句就走了。呼——' },
    ],
    nextNodeId: 'after_hide',
    effects: { trust: 5 },
    delay: 3500,
  },
  {
    id: 'confront_result',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我拿起了床旁边的铁管...门开了！' },
      { sender: 'zero', type: 'voice', content: '（撞击声+痛哼）我砸到他肩膀了！但他推了我一把，头撞到墙了...', voiceDuration: 5 },
      { sender: 'zero', type: 'text', content: '他踉跄了一下跑掉了。我不知道他会不会带更多人回来...' },
    ],
    nextNodeId: 'after_hide',
    delay: 3500,
  },
  {
    id: 'after_hide',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我不能一直待在这里。外面好像安静下来了...' },
      { sender: 'zero', type: 'text', content: '谢谢你...一直陪着我。说实话，如果通讯突然断了，我不知道该怎么办。' },
    ],
    nextNodeId: 'trust_moment',
    effects: { hunger: -10 },
    delay: 2500,
  },
  {
    id: 'trust_moment',
    type: 'choice',
    prompt: '零的声音有些哽咽...',
    choices: [
      { id: 'comfort', text: '"我不会挂的，我们一起逃出去。"', nextNodeId: 'escape_plan', effects: { trust: 20 }, playerResponse: '我不会挂的，我们一起逃出去。' },
      { id: 'practical', text: '"别多想，保存体力。想想下一步。"', nextNodeId: 'escape_plan', effects: { trust: 5 }, playerResponse: '别多想，保存体力。想想下一步。' },
      { id: 'distant', text: '"先别煽情了，专注于活着出去。"', nextNodeId: 'escape_plan', effects: { trust: -10 }, playerResponse: '先别煽情了，专注于活着出去。' },
    ],
  },
  {
    id: 'escape_plan',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '好...我听你的。' },
      { sender: 'system', type: 'text', content: '【提示】是时候使用你收集到的物品了' },
    ],
    nextNodeId: 'escape_door',
    delay: 2000,
  },
  {
    id: 'escape_door',
    type: 'choice',
    prompt: '电子门锁闪烁着红光，你会怎么做？',
    choices: [
      { id: 'use_keycard', text: '使用门禁卡', nextNodeId: 'keycard_success', requiredItem: 'keycard', playerResponse: '用门禁卡试试！' },
      { id: 'use_flashlight', text: '用手电筒照锁芯', nextNodeId: 'flashlight_fail', requiredItem: 'flashlight', playerResponse: '用手电筒看看锁的结构。' },
      { id: 'force', text: '强行撞门', nextNodeId: 'force_door', effects: { health: -25 }, playerResponse: '直接撞门，没时间了！' },
      { id: 'wait', text: '等待观察有没有其他办法', nextNodeId: 'wait_result', effects: { hunger: -15 }, playerResponse: '先等等，看看情况。' },
    ],
  },
  {
    id: 'keycard_success',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我把卡贴上去...滴——绿灯了！' },
      { sender: 'zero', type: 'voice', content: '（门开的声音）天呐，真的开了！外面是一条走廊。', voiceDuration: 4 },
      { sender: 'zero', type: 'text', content: '走廊左边有红光闪烁，右边是紧急出口的绿色标志。' },
    ],
    nextNodeId: 'corridor_choice',
    effects: { trust: 10 },
    delay: 3000,
  },
  {
    id: 'flashlight_fail',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '手电筒照上去...什么也没发生。这是电子锁，不是机械锁。' },
      { sender: 'zero', type: 'text', content: '等等，我看到锁上写着"新伊甸企业"，和那张照片背面写的字一样...' },
    ],
    nextNodeId: 'escape_door',
    delay: 2500,
  },
  {
    id: 'force_door',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'voice', content: '（撞击声）一！二！三！', voiceDuration: 3 },
      { sender: 'zero', type: 'text', content: '肩膀好痛...但门没开。反而触发了警报！' },
      { sender: 'system', type: 'text', content: '【警告】警报已被触发，威胁正在接近' },
    ],
    nextNodeId: 'corridor_choice',
    delay: 2500,
  },
  {
    id: 'wait_result',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我靠着墙坐着...肚子好饿。' },
      { sender: 'zero', type: 'text', content: '等等，有人过来了——是个穿制服的人，他把一张卡掉在地上就走了！' },
    ],
    nextNodeId: 'wait_give_card',
    delay: 2500,
  },
  {
    id: 'wait_give_card',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我捡起来了...是门禁卡！' },
    ],
    nextNodeId: 'escape_door',
    giveItem: ITEMS.KEYCARD,
    delay: 1500,
  },
  {
    id: 'corridor_choice',
    type: 'choice',
    prompt: '走廊分岔了，警报声越来越近...',
    choices: [
      { id: 'go_left', text: '往红光方向（看起来像是控制室）', nextNodeId: 'control_room', effects: { hunger: -10 }, playerResponse: '左边红光的方向，可能有控制终端。' },
      { id: 'go_right', text: '往绿色紧急出口', nextNodeId: 'exit_path', effects: { health: -10 }, playerResponse: '直奔紧急出口，越简单越好。' },
    ],
  },
  {
    id: 'control_room',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '控制室里没有人...墙上有很多监控屏幕。' },
      { sender: 'zero', type: 'image', content: '监控画面显示多个房间，其中一个屏幕上显示着"目标：零"的字样', imageUrl: 'monitors' },
      { sender: 'zero', type: 'text', content: '他们一直在监视我...这个终端能解锁所有门！我试试看——' },
      { sender: 'zero', type: 'text', content: '解锁了！紧急出口那边的门开了。还有...我在柜子里发现了这个医疗包。' },
    ],
    nextNodeId: 'final_escape',
    giveItem: ITEMS.MEDKIT,
    effects: { trust: 15 },
    delay: 3500,
  },
  {
    id: 'exit_path',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我跑向紧急出口...楼梯间！' },
      { sender: 'zero', type: 'voice', content: '（脚步声）有人在后面追！我往下跑——啊！', voiceDuration: 4 },
      { sender: 'zero', type: 'text', content: '我摔了一跤，腿破了...但我不能停。我看到出口的光了！' },
    ],
    nextNodeId: 'final_escape',
    delay: 3500,
  },
  {
    id: 'final_escape',
    type: 'message',
    messages: [
      { sender: 'zero', type: 'text', content: '我推开最后一道门——' },
      { sender: 'zero', type: 'text', content: '是霓虹都市的雨夜。我出来了...我真的出来了！' },
      { sender: 'zero', type: 'voice', content: '（哭泣声+笑）谢谢你...真的谢谢你。如果没有你一直陪着我，我早就放弃了。', voiceDuration: 6 },
      { sender: 'zero', type: 'text', content: '我叫了警察。他们马上就到。' },
    ],
    nextNodeId: 'check_ending',
    delay: 4000,
  },
  {
    id: 'check_ending',
    type: 'message',
    messages: [
      { sender: 'system', type: 'text', content: '【系统】正在根据表现计算结局...' },
    ],
    nextNodeId: 'ending_calc',
    delay: 1500,
  },
  {
    id: 'ending_calc',
    type: 'ending',
    endingType: 'good',
    title: '通往黎明的路',
    description: 'placeholder',
  },
  {
    id: 'death_health',
    type: 'ending',
    endingType: 'death',
    title: '信号中断',
    description: '零的伤势太重了...通讯器里传来她越来越弱的呼吸声，然后是永恒的静默。你没能救她。',
  },
  {
    id: 'death_hunger',
    type: 'ending',
    endingType: 'death',
    title: '耗尽',
    description: '零在黑暗中又冷又饿。她的消息越来越短，间隔越来越长...直到再也没有回复。',
  },
  {
    id: 'death_trust',
    type: 'ending',
    endingType: 'death',
    title: '孤独的终焉',
    description: '零不再相信你。她关闭了通讯器，独自面对未知的黑暗。你再也不知道她后来怎样了。',
  },
];

export const START_NODE_ID = 'start';
