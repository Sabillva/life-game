/**
 * character.ts
 * All tunable values for the character and third-person camera.
 * Centralised here so nothing is buried in component logic.
 */

export const CHARACTER = {
  // Capsule geometry
  radius:      0.38,
  height:      1.1,   // cylinder segment between hemispheres
  totalHeight: 1.86,  // radius*2 + height  (auto-derived for readability)

  // Movement
  moveSpeed:   6.0,   // units per second
  turnSpeed:   12.0,  // radians per second (visual body rotation)

  // Visual
  bodyColor:   '#f0c8a0',   // warm peach skin tone
  eyeColor:    '#3d2b1f',   // dark warm brown
  cheekColor:  '#f0a0a0',   // soft blush
} as const

export const CAMERA = {
  // Offset from character in character-local space (before yaw)
  distance:   9.0,    // how far behind
  height:     4.5,    // how high above character origin
  lookAtBias: 1.2,    // look slightly above origin (character mid-torso)

  // Smoothing
  lerpFactor: 0.08,   // lower = slower / dreamier follow
} as const
