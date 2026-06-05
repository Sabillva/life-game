import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { FOG, PALETTE } from '../constants/world'
import { CAMERA } from '../constants/character'
import Lighting from './Lighting'
import CameraControls from './CameraControls'
import { Ground, Sky, Particles } from './Environment'
import { CharacterController } from './Character'

/**
 * Scene
 * Owns the controlsRef and passes it downward.
 *
 * Data flow:
 *   controlsRef (Scene)
 *     → CameraControls   (writes the OrbitControls instance into the ref)
 *     → CharacterController → useOrbitTarget  (reads the ref to move the pivot)
 *
 * This is the only place that knows both exist.
 * CameraControls and CharacterController are fully decoupled from each other.
 */
export default function Scene() {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas
      camera={{
        position: [0, CAMERA.targetBias + 6, CAMERA.initialDistance],
        fov: 52,
        near: 0.1,
        far: 300,
      }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: PALETTE.skyHorizon }}
    >
      <fogExp2 attach="fog" color={FOG.color} density={0.018} />

      <Suspense fallback={null}>
        <Sky />
        <Ground />
        <Particles />
        <Lighting />

        {/*
          CameraControls must render before CharacterController
          so the ref is populated before useOrbitTarget's first useFrame.
        */}
        <CameraControls ref={controlsRef} />
        <CharacterController controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  )
}
