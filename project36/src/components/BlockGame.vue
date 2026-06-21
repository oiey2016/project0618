<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

interface Block {
  id: number
  x: number
  y: number
  width: number
  height: number
  isSelected: boolean
  isPlaced: boolean
  color: string
  rotation: number
  isFalling: boolean
  fallDirection: number
}

const gameContainer = ref<HTMLElement | null>(null)
const blocks = reactive<Block[]>([])
const selectedBlockId = ref<number | null>(null)
const gameOver = ref(false)
const score = ref(0)
const highScore = ref(parseInt(localStorage.getItem('blockStackHighScore') || '0'))
const towerOffset = ref(0)
const isAnimating = ref(false)
const showTutorial = ref(true)

// 选中块ID的计算属性
const selectedBlock = computed(() => {
  if (selectedBlockId.value === null) return null
  return blocks.find(b => b.id === selectedBlockId.value) || null
})

const BLOCK_HEIGHT = 30
const BASE_WIDTH = 200
const MAX_BLOCKS = 20
const GROUND_HEIGHT = 60

let containerWidth = 400
let containerHeight = 600
let nextBlockId = 1

const woodColors = [
  'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
  'linear-gradient(135deg, #A0522D 0%, #CD853F 50%, #A0522D 100%)',
  'linear-gradient(135deg, #D2691E 0%, #F4A460 50%, #D2691E 100%)',
  'linear-gradient(135deg, #CD853F 0%, #DEB887 50%, #CD853F 100%)',
]

function getRandomWoodColor(): string {
  return woodColors[Math.floor(Math.random() * woodColors.length)]
}

function initGame() {
  blocks.length = 0
  selectedBlockId.value = null
  gameOver.value = false
  score.value = 0
  towerOffset.value = 0
  isAnimating.value = false
  
  const baseBlock: Block = {
    id: nextBlockId++,
    x: (containerWidth - BASE_WIDTH) / 2,
    y: containerHeight - GROUND_HEIGHT - BLOCK_HEIGHT,
    width: BASE_WIDTH,
    height: BLOCK_HEIGHT,
    isSelected: false,
    isPlaced: true,
    color: getRandomWoodColor(),
    rotation: 0,
    isFalling: false,
    fallDirection: 0
  }
  blocks.push(baseBlock)
  
  const secondBlock: Block = {
    id: nextBlockId++,
    x: (containerWidth - BASE_WIDTH) / 2,
    y: containerHeight - GROUND_HEIGHT - BLOCK_HEIGHT * 2,
    width: BASE_WIDTH,
    height: BLOCK_HEIGHT,
    isSelected: false,
    isPlaced: true,
    color: getRandomWoodColor(),
    rotation: 0,
    isFalling: false,
    fallDirection: 0
  }
  blocks.push(secondBlock)
  
  spawnNewBlock()
}

function spawnNewBlock() {
  if (blocks.length >= MAX_BLOCKS) {
    gameOver.value = true
    updateHighScore()
    return
  }
  
  const topBlock = blocks[blocks.length - 1]
  const newBlock: Block = {
    id: nextBlockId++,
    x: Math.random() > 0.5 ? -BASE_WIDTH : containerWidth,
    y: topBlock.y - BLOCK_HEIGHT,
    width: BASE_WIDTH,
    height: BLOCK_HEIGHT,
    isSelected: false,
    isPlaced: false,
    color: getRandomWoodColor(),
    rotation: 0,
    isFalling: false,
    fallDirection: 0
  }
  blocks.push(newBlock)
  
  animateBlockIn(newBlock)
}

