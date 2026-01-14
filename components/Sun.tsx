import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../types';

interface SunProps {
  data: PlanetData;
  onClick: (data: PlanetData) => void;
}

export const Sun: React.FC<SunProps> = ({ data, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      <pointLight intensity={2.5} distance={300} decay={1} color="#FFF5CC" />
      <ambientLight intensity={0.2} />
      <Sphere
        ref={meshRef}
        args={[data.radius, 64, 64]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial
          emissive={new THREE.Color(data.color)}
          emissiveIntensity={1.5} // Make it glow
          color={data.color}
          toneMapped={false}
        />
      </Sphere>
      {/* Glow Halo */}
      <Sphere args={[data.radius * 1.2, 32, 32]}>
         <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
         />
      </Sphere>
    </group>
  );
};
