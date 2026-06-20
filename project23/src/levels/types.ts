export interface PlatformDef {
  x: number
  y: number
  width: number
  height: number
  type: 'ground' | 'floating' | 'wall'
}

export interface ObstacleDef {
  x: number
  y: number
  width: number
  height: number
  type: 'spike' | 'fire'
}

export interface LevelDefinition {
  id: number
  name: string
  hint: string
  platforms: PlatformDef[]
  obstacles: ObstacleDef[]
  goal: { x: number; y: number }
  playerStart: { x: number; y: number }
  allowedItems: string[]
  maxItems: number
  starThresholds: { three: number; two: number }
  background: string
}
