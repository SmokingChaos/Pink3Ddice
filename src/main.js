/**
 * Neon Dice 2000 - Main Application
 * 
 * This is the entry point for the application that coordinates
 * the initialization and running of the 3D dice simulation.
 */

import { DEBUG, DICE_COLORS } from './config.js';
import { initDebug, log, error } from './utils/debug.js';
import { 
  loadDependencies, 
  trackProgress, 
  showError 
} from './utils/loader.js';
import { createDice } from './physics/dice.js';
import { setupPhysicsWorld } from './physics/world.js';
import { createFloor } from './graphics/floor.js';

// Initialize debug if enabled
initDebug(DEBUG);

// Main application function
async function initApp() {
  try {
    log('Application starting');
    
    // Load dependencies (Three.js and Rapier)
    const { THREE, RAPIER, scene, camera, renderer } = await loadDependencies();
    
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
        // Stagger the dice a bit for more natural rolling
        const offsetX = index * 0.5;
        const offsetZ = index * 0.3;
        const height = 8 + index * 2;
        
        die.reset(10 + offsetX, height, 10 + offsetZ);
        
        // Apply impulse for rolling
        const force = 15 + Math.random() * 3;
        die.applyImpulse(
          -force, 
          5 + Math.random() * 2, 
          -force * (0.8 + Math.random() * 0.4)
        );
        
        // Apply random rotation
        die.applyTorque(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
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