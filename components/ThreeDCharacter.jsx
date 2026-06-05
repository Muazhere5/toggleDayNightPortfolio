'use client';

// ============================================================
// components/ThreeDCharacter.jsx — 3D GLB CHARACTER VIEWER
//
// CONNECTION MAP:
//   Landing.jsx → imports and mounts <ThreeDCharacter theme={theme} />
//   public/assets/character/threedavator.glb → the 3D model file
//
// PROPS:
//   theme {string} 'day' | 'night'
//
// HOW IT WORKS:
//   1. Dynamically imports @react-three/fiber + @react-three/drei
//      (ssr: false handled by parent via next/dynamic)
//   2. Canvas renders the GLB model with OrbitControls
//   3. Lighting adapts to day/night theme
//   4. Platform glow + fog + environment match each theme
//   5. Suspense fallback = animated placeholder (no layout shift)
//
// PERFORMANCE NOTES:
//   - frameloop="demand" → only re-renders on interaction/animation
//     This prevents constant GPU usage when model is idle
//   - Model is memoised — never re-loads on parent re-render
//   - Canvas is destroyed when component unmounts (no memory leak)
//   - dpr capped at [1, 2] — prevents 4K GPU overload on retina
// ============================================================

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ── GLB MODEL ─────────────────────────────────────────────────
// Separated into its own component so Suspense can catch loading
function CharacterModel({ isDay }) {
  const { scene } = useGLTF('/assets/character/threedavator.glb');
  const modelRef = useRef();

  // Subtle auto-rotation — gentle idle animation
  useFrame((state) => {
    if (!modelRef.current) return;
    // Slow gentle sway left-right — like breathing
    modelRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  // Ensure all meshes cast + receive shadows
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
        // Improve material quality
        if (child.material) {
          child.material.envMapIntensity = isDay ? 0.6 : 0.9;
        }
      }
    });
  }, [scene, isDay]);

  return (
    // Float = gentle bobbing up/down — matches the sky portfolio feel
    <Float
      speed={1.8}
      rotationIntensity={0.08}
      floatIntensity={0.35}
      floatingRange={[-0.06, 0.06]}
    >
      <primitive
        ref={modelRef}
        object={scene}
        // Position: slightly raised so shadow platform looks natural
        position={[0, -1.1, 0]}
        // Scale: adjust if model appears too large/small
        scale={[1.85, 1.85, 1.85]}
      />
    </Float>
  );
}

// ── CIRCULAR PLATFORM GLOW ────────────────────────────────────
// A glowing disc under the character — day vs night styles
function PlatformGlow({ isDay }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    // Pulse the opacity gently
    meshRef.current.material.opacity =
      0.35 + Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.12, 0]}
    >
      <circleGeometry args={[1.1, 64]} />
      <meshBasicMaterial
        color={isDay ? '#87CEEB' : '#7B68EE'}
        transparent
        opacity={0.38}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── LOADING PLACEHOLDER ───────────────────────────────────────
