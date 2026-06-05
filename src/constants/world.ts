/**
 * world.ts
 * Single source of truth for the world's visual palette,
 * fog settings, and environment configuration.
 * Tweak these to restyle the entire scene.
 */

export const PALETTE = {
  // Sky
  skyTop: '#5fa8d3',
  skyMid: '#8fc7e8',
  skyHorizon: '#d9eef7',

  // Grass
  grassBase: '#6faa46',
  grassDark: '#4f7d32',

  // Lighting
  sunColor: '#ffffff',
  fillColor: '#bcd7ea',

  particleColor: '#d8d2c7',
} as const

export const FOG = {
  color: '#d7e8f2',
  near: 40,
  far: 140,
}

export const WORLD = {
  groundSize:     120,
  groundSegments:   1,
  particleCount:   22,   // was 180 — just a handful of dust motes
  particleSpread:  35,
  particleHeight:   4,
} as const
