import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { SimplexNoise, getTerrainHeight, getTerrainNormal } from '../utils/noise'
import { GAME_CONFIG } from '../types/game'

interface PhysicsState {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: THREE.Euler
  angularVelocity: THREE.Vector3
  isGrounded: boolean
  groundNormal: THREE.Vector3
}

export const usePhysics = (noise: SimplexNoise) => {
  const physicsRef = useRef<PhysicsState>({
    position: new THREE.Vector3(0, 10, 40),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    isGrounded: false,
    groundNormal: new THREE.Vector3(0, 1, 0),
  })

  const resetPhysics = useCallback((position: [number, number, number]) => {
    physicsRef.current.position.set(position[0], position[1], position[2])
    physicsRef.current.velocity.set(0, 0, 0)
    physicsRef.current.rotation.set(0, 0, 0)
    physicsRef.current.angularVelocity.set(0, 0, 0)
    physicsRef.current.isGrounded = false
  }, [])

  const updatePhysics = useCallback((
    deltaTime: number,
    moveInput: [number, number],
    jumpPressed: boolean,
    ballSize: number,
    cameraDirection: THREE.Vector3
  ): {
    position: [number, number, number]
    velocity: [number, number, number]
    rotation: [number, number, number]
  } => {
    const state = physicsRef.current
    const dt = Math.min(deltaTime, 0.05)

    const camForward = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize()
    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize()

    const moveDir = new THREE.Vector3()
    moveDir.addScaledVector(camRight, moveInput[0])
    moveDir.addScaledVector(camForward, -moveInput[1])

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
    }

    const moveForce = GAME_CONFIG.MOVE_SPEED * (1 + ballSize * 0.1)
    state.velocity.x += moveDir.x * moveForce * dt
    state.velocity.z += moveDir.z * moveForce * dt

    if (jumpPressed && state.isGrounded) {
      state.velocity.y = GAME_CONFIG.JUMP_FORCE * (1 + ballSize * 0.05)
      state.isGrounded = false
    }

    state.velocity.y -= GAME_CONFIG.GRAVITY * dt

    state.velocity.x *= GAME_CONFIG.FRICTION
    state.velocity.z *= GAME_CONFIG.FRICTION

    state.position.x += state.velocity.x * dt
    state.position.y += state.velocity.y * dt
    state.position.z += state.velocity.z * dt

    const terrainHeight = getTerrainHeight(
      state.position.x,
      state.position.z,
      noise
    )
    const ballBottom = state.position.y - ballSize

    if (ballBottom < terrainHeight) {
      state.position.y = terrainHeight + ballSize
      state.velocity.y = 0
      state.isGrounded = true

      state.groundNormal.fromArray(
        getTerrainNormal(state.position.x, state.position.z, noise)
      )

      const slopeFactor = state.groundNormal.y
      if (slopeFactor < 0.7 && ballSize < 3) {
        const slideDir = new THREE.Vector3(
          -state.groundNormal.x,
          0,
          -state.groundNormal.z
        ).normalize()
        state.velocity.x += slideDir.x * 5 * dt
        state.velocity.z += slideDir.z * 5 * dt
      }
    } else {
      state.isGrounded = false
      state.groundNormal.set(0, 1, 0)
    }

    const worldSize = GAME_CONFIG.WORLD_SIZE
    const halfSize = worldSize / 2
    state.position.x = Math.max(-halfSize, Math.min(halfSize, state.position.x))
    state.position.z = Math.max(-halfSize, Math.min(halfSize, state.position.z))

    if (state.position.y < -10) {
      state.position.set(0, 10, 40)
      state.velocity.set(0, 0, 0)
    }

    const speed = Math.sqrt(state.velocity.x ** 2 + state.velocity.z ** 2)
    if (speed > 0.1) {
      const rotationAxis = new THREE.Vector3(
        -state.velocity.z,
        0,
        state.velocity.x
      ).normalize()
      const rotationSpeed = speed / ballSize

      const deltaRotation = new THREE.Quaternion().setFromAxisAngle(
        rotationAxis,
        rotationSpeed * dt
      )

      const currentQuat = new THREE.Quaternion().setFromEuler(state.rotation)
      currentQuat.multiply(deltaRotation)
      state.rotation.setFromQuaternion(currentQuat)
    }

    return {
      position: [state.position.x, state.position.y, state.position.z],
      velocity: [state.velocity.x, state.velocity.y, state.velocity.z],
      rotation: [state.rotation.x, state.rotation.y, state.rotation.z],
    }
  }, [noise])

  const checkCritterCollision = useCallback((
    ballPos: [number, number, number],
    ballSize: number,
    critterPos: [number, number, number],
    critterSize: number
  ): boolean => {
    const dx = ballPos[0] - critterPos[0]
    const dy = ballPos[1] - critterPos[1]
    const dz = ballPos[2] - critterPos[2]
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    return distance < ballSize + critterSize * GAME_CONFIG.ATTACH_DISTANCE
  }, [])

  const checkGoalCollision = useCallback((
    ballPos: [number, number, number],
    ballSize: number,
    goalPos: [number, number, number]
  ): boolean => {
    const dx = ballPos[0] - goalPos[0]
    const dy = ballPos[1] - goalPos[1]
    const dz = ballPos[2] - goalPos[2]
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    return distance < ballSize + GAME_CONFIG.GOAL_RADIUS
  }, [])

  return {
    physicsRef,
    resetPhysics,
    updatePhysics,
    checkCritterCollision,
    checkGoalCollision,
  }
}
