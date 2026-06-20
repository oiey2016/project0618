export class SimplexNoise {
  private perm: number[] = []

  constructor(seed: number = Math.random()) {
    const p: number[] = []
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }

    let n: number
    let q: number
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647
      n = seed % (i + 1)
      q = p[i]
      p[i] = p[n]
      p[n] = q
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255]
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7
    const u = h < 4 ? x : y
    const v = h < 4 ? y : x
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v)
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)

    const u = this.fade(x)
    const v = this.fade(y)

    const A = this.perm[X] + Y
    const B = this.perm[X + 1] + Y

    return this.lerp(
      this.lerp(this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y), u),
      this.lerp(this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1), u),
      v
    )
  }

  fbm(x: number, y: number, octaves: number = 4): number {
    let value = 0
    let amplitude = 1
    let frequency = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise2D(x * frequency, y * frequency)
      maxValue += amplitude
      amplitude *= 0.5
      frequency *= 2
    }

    return value / maxValue
  }
}

export const getTerrainHeight = (
  x: number,
  z: number,
  noise: SimplexNoise,
  mountainCenter: [number, number] = [0, 0],
  mountainHeight: number = 25,
  worldSize: number = 100
): number => {
  const distToCenter = Math.sqrt(
    Math.pow(x - mountainCenter[0], 2) + Math.pow(z - mountainCenter[1], 2)
  )

  const mountainFactor = Math.max(0, 1 - distToCenter / (worldSize * 0.4))
  const mountainShape = Math.pow(mountainFactor, 1.5) * mountainHeight

  const noiseValue = noise.fbm(x * 0.03, z * 0.03, 3)
  const terrainNoise = noiseValue * 3

  const baseHeight = 2 + terrainNoise + mountainShape

  return Math.max(0, baseHeight)
}

export const getTerrainNormal = (
  x: number,
  z: number,
  noise: SimplexNoise,
  epsilon: number = 0.1
): [number, number, number] => {
  const hL = getTerrainHeight(x - epsilon, z, noise)
  const hR = getTerrainHeight(x + epsilon, z, noise)
  const hD = getTerrainHeight(x, z - epsilon, noise)
  const hU = getTerrainHeight(x, z + epsilon, noise)

  const nx = hL - hR
  const ny = 2 * epsilon
  const nz = hD - hU

  const length = Math.sqrt(nx * nx + ny * ny + nz * nz)
  return [nx / length, ny / length, nz / length]
}
