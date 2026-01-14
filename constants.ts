import { PlanetData } from './types';

// Visual scales (not scientifically accurate, but optimized for viewing)
export const PLANET_DATA: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    radius: 12,
    distance: 0,
    speed: 0,
    color: '#FDB813',
    description: 'The star at the center of our Solar System.',
    textureType: 'sun',
    orbitalPeriod: '230 million years', // Galactic orbit
    rotationPeriod: '27 days',
    avgTemp: '5,500°C (Surface)'
  },
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 0.8,
    distance: 20,
    speed: 1.5,
    color: '#A5A5A5',
    description: 'The smallest planet in the Solar System and the closest to the Sun.',
    textureType: 'rocky',
    orbitalPeriod: '88 days',
    rotationPeriod: '59 days',
    avgTemp: '167°C'
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 1.5,
    distance: 30,
    speed: 1.2,
    color: '#E3BB76',
    description: 'The second planet from the Sun. It is the hottest planet in the Solar System.',
    textureType: 'gas', // Visual simplification
    orbitalPeriod: '225 days',
    rotationPeriod: '243 days',
    avgTemp: '464°C'
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 1.6,
    distance: 45,
    speed: 1.0,
    color: '#22A6B3',
    description: 'Our home planet, the third from the Sun.',
    textureType: 'rocky',
    orbitalPeriod: '365.25 days',
    rotationPeriod: '24 hours',
    avgTemp: '15°C'
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 1.2,
    distance: 60,
    speed: 0.8,
    color: '#EB4D4B',
    description: 'The fourth planet from the Sun, often called the Red Planet.',
    textureType: 'rocky',
    orbitalPeriod: '687 days',
    rotationPeriod: '24.6 hours',
    avgTemp: '-65°C'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 5,
    distance: 90,
    speed: 0.4,
    color: '#F9CA24',
    description: 'The largest planet in the Solar System, a gas giant.',
    textureType: 'gas',
    orbitalPeriod: '12 years',
    rotationPeriod: '10 hours',
    avgTemp: '-110°C'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 4.5,
    distance: 130,
    speed: 0.3,
    color: '#F0932B',
    description: 'The sixth planet from the Sun, famous for its ring system.',
    textureType: 'gas',
    hasRings: true,
    ringColor: '#dcdde1',
    orbitalPeriod: '29 years',
    rotationPeriod: '10.7 hours',
    avgTemp: '-140°C'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 3.5,
    distance: 170,
    speed: 0.2,
    color: '#7ED6DF',
    description: 'The seventh planet from the Sun. It has the third-largest planetary radius.',
    textureType: 'ice',
    orbitalPeriod: '84 years',
    rotationPeriod: '17 hours',
    avgTemp: '-195°C'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 3.4,
    distance: 210,
    speed: 0.1,
    color: '#4834D4',
    description: 'The eighth and farthest-known Solar planet from the Sun.',
    textureType: 'ice',
    orbitalPeriod: '165 years',
    rotationPeriod: '16 hours',
    avgTemp: '-200°C'
  },
];
