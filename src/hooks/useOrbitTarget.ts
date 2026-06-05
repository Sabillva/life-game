import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CAMERA } from '../constants/character'

const _targetGoal = new THREE.Vector3()

/**
 * useOrbitTarget
 * Smoothly moves OrbitControls' `target` (the orbit pivot) to follow
 * the character each frame.
 *
 * This is the ONLY bridge between character movement and the camera.
 * OrbitControls retains full ownership of camera position/rotation —
 * we only update the point it orbits around.
 *
 * The user can freely rotate, pan, and zoom at any time. When the
 * character moves, the pivot drifts after them with `followLerp` lag.
 *
 * @param characterRef  Ref to the character's root Group
 * @param controlsRef   Ref to the OrbitControls instance
 */
export function useOrbitTarget(
  characterRef: React.RefObject<THREE.Group | null>,
  controlsRef:  React.RefObject<OrbitControlsImpl | null>,
) {
  useFrame(() => {
    const controls  = controlsRef.current
    const character = characterRef.current
    if (!controls || !character) return

    const p = character.position

    // Target goal = character world position + vertical bias toward torso
    _targetGoal.set(p.x, p.y + CAMERA.targetBias, p.z)

    // Lerp the orbit target — OrbitControls reads target each frame internally
    controls.target.lerp(_targetGoal, CAMERA.followLerp)

    // Required to apply the updated target when damping is active
    controls.update()
  })
}
