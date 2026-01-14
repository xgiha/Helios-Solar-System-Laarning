import React from 'react';
import { FastForward, Pause, Play } from 'lucide-react';

interface ControlsProps {
  speed: number;
  setSpeed: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ speed, setSpeed }) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur border border-white/10 rounded-full p-2 flex items-center space-x-4 shadow-xl">
      <div className="flex items-center space-x-1 px-4 border-r border-white/10">
          <span className="text-white/60 text-xs font-mono uppercase">Sim Speed</span>
          <span className="text-indigo-400 font-bold text-sm w-8 text-center">{speed.toFixed(1)}x</span>
      </div>
      
      <button 
        onClick={() => setSpeed(0)}
        className={`p-2 rounded-full transition-colors ${speed === 0 ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        title="Pause"
      >
        <Pause size={18} />
      </button>
      
      <button 
        onClick={() => setSpeed(1)}
        className={`p-2 rounded-full transition-colors ${speed === 1 ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        title="Normal Speed"
      >
        <Play size={18} />
      </button>

      <button 
        onClick={() => setSpeed(5)}
        className={`p-2 rounded-full transition-colors ${speed === 5 ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        title="Fast Forward"
      >
        <FastForward size={18} />
      </button>
      
       <input 
          type="range" 
          min="0" 
          max="10" 
          step="0.1" 
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-24 accent-indigo-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
       />
    </div>
  );
};
