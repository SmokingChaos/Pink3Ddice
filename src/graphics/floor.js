/**
 * Floor creation for Neon Dice 2000
 */

import { FLOOR } from '../config.js';
import { log } from '../utils/debug.js';

// Texture cache
const textureCache = {
  grid: null,
  mountains: null
};

/**
 * Create the floor mesh with grid texture and Tron landscape
 * @param {Object} THREE - Three.js library
 * @param {Object} scene - Three.js scene
 * @param {Object} renderer - Three.js renderer
 * @returns {Object} - Floor mesh
 */
export function createFloor(THREE, scene, renderer) {
  log('Creating floor with grid texture');
  
  // Create grid texture (using cache)
  const gridTexture = getGridTexture(THREE);
  
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
  
  // Add Tron mountains landscape in the distance if enabled
  if (FLOOR.mountains.enabled) {
    addTronMountains(THREE, scene);
  }
  
  log('Floor created successfully');
  return floorMesh;
}

/**
 * Get a grid texture for the floor (using cache)
 * @param {Object} THREE - Three.js library
 * @returns {Object} - Canvas texture
 */
function getGridTexture(THREE) {
  // Check cache first
  if (textureCache.grid) {
    log('Using cached grid texture');
    return textureCache.grid;
  }
  
  log('Creating new grid texture');
  const texture = createGridTexture(THREE);
  
  // Store in cache
  textureCache.grid = texture;
  
  return texture;
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
  ctx.shadowBlur = 6; // Smaller blur for finer lines
  ctx.lineWidth = FLOOR.gridLineWidth || 1; // Thinner lines from config
  
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
 * Add Tron-style mountains in the distance
 * @param {Object} THREE - Three.js library
 * @param {Object} scene - Three.js scene
 */
function addTronMountains(THREE, scene) {
  log('Creating Tron landscape with distant mountains');
  
  // Create mountain texture (or use cached version)
  const mountainTexture = getMountainTexture(THREE);
  
  // Create a large curved plane for the mountains backdrop
  const distance = FLOOR.mountains.distance;
  const width = FLOOR.size * 2;
  const height = FLOOR.mountains.height * 2;
  
  // Create a cylinder geometry for curved backdrop
  const mountainGeometry = new THREE.CylinderGeometry(
    distance, // radius top
    distance, // radius bottom
    height,   // height
    32,       // segments
    1,        // height segments
    true,     // open-ended
    Math.PI * 0.25, // theta start (angle)
    Math.PI * 1.5   // theta length (angle)
  );
  
  // Create material with mountain texture
  const mountainMaterial = new THREE.MeshBasicMaterial({
    map: mountainTexture,
    side: THREE.BackSide, // Render inside of cylinder
    transparent: true
  });
  
  // Create mesh
  const mountainMesh = new THREE.Mesh(mountainGeometry, mountainMaterial);
  
  // Position and rotate
  mountainMesh.position.set(0, height/2 - 20, 0); // Adjust y to have horizon at eye level
  
  // Add to scene
  scene.add(mountainMesh);
  
  log('Tron landscape created successfully');
}

/**
 * Get mountain texture (using cache)
 * @param {Object} THREE - Three.js library
 * @returns {Object} - Canvas texture
 */
function getMountainTexture(THREE) {
  // Check cache first
  if (textureCache.mountains) {
    log('Using cached mountain texture');
    return textureCache.mountains;
  }
  
  log('Creating new mountain texture');
  const texture = createMountainTexture(THREE);
  
  // Store in cache
  textureCache.mountains = texture;
  
  return texture;
}

/**
 * Create a texture with mountains for the Tron landscape
 * @param {Object} THREE - Three.js library
 * @returns {Object} - Canvas texture
 */
function createMountainTexture(THREE) {
  const width = 2048;
  const height = 1024;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    log('Warning: Could not get 2D context for mountain texture, using fallback');
    return createFallbackTexture(THREE);
  }
  
  // Gradient sky background
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  skyGradient.addColorStop(0, 'black');
  skyGradient.addColorStop(1, '#001122');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.5);
  
  // Draw mountains in the distance
  const mountainColor = `#${FLOOR.mountains.color.toString(16).padStart(6, '0')}`;
  const glowColor = `#${FLOOR.mountains.glowColor.toString(16).padStart(6, '0')}`;
  
  // Mountain glow effect
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillStyle = mountainColor;
  
  // Function to draw a mountain peak
  function drawMountainRange(baseY, maxHeight, count, opacity) {
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    
    // Create mountain peaks
    for (let i = 0; i <= count; i++) {
      const x = (width * i) / count;
      const peakHeight = Math.random() * maxHeight;
      ctx.lineTo(x, baseY - peakHeight);
    }
    
    // Complete the shape
    ctx.lineTo(width, baseY);
    ctx.closePath();
    
    // Set transparency
    ctx.globalAlpha = opacity;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Draw mountain outlines with glow
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Draw multiple mountain ranges at different distances
  drawMountainRange(height * 0.5, height * 0.3, 5, 0.8);  // Closest range
  drawMountainRange(height * 0.45, height * 0.25, 7, 0.6); // Middle range
  drawMountainRange(height * 0.4, height * 0.2, 10, 0.4);  // Distant range
  
  // Draw grid lines extending to horizon
  const horizonY = height * 0.5;
  const vanishingPointX = width / 2;
  const vanishingPointY = horizonY * 0.8;
  
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 5;
  
  // Draw perspective grid lines
  const gridLineCount = 20;
  const gridSpacing = width / gridLineCount;
  
  for (let i = 0; i <= gridLineCount; i++) {
    const x = i * gridSpacing;
    
    // Draw line from bottom to vanishing point
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(
      vanishingPointX + (x - vanishingPointX) * 0.2,
      vanishingPointY
    );
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
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