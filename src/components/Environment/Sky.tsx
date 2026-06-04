import { useMemo } from 'react'
import * as THREE from 'three'
import { PALETTE } from '../../constants/world'

/**
 * Sky
 * An inverted sphere (BackSide) with a vertical gradient shader
 * blending three colours: top → mid → horizon.
 * No texture assets needed.
 */
export default function Sky() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTop:     { value: new THREE.Color(PALETTE.skyTop) },
        uMid:     { value: new THREE.Color(PALETTE.skyMid) },
        uHorizon: { value: new THREE.Color(PALETTE.skyHorizon) },
      },
      vertexShader: /* glsl */`
        varying float vY;
        void main() {
          vY = normalize(position).y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        varying float vY;
        void main() {
          // Upper half: top → mid
          // Lower half: mid → horizon
          vec3 color;
          if (vY > 0.0) {
            float t = pow(vY, 0.6);
            color = mix(uMid, uTop, t);
          } else {
            float t = pow(-vY, 0.4);
            color = mix(uMid, uHorizon, t);
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,   // render inside of sphere
      depthWrite: false,
    })
  }, [])

  return (
    // Large enough to always surround the scene; rendered first (no depthWrite)
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[200, 32, 16]} />
    </mesh>
  )
}
