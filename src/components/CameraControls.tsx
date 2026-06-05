import { forwardRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CAMERA } from '../constants/character'

/**
 * CameraControls
 * A thin wrapper around Drei's OrbitControls that forwards its ref
 * so external hooks (useOrbitTarget) can drive the orbit pivot.
 *
 * Responsibilities of this component:
 *  - Expose the OrbitControls instance via forwardRef
 *  - Set sensible default constraints (polar limits, zoom range)
 *  - Enable damping for smooth feel
 *
 * Responsibilities it does NOT have:
 *  - Knowing anything about the character
 *  - Driving the camera target (that's useOrbitTarget's job)
 *
 * Future click-to-move:
 *  - Disable panning (enablePan={false}) when click-to-move is active
 *  - The controlsRef can also be used to call controls.reset() on teleport
 */
const CameraControls = forwardRef<OrbitControlsImpl>((_, ref) => {
  return (
    <OrbitControls
      ref={ref}
      enableDamping
      dampingFactor={0.07}
      enablePan
      panSpeed={0.8}
      enableZoom
      zoomSpeed={1.0}
      minDistance={CAMERA.minDistance}
      maxDistance={CAMERA.maxDistance}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.04}  // never clip underground
      makeDefault                           // registers as the default R3F controls
    />
  )
})

CameraControls.displayName = 'CameraControls'
export default CameraControls
