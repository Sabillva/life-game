/**
 * world.ts
 * Single source of truth for the world's visual palette,
 * fog settings, and environment configuration.
 * Tweak these to restyle the entire scene.
 */

export const PALETTE = {
  // Sky gradient — clear midday sky, no green tint, proper atmospheric scattering
  skyTop:     '#4a8fc2',   // deep cerulean overhead
  skyMid:     '#87bfdf',   // mid-blue, slightly desaturated
  skyHorizon: '#c9dfe8',   // pale silver-blue haze at horizon

  // Ground — real lawn: slightly yellow-green, not saturated
  grassBase:  '#7a9e5f',   // natural mid-tone lawn grass
  grassDark:  '#5c7a44',   // slightly darker at distance / shadows

  // Lighting — high-noon sun is nearly white, very slight warmth
  sunColor:   '#fff8f0',   // near-white with barely perceptible warmth
  fillColor:  '#d6e8f5',   // cool sky-bounce from above
  rimColor:   '#e8f0d8',   // very subtle warm-neutral fill, not orange

  // Particles — nearly invisible dust motes, not glowing spores
  particleColor: '#d4cfc8',
} as const

export const FOG = {
  // True atmospheric haze: blueish-grey, not green
  color:   '#b8cedc',
  near:    18,
  far:     80,
} as const

export const WORLD = {
  groundSize:     120,
  groundSegments:   1,
  particleCount:   22,   // was 180 — just a handful of dust motes
  particleSpread:  35,
  particleHeight:   4,
} as const
