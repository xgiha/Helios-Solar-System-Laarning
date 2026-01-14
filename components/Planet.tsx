import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../types';

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onClick: (data: PlanetData) => void;
  speedMultiplier: number;
}

export const Planet: React.FC<PlanetProps> = ({ data, isSelected, onClick, speedMultiplier }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  // Random start angle
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * data.speed * 0.1 * speedMultiplier + initialAngle;
    const x = Math.cos(t) * data.distance;
    const z = Math.sin(t) * data.distance;

    if (orbitRef.current) {
      orbitRef.current.position.set(x, 0, z);
      // Self rotation
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group>
      {/* Orbit Path Visual */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Group Container moving along orbit */}
      <group ref={orbitRef}>
        <Sphere
          ref={meshRef}
          args={[data.radius, 32, 32]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(data);
          }}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <meshStandardMaterial
            color={data.color}
            roughness={data.textureType === 'gas' ? 0.4 : 0.7}
            metalness={0.1}
            emissive={isSelected ? data.color : '#000000'}
            emissiveIntensity={isSelected ? 0.5 : 0}
          />
        </Sphere>

        {/* Planet Label on Hover */}
        {(hovered || isSelected) && (
            <Html distanceFactor={20} position={[0, data.radius + 1, 0]}>
                <div className="bg-black/80 backdrop-blur text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-white/20 pointer-events-none">
                    {data.name}
                </div>
            </Html>
        )}

        {/* Rings for Saturn-like planets */}
        {data.hasRings && (
          <mesh rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
            <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
            <meshStandardMaterial
              color={data.ringColor}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
