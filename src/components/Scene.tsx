import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { FOG, PALETTE } from '../constants/world'
import Lighting from './Lighting'
import { Ground, Sky, Particles } from './Environment'
import { CharacterController } from './Character'

/**
 * Scene
 * Root canvas.
 *
 * Camera is set to manual={true} so that useThirdPersonCamera
 * inside CharacterController has full control each frame without
 * R3F's default camera fighting it.
 *
 * Composition order:
 *   Sky dome → Ground → Particles → Lights → Character (+ camera hook)
 */
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 8, 14], fov: 52, near: 0.1, far: 300 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: PALETTE.skyHorizon }}  /* pale silver-blue horizon */
    >
      {/* Atmospheric exponential fog */}
      <fogExp2 attach="fog" color={FOG.color} density={0.018} />

      <Suspense fallback={null}>
        <Sky />
        <Ground />
        <Particles />
        <Lighting />

        {/* Character owns WASD input + camera follow */}
        <CharacterController />
      </Suspense>
    </Canvas>
  )
}
