import { PALETTE } from '../constants/world'

/**
 * Lighting
 * Realistic midday outdoor lighting.
 *
 * Key principles for believable daylight:
 *  - Sun is nearly white (not golden) at midday, high angle
 *  - Hemisphere sky/ground bounce is the primary fill — no extra point lights
 *  - Shadow fill comes from a dim, cool, opposing directional (sky scatter)
 *  - No coloured rim lights — those read as fantasy/cinematic, not real
 */
export default function Lighting() {
  return (
    <>
      {/*
        Hemisphere light — most important for outdoor realism.
        Sky colour (top) is the dominant fill on upward faces.
        Ground colour (bottom) is the faint bounce on undersides.
        Intensity kept moderate: real sky is bright but not blinding.
      */}
      <hemisphereLight
        args={[
          PALETTE.skyMid,    // sky colour — cool blue-white
          PALETTE.grassBase, // ground bounce — desaturated green
          0.55,               // intensity
        ]}
      />

      {/*
        Primary sun — midday, so positioned high rather than raking low.
        Nearly white light. High intensity simulates clear-day brightness.
        Shadows are sharp but not exaggerated.
      */}
      <directionalLight
        position={[8, 18, 6]}
        intensity={1.6}
        color={PALETTE.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0004}
      />

      {/*
        Sky-scatter fill — replaces the old coloured rim/point lights.
        Real outdoor shadows are filled by scattered light from the blue sky,
        so this is a dim, cool directional from the opposite hemisphere.
        No point lights — those read as artificial indoor sources.
      */}
      <directionalLight
        position={[-6, 8, -8]}
        intensity={0.15}
        color={PALETTE.fillColor}
      />
    </>
  )
}
