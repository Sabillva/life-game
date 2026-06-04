import { CHARACTER } from '../../constants/character'

/**
 * CharacterMesh
 * Pure visual representation of the player character.
 * A stylized capsule body with two subtle eyes and blush marks.
 * No state, no hooks — just geometry + materials.
 *
 * The parent Group's Y rotation is driven by CharacterController.
 */
export default function CharacterMesh() {
  const r = CHARACTER.radius
  const h = CHARACTER.height

  return (
    <group>
      {/* ── Body capsule ────────────────────────────────────────── */}
      {/* Bottom hemisphere */}
      <mesh position={[0, r, 0]} castShadow receiveShadow>
        <sphereGeometry args={[r, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={CHARACTER.bodyColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Cylinder torso */}
      <mesh position={[0, r + h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h, 16, 1]} />
        <meshStandardMaterial color={CHARACTER.bodyColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Top hemisphere (head) */}
      <mesh position={[0, r + h, 0]} castShadow receiveShadow>
        <sphereGeometry args={[r, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={CHARACTER.bodyColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* ── Face details (on head sphere) ───────────────────────── */}
      {/* Left eye */}
      <mesh position={[-r * 0.38, r + h + r * 0.35, r * 0.88]}>
        <sphereGeometry args={[r * 0.13, 8, 8]} />
        <meshStandardMaterial color={CHARACTER.eyeColor} roughness={0.4} />
      </mesh>

      {/* Right eye */}
      <mesh position={[r * 0.38, r + h + r * 0.35, r * 0.88]}>
        <sphereGeometry args={[r * 0.13, 8, 8]} />
        <meshStandardMaterial color={CHARACTER.eyeColor} roughness={0.4} />
      </mesh>

      {/* Left blush */}
      <mesh position={[-r * 0.58, r + h + r * 0.1, r * 0.78]}
            rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[r * 0.18, 6, 6]} />
        <meshStandardMaterial
          color={CHARACTER.cheekColor}
          transparent opacity={0.55}
          roughness={1}
        />
      </mesh>

      {/* Right blush */}
      <mesh position={[r * 0.58, r + h + r * 0.1, r * 0.78]}
            rotation={[0, -0.3, 0]}>
        <sphereGeometry args={[r * 0.18, 6, 6]} />
        <meshStandardMaterial
          color={CHARACTER.cheekColor}
          transparent opacity={0.55}
          roughness={1}
        />
      </mesh>

      {/* ── Soft blob shadow on ground ──────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[r * 1.1, 24]} />
        <meshBasicMaterial
          color="#2a4a20"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
