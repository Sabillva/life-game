import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA } from '../constants/character'

const _idealPosition = new THREE.Vector3()
const _idealLookAt   = new THREE.Vector3()

/**
 * useThirdPersonCamera
 * Each frame, computes the ideal camera position behind the character
 * (based on its current yaw), then lerps the real camera toward it.
 *
 * @param characterRef  — ref to the character's root Group
 * @param yawRef        — ref to the current facing angle (radians)
 */
export function useThirdPersonCamera(
  characterRef: React.RefObject<THREE.Group>,
  yawRef: React.RefObject<number>,
) {
  const { camera } = useThree()
  // Seed camera position so first frame has no jump
  const initialised = useRef(false)

  useFrame(() => {
    if (!characterRef.current) return

    const pos = characterRef.current.position
    const yaw = yawRef.current ?? 0

    // Ideal position = behind + above character along its facing direction
    _idealPosition.set(
      pos.x - Math.sin(yaw) * CAMERA.distance,
      pos.y + CAMERA.height,
      pos.z - Math.cos(yaw) * CAMERA.distance,
    )

    // Look at a point slightly above character origin
    _idealLookAt.set(pos.x, pos.y + CAMERA.lookAtBias, pos.z)

    if (!initialised.current) {
      // Snap on first frame — no lerp lag at startup
      camera.position.copy(_idealPosition)
      camera.lookAt(_idealLookAt)
      initialised.current = true
      return
    }

    // Smooth exponential lerp (frame-rate stable via fixed factor)
    camera.position.lerp(_idealPosition, CAMERA.lerpFactor)
    camera.lookAt(_idealLookAt)
  })
}
