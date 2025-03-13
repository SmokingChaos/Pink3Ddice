/**
 * Configuration settings for the Neon Dice 2000 application
 */

// Debug mode - set to true to enable debug output
export const DEBUG = false;

// Library versions and URLs
export const LIBRARIES = {
  THREE: {
    url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
    fallbackUrl: './libs/three.module.js'
  },
  RAPIER: {
    url: 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.15.0/rapier.es.js',
    fallbackUrl: './libs/rapier.es.js'
  }
};

// Camera settings
export const CAMERA = {
  fov: 75,
  nearPlane: 0.1,
  farPlane: 1000,
  position: { x: 3, y: 8, z: 15 },
  lookAt: { x: 0, y: 0, z: 0 }
};

// Lighting settings
export const LIGHTING = {
  ambient: {
    color: 0x111111,
    intensity: 0.4
  },
  directional: {
    color: 0xffffff,
    intensity: 0.8,
    position: { x: 10, y: 10, z: 5 },
    castShadow: true
  }
};

// Physics settings
export const PHYSICS = {
  gravity: { x: 0, y: -9.81, z: 0 },
  floorSize: { x: 80, y: 0.1, z: 80 },
  dice: {
    size: 1.5,
    restitution: 0.3,  // bounciness
    friction: 0.8,
    linearDamping: 0.5,
    angularDamping: 0.5
  }
};

// Dice colors
export const DICE_COLORS = [
  0xff00ff,  // Pink
  0x00ffff   // Cyan
];

// Floor appearance
export const FLOOR = {
  size: 160,
  gridSize: 20,
  gridColor: 0x00ffff,
  gridGlow: 0x00ffff,
  textureSize: 1024,
  material: {
    color: 0x000000,
    emissive: 0x006666,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.7
  }
};