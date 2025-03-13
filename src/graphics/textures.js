/**
 * Texture generation utilities for Neon Dice 2000
 */

import { log } from '../utils/debug.js';

// Texture cache for dice faces
const diceFaceCache = {};

/**
 * Get a texture for a dice face (using cache)
 * @param {Object} THREE - Three.js library
 * @param {number} value - Dice face value (1-6)
 * @param {number} color - Neon color as hex value
 * @returns {Object} - Canvas texture
 */
export function createDiceFaceTexture(THREE, value, color) {
  // Generate cache key
  const cacheKey = `face_${value}_${color}`;
  
  // Check cache first
  if (diceFaceCache[cacheKey]) {
    return diceFaceCache[cacheKey];
  }
  
  // Create new texture
  const texture = generateDiceFaceTexture(THREE, value, color);
  
  // Store in cache
  diceFaceCache[cacheKey] = texture;
  
  return texture;
}

/**
 * Generate a texture for a dice face with the specified number
 * @param {Object} THREE - Three.js library
 * @param {number} value - Dice face value (1-6)
 * @param {number} color - Neon color as hex value
 * @returns {Object} - Canvas texture
 */
function generateDiceFaceTexture(THREE, value, color) {
  try {
    const size = 256; // Texture resolution - balancing quality and performance
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Could not get 2D context for dice texture");
    }
    
    // Fill background with black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup neon glow effect
    const hexColor = `#${color.toString(16).padStart(6, '0')}`;
    ctx.shadowColor = hexColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Calculate pip positions
    const center = size / 2;
    const offset = size / 4;
    const pipRadius = size / 14;
    
    // Use white for the pips
    ctx.fillStyle = 'white';
    
    // Draw pips based on dice value
    switch(value) {
      case 1:
        drawPip(ctx, center, center, pipRadius);
        break;
        
      case 2:
        drawPip(ctx, center + offset, center - offset, pipRadius);
        drawPip(ctx, center - offset, center + offset, pipRadius);
        break;
        
      case 3:
        drawPip(ctx, center - offset, center - offset, pipRadius);
        drawPip(ctx, center, center, pipRadius);
        drawPip(ctx, center + offset, center + offset, pipRadius);
        break;
        
      case 4:
        drawPip(ctx, center - offset, center - offset, pipRadius);
        drawPip(ctx, center + offset, center - offset, pipRadius);
        drawPip(ctx, center - offset, center + offset, pipRadius);
        drawPip(ctx, center + offset, center + offset, pipRadius);
        break;
        
      case 5:
        drawPip(ctx, center - offset, center - offset, pipRadius);
        drawPip(ctx, center + offset, center - offset, pipRadius);
        drawPip(ctx, center, center, pipRadius);
        drawPip(ctx, center - offset, center + offset, pipRadius);
        drawPip(ctx, center + offset, center + offset, pipRadius);
        break;
        
      case 6:
        drawPip(ctx, center - offset, center - offset, pipRadius);
        drawPip(ctx, center - offset, center, pipRadius);
        drawPip(ctx, center - offset, center + offset, pipRadius);
        drawPip(ctx, center + offset, center - offset, pipRadius);
        drawPip(ctx, center + offset, center, pipRadius);
        drawPip(ctx, center + offset, center + offset, pipRadius);
        break;
        
      default:
        log(`Warning: Invalid dice value ${value}, defaulting to 1`);
        drawPip(ctx, center, center, pipRadius);
    }
    
    return new THREE.CanvasTexture(canvas);
    
  } catch (error) {
    log(`Error creating dice face texture: ${error.message}`);
    return createFallbackTexture(THREE, value, color);
  }
}

/**
 * Draw a single pip (dot) on the dice
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} radius - Pip radius
 */
function drawPip(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Create a fallback texture if canvas creation fails
 * @param {Object} THREE - Three.js library
 * @param {number} value - Dice face value
 * @param {number} color - Neon color as hex value
 * @returns {Object} - Basic texture
 */
function createFallbackTexture(THREE, value, color) {
  // Create a simple colored texture with the number
  const hexColor = `#${color.toString(16).padStart(6, '0')}`;
  const size = 64;
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // Last resort fallback - just return a basic texture
    return new THREE.TextureLoader().load(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    );
  }
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = hexColor;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toString(), size/2, size/2);
  
  return new THREE.CanvasTexture(canvas);
}

/**
 * Create a neon text texture
 * @param {Object} THREE - Three.js library
 * @param {string} text - Text to render
 * @param {number} color - Primary color as hex value 
 * @param {number} glowColor - Glow color as hex value
 * @param {number} size - Texture size
 * @returns {Object} - Canvas texture
 */
export function createNeonTextTexture(THREE, text, color, glowColor, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size * 2; // Wide for text
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    log('Warning: Could not get 2D context for neon text, using fallback');
    return createFallbackTexture(THREE, text, color);
  }
  
  // Background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Convert colors to CSS format
  const primaryColor = `#${color.toString(16).padStart(6, '0')}`;
  const secondaryColor = `#${glowColor.toString(16).padStart(6, '0')}`;
  
  // Text settings
  const fontSize = size / 3;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Glow effect - multiple layers with decreasing blur
  for (let i = 10; i > 0; i--) {
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = i * 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    const opacity = 0.2 + (10-i) * 0.05;
    const r = parseInt(secondaryColor.slice(1, 3), 16);
    const g = parseInt(secondaryColor.slice(3, 5), 16);
    const b = parseInt(secondaryColor.slice(5, 7), 16);
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  
  // Core text
  ctx.shadowBlur = 0;
  ctx.fillStyle = primaryColor;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Inner highlight - simulating the inner light
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = `bold ${fontSize * 0.97}px Arial, sans-serif`;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  return new THREE.CanvasTexture(canvas);
}