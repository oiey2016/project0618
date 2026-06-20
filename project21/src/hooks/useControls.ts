import { useEffect, useRef } from 'react'

export interface ControlState {
  forward: number
  backward: number
  left: number
  right: number
  jump: boolean
}

export const useControls = () => {
  const controlsRef = useRef<ControlState>({
    forward: 0,
    backward: 0,
    left: 0,
    right: 0,
    jump: false,
  })

  const jumpPressedRef = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsRef.current.forward = 1
          break
        case 'KeyS':
        case 'ArrowDown':
          controlsRef.current.backward = 1
          break
        case 'KeyA':
        case 'ArrowLeft':
          controlsRef.current.left = 1
          break
        case 'KeyD':
        case 'ArrowRight':
          controlsRef.current.right = 1
          break
        case 'Space':
          if (!jumpPressedRef.current) {
            controlsRef.current.jump = true
            jumpPressedRef.current = true
          }
          e.preventDefault()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsRef.current.forward = 0
          break
        case 'KeyS':
        case 'ArrowDown':
          controlsRef.current.backward = 0
          break
        case 'KeyA':
        case 'ArrowLeft':
          controlsRef.current.left = 0
          break
        case 'KeyD':
        case 'ArrowRight':
          controlsRef.current.right = 0
          break
        case 'Space':
          controlsRef.current.jump = false
          jumpPressedRef.current = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const getMovementVector = (): [number, number] => {
    const controls = controlsRef.current
    const x = (controls.right - controls.left)
    const z = (controls.backward - controls.forward)

    const length = Math.sqrt(x * x + z * z)
    if (length > 0) {
      return [x / length, z / length]
    }
    return [0, 0]
  }

  const consumeJump = (): boolean => {
    const jump = controlsRef.current.jump
    controlsRef.current.jump = false
    return jump
  }

  return {
    controlsRef,
    getMovementVector,
    consumeJump,
  }
}
