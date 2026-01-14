import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Planet } from './components/Planet';
import { Sun } from './components/Sun';
import { InfoPanel } from './components/InfoPanel';
import { Controls } from './components/Controls';
import { PLANET_DATA } from './constants';
import { PlanetData } from './types';
import * as THREE from 'three';

const Scene: React.FC<{ 
  selectedPlanet: PlanetData | null, 
  setSelectedPlanet: (p: PlanetData | null) => void,
  speed: number
}> = ({ selectedPlanet, setSelectedPlanet, speed }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 100, 250]} fov={45} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true} 
        maxDistance={500}
        minDistance={10}
        target={selectedPlanet ? [0,0,0] : [0,0,0]} // Simplified target for demo stability, ideally would track planet
      />
      
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Sun */}
      <Sun 
        data={PLANET_DATA[0]} 
        onClick={setSelectedPlanet} 
      />

      {/* Planets */}
      {PLANET_DATA.slice(1).map((planet) => (
        <Planet 
          key={planet.id} 
          data={planet} 
          isSelected={selectedPlanet?.id === planet.id}
          onClick={setSelectedPlanet}
          speedMultiplier={speed}
        />
      ))}
    </>
  );
};

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [speed, setSpeed] = useState(1);

  // Background audio (optional conceptual implementation)
  
  return (
    <div className="relative w-full h-full bg-black">
      {/* Header / Title Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mix-blend-difference opacity-80">
          HELIOS
        </h1>
        <p className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase ml-1">
          AI-Powered Solar Explorer
        </p>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <Suspense fallback={null}>
          <Scene 
            selectedPlanet={selectedPlanet} 
            setSelectedPlanet={setSelectedPlanet}
            speed={speed}
          />
        </Suspense>
      </Canvas>

      <Controls speed={speed} setSpeed={setSpeed} />
      
      <InfoPanel 
        planet={selectedPlanet} 
        onClose={() => setSelectedPlanet(null)} 
      />
      
      {/* Instructions Tip */}
      {!selectedPlanet && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white/30 text-xs animate-pulse pointer-events-none">
          Click on a planet to explore
        </div>
      )}
    </div>
  );
};

export default App;
