import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useThirdPersonCamera } from '../../hooks/useThirdPersonCamera'
import { CHARACTER } from '../../constants/character'
import { WORLD } from '../../constants/world'
import CharacterMesh from './CharacterMesh'

// Reusable vectors — allocated once, never inside useFrame
const _move      = new THREE.Vector3()
const _direction = new THREE.Vector3()

// Half the ground so we can clamp position inside it
const BOUND = WORLD.groundSize / 2 - 2

/**
 * CharacterController
 * Owns the character Group ref and the yaw ref.
 * Reads keyboard state each frame (no re-renders) and:
 *   1. Accumulates a world-space movement vector from WASD
 *   2. Rotates the mesh body toward the movement direction
 *   3. Moves the character (clamped to ground bounds)
 *   4. Delegates camera follow to useThirdPersonCamera
 *
 * Movement is always relative to the CAMERA facing direction so
 * W always means "forward into the screen" from the player's POV.
 */
export default function CharacterController() {
  const groupRef = useRef<THREE.Group>(null!)
  const yawRef   = useRef<number>(0)
  const keys     = useKeyboard()

  // Attach the third-person camera — reads groupRef + yawRef each frame
  useThirdPersonCamera(groupRef, yawRef)

  useFrame(({ camera }, delta) => {
    const k = keys.current
    if (!k) return

    // ── 1. Gather raw input axes ────────────────────────────────
    const forward = (k.KeyW || k.ArrowUp    ? 1 : 0) - (k.KeyS || k.ArrowDown  ? 1 : 0)
    const strafe  = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft  ? 1 : 0)

    if (forward === 0 && strafe === 0) return

    // ── 2. Build world-space move direction from camera yaw ─────
    // Extract camera's horizontal facing angle (ignore pitch)
    const camYaw = Math.atan2(
      camera.position.x - groupRef.current.position.x,
      camera.position.z - groupRef.current.position.z,
    )

    // Forward vector aligned with camera
    _direction.set(
      Math.sin(camYaw) * forward + Math.cos(camYaw) * strafe,
      0,
      Math.cos(camYaw) * forward - Math.sin(camYaw) * strafe,
    ).normalize()

    // ── 3. Move character ───────────────────────────────────────
    _move.copy(_direction).multiplyScalar(CHARACTER.moveSpeed * delta)
    const p = groupRef.current.position

    p.x = THREE.MathUtils.clamp(p.x + _move.x, -BOUND, BOUND)
    p.z = THREE.MathUtils.clamp(p.z + _move.z, -BOUND, BOUND)
    p.y = 0  // stay on ground (no physics yet)

    // ── 4. Rotate body to face movement direction ───────────────
    const targetYaw = Math.atan2(_direction.x, _direction.z)

    // Shortest-path angular lerp
    let delta_yaw = targetYaw - yawRef.current
    if (delta_yaw >  Math.PI) delta_yaw -= Math.PI * 2
    if (delta_yaw < -Math.PI) delta_yaw += Math.PI * 2

    yawRef.current += delta_yaw * Math.min(CHARACTER.turnSpeed * delta, 1)
    groupRef.current.rotation.y = yawRef.current
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <CharacterMesh />
    </group>
  )
}
