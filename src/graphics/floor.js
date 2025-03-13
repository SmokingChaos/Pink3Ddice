/**
 * Floor creation for Neon Dice 2000
 */

import { FLOOR } from '../config.js';
import { log } from '../utils/debug.js';

/**
 * Create the floor mesh with grid texture
 * @param {Object} THREE - Three.js library
 * @param {Object} scene - Three.js scene
 * @param {Object} renderer - Three.js renderer
 * @returns {Object} - Floor mesh
 */
export function createFloor(THREE, scene, renderer) {
  log('Creating floor with grid texture');
  
  // Create grid texture
  const gridTexture = createGridTexture(THREE);
  
  // Set anisotropic filtering for sharper appearance
  if (renderer.capabilities.getMaxAnisotropy) {
    gridTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
  
  // Create floor geometry
  const floorGeometry = new THREE.PlaneGeometry(FLOOR.size, FLOOR.size);
  
  // Create floor material with grid texture
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: FLOOR.material.color,
    emissive: FLOOR.material.emissive,
    emissiveMap: gridTexture,
    emissiveIntensity: FLOOR.material.emissiveIntensity,
    roughness: FLOOR.material.roughness,
    metalness: FLOOR.material.metalness
  });
  
  // Create floor mesh
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  
  // Rotate floor to horizontal position and enable shadows
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  
  // Add to scene
  scene.add(floorMesh);
  
  log('Floor created successfully');
  return floorMesh;
}

/**
 * Create a grid texture for the floor
 * @param {Object} THREE - Three.js library
 * @returns {Object} - Canvas texture
 */
function createGridTexture(THREE) {
  const size = FLOOR.textureSize;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    log('Warning: Could not get 2D context for grid texture, using fallback');
    return createFallbackTexture(THREE);
  }
  
  // Fill background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, size, size);
  
  // Draw grid lines
  ctx.strokeStyle = `#${FLOOR.gridColor.toString(16).padStart(6, '0')}`;
  ctx.shadowColor = `#${FLOOR.gridGlow.toString(16).padStart(6, '0')}`;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  
  const gridSpacing = size / FLOOR.gridSize;
  
  for (let i = 0; i <= FLOOR.gridSize; i++) {
    const pos = i * gridSpacing;
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();
  }
  
  return new THREE.CanvasTexture(canvas);
}

/**
 * Create a simple fallback texture in case canvas fails
 * @param {Object} THREE - Three.js library
 * @returns {Object} - Basic texture
 */
function createFallbackTexture(THREE) {
  // Create a simple checkerboard texture as fallback
  return new THREE.TextureLoader().load(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  );
}