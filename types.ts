export interface PlanetData {
  id: string;
  name: string;
  radius: number; // Relative size for visualization
  distance: number; // Distance from sun
  speed: number; // Orbital speed multiplier
  color: string;
  description: string;
  textureType: 'rocky' | 'gas' | 'sun' | 'ice';
  hasRings?: boolean;
  ringColor?: string;
  orbitInclination?: number; // In degrees (visual variety)
  orbitalPeriod: string; // Year length
  rotationPeriod: string; // Day length
  avgTemp: string; // Average temperature
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
