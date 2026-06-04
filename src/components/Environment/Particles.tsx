import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PALETTE, WORLD } from '../../constants/world'

/**
 * Particles
 * A tiny handful of dust motes drifting slowly through the air.
 * Count is deliberately very low (WORLD.particleCount = 22) so they
 * read as occasional real-world dust rather than magical spores.
 *
 * No additive blending — dust is opaque, not luminous.
 */
export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null!)

  const { geometry, offsets } = useMemo(() => {
    const count  = WORLD.particleCount
    const spread = WORLD.particleSpread
    const height = WORLD.particleHeight

    const positions     = new Float32Array(count * 3)
    const randomOffsets = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * spread
      positions[i3 + 1] = Math.random() * height + 0.3
      positions[i3 + 2] = (Math.random() - 0.5) * spread

      randomOffsets[i3]     = Math.random() * Math.PI * 2   // x sway phase
      randomOffsets[i3 + 1] = Math.random() * Math.PI * 2   // z drift phase
      randomOffsets[i3 + 2] = 0.15 + Math.random() * 0.25  // very slow speed
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry: geo, offsets: randomOffsets }
  }, [])

  useFrame((state) => {
    const t   = state.clock.elapsedTime
    const pos = geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const count  = WORLD.particleCount
    const spread = WORLD.particleSpread
    const height = WORLD.particleHeight

    for (let i = 0; i < count; i++) {
      const i3    = i * 3
      const speed = offsets[i3 + 2]
      const xPh   = offsets[i3]
      const zPh   = offsets[i3 + 1]

      // Very slow, barely perceptible drift — more realistic than active rising
      arr[i3]     += Math.sin(t * speed + xPh) * 0.001
      arr[i3 + 1] += speed * 0.0012
      arr[i3 + 2] += Math.cos(t * speed * 0.8 + zPh) * 0.001

      if (arr[i3 + 1] > height) {
        arr[i3]     = (Math.random() - 0.5) * spread
        arr[i3 + 1] = 0.2
        arr[i3 + 2] = (Math.random() - 0.5) * spread
      }
    }
    pos.needsUpdate = true
  })

  const material = useMemo(() => new THREE.PointsMaterial({
    color:          new THREE.Color(PALETTE.particleColor),
    size:           0.045,
    sizeAttenuation: true,
    transparent:    true,
    opacity:        0.45,           // subtle — barely visible
    depthWrite:     false,
    blending:       THREE.NormalBlending,  // no additive glow
  }), [])

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
