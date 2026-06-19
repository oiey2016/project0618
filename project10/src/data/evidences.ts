export interface Evidence {
  id: string
  description: string
  type: 'physical' | 'document' | 'testimony'
  sourceNoteId: string
  linkedSuspicionIds: string[]
  detail: string
}

export const evidences: Evidence[] = [
  {
    id: 'ev-1',
    description: '画室窗户下的泥脚印',
    type: 'physical',
    sourceNoteId: 'note-zhao-2',
    linkedSuspicionIds: ['sus-1'],
    detail: '脚印与赵明辉鞋码吻合'
  },
  {
    id: 'ev-2',
    description: '茶杯上的第二组指纹',
    type: 'physical',
    sourceNoteId: 'note-zhou-2',
    linkedSuspicionIds: ['sus-6'],
    detail: '指纹属于赵明辉'
  },
  {
    id: 'ev-3',
    description: '赵明辉笔记本中的窗户尺寸记录',
    type: 'document',
    sourceNoteId: 'note-zhao-3',
    linkedSuspicionIds: ['sus-1', 'sus-5'],
    detail: '记录了画室窗户的精确尺寸'
  },
  {
    id: 'ev-4',
    description: '拍卖行转账记录',
    type: 'document',
    sourceNoteId: 'note-zhao-3',
    linkedSuspicionIds: ['sus-5'],
    detail: '款项未到林远舟账户'
  },
  {
    id: 'ev-5',
    description: '画室暗门',
    type: 'physical',
    sourceNoteId: 'note-zhou-3',
    linkedSuspicionIds: ['sus-6'],
    detail: '证明反锁的门不是唯一出口'
  }
]
