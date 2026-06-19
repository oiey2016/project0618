import type { StoryNode } from '@/types/game';

export const storyNodes: Record<string, StoryNode> = {
  start: {
    id: 'start',
    messages: [
      {
        sender: 'system',
        content: '[ 卫星通讯建立中... 信号强度: 58% ]',
        delay: 1500,
      },
      {
        sender: 'system',
        content: '[ 检测到幸存者生命体征... 坐标: 月球背面 未知区域 ]',
        delay: 2000,
      },
      {
        sender: 'astronaut',
        content: '喂... 喂？有人吗？能不能听到我说话？',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '我是"猎户座七号"任务的宇航员，李航。我的飞船坠毁了... 我被困在月球上。',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '请求协助... 请求紧急救援...',
        delay: 2500,
      },
    ],
    choices: [
      {
        id: 'start_calm',
        text: '深呼吸，李航。你现在安全吗？有没有受伤？',
        nextNodeId: 'intro_calm',
      },
      {
        id: 'start_action',
        text: '李航，立刻报告你的位置和周围环境。',
        nextNodeId: 'intro_action',
      },
    ],
  },

  intro_calm: {
    id: 'intro_calm',
    messages: [
      {
        sender: 'astronaut',
        content: '我... 我在试着冷静。头有点晕，宇航服的右臂好像破了个小口，好在生命维持系统还在工作。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '周围一片漆黑，只有着陆器残骸散落在周围。地表看起来像是在一个陨石坑里。',
        delay: 3500,
      },
    ],
    statusEffect: { stamina: -3 },
    nextNodeId: 'first_decision',
  },

  intro_action: {
    id: 'intro_action',
    messages: [
      {
        sender: 'astronaut',
        content: '明白！坐标已经上传... 我在一个大型陨石坑内，着陆器主体结构损毁约60%。',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '生命体征正常，右臂宇航服有轻微破损，但已自动密封。周围没有其他幸存者迹象。',
        delay: 3500,
      },
    ],
    statusEffect: { signal: +3 },
    nextNodeId: 'first_decision',
  },

  first_decision: {
    id: 'first_decision',
    messages: [
      {
        sender: 'system',
        content: '[ 扫描显示：着陆器主体位于东北方向约200米处，可能有物资和应急信标 ]',
        delay: 2000,
      },
      {
        sender: 'system',
        content: '[ 警告：月球表面温度正在急剧下降，氧气储备持续消耗中 ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '我看到了... 残骸那边应该还有能用的东西。但外面真的很冷，而且我不确定氧气够不够。',
        delay: 3500,
      },
    ],
    choices: [
      {
        id: 'decision_explore',
        text: '立刻前往残骸收集物资。趁现在状态还行，速去速回。',
        nextNodeId: 'explore_wreckage',
        statusEffect: { stamina: -15, oxygen: -10 },
      },
      {
        id: 'decision_stay',
        text: '留在原地保存体力，用应急频道持续呼叫救援。',
        nextNodeId: 'stay_wait',
        statusEffect: { oxygen: -5, signal: -5 },
      },
      {
        id: 'decision_scout',
        text: '先登上陨石坑边缘观察周围环境，再决定下一步。',
        nextNodeId: 'scout_area',
        statusEffect: { stamina: -8 },
      },
    ],
  },

  explore_wreckage: {
    id: 'explore_wreckage',
    messages: [
      {
        sender: 'astronaut',
        content: '收到！正在向残骸移动... 地表比我想象的更难走，每一步都要很小心。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '到达了！天呐，比我预想的更惨... 驾驶舱整个没了。但物资舱看起来还算完整！',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '我找到了！备用氧气罐、应急医疗包、还有... 等等，这是备用信标发射器！虽然可能坏了。',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 检测到新物品获得: 备用氧气罐 (+30% 氧气), 医疗包, 损坏的信标 ]',
        delay: 2000,
      },
    ],
    statusEffect: { oxygen: +30, health: +5 },
    choices: [
      {
        id: 'wreckage_use_beacon',
        text: '优先尝试修复信标，这是被救援的最大希望。',
        nextNodeId: 'repair_beacon',
        statusEffect: { stamina: -12, signal: +15 },
      },
      {
        id: 'wreckage_rest',
        text: '先用医疗包处理伤口，补充氧气，休息一下。',
        nextNodeId: 'rest_and_heal',
        statusEffect: { health: +15, stamina: +20, oxygen: -5 },
      },
      {
        id: 'wreckage_search_more',
        text: '继续搜索残骸，看看有没有更多有用的东西。',
        nextNodeId: 'search_deeper',
        statusEffect: { stamina: -10, oxygen: -8 },
      },
    ],
  },

  stay_wait: {
    id: 'stay_wait',
    messages: [
      {
        sender: 'astronaut',
        content: '好的，我就待在这儿... 应急频道一直开着。',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '安静，太安静了... 除了自己的呼吸声，什么都听不到。',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '等等！有声音！好像是... 通讯器的静电噪音！',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 信号波动检测... 有微弱未知信号从东南方向传来 ]',
        delay: 2500,
      },
    ],
    statusEffect: { signal: -3 },
    choices: [
      {
        id: 'stay_follow_signal',
        text: '那个信号可能是其他幸存者！立刻去调查！',
        nextNodeId: 'follow_signal',
        statusEffect: { stamina: -15, oxygen: -12 },
      },
      {
        id: 'stay_amplify',
        text: '尝试调节通讯器，放大这个信号，看看是什么。',
        nextNodeId: 'amplify_signal',
        statusEffect: { stamina: -5, signal: +8 },
      },
      {
        id: 'stay_ignore',
        text: '信号太微弱，可能是干扰。待在原地继续呼叫。',
        nextNodeId: 'keep_waiting',
        statusEffect: { oxygen: -10, signal: -8 },
      },
    ],
  },

  scout_area: {
    id: 'scout_area',
    messages: [
      {
        sender: 'astronaut',
        content: '正在攀登陨石坑边缘... 坡度不大，但穿着厚重的宇航服真的很累。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '登顶了！我的天... 这是一个巨大的陨石坑，比我从飞船上看到的还要大。',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '等等... 那边！在陨石坑的另一边，有东西在闪光！像是人造结构！',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 远距离扫描: 检测到疑似月球基地结构，距离约 3.2 公里 ]',
        delay: 2500,
      },
    ],
    statusEffect: { signal: +10 },
    choices: [
      {
        id: 'scout_base',
        text: '那个基地可能有人！向那个方向出发！',
        nextNodeId: 'journey_base',
        statusEffect: { stamina: -20, oxygen: -15 },
      },
      {
        id: 'scout_wreckage_first',
        text: '太远了，先去残骸收集物资再出发。',
        nextNodeId: 'explore_wreckage',
        statusEffect: { stamina: -10, oxygen: -8 },
      },
      {
        id: 'scout_observe',
        text: '先在这里观察一段时间，确认那个结构是什么。',
        nextNodeId: 'observe_base',
        statusEffect: { stamina: +5, oxygen: -6, signal: +5 },
      },
    ],
  },

  repair_beacon: {
    id: 'repair_beacon',
    messages: [
      {
        sender: 'astronaut',
        content: '在修了... 线路板被撞歪了几根。好在我训练过应急维修。',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '好了！现在启动... 三、二、一——',
        delay: 2500,
      },
      {
        sender: 'system',
        content: '[ 信标已激活！求救信号已发送至近月轨道 ]',
        delay: 2000,
      },
      {
        sender: 'system',
        content: '[ 警告：信标电池容量有限，预计可持续 72 小时 ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '成功了！哈哈，成功了！现在就等救援了！',
        delay: 2500,
      },
    ],
    statusEffect: { signal: +25 },
    nextNodeId: 'mid_story',
  },

  rest_and_heal: {
    id: 'rest_and_heal',
    messages: [
      {
        sender: 'astronaut',
        content: '找到一个相对避风的角落，坐下来... 处理一下伤口。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '医疗包的止痛药很快就起效了。备用氧气罐也接上了，感觉好多了。',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '我刚才在残骸里还发现了一本任务日志... 也许里面有什么有用的信息？',
        delay: 3500,
      },
    ],
    choices: [
      {
        id: 'rest_read_log',
        text: '仔细阅读任务日志，看看有没有关于这次任务的线索。',
        nextNodeId: 'read_log',
        statusEffect: { stamina: +10 },
      },
      {
        id: 'rest_find_beacon',
        text: '日志以后再看，先找到信标发射器。',
        nextNodeId: 'repair_beacon',
        statusEffect: { stamina: -10, signal: +15 },
      },
    ],
  },

  search_deeper: {
    id: 'search_deeper',
    messages: [
      {
        sender: 'astronaut',
        content: '我往更深的地方走... 小心避开那些锋利的金属碎片。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '货舱后面有个被撞开的口子... 等等，这是什么？',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '我的天... 是一个逃生舱！看起来基本完好，甚至还有电！',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 逃生舱检测: 推进系统 45% 可用，生命维持系统 80% 可用 ]',
        delay: 2500,
      },
    ],
    statusEffect: { signal: +8 },
    choices: [
      {
        id: 'search_use_escape',
        text: '逃生舱是你离开这里的最好机会！立即检查启动条件。',
        nextNodeId: 'escape_pod_route',
        statusEffect: { stamina: -8 },
      },
      {
        id: 'search_take_supplies',
        text: '先把逃生舱里的物资全部拿出来，这些才是活下去的关键。',
        nextNodeId: 'mid_story',
        statusEffect: { health: +10, oxygen: +20, stamina: +10 },
      },
    ],
  },

  follow_signal: {
    id: 'follow_signal',
    messages: [
      {
        sender: 'astronaut',
        content: '跟着信号走... 方向是东南。地面越来越不平整了。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '我看到了！是... 一个探测器？不对，是之前坠毁的月球车？！',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '它的通讯系统还在工作，但车里没人... 不过有个储存箱！',
        delay: 3500,
      },
    ],
    statusEffect: { stamina: -5 },
    nextNodeId: 'rover_discovery',
  },

  amplify_signal: {
    id: 'amplify_signal',
    messages: [
      {
        sender: 'astronaut',
        content: '在调通讯器... 把功率调到最大。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '信号清晰了... 这不是人说话的声音，是... 数据？像是某种定位信标？',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 信号解析中... 检测到已知频率: 国际月球站应急信标 ID-7 ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '月球站？这里有月球站？！信号来源是东南方向！',
        delay: 3000,
      },
    ],
    statusEffect: { signal: +15 },
    choices: [
      {
        id: 'amplify_go_station',
        text: '月球站就是活下去的希望！立刻出发！',
        nextNodeId: 'journey_base',
        statusEffect: { stamina: -18, oxygen: -15 },
      },
      {
        id: 'amplify_reply',
        text: '尝试用同样的频率回复信号，也许月球站能听到我们。',
        nextNodeId: 'contact_station',
        statusEffect: { signal: +10, stamina: -5 },
      },
    ],
  },

  keep_waiting: {
    id: 'keep_waiting',
    messages: [
      {
        sender: 'astronaut',
        content: '继续呼叫... "这里是猎户座七号，李航，请求救援..."',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '氧气在消耗... 我开始觉得冷了...',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 警告: 氧气储备已降至危险水平 ]',
        delay: 2000,
      },
    ],
    statusEffect: { health: -8, oxygen: -5 },
    choices: [
      {
        id: 'wait_go_wreckage',
        text: '不能再等了！去残骸找备用氧气罐！',
        nextNodeId: 'explore_wreckage',
        statusEffect: { stamina: -15, oxygen: -8 },
      },
      {
        id: 'wait_follow_signal',
        text: '去追踪那个微弱信号！也许是唯一的希望！',
        nextNodeId: 'follow_signal',
        statusEffect: { stamina: -12, oxygen: -10 },
      },
    ],
  },

  journey_base: {
    id: 'journey_base',
    messages: [
      {
        sender: 'astronaut',
        content: '出发了... 三公里，在月球上走可不近。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '陨石坑边缘越来越近了... 那个闪光越来越清晰，真的是建筑！',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '不好... 前面有一片碎石区域，看起来不太稳定。得绕路或者硬闯。',
        delay: 3500,
      },
    ],
    choices: [
      {
        id: 'journey_detour',
        text: '安全第一，绕路过去。虽然会费些时间和体力。',
        nextNodeId: 'base_arrival',
        statusEffect: { stamina: -15, oxygen: -12 },
      },
      {
        id: 'journey_cross',
        text: '直接穿过，节省时间。小心点应该没事。',
        nextNodeId: 'rock_danger',
        statusEffect: { stamina: -8, oxygen: -5 },
      },
    ],
  },

  observe_base: {
    id: 'observe_base',
    messages: [
      {
        sender: 'astronaut',
        content: '静静地观察... 那个结构偶尔会闪一下光，像是某种灯光。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '我用通讯器扫了一圈... 能检测到微弱的电磁信号。是活的！',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 信号分析: 检测到民用级通讯协议，疑似月球研究站 ]',
        delay: 2500,
      },
    ],
    choices: [
      {
        id: 'observe_go_now',
        text: '确认了，立刻出发去基地！',
        nextNodeId: 'journey_base',
        statusEffect: { stamina: -15, oxygen: -12 },
      },
      {
        id: 'observe_signal',
        text: '先尝试用通讯器联系基地，告诉他们我们来了。',
        nextNodeId: 'contact_station',
        statusEffect: { signal: +8, stamina: -3 },
      },
    ],
  },

  read_log: {
    id: 'read_log',
    messages: [
      {
        sender: 'astronaut',
        content: '打开日志... 前面都是例行记录，直到... 等等，这里有加密内容？',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '解密了... "本次任务真实目标：确认月球背面检测到的异常信号来源。"',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '异常信号？所以我们坠毁的地方... 就是信号来源？这不可能是巧合...',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 日志附件: 坐标标记 - 距离当前位置 1.8 公里，陨石坑中心 ]',
        delay: 2500,
      },
    ],
    statusEffect: { signal: +5 },
    choices: [
      {
        id: 'log_investigate',
        text: '这个信号也许就是关键。去坐标标记的地方看看！',
        nextNodeId: 'mystery_signal',
        statusEffect: { stamina: -15, oxygen: -10 },
      },
      {
        id: 'log_beacon',
        text: '别管什么秘密了，先修复信标求救。',
        nextNodeId: 'repair_beacon',
        statusEffect: { stamina: -10, signal: +15 },
      },
    ],
  },

  rover_discovery: {
    id: 'rover_discovery',
    messages: [
      {
        sender: 'astronaut',
        content: '打开储存箱... 里面有备用电池、工具、还有一个完整的便携氧气罐！',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '月球车的导航系统还能用... 上面有标记！最近的月球研究站只在 2.5 公里外！',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 物资获取: 便携氧气罐 (+25% 氧气), 高能电池, 维修工具 ]',
        delay: 2000,
      },
    ],
    statusEffect: { oxygen: +25 },
    choices: [
      {
        id: 'rover_go_station',
        text: '有了这些补给，立刻出发去月球站！',
        nextNodeId: 'base_arrival',
        statusEffect: { stamina: -10, oxygen: -5 },
      },
      {
        id: 'rover_fix_rover',
        text: '尝试用工具修复月球车，能开车就省体力了。',
        nextNodeId: 'fix_rover',
        statusEffect: { stamina: -8, signal: +3 },
      },
    ],
  },

  contact_station: {
    id: 'contact_station',
    messages: [
      {
        sender: 'astronaut',
        content: '"这里是猎户座七号宇航员李航，听到请回答！..."',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '静... 有动静了！',
        delay: 2500,
      },
      {
        sender: 'system',
        content: '[ 通讯建立: 月球研究站 "嫦娥基地" ]',
        delay: 2000,
      },
      {
        sender: 'system',
        content: '[ 嫦娥基地 ]: "李航？收到你的信号了！你还活着！我们立刻派出救援车！"',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '他们来了... 他们真的来了！',
        delay: 2500,
      },
    ],
    statusEffect: { signal: +30 },
    nextNodeId: 'rescue_coming',
  },

  rock_danger: {
    id: 'rock_danger',
    messages: [
      {
        sender: 'astronaut',
        content: '小心地穿过碎石... 脚下的石头在滑动——',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '糟了！！',
        delay: 1500,
      },
      {
        sender: 'system',
        content: '[ 警告: 检测到撞击！宇航服左胸受损！氧气泄漏！ ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '嘶... 该死，摔了一跤，宇航服破了！我得赶紧把它封住！',
        delay: 3500,
      },
    ],
    statusEffect: { health: -20, oxygen: -20 },
    choices: [
      {
        id: 'rock_patch_fast',
        text: '用应急密封贴快速处理，然后赶紧继续赶路。',
        nextNodeId: 'base_arrival',
        statusEffect: { health: -5, oxygen: -10, stamina: -5 },
      },
      {
        id: 'rock_patch_proper',
        text: '停下仔细修补，确保没有隐患。安全第一。',
        nextNodeId: 'base_arrival',
        statusEffect: { stamina: -15, oxygen: -15 },
      },
    ],
  },

  escape_pod_route: {
    id: 'escape_pod_route',
    messages: [
      {
        sender: 'astronaut',
        content: '进入逃生舱... 控制台启动中。',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '系统显示推进燃料只够进行一次短距起飞... 只能进入近月轨道，没法回地球。',
        delay: 4000,
      },
      {
        sender: 'astronaut',
        content: '但如果我进入轨道，也许能被巡逻的救援舰发现...',
        delay: 3000,
      },
    ],
    choices: [
      {
        id: 'pod_launch',
        text: '博一把！启动逃生舱，进入轨道求救！',
        nextNodeId: 'pod_launch_sequence',
        statusEffect: { stamina: -10 },
      },
      {
        id: 'pod_wait',
        text: '太冒险了。逃生舱留着当庇护所，用它的电力发送求救信号。',
        nextNodeId: 'mid_story',
        statusEffect: { signal: +20 },
      },
    ],
  },

  mystery_signal: {
    id: 'mystery_signal',
    messages: [
      {
        sender: 'astronaut',
        content: '往陨石坑中心走... 这里的地面颜色不一样，像是玻璃化的？',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '看到了！陨石坑正中央有个... 金属结构？不是我们的技术风格...',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 警告: 未知能量波动！信号强度急剧上升！ ]',
        delay: 2000,
      },
      {
        sender: 'astronaut',
        content: '它在... 发光？我应该怎么办？',
        delay: 3000,
      },
    ],
    choices: [
      {
        id: 'mystery_touch',
        text: '小心靠近，尝试触碰或激活它。',
        nextNodeId: 'artifact_ending',
        statusEffect: { signal: +40 },
      },
      {
        id: 'mystery_observe',
        text: '保持距离观察，先采集一些数据样本。',
        nextNodeId: 'mid_story',
        statusEffect: { signal: +15, stamina: -5 },
      },
      {
        id: 'mystery_leave',
        text: '这东西太危险了，赶紧离开去找月球站。',
        nextNodeId: 'journey_base',
        statusEffect: { stamina: -10, oxygen: -8 },
      },
    ],
  },

  fix_rover: {
    id: 'fix_rover',
    messages: [
      {
        sender: 'astronaut',
        content: '检查引擎... 好像只是线路松了。电池倒是满的！',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '接上！启动！... 有反应了！月球车修好了！',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 月球车状态: 动力系统 75% 可用，最高时速 12km/h ]',
        delay: 2000,
      },
    ],
    statusEffect: { stamina: +20, oxygen: +10 },
    nextNodeId: 'base_arrival',
  },

  base_arrival: {
    id: 'base_arrival',
    messages: [
      {
        sender: 'astronaut',
        content: '终于... 到了！月球站的入口就在眼前！',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '我按了门铃... 拜托了，有人吗？',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 气闸门开启: 欢迎来到嫦娥研究基地 ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '有人... 他们看到我了！门开了！我要进去了！',
        delay: 3000,
      },
    ],
    statusEffect: { health: +20, oxygen: +50, stamina: +30, signal: +50 },
    isEnding: true,
    endingType: 'rescue',
    endingTitle: '救援成功',
    endingDescription: '李航成功抵达嫦娥月球研究基地，得到了及时的救援和医疗救治。在医护人员的精心照料下，他的身体逐渐恢复。三天后，一艘地月通勤船将他安全送回地球。\n\n这次事故让全世界意识到了深空探索的风险，也让李航成为了讲述月球历险故事的英雄。而他从月球带回的那些神秘数据，将在未来几十年里一直困扰着科学家们...',
  },

  rescue_coming: {
    id: 'rescue_coming',
    messages: [
      {
        sender: 'system',
        content: '[ 嫦娥基地 ]: "救援车预计 40 分钟后到达你的位置。保持通讯畅通，尽量保存体力。"',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '40分钟... 我能撑住的，一定能。',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 38 分钟后... ]',
        delay: 2000,
      },
      {
        sender: 'astronaut',
        content: '看到车灯了！他们来了！我看到了！',
        delay: 2500,
      },
    ],
    statusEffect: { health: +30, oxygen: +40, stamina: +20, signal: +50 },
    isEnding: true,
    endingType: 'rescue',
    endingTitle: '通讯救命',
    endingDescription: '在最关键的时刻，李航选择了相信那个微弱的信号。正是这个决定让他与嫦娥月球基地建立了联系。\n\n救援车将他安全带回基地，医护团队立即开始治疗。虽然在月球表面经历了惊心动魄的一夜，但李航奇迹般地只受了轻伤。\n\n回到地球后，李航被授予航天英雄勋章。他常说："在太空中，永远不要放弃任何一丝希望——哪怕它只是一个微弱的信号。"',
  },

  pod_launch_sequence: {
    id: 'pod_launch_sequence',
    messages: [
      {
        sender: 'astronaut',
        content: '系统启动... 推进器预热... 倒计时开始！',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '三... 二... 一... 发射！',
        delay: 2500,
      },
      {
        sender: 'system',
        content: '[ 逃生舱已进入近月轨道 ]',
        delay: 2000,
      },
      {
        sender: 'astronaut',
        content: '进入轨道了！现在发送求救信号... 拜托，拜托有人能听到...',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 求救信号已广播... 正在等待回应... ]',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 信号响应: 近月巡逻舰 "曙光号" 预计 3 小时后抵达 ]',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '哈... 哈哈哈... 我做到了... 我真的做到了！',
        delay: 3000,
      },
    ],
    statusEffect: { health: +20, oxygen: +30, stamina: +10, signal: +50 },
    isEnding: true,
    endingType: 'survive',
    endingTitle: '搏命升空',
    endingDescription: '这是一场豪赌，而李航赢了。\n\n逃生舱的燃料刚刚够让他进入近月轨道，而巡逻舰"曙光号"刚好就在附近执行例行任务。如果他没有赌这一把，如果救援舰不在附近——结局也许完全不同。\n\n当曙光号的对接舱与逃生舱成功连接时，李航瘫坐在座椅上，泪水在零重力中漂浮。他不仅活了下来，更用自己的勇气证明了：在绝望面前，最大的冒险就是不去冒险。',
  },

  artifact_ending: {
    id: 'artifact_ending',
    messages: [
      {
        sender: 'astronaut',
        content: '我的手... 碰到它了——',
        delay: 3000,
      },
      {
        sender: 'system',
        content: '[ 能量爆发！！！——— ]',
        delay: 1000,
      },
      {
        sender: 'system',
        content: '[ 通讯信号中断... ]',
        delay: 2000,
      },
      {
        sender: 'system',
        content: '[ 信号恢复... 位置变化检测: 李航的坐标已从月球表面消失 ]',
        delay: 3000,
      },
      {
        sender: 'astronaut',
        content: '你好... 还在吗？我... 我也不知道该怎么描述我看到的。',
        delay: 4000,
      },
      {
        sender: 'astronaut',
        content: '我想... 我找到了我们一直在寻找的答案。',
        delay: 4000,
      },
    ],
    statusEffect: { signal: +100, health: +50, oxygen: +50, stamina: +50 },
    isEnding: true,
    endingType: 'sacrifice',
    endingTitle: '星际使者',
    endingDescription: '在触碰那个神秘结构的瞬间，李航被传送到了一个无法用语言描述的地方。\n\n他看到了银河系的历史，看到了无数文明的兴衰，也看到了人类的未来——一条充满希望但也充满挑战的道路。\n\n当他再次恢复意识时，发现自己正漂浮在地球轨道上，被一艘过路的商船搭救。他的宇航服完好无损，甚至比新的还管用。\n\n没有人相信他讲述的故事，除了那些从他宇航服中检测到的、不属于任何已知元素的奇异物质。\n\n李航知道，他已经不再是一个普通的宇航员了。他是某种... 信使。而他的故事，才刚刚开始。',
  },

  mid_story: {
    id: 'mid_story',
    messages: [
      {
        sender: 'astronaut',
        content: '好了，现在的情况... 比刚坠毁时好多了。但我还是得想办法离开这儿。',
        delay: 3500,
      },
      {
        sender: 'system',
        content: '[ 信号扫描更新: 检测到两个方向的潜在目标 ]',
        delay: 2500,
      },
      {
        sender: 'system',
        content: '[ 方向A: 东南 - 疑似月球研究站，距离 2.8 公里 ]',
        delay: 2500,
      },
      {
        sender: 'system',
        content: '[ 方向B: 西南 - 未知信号源，距离 1.5 公里，信号特征异常 ]',
        delay: 2500,
      },
      {
        sender: 'astronaut',
        content: '两个选择... 月球站是安全的选择，而那个未知信号... 也许是什么惊人的发现？',
        delay: 4000,
      },
    ],
    choices: [
      {
        id: 'mid_station',
        text: '别冒险了，去月球站才是理智的选择。',
        nextNodeId: 'journey_base',
        statusEffect: { stamina: -15, oxygen: -12 },
      },
      {
        id: 'mid_mystery',
        text: '那个信号也许是这次任务坠毁的原因，我得去看看。',
        nextNodeId: 'mystery_signal',
        statusEffect: { stamina: -12, oxygen: -8 },
      },
      {
        id: 'mid_wait',
        text: '如果信标已经启动了，就在这里等救援。',
        nextNodeId: 'rescue_coming',
        statusEffect: { oxygen: -15, signal: -5 },
      },
    ],
  },

  death_oxygen: {
    id: 'death_oxygen',
    messages: [
      {
        sender: 'system',
        content: '[ 警告: 氧气储备耗尽 ]',
        delay: 1500,
      },
      {
        sender: 'astronaut',
        content: '呼吸... 越来越困难了... 视野... 在模糊...',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '对不起... 我... 尽力了...',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 生命体征消失... 通讯终止 ]',
        delay: 2500,
      },
    ],
    isEnding: true,
    endingType: 'death',
    endingTitle: '寂静之死',
    endingDescription: '氧气最终还是耗尽了。\n\n李航在月球的漫漫长夜中永远地闭上了眼睛。他的身体将在真空环境中完好保存，成为这片荒凉土地上又一个沉默的里程碑。\n\n直到多年后，一支月球探险队发现了他的遗骸，以及他用最后的力气在宇航服头盔上刻下的字：\n\n"我不后悔仰望星空。"',
  },

  death_health: {
    id: 'death_health',
    messages: [
      {
        sender: 'system',
        content: '[ 警告: 生命体征急剧下降 ]',
        delay: 1500,
      },
      {
        sender: 'astronaut',
        content: '好痛... 身体... 撑不住了...',
        delay: 3500,
      },
      {
        sender: 'astronaut',
        content: '请告诉我的家人... 我爱他们...',
        delay: 4000,
      },
      {
        sender: 'system',
        content: '[ 心脏停搏... 已确认死亡 ]',
        delay: 2500,
      },
    ],
    isEnding: true,
    endingType: 'death',
    endingTitle: '伤重不治',
    endingDescription: '伤势最终还是夺去了李航的生命。\n\n在最后清醒的时刻，他用通讯器录下了留给家人的遗言。这些音频数据通过微弱的信号传回地球，成为了他留给这个世界最后的礼物。\n\n航天部门将李航追授为"太空烈士"，并以他的名字命名了一座新建成的深空探测站。\n\n人类探索宇宙的脚步从未停止，而每一步，都有人在为之付出一切。',
  },
};

export const DEATH_NODES = {
  oxygen: 'death_oxygen',
  health: 'death_health',
};

export const START_NODE_ID = 'start';