function animateBlockIn(block: Block) {
  const targetX = (containerWidth - block.width) / 2 + towerOffset.value
  const startX = block.x
  const duration = 800
  const startTime = performance.now()
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutCubic(progress)
    
    block.x = startX + (targetX - startX) * eased
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function handleBlockClick(block: Block) {
  if (gameOver.value || isAnimating.value) return
  if (!block.isPlaced) return
  
  if (selectedBlockId.value === block.id) {
    selectedBlockId.value = null
    return
  }
  
  selectedBlockId.value = block.id
}

function handlePlaceClick() {
  if (!selectedBlock.value || gameOver.value || isAnimating.value) return
  
  const selected = selectedBlock.value
  const placedBlocks = blocks.filter(b => b.isPlaced && !b.isFalling)
  
  const newBlock = blocks.find(b => !b.isPlaced)
  if (!newBlock) return
  
  const overlapX = Math.max(0, 
    Math.min(selected.x + selected.width, newBlock.x + newBlock.width) - 
    Math.max(selected.x, newBlock.x)
  )
  
  if (overlapX < selected.width * 0.3) {
    triggerGameOver()
    return
  }
  
  const excessLeft = selected.x - newBlock.x
  const excessRight = (selected.x + selected.width) - (newBlock.x + newBlock.width)
  
  isAnimating.value = true
  
  if (excessLeft > 0) {
    createFallingBlock(selected.x, selected.y, selected.height, excessLeft, -1)
    selected.width -= excessLeft
    selected.x += excessLeft
  } else if (excessRight > 0) {
    createFallingBlock(selected.x + selected.width - excessRight, selected.y, selected.height, excessRight, 1)
    selected.width -= excessRight
  }
  
  towerOffset.value += (selected.x - newBlock.x)
  
  animateMoveToTop(selected, newBlock)
}

function animateMoveToTop(selected: Block, newBlock: Block) {
  const startX = selected.x
  const startY = selected.y
  const targetY = newBlock.y
  const targetX = newBlock.x
  const duration = 400
  const startTime = performance.now()
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutCubic(progress)
    
    selected.x = startX + (targetX - startX) * eased
    selected.y = startY + (targetY - startY) * eased
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      selected.x = targetX
      selected.y = targetY
      
      const newBlockIndex = blocks.indexOf(newBlock)
      if (newBlockIndex > -1) {
        blocks.splice(newBlockIndex, 1)
      }
      
      selected.isPlaced = true
      selectedBlockId.value = null
      
      score.value++
      isAnimating.value = false
      
      checkStability()
      spawnNewBlock()
    }
  }
  
  requestAnimationFrame(animate)
}

function createFallingBlock(x: number, y: number, height: number, width: number, direction: number) {
  const fallingBlock: Block = {
    id: -1,
    x,
    y,
    width,
    height,
    isSelected: false,
    isPlaced: false,
    color: getRandomWoodColor(),
    rotation: 0,
    isFalling: true,
    fallDirection: direction
  }
  blocks.push(fallingBlock)
  
  animateFall(fallingBlock)
}

function animateFall(block: Block) {
  const startX = block.x
  const startY = block.y
  let rotation = 0
  const duration = 800
  const startTime = performance.now()
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    block.x = startX + block.fallDirection * 150 * progress
    block.y = startY + 200 * progress
    rotation += block.fallDirection * 15
    block.rotation = rotation
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      const index = blocks.indexOf(block)
      if (index > -1) {
        blocks.splice(index, 1)
      }
    }
  }
  
  requestAnimationFrame(animate)
}

function checkStability() {
  const placedBlocks = blocks.filter(b => b.isPlaced && !b.isFalling)
  
  for (let i = placedBlocks.length - 1; i >= 2; i--) {
    const block = placedBlocks[i]
    const belowBlock = placedBlocks[i - 1]
    
    const blockCenter = block.x + block.width / 2
    const belowLeft = belowBlock.x
    const belowRight = belowBlock.x + belowBlock.width
    
    if (blockCenter < belowLeft || blockCenter > belowRight) {
      triggerGameOver()
      return
    }
  }
}

function triggerGameOver() {
  gameOver.value = true
  isAnimating.value = true
  
  for (const block of blocks) {
    if (block.isPlaced) {
      block.isFalling = true
      block.fallDirection = Math.random() > 0.5 ? 1 : -1
      animateFall(block)
    }
  }
  
  updateHighScore()
}

function updateHighScore() {
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('blockStackHighScore', score.value.toString())
  }
}

function restartGame() {
  nextBlockId = 1
  initGame()
}

function handleContainerClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  // 点击的不是积木块时触发放置
  if (!target.classList.contains('block')) {
    handlePlaceClick()
  }
}

function handleResize() {
  if (gameContainer.value) {
    containerWidth = gameContainer.value.clientWidth
    containerHeight = gameContainer.value.clientHeight
  }
}

