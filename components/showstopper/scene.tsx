"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useMemo } from "react";

/**
 * The single 3D moment of the entire site (Phase 3 only).
 * A quiet, slowly-distorting icosahedron that sits BEHIND the case-study text,
 * supportive, never overwhelming. frameloop="demand" keeps it cheap; the whole
 * Canvas is lazy-loaded by the parent so it never blocks first paint.
 *
 * `progress` (0..1 scroll position within the pinned section) gently shifts the
 * accent hue so the object feels scroll-linked without stealing focus.
 */
export default function Scene({ progress = 0 }: { progress?: number }) {
  // map scroll progress to a restrained hue drift around the cobalt accent
  const color = useMemo(() => {
    const hue = 226 + progress * 40; // cobalt → indigo-violet
    return `hsl(${hue}, 70%, 55%)`;
  }, [progress]);

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.1}>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 6]} />
          <MeshDistortMaterial
            color={color}
            distort={0.32}
            speed={1.1}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>
      </Float>
    </Canvas>
  );
}
