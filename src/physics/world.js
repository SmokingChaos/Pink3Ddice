/**
 * Physics world setup for Neon Dice 2000
 */

import { PHYSICS, FLOOR } from '../config.js';
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
  
  // Create a single composite boundary to contain dice
  // This is more efficient than creating individual walls
  createCompositeBoundary(RAPIER, world);
  
  log('Physics world created successfully');
  return world;
}

/**
 * Create a composite boundary to keep dice within the playing area
 * @param {Object} RAPIER - The Rapier physics library
 * @param {Object} world - The physics world
 */
function createCompositeBoundary(RAPIER, world) {
  log('Creating composite boundary');
  
  // Create a single static rigid body for all boundaries
  const boundaryBodyDesc = RAPIER.RigidBodyDesc.fixed();
  const boundaryBody = world.createRigidBody(boundaryBodyDesc);
  
  // Size of the playing area (should be slightly larger than the visible floor)
  const areaSize = FLOOR.size * 0.7; // 70% of the floor size (increased from 60%)
  const wallHeight = 40;
  const wallThickness = 2;
  
  // Create a compound collider with all four walls
  
  // Front wall (positive Z)
  const frontWallDesc = RAPIER.ColliderDesc.cuboid(
    areaSize/2, // half width
    wallHeight/2, // half height
    wallThickness/2 // half depth
  ).setTranslation(0, wallHeight/2, areaSize/2);
  
  // Back wall (negative Z)
  const backWallDesc = RAPIER.ColliderDesc.cuboid(
    areaSize/2, 
    wallHeight/2, 
    wallThickness/2
  ).setTranslation(0, wallHeight/2, -areaSize/2);
  
  // Right wall (positive X)
  const rightWallDesc = RAPIER.ColliderDesc.cuboid(
    wallThickness/2, 
    wallHeight/2, 
    areaSize/2
  ).setTranslation(areaSize/2, wallHeight/2, 0);
  
  // Left wall (negative X)
  const leftWallDesc = RAPIER.ColliderDesc.cuboid(
    wallThickness/2, 
    wallHeight/2, 
    areaSize/2
  ).setTranslation(-areaSize/2, wallHeight/2, 0);
  
  // Create all colliders at once - increased restitution for bouncier walls
  world.createCollider(frontWallDesc.setRestitution(0.6), boundaryBody);
  world.createCollider(backWallDesc.setRestitution(0.6), boundaryBody);
  world.createCollider(rightWallDesc.setRestitution(0.6), boundaryBody);
  world.createCollider(leftWallDesc.setRestitution(0.6), boundaryBody);
  
  // Add a very slight ramp to guide dice back to the center
  // Reduced slope to prevent excessive movement toward center
  const rampSlope = 0.05; // Reduced from 0.15
  
  // Create a ramp collider (invisible)
  const rampDesc = RAPIER.ColliderDesc.cuboid(
    areaSize, // width
    5, // thickness
    areaSize // depth
  )
  .setTranslation(0, -rampSlope, 0) // Slightly below the floor level
  .setRotation({ x: rampSlope, y: 0, z: 0 }); // Slight rotation for the ramp
  
  world.createCollider(rampDesc.setRestitution(0.3).setFriction(0.7), boundaryBody);
  
  log('Composite boundary created successfully');
}