// Shown while GLB is downloading — matches bubble style
function LoadingFallback({ isDay }) {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale:   [0.97, 1.02, 0.97],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      {/* Pulsing silhouette circle */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isDay
          ? 'rgba(255,255,255,0.3)'
          : 'rgba(123,104,238,0.2)',
        border: isDay
          ? '2px solid rgba(255,255,255,0.5)'
          : '2px solid rgba(123,104,238,0.4)',
      }} />
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.5)',
        animation: 'charLoaderDots 1.4s ease-in-out infinite',
      }}>
        Loading
      </span>
      <style>{`
        @keyframes charLoaderDots {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORTED COMPONENT
// ══════════════════════════════════════════════════════════════
export default function ThreeDCharacter({ theme }) {
  const isDay = theme === 'day';

  // ── THEME-MATCHED LIGHTING CONFIG ──────────────────────────
  // Day: warm golden sun simulation → brings out green polo + brown hair
  // Night: cool purple/cyan studio → creates space station feel
  const ambientIntensity  = isDay ? 0.9  : 0.35;
  const mainLightColor    = isDay ? '#FFF5E0' : '#b8d4ff';
  const mainLightIntensity = isDay ? 2.2  : 1.6;
  const fillLightColor    = isDay ? '#87CEEB' : '#7B68EE';
  const fillLightIntensity = isDay ? 0.7  : 0.8;
  const rimLightColor     = isDay ? '#FFD580' : '#00e5ff';
  const rimLightIntensity = isDay ? 0.5  : 0.9;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* ── ATMOSPHERIC GLOW RING behind the canvas ─────── */}
      <motion.div
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale:   [1, 1.08, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '50%',
          background: isDay
            ? 'radial-gradient(circle, rgba(255,220,100,0.18) 0%, rgba(135,206,235,0.12) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(123,104,238,0.22) 0%, rgba(0,229,255,0.08) 50%, transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── THREE.JS CANVAS ─────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
        <Suspense fallback={<LoadingFallback isDay={isDay} />}>
          <Canvas
            // frameloop="demand" = only renders when something changes
            // This is the KEY performance setting — no idle GPU drain
            frameloop="demand"
            // Cap device pixel ratio — prevents 4K GPU overload
            dpr={[1, 2]}
            camera={{
              position: [0, 0.5, 4.2],
              fov: 38,
              near: 0.1,
              far: 100,
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'transparent',
            }}
            gl={{
              antialias: true,
              alpha: true,          // transparent background
              powerPreference: 'high-performance',
            }}
            shadows
          >
            {/* ── SCENE FOG ── subtle depth effect */}
            <fog
              attach="fog"
              args={[
                isDay ? '#c5e8f5' : '#020208',
                8,
                22,
              ]}
            />

            {/* ── AMBIENT LIGHT ── fills all shadows softly */}
            <ambientLight intensity={ambientIntensity} />

            {/* ── MAIN KEY LIGHT ── from top-left (sun/studio key) */}
            <directionalLight
              position={[3, 6, 4]}
              color={mainLightColor}
              intensity={mainLightIntensity}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={20}
              shadow-camera-left={-4}
              shadow-camera-right={4}
              shadow-camera-top={4}
              shadow-camera-bottom={-4}
            />

            {/* ── FILL LIGHT ── softens harsh shadows */}
            <directionalLight
              position={[-3, 2, -2]}
              color={fillLightColor}
              intensity={fillLightIntensity}
            />

            {/* ── RIM LIGHT ── separates character from background */}
            <directionalLight
              position={[0, -1, -4]}
              color={rimLightColor}
              intensity={rimLightIntensity}
            />

            {/* ── ENVIRONMENT ── subtle HDR reflections on model */}
            <Environment preset={isDay ? 'dawn' : 'night'} />

            {/* ── PLATFORM GLOW DISC ── */}
            <PlatformGlow isDay={isDay} />

            {/* ── CONTACT SHADOW ── natural ground shadow */}
            <ContactShadows
              position={[0, -1.12, 0]}
              opacity={isDay ? 0.35 : 0.55}
              scale={3}
              blur={2.5}
              far={1.5}
              color={isDay ? '#4a8ab5' : '#3a2080'}
            />

            {/* ── THE CHARACTER MODEL ── */}
            <CharacterModel isDay={isDay} />

            {/* ── ORBIT CONTROLS ──
                Allows mouse/touch rotation
                Limited to prevent flipping upside down
                Auto-rotate disabled — we handle animation in CharacterModel */}
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3.5}
              maxPolarAngle={Math.PI / 1.8}
              // Gentle damping for smooth feel
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.55}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

// Preload the GLB when the module loads — reduces wait time
// This starts fetching the .glb in the background immediately
useGLTF.preload('/assets/character/threedavator.glb');