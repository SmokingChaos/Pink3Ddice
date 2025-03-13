/**
 * Dice physics implementation for Neon Dice 2000
 */

import { PHYSICS } from '../config.js';
import { log } from '../utils/debug.js';
import { createDiceFaceTexture } from '../graphics/textures.js';

/**
 * Create a dice with physics and visual representation
 * @param {Object} THREE - Three.js library
 * @param {Object} RAPIER - Rapier physics library
 * @param {Object} scene - Three.js scene
 * @param {Object} world - Rapier physics world
 * @param {number} color - Dice color as hex value
 * @returns {Object} - Dice controller with update methods
 */
export function createDice(THREE, RAPIER, scene, world, color) {
  log(`Creating dice with color: 0x${color.toString(16)}`);
  
  const size = PHYSICS.dice.size;
  
  // Create materials for each face of the dice
  const materials = [];
  
  // Standard dice configuration (right, left, top, bottom, front, back)
  const faceNumbers = [1, 6, 2, 5, 3, 4];
  
  for (const number of faceNumbers) {
    const texture = createDiceFaceTexture(THREE, number, color);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: color,
      emissiveMap: texture,
      emissiveIntensity: 1,
      roughness: 0.3,
      metalness: 0.7
    });
    
    materials.push(material);
  }
  
  // Create dice mesh
  const geometry = new THREE.BoxGeometry(size, size, size);
  const diceMesh = new THREE.Mesh(geometry, materials);
  diceMesh.castShadow = true;
  scene.add(diceMesh);
  
  // Add wireframe for edges
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    linewidth: 2
  });
  const wireframe = new THREE.LineSegments(edges, lineMaterial);
  diceMesh.add(wireframe);
  
  // Create point light to follow the dice
  const pointLight = new THREE.PointLight(color, 2, 10);
  scene.add(pointLight);
  
  // Create physics body
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 5, 0);
    
  // NOTE: We removed the setMass call as it's not supported in this version
  
  const body = world.createRigidBody(bodyDesc);
  
  // Create collider
  const colliderDesc = RAPIER.ColliderDesc.cuboid(
    size/2, size/2, size/2
  )
    .setRestitution(PHYSICS.dice.restitution)
    .setFriction(PHYSICS.dice.friction);
  
  world.createCollider(colliderDesc, body);
  
  // Apply damping for more realistic movement
  body.setLinearDamping(PHYSICS.dice.linearDamping);
  body.setAngularDamping(PHYSICS.dice.angularDamping);
  
  /**
   * Get the current value showing on top of the dice
   * @returns {number} - The value (1-6) currently facing up
   */
  function getCurrentValue() {
    // Implementation for determining the facing value
    // This is a simplified approach - for production would need more robust detection
    const diceRotation = diceMesh.quaternion;
    const upVector = new THREE.Vector3(0, 1, 0);
    
    // Transform the up vector by the dice's rotation
    upVector.applyQuaternion(diceRotation);
    
    // Determine which face is most aligned with the up direction
    let maxAlignment = -1;
    let faceIndex = 0;
    
    // Check alignment with each face normal
    const normals = [
      new THREE.Vector3(1, 0, 0),   // Right - 1
      new THREE.Vector3(-1, 0, 0),  // Left - 6
      new THREE.Vector3(0, 1, 0),   // Top - 2
      new THREE.Vector3(0, -1, 0),  // Bottom - 5
      new THREE.Vector3(0, 0, 1),   // Front - 3
      new THREE.Vector3(0, 0, -1)   // Back - 4
    ];
    
    normals.forEach((normal, index) => {
      const alignment = upVector.dot(normal);
      if (alignment > maxAlignment) {
        maxAlignment = alignment;
        faceIndex = index;
      }
    });
    
    return faceNumbers[faceIndex];
  }
  
  // Return dice controller object
  return {
    /**
     * Update dice position and rotation based on physics
     */
    update() {
      const pos = body.translation();
      diceMesh.position.set(pos.x, pos.y, pos.z);
      
      const rot = body.rotation();
      diceMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
      
      // Update light position to follow dice
      pointLight.position.copy(diceMesh.position);
      pointLight.position.y += 2;
      
      if (PHYSICS.dice.debug) {
        // Optional: log the current visible face for debugging
        if (this.isAtRest()) {
          log(`Dice value: ${getCurrentValue()}`);
        }
      }
    },
    
    /**
     * Reset dice position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    reset(x, y, z) {
      body.setTranslation(new RAPIER.Vector3(x, y, z), true);
      body.setLinvel(new RAPIER.Vector3(0, 0, 0), true);
      body.setAngvel(new RAPIER.Vector3(0, 0, 0), true);
    },
    
    /**
     * Apply linear impulse to the dice
     * @param {number} x - X impulse
     * @param {number} y - Y impulse
     * @param {number} z - Z impulse
     */
    applyImpulse(x, y, z) {
      body.applyImpulse(new RAPIER.Vector3(x, y, z), true);
    },
    
    /**
     * Apply torque impulse to the dice
     * @param {number} x - X torque
     * @param {number} y - Y torque
     * @param {number} z - Z torque
     */
    applyTorque(x, y, z) {
      body.applyTorqueImpulse(new RAPIER.Vector3(x, y, z), true);
    },
    
    /**
     * Check if dice is at rest
     * @returns {boolean} - True if the dice has stopped moving
     */
    isAtRest() {
      const velocityThreshold = 0.1;
      const angularVelocityThreshold = 0.1;
      
      return (
        body.linvel().length < velocityThreshold &&
        body.angvel().length < angularVelocityThreshold
      );
    },
    
    /**
     * Get the current value showing on top of the dice
     * @returns {number} - Current dice value (1-6)
     */
    getValue() {
      return getCurrentValue();
    },
    
    // Expose internal objects for advanced usage
    mesh: diceMesh,
    body: body,
    light: pointLight
  };
}