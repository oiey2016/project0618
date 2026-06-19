import type { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  {
    id: 'ev-friendly-merchant',
    title: '友好的旅行商人',
    description: '一艘装饰华丽的商船靠近你的飞船，商人通过通讯频道热情地打招呼，邀请你进行一场公平交易。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '用50星币购买神秘包裹',
        resultText: '你打开包裹，发现里面是一份珍贵的燃料补剂和一些实用物资！商人微笑着挥手告别。',
        effect: { stardust: -50, fuel: 30, morale: 5 },
      },
      {
        id: 'opt-2',
        text: '礼貌地婉拒并祝他生意兴隆',
        resultText: '商人感谢你的礼貌，临别前赠送了一小袋星币作为心意。',
        effect: { stardust: 20, morale: 5 },
      },
      {
        id: 'opt-3',
        text: '邀请商人上船喝杯咖啡聊聊',
        resultText: '你们相谈甚欢，商人分享了一条隐秘的捷径信息，并留下了一些星币表示感谢。',
        effect: { stardust: 40, days: -1, morale: 10 },
      },
    ],
  },
  {
    id: 'ev-nebula-view',
    title: '壮丽的星云奇景',
    description: '飞船正穿越一片绚丽的星云，紫色与金色的气体云在舷窗外缓缓流动，船员们纷纷驻足观看。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '停下来欣赏美景，让船员休息',
        resultText: '船员们在观景台度过了愉快的时光，士气大振，虽然多花了一天但收获满满。',
        effect: { days: 1, morale: 20 },
      },
      {
        id: 'opt-2',
        text: '保持航线，顺便收集星云气体样本',
        resultText: '科学官在星云中发现了稀有元素，这些样本可以在港口卖出好价钱！',
        effect: { stardust: 60 },
      },
      {
        id: 'opt-3',
        text: '全速通过，不做停留',
        resultText: '飞船平稳穿越星云，节省了宝贵的航行时间。',
        effect: { days: -1 },
      },
    ],
  },
  {
    id: 'ev-ancient-ruins',
    title: '神秘的古代遗迹',
    description: '航线旁漂浮着一座失落文明的遗迹空间站，扫描显示内部可能还有未被发现的宝藏。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '派遣探险队深入探索',
        resultText: '探险队在遗迹深处发现了古代星图碎片和一些星币！但探索花费了不少时间。',
        effect: { days: 2, stardust: 80, morale: 10 },
      },
      {
        id: 'opt-2',
        text: '在入口处快速搜索后离开',
        resultText: '你们找到了一些散落的星币和燃料罐，没有深入冒险。',
        effect: { stardust: 30, fuel: 10 },
      },
      {
        id: 'opt-3',
        text: '记录坐标后继续航行',
        resultText: '你将坐标卖给了星际考古学会，获得了一笔情报费。',
        effect: { stardust: 40 },
      },
    ],
  },
  {
    id: 'ev-stray-animal',
    title: '太空流浪生物',
    description: '一只毛茸茸的、像猫又像狐狸的外星小生物不知何时钻进了你的飞船，它正歪着头好奇地看着你。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '收养它，成为飞船吉祥物',
        resultText: '小家伙很快融入了船员们的生活，大家的士气都提高了不少！',
        effect: { morale: 15 },
      },
      {
        id: 'opt-2',
        text: '送到下一个星球的动物收容站',
        resultText: '收容站的工作人员非常感谢你，并给了一笔感谢金。',
        effect: { stardust: 25, morale: 5 },
      },
      {
        id: 'opt-3',
        text: '温柔地引导它离开飞船',
        resultText: '小生物临走前叼来了一枚闪亮的矿石，似乎是在表达谢意。',
        effect: { stardust: 50 },
      },
    ],
  },
  {
    id: 'ev-distress-good',
    title: '善意的求救信号',
    description: '通讯频道传来微弱的求救信号，一艘小型货船引擎故障，被困在这片空域已经三天了。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '慷慨援助，帮忙修理引擎',
        resultText: '货船船长感激涕零，不仅支付了报酬，还赠送了一批补给物资。',
        effect: { stardust: 70, fuel: 20, morale: 10 },
      },
      {
        id: 'opt-2',
        text: '呼叫最近的救援队后离开',
        resultText: '你做了该做的事，虽然没有物质回报，但内心感到满足。',
        effect: { morale: 5 },
      },
      {
        id: 'opt-3',
        text: '拖带他们去最近的港口收取费用',
        resultText: '你们收取了合理的救援费用，对方也表示理解。',
        effect: { stardust: 100, days: 1 },
      },
    ],
  },
  {
    id: 'ev-space-post',
    title: '星际邮政局',
    description: '前方出现一座漂浮的星际邮政中转站，工作人员挥手示意你们是否需要邮递服务。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '寄送一份家书回故乡',
        resultText: '寄出信件后，你收到了家人提前存放在邮局的回信和一小包礼物，心中温暖无比。',
        effect: { morale: 15, stardust: 10 },
      },
      {
        id: 'opt-2',
        text: '帮邮局运送一份加急包裹',
        resultText: '邮局支付了丰厚的运费，包裹的收件人还给了你额外的小费！',
        effect: { stardust: 80, days: 1 },
      },
      {
        id: 'opt-3',
        text: '购买一张限量版星际邮票',
        resultText: '这张精美的邮票在收藏市场很受欢迎，或许以后能卖出更高的价格。',
        effect: { stardust: -20, morale: 5 },
      },
    ],
  },
  {
    id: 'ev-pilgrim-ride',
    title: '朝圣者的请求',
    description: '两名身披长袍的朝圣者请求搭便车，他们要去参加远方星球的神圣仪式，但错过了常规航班。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '欣然同意，提供免费搭乘',
        resultText: '朝圣者一路上为你的旅途祈福，并在临别时赠予了一份神圣的祝福礼物。',
        effect: { morale: 20, fuel: 10 },
      },
      {
        id: 'opt-2',
        text: '收取合理的船费',
        resultText: '朝圣者理解你的立场，支付了船费并为你祝福。',
        effect: { stardust: 40, morale: 5 },
      },
      {
        id: 'opt-3',
        text: '抱歉婉拒，船舱空间有限',
        resultText: '朝圣者表示理解，并留下了一个小护身符纪念。',
        effect: { morale: 3 },
      },
    ],
  },
  {
    id: 'ev-child-flower',
    title: '孩子的礼物',
    description: '在港口停泊时，一个穿着破旧但整洁的小女孩跑过来，手里捧着一束从家乡带来的奇异花朵。',
    triggerCondition: 'low',
    options: [
      {
        id: 'opt-1',
        text: '收下花并给她一些星币',
        resultText: '小女孩笑得像阳光一样灿烂，这束花让整个船舱都弥漫着芬芳，船员们心情都变好了。',
        effect: { stardust: -30, morale: 25 },
      },
      {
        id: 'opt-2',
        text: '收下花，邀请她参观飞船',
        resultText: '小女孩兴奋地参观了每个角落，她的快乐感染了所有人。离开时她的父亲赶来道谢，塞给你一袋星币。',
        effect: { stardust: 60, morale: 15 },
      },
      {
        id: 'opt-3',
        text: '温和地谢绝礼物',
        resultText: '你礼貌地说明了旅程的艰辛，小女孩点点头，把花送给了码头上的另一位旅行者。',
        effect: { morale: 2 },
      },
    ],
  },

  {
    id: 'ev-asteroid-belt',
    title: '危险的小行星带',
    description: '飞船进入了密集的小行星带，岩石碎片在四周飞舞，必须小心驾驶才能安全通过。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '小心减速，手动驾驶穿越',
        resultText: '在船长的精湛操作下，飞船安全通过了小行星带，船员们对船长的技术赞叹不已。',
        effect: { days: 2, morale: 10 },
      },
      {
        id: 'opt-2',
        text: '冒险加速冲过去',
        resultText: '飞船高速穿越，但侧翼被一块碎片擦伤，损失了一些燃料，不过节省了大量时间。',
        effect: { fuel: -25, days: -2, morale: -5 },
      },
      {
        id: 'opt-3',
        text: '绕远路避开小行星带',
        resultText: '虽然多花了几天时间和燃料，但船员们都平安无事，这才是最重要的。',
        effect: { days: 3, fuel: -15 },
      },
      {
        id: 'opt-4',
        text: '派遣采矿无人机采集矿物',
        resultText: '无人机采集到了一些稀有矿石，但飞船在等待时被碎片击中了外壳。',
        effect: { stardust: 120, fuel: -20, morale: -10, days: 2 },
      },
    ],
  },
  {
    id: 'ev-customs-check',
    title: '严格的海关检查',
    description: '前方出现了联邦海关的巡逻舰，他们要求停船接受检查，态度十分强硬。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '配合检查，出示所有证件',
        resultText: '海关官员确认一切正常，虽然耽误了些时间，但你保持了良好的信用记录。',
        effect: { days: 1, morale: 5 },
      },
      {
        id: 'opt-2',
        text: '悄悄塞给官员一笔贿赂',
        resultText: '官员不动声色地收下了星币，挥手让你们快速通过。',
        effect: { stardust: -80 },
      },
      {
        id: 'opt-3',
        text: '争辩抗议，耽误时间',
        resultText: '你据理力争了很久，虽然最终被放行，但浪费了大量时间和精力。',
        effect: { days: 3, morale: -15 },
      },
      {
        id: 'opt-4',
        text: '尝试绕开关卡',
        resultText: '你找到了一条监控盲区的航线，虽然惊险但成功绕过了检查，只是多消耗了些燃料。',
        effect: { fuel: -20, morale: 10 },
      },
    ],
  },
  {
    id: 'ev-smuggler-offer',
    title: '走私者的邀约',
    description: '在港口的酒吧里，一个神秘的走私商人找上了你，他提议帮他运送一批"特殊货物"，报酬相当丰厚。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '接受邀约，赚这笔大钱',
        resultText: '你成功将货物送达目的地，走私者如约支付了报酬，但这件事让你良心有些不安。',
        effect: { stardust: 200, morale: -10 },
      },
      {
        id: 'opt-2',
        text: '断然拒绝，与犯罪划清界限',
        resultText: '你坚定地拒绝了邀约，虽然失去了一大笔钱，但内心坦荡。邻座的一位商人欣赏你的正直，给了你一个合法的货运机会。',
        effect: { stardust: 60, morale: 15 },
      },
      {
        id: 'opt-3',
        text: '假装答应，暗中举报',
        resultText: '你向当地治安官举报了走私者，获得了举报奖励，走私者被绳之以法。',
        effect: { stardust: 100, morale: 20, days: 1 },
      },
    ],
  },
  {
    id: 'ev-mechanical-failure',
    title: '突发机械故障',
    description: '飞船的主引擎突然发出刺耳的噪音后停机了！警报声响彻整个船舱，必须立即处理。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '使用维修包紧急修复',
        resultText: '维修包中的纳米机器人完美修复了故障，引擎重新启动，比之前运转得更顺畅。',
        effect: { fuel: -10 },
      },
      {
        id: 'opt-2',
        text: '让机械师全力抢修',
        resultText: '机械师不眠不休地工作了两天，终于修好了引擎，不过他累垮了需要休息。',
        effect: { days: 2, morale: -15, fuel: -15 },
      },
      {
        id: 'opt-3',
        text: '就近呼叫维修服务',
        resultText: '维修队很快赶到并修好了引擎，但他们的收费可真不便宜。',
        effect: { stardust: -150, days: 1 },
      },
    ],
  },
  {
    id: 'ev-comm-lost',
    title: '通讯迷航',
    description: '飞船进入了一片强烈的电磁干扰区域，所有通讯设备失灵，星图导航也出现了偏差。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '使用备用导航仪，谨慎前进',
        resultText: '在船员们的通力协作下，你们小心翼翼地走出了干扰区，虽然多花了几天但没有迷路。',
        effect: { days: 2, fuel: -10 },
      },
      {
        id: 'opt-2',
        text: '凭经验盲目前行',
        resultText: '你的领航员经验丰富，成功地凭直觉找到了出路，大家都松了一口气。',
        effect: { days: 1, morale: 10 },
      },
      {
        id: 'opt-3',
        text: '停下来等待干扰消散',
        resultText: '你们在原地等待了几天，干扰终于消散，但消耗了不少补给，船员们也有些焦虑。',
        effect: { days: 3, fuel: -5, morale: -10 },
      },
    ],
  },
  {
    id: 'ev-religious-fanatics',
    title: '宗教狂热份子',
    description: '一群身穿长袍的狂热教徒堵住了飞船入口，他们要求你加入他们的信仰，否则不让你离开。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '假装感兴趣，敷衍应付',
        resultText: '你耐心听完他们的布道并假装被感化，他们终于满意地离开了，还送给你一份"祝福礼"。',
        effect: { stardust: 20, morale: -5, days: 1 },
      },
      {
        id: 'opt-2',
        text: '坚定拒绝并强行通过',
        resultText: '你的坚决态度让他们退缩了，但争执过程中有人受了点轻伤，气氛有些紧张。',
        effect: { morale: -15, fuel: -5 },
      },
      {
        id: 'opt-3',
        text: '耐心沟通，讲道理说服',
        resultText: '经过长时间的辩论，你成功说服了其中的领袖，他不仅让你们通行，还为之前的无礼道歉。',
        effect: { morale: 15, days: 2 },
      },
    ],
  },
  {
    id: 'ev-pirate-scout',
    title: '太空海盗侦察',
    description: '雷达探测到一艘海盗侦察舰正在尾随着你们，他们正在评估是否要发动攻击。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '释放假信号迷惑他们',
        resultText: '你伪造了一艘大型战舰的信号，海盗侦察舰吓得仓皇逃走，船员们为你的机智鼓掌。',
        effect: { morale: 15 },
      },
      {
        id: 'opt-2',
        text: '全速逃离',
        resultText: '飞船开足马力甩掉了追踪者，但消耗了大量燃料。',
        effect: { fuel: -30 },
      },
      {
        id: 'opt-3',
        text: '主动示好，支付保护费',
        resultText: '你支付了一笔"过路费"，海盗们心满意足地离开了，承诺在这片区域不会再来骚扰。',
        effect: { stardust: -100 },
      },
    ],
  },
  {
    id: 'ev-resource-dispute',
    title: '资源争端',
    description: '你和另一艘商船同时发现了一颗富含资源的小行星，对方声称是他们先发现的，气氛剑拔弩张。',
    triggerCondition: 'mid',
    options: [
      {
        id: 'opt-1',
        text: '提议平分资源',
        resultText: '对方接受了你的提议，你们公平地分配了采矿权，虽然少赚了一点，但避免了冲突。',
        effect: { stardust: 70, morale: 5 },
      },
      {
        id: 'opt-2',
        text: '抢先开采，速战速决',
        resultText: '你们以最快速度采集了大量矿石后扬长而去，对方气得跳脚但无可奈何。',
        effect: { stardust: 150, morale: -10, days: 1 },
      },
      {
        id: 'opt-3',
        text: '退让一步，主动离开',
        resultText: '你决定不愿为了资源结怨，大度地离开了。对方船长被你的风度打动，在港口请你喝了一杯并介绍了一个好生意。',
        effect: { stardust: 50, morale: 10 },
      },
    ],
  },

  {
    id: 'ev-pirate-attack',
    title: '海盗袭击！',
    description: '警报大作！三艘海盗战舰包围了你的飞船，为首的海盗头目通过通讯频道要求你交出所有货物和星币，否则就将你轰成碎片！',
    triggerCondition: 'high',
    options: [
      {
        id: 'opt-1',
        text: '交出一半财物换取性命',
        resultText: '海盗们拿走了大量星币和部分燃料，但遵守承诺放你们离开了。破财消灾，活着最重要。',
        effect: { stardust: -300, fuel: -40, morale: -20 },
      },
      {
        id: 'opt-2',
        text: '拼死一战！',
        resultText: '经过一番惊心动魄的战斗，你们奇迹般地击退了海盗！虽然船体受损严重，但缴获了海盗遗落的战利品！',
        effect: { stardust: 200, fuel: -50, morale: 30, days: 1 },
      },
      {
        id: 'opt-3',
        text: '紧急跃迁逃离',
        resultText: '你孤注一掷启动紧急跃迁，飞船摇摇晃晃地跳入超空间，虽然跃迁不稳出了点故障，但总算摆脱了海盗。',
        effect: { fuel: -60, morale: -10, days: 2 },
      },
      {
        id: 'opt-4',
        text: '用外交徽章谈判',
        resultText: '你亮出外交使节徽章，声称自己是议会官员。海盗头子犹豫再三，最终不敢得罪议会，只象征性收了点过路费就放行了。',
        effect: { stardust: -50, morale: 15 },
      },
    ],
  },
  {
    id: 'ev-supernova',
    title: '超新星风暴',
    description: '前方一颗恒星毫无征兆地发生了超新星爆发！致命的辐射风暴正在以光速向你逼近！',
    triggerCondition: 'high',
    options: [
      {
        id: 'opt-1',
        text: '展开防辐射护盾硬扛',
        resultText: '护盾在辐射风暴中滋滋作响，勉强扛过了最危险的阶段。护盾发生器严重过载，但船员们安然无恙。',
        effect: { fuel: -30, morale: -10 },
      },
      {
        id: 'opt-2',
        text: '紧急转向躲入行星背面',
        resultText: '你发现附近有一颗行星，开足马力冲到它的背面，行星挡住了大部分辐射。惊险但完美的应对！',
        effect: { fuel: -25, morale: 20 },
      },
      {
        id: 'opt-3',
        text: '全速冲过风暴边缘',
        resultText: '飞船高速突进，虽然承受了一些辐射损伤，但成功穿越了最危险的区域，还意外发现了风暴中的珍贵能量晶体！',
        effect: { stardust: 180, morale: -20, fuel: -20 },
      },
    ],
  },
  {
    id: 'ev-alien-creature',
    title: '未知外星异形',
    description: '货舱传来奇怪的声响，你们前去检查时发现了一只从未见过的外星生物！它体型巨大，面目狰狞，正虎视眈眈地盯着你们。',
    triggerCondition: 'high',
    options: [
      {
        id: 'opt-1',
        text: '尝试用食物安抚它',
        resultText: '你小心翼翼地递出食物，怪物嗅了嗅，突然变得温顺起来——原来它只是饿坏了。它跟着你走出了飞船，临走前还吐出了一块闪闪发光的矿石！',
        effect: { stardust: 120, morale: 10, days: 1 },
      },
      {
        id: 'opt-2',
        text: '将它引到逃生舱放逐太空',
        resultText: '你们费了九牛二虎之力将它引入逃生舱并释放到太空中。虽然有些残忍，但安全第一。船员们惊魂未定。',
        effect: { morale: -15, fuel: -10 },
      },
      {
        id: 'opt-3',
        text: '麻醉它卖给生物研究所',
        resultText: '你设法用镇静剂制服了这个生物，将它卖给了下一个港口的研究所，获得了一笔巨额报酬。',
        effect: { stardust: 250, morale: -5, days: 2 },
      },
    ],
  },
  {
    id: 'ev-wormhole',
    title: '虫洞异常',
    description: '前方空间突然扭曲，一个不稳定的虫洞出现在航线上！它的引力正在拉扯你的飞船，要么被吸入，要么想办法挣脱！',
    triggerCondition: 'high',
    options: [
      {
        id: 'opt-1',
        text: '顺势进入虫洞冒险',
        resultText: '天旋地转后，你发现飞船被传送到了离终点极近的空域！这是一个幸运的虫洞！节省了大量时间！',
        effect: { days: -10, morale: 20, fuel: -40 },
      },
      {
        id: 'opt-2',
        text: '全力逆转引擎逃脱引力',
        resultText: '引擎咆哮着超负荷运转，你们艰难地挣脱了虫洞引力。引擎严重过载，需要时间冷却。',
        effect: { days: 3, fuel: -50, morale: -10 },
      },
      {
        id: 'opt-3',
        text: '利用引力弹弓加速',
        resultText: '你精妙地利用虫洞边缘的引力场为飞船加速，虽然惊险但获得了极大的动能！',
        effect: { days: -5, fuel: 30, morale: 15 },
      },
    ],
  },
];
