export interface Note {
  id: string
  characterId: string
  title: string
  content: string
  unlockSuspicionId: string | null
  isLocked: boolean
  date: string
  evidenceId?: string
}

export const notes: Note[] = [
  {
    id: 'note-lin-1',
    characterId: 'lin-xiaoyu',
    title: '关于爸爸',
    content: '最近爸爸总是在画室待到很晚，我想去找他说说话，但每次走到门口又折回来了。他好像变了一个人似的，不再像以前那样关心我的学业。妈妈走后，他就把自己封闭在画里，可即便如此，他毕竟是我唯一的亲人……我有时候恨他，更多时候只是心疼。',
    unlockSuspicionId: null,
    isLocked: false,
    date: '6月12日'
  },
  {
    id: 'note-lin-2',
    characterId: 'lin-xiaoyu',
    title: '遗嘱的事',
    content: '那天我无意间听到爸爸打电话给律师，说要修改遗嘱。他说要把大部分财产捐给基金会，只给我留一小部分……我知道他一直觉得我不争气，但我真的没想到他会做到这种地步。他难道忘了吗？妈妈走的时候，是我一直在他身边。算了，反正他也没来得及改。',
    unlockSuspicionId: 'sus-4',
    isLocked: true,
    date: '6月14日'
  },
  {
    id: 'note-lin-3',
    characterId: 'lin-xiaoyu',
    title: '那天晚上',
    content: '出事那天晚上，大概十一点左右，我听到画室那边有声响。从窗户看过去，灯是亮的，爸爸的影子在窗帘上晃动。好像还有另一个人在……我没看清是谁。我以为是赵叔叔，他经常来找爸爸谈事情。我犹豫了一下，没有过去。如果那时我去了，也许……',
    unlockSuspicionId: 'sus-4',
    isLocked: true,
    date: '6月15日'
  },
  {
    id: 'note-zhao-1',
    characterId: 'zhao-minghui',
    title: '远舟的作品',
    content: '远舟这批新画水平极高，尤其是那幅未完成的大画，如果面世绝对能拍出天价。这些年我替他经手了不下二十场拍卖，每一场都满载而归。只是最近市场不太好，几笔款子回笼慢了些，远舟那边催得紧，我有些压力。不过老朋友嘛，他应该理解的。',
    unlockSuspicionId: null,
    isLocked: false,
    date: '6月10日'
  },
  {
    id: 'note-zhao-2',
    characterId: 'zhao-minghui',
    title: '画室考察',
    content: '远舟让我帮忙看看画室的安保系统，我顺便量了窗户的尺寸——宽62厘米，高118厘米，一个成年人侧身可以通过。画室在一楼，窗户外面是花园，没有监控。虽然装了防盗锁，但那锁的款式老旧，用力一推就能打开。我把这些记下来，本来是想给他建议升级安保的。',
    unlockSuspicionId: 'sus-1',
    isLocked: true,
    date: '6月13日',
    evidenceId: 'ev-1'
  },
  {
    id: 'note-zhao-3',
    characterId: 'zhao-minghui',
    title: '账目备忘',
    content: '去年秋拍的三幅画总成交价820万，按合约远舟应得570万。但其中一笔320万的尾款我一直没转给他……不是不想转，是我先拿去填了别的窟窿。赌场的债到期不还后果很严重，我打算今年春拍结束后一起补上。远舟画的窗户尺寸我也记在了这里，62×118，提醒自己尽快给他换锁。可现在一切都来不及了。',
    unlockSuspicionId: 'sus-5',
    isLocked: true,
    date: '6月14日',
    evidenceId: 'ev-3'
  },
  {
    id: 'note-su-1',
    characterId: 'su-wanqing',
    title: '回国日记',
    content: '飞了十一个小时，从巴黎回到这座城市。六年了，空气中还是那股潮湿的味道。出租车经过我们以前住的那条街，我没有让司机停下来。这次回来不是为了叙旧，而是为了拿回属于我的东西。那幅画，是我们婚姻期间画的，法律上我有一半的权利。远舟，你以为离婚就能把一切切割干净吗？',
    unlockSuspicionId: null,
    isLocked: false,
    date: '6月11日'
  },
  {
    id: 'note-su-2',
    characterId: 'su-wanqing',
    title: '那幅画',
    content: '我此行真正的目的，就是那幅《暮色中的告别》。远舟在离婚那年画了它，画的是一个女人的背影消失在黄昏里。我知道他画的是我。这幅画在圈内估值已经超过一千万，可他从来不肯卖，也不肯给我。我查过法律，婚姻存续期间创作的画作，配偶有权主张共同财产分割。我要拿回它。',
    unlockSuspicionId: 'sus-2',
    isLocked: true,
    date: '6月13日'
  },
  {
    id: 'note-su-3',
    characterId: 'su-wanqing',
    title: '远舟和我',
    content: '我到的那天晚上，去画室找了他。他看到我的时候很惊讶，但让我进去了。我们喝了杯茶，聊了很多，关于过去，关于小雨。他说他想改遗嘱，把画捐出去。我当时就急了，和他在画室吵了一架。我离开的时候他还活着，我可以对天发誓。只是……我走的时候，他一个人坐在画室里，很孤独的样子。',
    unlockSuspicionId: 'sus-2',
    isLocked: true,
    date: '6月15日'
  },
  {
    id: 'note-chen-1',
    characterId: 'chen-mo',
    title: '师父教我',
    content: '跟着师父学画三年了，从最基础的素描开始，到现在能独立完成一幅油画。师父说我有天赋，但缺少灵魂。他说画画不是技法，是情感。可我总觉得，我的情感都藏在很深的地方，拿不出来。师父对我很好，管吃管住，每个月还给我生活费。我欠他太多，这辈子可能都还不完。',
    unlockSuspicionId: null,
    isLocked: false,
    date: '6月9日'
  },
  {
    id: 'note-chen-2',
    characterId: 'chen-mo',
    title: '遗作',
    content: '师父最后那幅画，他不让任何人看，连我也不行。但有一天夜里，我偷偷进了画室，站在画布前看了很久。那是一幅自画像，他把自己画成了一个站在悬崖边的人，背后是无尽的黑暗，面朝一线微光。我忍不住拿起画笔临摹了一幅，我知道这样做不对，可那画面深深刺痛了我，我想留住那种感觉。',
    unlockSuspicionId: 'sus-3',
    isLocked: true,
    date: '6月14日'
  },
  {
    id: 'note-chen-3',
    characterId: 'chen-mo',
    title: '画室的夜',
    content: '那天晚上我又去了画室，大概是凌晨两点。我本以为师父已经睡了，但画室的灯亮着，门没有锁。我轻轻推开门，发现师父倒在画架旁边，已经没有呼吸了。画架上那幅自画像还没有完成，右下角缺了一块。我吓坏了，不知道该怎么办，愣了好一会儿才跑出去叫人。我应该第一时间报警的，可我太害怕了。',
    unlockSuspicionId: 'sus-3',
    isLocked: true,
    date: '6月15日'
  },
  {
    id: 'note-zhou-1',
    characterId: 'zhou-jingguan',
    title: '现场勘查',
    content: '林远舟，男，58岁，知名画家。6月15日凌晨被发现死于自家画室。画室门从内部反锁，窗户关闭但未上锁。死者面朝下倒在画架旁，无明显外伤，法医初步判断死因为中毒，毒物类型待化验。画室内有未完成的画布一幅，茶具一套，茶壶中残有茶水。现场未发现强制入侵痕迹，初步判断为密室。',
    unlockSuspicionId: null,
    isLocked: false,
    date: '6月15日'
  },
  {
    id: 'note-zhou-2',
    characterId: 'zhou-jingguan',
    title: '茶杯指纹',
    content: '茶具检验结果出来了。两个茶杯，一个只有死者指纹，另一个上面有两组指纹：一组属于死者，另一组经比对属于赵明辉。赵明辉声称当晚未去过画室，但指纹不会说谎。壶中残茶未检出毒物，说明下毒手段不在茶水里。如果赵明辉当晚确实在画室，他为什么撒谎？',
    unlockSuspicionId: 'sus-6',
    isLocked: true,
    date: '6月15日',
    evidenceId: 'ev-2'
  },
  {
    id: 'note-zhou-3',
    characterId: 'zhou-jingguan',
    title: '暗门',
    content: '重大发现：画室西侧书架后面有一条暗门，通向后院的储藏室。门被书架遮挡，极为隐蔽，如果不是仔细搜查根本不会发现。这意味着画室并非密室——有人可以从暗门进入，从正门反锁后从暗门离开，制造出密室假象。暗门门把手上有擦拭痕迹，有人在离开时刻意清除了指纹。此信息暂不公开。',
    unlockSuspicionId: 'sus-6',
    isLocked: true,
    date: '6月16日',
    evidenceId: 'ev-5'
  }
]
