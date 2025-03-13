/**
 * Resource loading utilities for Neon Dice 2000
 */

import { LIBRARIES, CAMERA, LIGHTING } from '../config.js';
import { log, error } from './debug.js';

// DOM elements for tracking progress
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

/**
 * Update the loading progress bar and text
 * @param {number} percent - Loading progress percentage (0-100)
 * @param {string} message - Loading status message
 */
export function trackProgress(percent, message) {
  progressFill.style.width = `${percent}%`;
  progressText.textContent = message;
  log(`Loading progress: ${percent}% - ${message}`);
}

/**
 * Show error message in the loading screen
 * @param {string} title - Error title
 * @param {string} details - Error details
 * @param {string} helpText - Help text to guide the user
 */
export function showError(title, details, helpText) {
  const loadingEl = document.getElementById('loading');
  
  // Clear existing content
  loadingEl.innerHTML = '';
  
  // Create error message container
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  
  // Add error title
  const titleEl = document.createElement('div');
  titleEl.className = 'error-title';
  titleEl.textContent = title;
  errorEl.appendChild(titleEl);
  
  // Add error details
  const detailsEl = document.createElement('div');
  detailsEl.className = 'error-details';
  detailsEl.textContent = details;
  errorEl.appendChild(detailsEl);
  
  // Add help text
  const helpEl = document.createElement('div');
  helpEl.className = 'error-help';
  helpEl.textContent = helpText;
  errorEl.appendChild(helpEl);
  
  // Add to loading screen
  loadingEl.appendChild(errorEl);
}

/**
 * Load Three.js and Rapier physics libraries
 * @returns {Promise<Object>} - Loaded libraries and initialized scene
 */
export async function loadDependencies() {
  try {
    // Start loading
    trackProgress(5, 'Loading 3D renderer...');
    
    // Load Three.js
    const THREE = await importLibrary(
      LIBRARIES.THREE.url, 
      LIBRARIES.THREE.fallbackUrl, 
      'Three.js'
    );
    
    trackProgress(20, 'Loading physics engine...');
    
    // Load Rapier physics
    const RAPIER = await importLibrary(
      LIBRARIES.RAPIER.url, 
      LIBRARIES.RAPIER.fallbackUrl, 
      'Rapier physics'
    );
    
    // Initialize Rapier
    await RAPIER.init();
    
    trackProgress(25, 'Setting up 3D scene...');
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      CAMERA.fov, 
      window.innerWidth / window.innerHeight, 
      CAMERA.nearPlane, 
      CAMERA.farPlane
    );
    camera.position.set(
      CAMERA.position.x, 
      CAMERA.position.y, 
      CAMERA.position.z
    );
    camera.lookAt(
      CAMERA.lookAt.x, 
      CAMERA.lookAt.y, 
      CAMERA.lookAt.z
    );
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    
    // Setup lighting
    const ambientLight = new THREE.AmbientLight(
      LIGHTING.ambient.color, 
      LIGHTING.ambient.intensity
    );
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(
      LIGHTING.directional.color, 
      LIGHTING.directional.intensity
    );
    directionalLight.position.set(
      LIGHTING.directional.position.x,
      LIGHTING.directional.position.y,
      LIGHTING.directional.position.z
    );
    directionalLight.castShadow = LIGHTING.directional.castShadow;
    scene.add(directionalLight);
    
    return { THREE, RAPIER, scene, camera, renderer };
    
  } catch (err) {
    error('Failed to load dependencies', err);
    
    let errorMessage = 'Could not load required libraries.';
    let helpText = 'Please check your internet connection and try refreshing the page.';
    
    if (err.message.includes('Three.js')) {
      errorMessage = 'Failed to load 3D rendering engine (Three.js).';
    } else if (err.message.includes('Rapier')) {
      errorMessage = 'Failed to load physics engine (Rapier).';
    }
    
    showError('Loading Error', errorMessage, helpText);
    throw err;
  }
}

/**
 * Import a library with fallback support
 * @param {string} url - Primary URL for the library
 * @param {string} fallbackUrl - Fallback URL if primary fails
 * @param {string} name - Library name for error reporting
 * @returns {Promise<Object>} - The imported library
 */
async function importLibrary(url, fallbackUrl, name) {
  try {
    log(`Loading ${name} from ${url}`);
    return await import(url);
  } catch (primaryError) {
    log(`Primary ${name} load failed, trying fallback: ${fallbackUrl}`);
    
    try {
      return await import(fallbackUrl);
    } catch (fallbackError) {
      throw new Error(`Failed to load ${name} from both primary and fallback sources.`);
    }
  }
}