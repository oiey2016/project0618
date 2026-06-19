export interface Suspicion {
  id: string
  description: string
  sourceCharacterId: string
  detail: string
}

export const suspicions: Suspicion[] = [
  {
    id: 'sus-1',
    description: '赵明辉声称当晚没去过画室',
    sourceCharacterId: 'zhao-minghui',
    detail: '但他的笔记中记录了画室窗户的高度'
  },
  {
    id: 'sus-2',
    description: '苏婉清回国时间与修改遗嘱时间重合',
    sourceCharacterId: 'su-wanqing',
    detail: '但这与凶案无直接关联'
  },
  {
    id: 'sus-3',
    description: '陈默能准确描述遗作画面',
    sourceCharacterId: 'chen-mo',
    detail: '说明他趁夜进过画室'
  },
  {
    id: 'sus-4',
    description: '林小雨对父亲死讯反应有延迟',
    sourceCharacterId: 'lin-xiaoyu',
    detail: '她早就知道遗嘱变更'
  },
  {
    id: 'sus-5',
    description: '赵明辉对拍卖款细节回避',
    sourceCharacterId: 'zhao-minghui',
    detail: '他挪用了拍卖款'
  },
  {
    id: 'sus-6',
    description: '画室茶杯有两个人指纹',
    sourceCharacterId: 'zhou-jingguan',
    detail: '有人陪林远舟喝茶'
  },
  {
    id: 'sus-7',
    description: '赵明辉手机定位案发时段有1小时空白',
    sourceCharacterId: 'zhao-minghui',
    detail: '他关闭了手机'
  }
]