onMounted(() => {
  handleResize()
  initGame()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 select-none">
    <div class="text-center mb-4">
      <h1 class="text-4xl font-bold text-white drop-shadow-lg mb-2">积木叠高塔</h1>
      <div class="flex gap-8 justify-center text-white">
        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <span class="text-lg">分数: </span>
          <span class="text-2xl font-bold">{{ score }}</span>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <span class="text-lg">最高: </span>
          <span class="text-2xl font-bold">{{ highScore }}</span>
        </div>
      </div>
    </div>

    <div 
      ref="gameContainer"
      class="game-container relative w-full max-w-md h-[500px] bg-gradient-to-b from-sky-300 to-sky-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer border-4 border-white/30"
      @click="handleContainerClick"
    >
      <div class="sky-background absolute inset-0">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-b-xl">
        <div class="absolute inset-0 bg-repeat-x" style="background-image: url('data:image/svg+xml,%3Csvg width=\'40\' height=\'60\' viewBox=\'0 0 40 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 30 Q10 20 20 30 T40 30\' fill=\'%23228B22\' opacity=\'0.3\'/%3E%3C/svg%3E'); background-size: 40px 60px;"></div>
      </div>

      <div 
        v-for="block in blocks" 
        :key="block.id"
        class="block absolute rounded-lg cursor-pointer transition-transform"
        :class="{ 
          'ring-4 ring-yellow-400 scale-110 z-20': block.id === selectedBlockId,
          'shadow-lg': block.isPlaced && !block.isFalling,
          'animate-pulse': block.id === selectedBlockId
        }"
        :style="{
          left: block.x + 'px',
          bottom: (containerHeight - block.y - block.height) + 'px',
          width: block.width + 'px',
          height: block.height + 'px',
          background: block.color,
          transform: `rotate(${block.rotation}deg)`,
          boxShadow: block.id === selectedBlockId 
            ? '0 0 20px rgba(251, 191, 36, 0.8), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.3)'
            : block.isPlaced && !block.isFalling
              ? 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)'
              : 'none',
          transition: block.isFalling ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease'
        }"
        @click.stop="handleBlockClick(block)"
      >
        <div class="absolute inset-0 rounded-lg overflow-hidden">
          <div class="absolute inset-0 opacity-30" style="background: repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px);"></div>
          <div class="absolute inset-0 opacity-20" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);"></div>
        </div>
        
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-lg"></div>
        <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-b-lg"></div>
      </div>

      <div v-if="selectedBlock && !gameOver" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-amber-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce z-30">
        点击上方移动的积木位置放置
      </div>

      <div v-if="showTutorial && !gameOver" class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
        <div class="bg-white/90 rounded-2xl p-6 text-center max-w-xs mx-4 shadow-xl">
          <h2 class="text-2xl font-bold text-amber-800 mb-4">🏗️ 游戏玩法</h2>
          <div class="text-gray-700 space-y-3 mb-6 text-left">
            <p>🎯 <strong>目标</strong>：将下方的积木一层层叠到上方</p>
            <p>👆 <strong>步骤</strong>：</p>
            <p class="ml-4">1. 点击选中塔中某一块积木</p>
            <p class="ml-4">2. 点击上方正在移动的新积木位置</p>
            <p class="ml-4">3. 选中的积木会飞上去叠在新积木上</p>
            <p>⚠️ <strong>注意</strong>：积木必须对齐，否则会掉落！</p>
          </div>
          <button 
            @click="showTutorial = false"
            class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
          >
            开始游戏
          </button>
        </div>
      </div>

      <div v-if="gameOver" class="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
        <div class="bg-white/95 rounded-2xl p-8 text-center shadow-2xl">
          <h2 class="text-3xl font-bold text-red-600 mb-4">塔倒了！</h2>
          <p class="text-xl text-gray-700 mb-2">本次得分</p>
          <p class="text-5xl font-bold text-amber-500 mb-4">{{ score }}</p>
          <p class="text-gray-600 mb-6">最高记录: {{ highScore }}</p>
          <button 
            @click="restartGame"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            再来一局
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 text-white/80 text-sm text-center">
      <p>👆 点击塔中积木选中，点击上方移动的积木位置放置</p>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  perspective: 1000px;
}

.block {
  transform-style: preserve-3d;
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud-1 {
  width: 80px;
  height: 30px;
  top: 50px;
  left: 50px;
  animation: float 8s ease-in-out infinite;
}

.cloud-1::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 10px;
}

.cloud-1::after {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 35px;
}

.cloud-2 {
  width: 100px;
  height: 35px;
  top: 100px;
  right: 30px;
  animation: float 10s ease-in-out infinite reverse;
}

.cloud-2::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud-2::after {
  width: 60px;
  height: 55px;
  top: -30px;
  left: 50px;
}

.cloud-3 {
  width: 60px;
  height: 25px;
  top: 180px;
  left: 50%;
  animation: float 7s ease-in-out infinite;
}

.cloud-3::before {
  width: 35px;
  height: 35px;
  top: -18px;
  left: 8px;
}

.cloud-3::after {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 28px;
}

@keyframes float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}
</style>