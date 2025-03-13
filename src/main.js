/**
 * Neon Dice 2000 - Main Application
 * 
 * This is the entry point for the application that coordinates
 * the initialization and running of the 3D dice simulation.
 */

import { DEBUG, DICE_COLORS, CAMERA } from './config.js';
import { initDebug, log, error } from './utils/debug.js';
import { 
  loadDependencies, 
  trackProgress 
} from './utils/loader.js';
import { createDice } from './physics/dice.js';
import { setupPhysicsWorld } from './physics/world.js';
import { createFloor } from './graphics/floor.js';

// Initialize debug if enabled
initDebug(DEBUG);

// Define error display function in case it's not imported correctly
function showError(title, details, helpText) {
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

// Main application function
async function initApp() {
  try {
    log('Application starting');
    
    // Load dependencies (Three.js and Rapier)
    const { THREE, RAPIER, scene, camera, renderer } = await loadDependencies();
    
    // Apply camera tilt if configured
    if (CAMERA.tilt) {
      camera.rotation.z = CAMERA.tilt;
    }
    
    // Track loading progress
    trackProgress(30, 'Setting up physics world...');
    
    // Setup physics world
    const world = setupPhysicsWorld(RAPIER);
    
    // Track loading progress
    trackProgress(50, 'Creating environment...');
    
    // Create floor
    createFloor(THREE, scene, renderer);
    
    // Track loading progress
    trackProgress(70, 'Creating dice...');
    
    // Create dice
    const dice = [];
    for (let i = 0; i < DICE_COLORS.length; i++) {
      dice.push(createDice(THREE, RAPIER, scene, world, DICE_COLORS[i]));
    }
    
    // Track loading progress
    trackProgress(90, 'Finalizing setup...');
    
    // Define the roll dice function
    function rollDice() {
      dice.forEach((die, index) => {
        // Use wider spacing between dice
        const offsetX = index * 4;  // Increased from 0.5
        const offsetZ = index * 3;  // Increased from 0.3
        const height = 8 + index * 3; // Higher starting position
        
        // Position dice with more variation
        die.reset(
          8 + offsetX + (Math.random() * 2 - 1), // Add some randomness
          height,
          8 + offsetZ + (Math.random() * 2 - 1)  // Add some randomness
        );
        
        // Apply impulse for rolling - stronger and more varied
        const force = 18 + Math.random() * 5;  // Increased force
        
        die.applyImpulse(
          -force * (0.9 + Math.random() * 0.2), 
          6 + Math.random() * 3,  // More upward force
          -force * (0.7 + Math.random() * 0.3)
        );
        
        // Apply stronger random rotation
        die.applyTorque(
          (Math.random() - 0.5) * 15,  // Increased from 10
          (Math.random() - 0.5) * 15,  // Increased from 10
          (Math.random() - 0.5) * 15   // Increased from 10
        );
      });
    }
    
    // Hide loading screen and show instructions
    trackProgress(100, 'Ready!');
    document.getElementById('loading').style.display = 'none';
    
    // Add event listeners for rolling dice
    window.addEventListener('click', rollDice);
    window.addEventListener('touchstart', (e) => {
      e.preventDefault();
      rollDice();
    });
    
    // Initial roll after a short delay
    setTimeout(rollDice, 500);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Step physics world
      world.step();
      
      // Update dice positions and rotations
      dice.forEach(die => die.update());
      
      // Render scene
      renderer.render(scene, camera);
    }
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    log('Application started successfully');
    
  } catch (err) {
    error('Failed to initialize application', err);
    showError(
      'Application Error',
      'Failed to initialize the 3D environment.',
      'Please check your browser compatibility and try refreshing the page.'
    );
  }
}

// Start the application
initApp();