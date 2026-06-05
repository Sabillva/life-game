import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useOrbitTarget } from '../../hooks/useOrbitTarget'
import { CHARACTER } from '../../constants/character'
import { WORLD } from '../../constants/world'
import CharacterMesh from './CharacterMesh'

// Reusable vectors — never allocated inside useFrame
const _move      = new THREE.Vector3()
const _direction = new THREE.Vector3()

const BOUND = WORLD.groundSize / 2 - 2

/**
 * CharacterController
 * Owns character position + yaw. Drives WASD movement.
 * Does NOT own or manipulate the camera directly.
 *
 * Camera follow is delegated to useOrbitTarget, which only moves
 * the OrbitControls pivot — the user retains full rotate/pan/zoom.
 *
 * @param controlsRef  Forwarded ref to the OrbitControls instance.
 *                     Passed down from Scene so this component stays
 *                     decoupled from camera implementation details.
 *
 * Future click-to-move:
 *  - Add an optional `onNavigateTo(point: THREE.Vector3)` prop
 *  - Drive position from a target point instead of keyboard input
 *  - The camera hook requires zero changes
 */
interface CharacterControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

export default function CharacterController({ controlsRef }: CharacterControllerProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const yawRef   = useRef<number>(0)
  const keys     = useKeyboard()

  // Bridge: keeps OrbitControls pivot locked onto the character
  useOrbitTarget(groupRef, controlsRef)

  useFrame(({ camera }, delta) => {
    const k = keys.current
    if (!k) return

    const forward = (k.KeyW || k.ArrowUp    ? 1 : 0) - (k.KeyS || k.ArrowDown  ? 1 : 0)
    const strafe  = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft  ? 1 : 0)

    if (forward === 0 && strafe === 0) return

    // Camera-relative movement: W = toward camera look direction on XZ plane
    const camYaw = Math.atan2(
      camera.position.x - groupRef.current.position.x,
      camera.position.z - groupRef.current.position.z,
    )

    _direction.set(
      Math.sin(camYaw) * forward + Math.cos(camYaw) * strafe,
      0,
      Math.cos(camYaw) * forward - Math.sin(camYaw) * strafe,
    ).normalize()

    _move.copy(_direction).multiplyScalar(CHARACTER.moveSpeed * delta)

    const p = groupRef.current.position
    p.x = THREE.MathUtils.clamp(p.x + _move.x, -BOUND, BOUND)
    p.z = THREE.MathUtils.clamp(p.z + _move.z, -BOUND, BOUND)
    p.y = 0

    // Shortest-path yaw lerp toward movement direction
    const targetYaw = Math.atan2(_direction.x, _direction.z)
    let   dyaw      = targetYaw - yawRef.current
    if (dyaw >  Math.PI) dyaw -= Math.PI * 2
    if (dyaw < -Math.PI) dyaw += Math.PI * 2

    yawRef.current             += dyaw * Math.min(CHARACTER.turnSpeed * delta, 1)
    groupRef.current.rotation.y = yawRef.current
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <CharacterMesh />
    </group>
  )
}
