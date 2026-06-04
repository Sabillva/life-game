import { OrbitControls } from '@react-three/drei'

/**
 * CameraControls
 * Orbit controls tuned for the life-sim environment:
 * - Prevents going underground (maxPolarAngle)
 * - Max zoom out generous enough to appreciate the environment
 */
export default function CameraControls() {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={40}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={[0, 0.5, 0]}
    />
  )
}
