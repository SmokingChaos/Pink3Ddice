/**
 * Physics world setup for Neon Dice 2000
 */

import { PHYSICS } from '../config.js';
import { log } from '../utils/debug.js';

/**
 * Setup the physics world with floor and boundaries
 * @param {Object} RAPIER - The Rapier physics library
 * @returns {Object} - The initialized physics world
 */
export function setupPhysicsWorld(RAPIER) {
  log('Creating physics world');
  
  // Create physics world with gravity
  const world = new RAPIER.World(PHYSICS.gravity);
  
  // Create floor rigid body
  const floorBodyDesc = RAPIER.RigidBodyDesc.fixed()
    .setTranslation(0, 0, 0);
  const floorBody = world.createRigidBody(floorBodyDesc);
  
  // Create floor collider
  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(
    PHYSICS.floorSize.x,
    PHYSICS.floorSize.y,
    PHYSICS.floorSize.z
  );
  world.createCollider(floorColliderDesc, floorBody);
  
  // Add invisible walls to contain dice within the visible area
  createBoundaryWall(RAPIER, world, 0, 20, 100, 40, 'front');  // Front wall
  createBoundaryWall(RAPIER, world, 0, 20, -100, 40, 'back');  // Back wall
  createBoundaryWall(RAPIER, world, 100, 20, 0, 40, 'right');  // Right wall
  createBoundaryWall(RAPIER, world, -100, 20, 0, 40, 'left');  // Left wall
  
  log('Physics world created successfully');
  return world;
}

/**
 * Create a boundary wall to keep dice in the visible area
 * @param {Object} RAPIER - The Rapier physics library
 * @param {Object} world - The physics world
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 * @param {number} size - Wall size
 * @param {string} position - Wall position identifier for logging
 */
function createBoundaryWall(RAPIER, world, x, y, z, size, position) {
  log(`Creating boundary wall: ${position}`);
  
  const wallBodyDesc = RAPIER.RigidBodyDesc.fixed()
    .setTranslation(x, y, z);
  const wallBody = world.createRigidBody(wallBodyDesc);
  
  // Determine wall orientation based on position
  let halfWidth, halfHeight, halfDepth;
  
  if (position === 'front' || position === 'back') {
    // Front/back walls (X-Y plane)
    halfWidth = size;
    halfHeight = size;
    halfDepth = 1;
  } else {
    // Left/right walls (Z-Y plane)
    halfWidth = 1;
    halfHeight = size;
    halfDepth = size;
  }
  
  const wallColliderDesc = RAPIER.ColliderDesc.cuboid(
    halfWidth,
    halfHeight,
    halfDepth
  ).setRestitution(0.3);  // Add some bounce to the walls
  
  world.createCollider(wallColliderDesc, wallBody);
}