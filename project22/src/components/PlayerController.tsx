import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster } from 'three';
import { useGameStore } from '@/store/gameStore';
import { resolveAxisCollision, applyGravityAndGround } from '@/utils/physics';
import { getBlockKey } from '@/utils/terrain';
import { GAME_CONFIG } from '@/constants/blocks';
import { BlockType, HitInfo } from '@/types';

interface PlayerControllerProps {
  onHitChange: (hit: HitInfo | null) => void;
}

export default function PlayerController({ onHitChange }: PlayerControllerProps) {
  const { camera, gl, scene } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const isPointerLocked = useRef(false);
  const raycaster = useRef(new Raycaster());
  const lastHungerUpdate = useRef(0);

  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const setPlayerVelocity = useGameStore((state) => state.setPlayerVelocity);
  const setOnGround = useGameStore((state) => state.setOnGround);
  const setSelectedSlot = useGameStore((state) => state.setSelectedSlot);
  const setHealth = useGameStore((state) => state.setHealth);
  const setHunger = useGameStore((state) => state.setHunger);
  const breakBlock = useGameStore((state) => state.breakBlock);
  const placeBlock = useGameStore((state) => state.placeBlock);
  const removeFromInventory = useGameStore((state) => state.removeFromInventory);
  const respawn = useGameStore((state) => state.respawn);

  const playerPosition = useGameStore((state) => state.player.position);
  const playerVelocity = useGameStore((state) => state.player.velocity);
  const yaw = useGameStore((state) => state.player.yaw);
  const pitch = useGameStore((state) => state.player.pitch);
  const onGround = useGameStore((state) => state.player.onGround);
  const selectedSlot = useGameStore((state) => state.player.selectedSlot);
  const inventory = useGameStore((state) => state.player.inventory);
  const health = useGameStore((state) => state.player.health);
  const hunger = useGameStore((state) => state.player.hunger);
  const world = useGameStore((state) => state.world.blocks);
  const mouseSensitivity = useGameStore((state) => state.settings.mouseSensitivity);
  const phase = useGameStore((state) => state.phase);

  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);

      if (e.code.startsWith('Digit')) {
        const digit = parseInt(e.code.replace('Digit', ''));
        if (digit >= 1 && digit <= 5) {
          setSelectedSlot(digit - 1);
        }
      }

      if (e.code === 'Space' && onGround) {
        setPlayerVelocity({ ...playerVelocity, y: GAME_CONFIG.jumpForce });
        setOnGround(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;

      const newYaw = yaw - e.movementX * mouseSensitivity;
      const newPitch = Math.max(
        -Math.PI / 2 + 0.01,
        Math.min(Math.PI / 2 - 0.01, pitch - e.movementY * mouseSensitivity)
      );

      setPlayerRotation(newYaw, newPitch);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;

      const hit = raycastBlock();
      if (!hit) return;

      if (e.button === 0) {
        breakBlock(hit.blockPosition.x, hit.blockPosition.y, hit.blockPosition.z);
        forceUpdate({});
      } else if (e.button === 2) {
        const placePos = {
          x: hit.blockPosition.x + hit.faceNormal.x,
          y: hit.blockPosition.y + hit.faceNormal.y,
          z: hit.blockPosition.z + hit.faceNormal.z,
        };

        const slot = inventory[selectedSlot];
        if (slot.blockType && slot.count > 0) {
          const success = placeBlock(placePos.x, placePos.y, placePos.z, slot.blockType);
          if (success) {
            removeFromInventory(selectedSlot);
            forceUpdate({});
          }
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    const handleClick = () => {
      if (!isPointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [phase, yaw, pitch, onGround, selectedSlot, inventory, world, mouseSensitivity]);

  const raycastBlock = (): HitInfo | null => {
    raycaster.current.setFromCamera(new Vector2(0, 0), camera);
    raycaster.current.far = GAME_CONFIG.maxReach;

    const meshes: { position: Vector3; normal: Vector3; distance: number }[] = [];
    
    world.forEach((type, key) => {
      if (type === BlockType.AIR || type === BlockType.WATER) return;
      
      const [bx, by, bz] = key.split(',').map(Number);
      const blockCenter = new Vector3(bx + 0.5, by + 0.5, bz + 0.5);
      
      const toBlock = new Vector3().subVectors(blockCenter, camera.position);
      const distance = toBlock.length();
      
      if (distance > GAME_CONFIG.maxReach + 2) return;

      const directions = [
        { normal: new Vector3(1, 0, 0), face: 0 },
        { normal: new Vector3(-1, 0, 0), face: 1 },
        { normal: new Vector3(0, 1, 0), face: 2 },
        { normal: new Vector3(0, -1, 0), face: 3 },
        { normal: new Vector3(0, 0, 1), face: 4 },
        { normal: new Vector3(0, 0, -1), face: 5 },
      ];

      for (const { normal } of directions) {
        const faceCenter = blockCenter.clone().add(normal.clone().multiplyScalar(0.5));
        const rayToFace = new Vector3().subVectors(faceCenter, camera.position);
        const dot = rayToFace.dot(raycaster.current.ray.direction);
        
        if (dot > 0) {
          const t = rayToFace.length() * Math.cos(rayToFace.angleTo(raycaster.current.ray.direction));
          const hitPoint = camera.position.clone().add(
            raycaster.current.ray.direction.clone().multiplyScalar(t)
          );
          
          const localHit = new Vector3().subVectors(hitPoint, blockCenter);
          
          if (
            Math.abs(localHit.x) <= 0.501 &&
            Math.abs(localHit.y) <= 0.501 &&
            Math.abs(localHit.z) <= 0.501
          ) {
            if (t < GAME_CONFIG.maxReach) {
              meshes.push({
                position: new Vector3(bx, by, bz),
                normal: normal.clone(),
                distance: t,
              });
            }
          }
        }
      }
    });

    if (meshes.length === 0) return null;

    meshes.sort((a, b) => a.distance - b.distance);
    const nearest = meshes[0];

    return {
      blockPosition: { x: nearest.position.x, y: nearest.position.y, z: nearest.position.z },
      faceNormal: { x: nearest.normal.x, y: nearest.normal.y, z: nearest.normal.z },
      distance: nearest.distance,
    };
  };

  useFrame((_, deltaTime) => {
    if (phase !== 'playing') return;

    const dt = Math.min(deltaTime, 0.1);

    const forward = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new Vector3().crossVectors(forward, new Vector3(0, 1, 0)).normalize();

    let moveX = 0;
    let moveZ = 0;

    if (keys.current.has('KeyW')) {
      moveX += forward.x;
      moveZ += forward.z;
    }
    if (keys.current.has('KeyS')) {
      moveX -= forward.x;
      moveZ -= forward.z;
    }
    if (keys.current.has('KeyA')) {
      moveX -= right.x;
      moveZ -= right.z;
    }
    if (keys.current.has('KeyD')) {
      moveX += right.x;
      moveZ += right.z;
    }

    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX = (moveX / length) * GAME_CONFIG.moveSpeed * dt;
      moveZ = (moveZ / length) * GAME_CONFIG.moveSpeed * dt;
    }

    let newPos = { ...playerPosition };
    let newVelY = playerVelocity.y;

    const resultX = resolveAxisCollision(newPos, world, 'x', moveX);
    newPos = resultX.position;

    const resultZ = resolveAxisCollision(newPos, world, 'z', moveZ);
    newPos = resultZ.position;

    const gravityResult = applyGravityAndGround(newPos, newVelY, world, dt);
    newPos = gravityResult.position;
    newVelY = gravityResult.velocityY;
    setOnGround(gravityResult.onGround);

    if (newPos.y < -10) {
      setHealth(0);
      respawn();
      return;
    }

    setPlayerPosition(newPos);
    setPlayerVelocity({ x: 0, y: newVelY, z: 0 });

    camera.position.set(newPos.x, newPos.y + 1.62, newPos.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    const hit = raycastBlock();
    onHitChange(hit);

    lastHungerUpdate.current += dt;
    if (lastHungerUpdate.current > 1) {
      lastHungerUpdate.current = 0;

      if (hunger > 0 && (Math.abs(moveX) > 0 || Math.abs(moveZ) > 0)) {
        setHunger(Math.max(0, hunger - GAME_CONFIG.hungerDecreaseRate));
      }

      if (hunger >= 18 && health < 20) {
        setHealth(Math.min(20, health + GAME_CONFIG.healthRegenRate));
      } else if (hunger <= 0 && health > 0) {
        setHealth(Math.max(0, health - GAME_CONFIG.healthDecreaseRate));
      }

      if (health <= 0) {
        respawn();
      }
    }
  });

  return null;
}
