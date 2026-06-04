import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface RotatingCubeProps {
  /** Rotation speed multiplier (default 1) */
  speed?: number
}

/**
 * RotatingCube
 * A physically-based box mesh that rotates on every frame.
 * Casts and receives shadows. Sits above a ground plane.
 */
export default function RotatingCube({ speed = 1 }: RotatingCubeProps) {
  const meshRef = useRef<Mesh>(null!)

  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta * 0.6 * speed
    meshRef.current.rotation.y += delta * 0.9 * speed
  })

  return (
    <>
      {/* The rotating cube */}
      <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#4a9eff"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Ground plane to catch the shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111118" roughness={1} metalness={0} />
      </mesh>
    </>
  )
}
