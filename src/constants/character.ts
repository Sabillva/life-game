/**
 * character.ts
 * All tunable values for the character and third-person camera.
 */

export const CHARACTER = {
  // Capsule geometry
  radius:      0.38,
  height:      1.1,
  totalHeight: 1.86,

  // Movement
  moveSpeed:   6.0,   // units per second
  turnSpeed:   12.0,  // radians per second

  // Visual
  bodyColor:  '#f0c8a0',
  eyeColor:   '#3d2b1f',
  cheekColor: '#f0a0a0',
} as const

export const CAMERA = {
  /**
   * Vertical bias added to the OrbitControls target so the camera
   * looks at the character's torso, not their feet.
   */
  targetBias: 1.0,

  /**
   * How quickly the orbit target lerps to the character position.
   * 0.08 = smooth cinematic lag. Raise toward 1.0 for tighter follow.
   * Movement direction does NOT affect this — the user orbits freely.
   */
  followLerp: 0.08,

  // Starting orbit state (applied once on mount via OrbitControls props)
  initialDistance: 10,
  minDistance:      4,
  maxDistance:     40,
} as const
