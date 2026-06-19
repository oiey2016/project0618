export interface Character {
  id: string
  name: string
  avatar: string
  title: string
  personality: string
  secret: string
  isOnline: boolean
  lastMessage: string
}

export const characters: Character[] = [
  {
    id: 'lin-xiaoyu',
    name: '林小雨',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20Chinese%20young%20woman%20in%20her%20early%2020s%20melancholic%20eyes%20pale%20skin%20noir%20style%20dark%20moody%20cinematic&image_size=square',
    title: '死者女儿，大学生',
    personality: '表面悲伤温柔，偶尔冷漠',
    secret: '知道父亲曾想修改遗嘱剥夺她的继承权',
    isOnline: true,
    lastMessage: '我……还是不敢相信爸爸走了'
  },
  {
    id: 'zhao-minghui',
    name: '赵明辉',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20Chinese%20man%20in%20his%2040s%20shrewd%20eyes%20suit%20noir%20style%20dark%20moody%20cinematic&image_size=square',
    title: '死者经纪人，40岁精明世故',
    personality: '精明世故，善于周旋',
    secret: '挪用了林远舟画作的拍卖款欠下巨债',
    isOnline: true,
    lastMessage: '我跟远舟是多年的老交情了'
  },
  {
    id: 'su-wanqing',
    name: '苏婉清',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20Chinese%20elegant%20woman%20in%20her%20late%2030s%20resentful%20gaze%20noir%20style%20dark%20moody%20cinematic&image_size=square',
    title: '死者前妻，38岁优雅怨恨刚从法国回来',
    personality: '优雅而怨恨，言辞锋利',
    secret: '回国真实目的是争夺一幅价值千万的画',
    isOnline: true,
    lastMessage: '我回来得太晚了……'
  },
  {
    id: 'chen-mo',
    name: '陈默',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20Chinese%20quiet%20young%20man%20in%20his%2020s%20humble%20noir%20style%20dark%20moody%20cinematic&image_size=square',
    title: '死者学生/助手，25岁沉默寡言忠诚但自卑',
    personality: '沉默寡言，忠诚但自卑',
    secret: '偷偷临摹了林远舟的未完成遗作',
    isOnline: true,
    lastMessage: '老师他……对我很好'
  },
  {
    id: 'zhou-jingguan',
    name: '周警官',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20Chinese%20middle-aged%20police%20officer%20in%20his%2040s%20stern%20noir%20style%20dark%20moody%20cinematic&image_size=square',
    title: '办案刑警，45岁公事公办偶尔透露案情',
    personality: '公事公办，偶尔透露案情',
    secret: '发现了画室的暗门但暂时保密',
    isOnline: true,
    lastMessage: '案情还在调查中'
  }
]
