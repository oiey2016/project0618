import * as THREE from 'three'

export const createClayMaterial = (
  color: string | THREE.Color = '#E07A5F',
  roughness: number = 0.85,
  metalness: number = 0.05
): THREE.MeshStandardMaterial => {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    flatShading: false,
  })

  return material
}

export const createToonClayMaterial = (
  color: string | THREE.Color = '#E07A5F',
  useOutline: boolean = false
): THREE.MeshToonMaterial => {
  const gradientMap = createGradientTexture()
  
  const material = new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap,
  })

  return material
}

const createGradientTexture = (): THREE.DataTexture => {
  const colors = new Uint8Array(4)
  colors[0] = 0
  colors[1] = 85
  colors[2] = 170
  colors[3] = 255

  const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat)
  gradientMap.minFilter = THREE.NearestFilter
  gradientMap.magFilter = THREE.NearestFilter
  gradientMap.generateMipmaps = false
  gradientMap.needsUpdate = true

  return gradientMap
}

export const createOutlineMaterial = (
  color: string | THREE.Color = '#2D2D2D',
  thickness: number = 0.03
): THREE.MeshBasicMaterial => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    side: THREE.BackSide,
  })
}

export const CLAY_PALETTE = {
  terracotta: '#E07A5F',
  cream: '#F4F1DE',
  teal: '#81B29A',
  navy: '#3D405B',
  sand: '#F2CC8F',
  pink: '#E8C2CA',
  sky: '#A8DADC',
  mint: '#B5EAD7',
  peach: '#FFDAC1',
  lavender: '#C7CEEA',
  orange: '#FFB347',
  yellow: '#FFE66D',
} as const

export const getRandomClayColor = (): string => {
  const colors = Object.values(CLAY_PALETTE)
  return colors[Math.floor(Math.random() * colors.length)]
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

export const lerpColor = (color1: string, color2: string, t: number): string => {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  
  const r = Math.round((c1.r + (c2.r - c1.r) * t) * 255)
  const g = Math.round((c1.g + (c2.g - c1.g) * t) * 255)
  const b = Math.round((c1.b + (c2.b - c1.b) * t) * 255)
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
