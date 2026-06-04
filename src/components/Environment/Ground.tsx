import { useMemo } from 'react'
import * as THREE from 'three'
import { PALETTE, WORLD } from '../../constants/world'

/**
 * Ground
 * A large flat plane with a custom ShaderMaterial that blends two
 * grass tones based on distance from centre — gives a subtle
 * radial vignette without any texture assets.
 */
export default function Ground() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColorCenter: { value: new THREE.Color(PALETTE.grassBase) },
        uColorEdge:   { value: new THREE.Color(PALETTE.grassDark) },
        uRadius:      { value: WORLD.groundSize * 0.45 },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColorCenter;
        uniform vec3 uColorEdge;
        uniform float uRadius;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          float dist = length(vWorldPos) / uRadius;
          dist = clamp(dist, 0.0, 1.0);
          // Smooth quintic ease
          float t = dist * dist * dist * (dist * (dist * 6.0 - 15.0) + 10.0);
          vec3 color = mix(uColorCenter, uColorEdge, t);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.FrontSide,
    })
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      material={material}
    >
      <planeGeometry args={[WORLD.groundSize, WORLD.groundSize, WORLD.groundSegments, WORLD.groundSegments]} />
    </mesh>
  )
}
