export interface TrackSegment {
  type: 'straight' | 'curve' | 'gap'
  length: number
  radius?: number
  angle?: number
  direction?: 'left' | 'right'
}

export interface LevelData {
  id: number
  name: string
  track: TrackSegment[]
  startPosition: [number, number, number]
  endPosition: [number, number, number]
}

export const levels: LevelData[] = [
  {
    id: 1,
    name: '初学者之路',
    track: [
      { type: 'straight', length: 8 },
      { type: 'curve', length: 4, radius: 3, angle: 90, direction: 'left' },
      { type: 'straight', length: 6 },
      { type: 'gap', length: 1.5 },
      { type: 'straight', length: 6 },
      { type: 'curve', length: 4, radius: 2.5, angle: -90, direction: 'right' },
      { type: 'straight', length: 8 },
    ],
    startPosition: [0, 2, 0],
    endPosition: [0, 2, 28],
  },
  {
    id: 2,
    name: '蜿蜒小径',
    track: [
      { type: 'straight', length: 5 },
      { type: 'curve', length: 3, radius: 2, angle: 90, direction: 'left' },
      { type: 'straight', length: 4 },
      { type: 'gap', length: 2 },
      { type: 'curve', length: 4, radius: 2.5, angle: -180, direction: 'right' },
      { type: 'gap', length: 1.8 },
      { type: 'straight', length: 6 },
      { type: 'curve', length: 3, radius: 2, angle: 90, direction: 'left' },
      { type: 'straight', length: 6 },
    ],
    startPosition: [0, 3, 0],
    endPosition: [-6, 3, 25],
  },
  {
    id: 3,
    name: '高空挑战',
    track: [
      { type: 'straight', length: 4 },
      { type: 'curve', length: 3, radius: 1.8, angle: 90, direction: 'left' },
      { type: 'gap', length: 2.2 },
      { type: 'straight', length: 5 },
      { type: 'curve', length: 4, radius: 2, angle: -90, direction: 'right' },
      { type: 'straight', length: 3 },
      { type: 'gap', length: 2.5 },
      { type: 'curve', length: 4, radius: 2, angle: 180, direction: 'left' },
      { type: 'straight', length: 7 },
    ],
    startPosition: [0, 4, 0],
    endPosition: [0, 4, 23],
  },
]

export function generateTrackPoints(segments: TrackSegment[]): [number, number, number][] {
  const points: [number, number, number][] = []
  let currentPos: [number, number, number] = [0, 0, 0]
  let currentAngle = 0

  points.push([...currentPos])

  for (const segment of segments) {
    if (segment.type === 'straight') {
      const dx = Math.sin((currentAngle * Math.PI) / 180) * segment.length
      const dz = Math.cos((currentAngle * Math.PI) / 180) * segment.length
      currentPos = [
        currentPos[0] + dx,
        currentPos[1],
        currentPos[2] + dz,
      ]
      points.push([...currentPos])
    } else if (segment.type === 'curve') {
      const radius = segment.radius || 2
      const angle = segment.angle || 90
      const direction = segment.direction === 'left' ? 1 : -1
      const steps = Math.abs(Math.floor(angle / 15))
      const stepAngle = (angle / steps) * direction

      for (let i = 1; i <= steps; i++) {
        const prevAngle = currentAngle
        currentAngle += stepAngle / 2
        const cx = currentPos[0] - Math.sin((prevAngle * Math.PI) / 180) * radius * direction
        const cz = currentPos[2] - Math.cos((prevAngle * Math.PI) / 180) * radius * direction

        currentAngle += stepAngle / 2
        currentPos = [
          cx + Math.sin((currentAngle * Math.PI) / 180) * radius * direction,
          currentPos[1],
          cz + Math.cos((currentAngle * Math.PI) / 180) * radius * direction,
        ]
        points.push([...currentPos])
      }
    } else if (segment.type === 'gap') {
      const dx = Math.sin((currentAngle * Math.PI) / 180) * segment.length
      const dz = Math.cos((currentAngle * Math.PI) / 180) * segment.length
      currentPos = [
        currentPos[0] + dx,
        currentPos[1],
        currentPos[2] + dz,
      ]
    }
  }

  return points
}
