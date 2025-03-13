/**
 * Debug utilities for Neon Dice 2000
 */

// Debug state
let debugEnabled = false;
let debugElement = null;

/**
 * Initialize debug mode
 * @param {boolean} enabled - Whether debug mode is enabled
 */
export function initDebug(enabled) {
  debugEnabled = enabled;
  
  if (enabled) {
    debugElement = document.getElementById('debug-info');
    if (debugElement) {
      debugElement.style.display = 'block';
    }
    
    log('Debug mode enabled');
  }
}

/**
 * Log a debug message to console and debug display
 * @param {string} message - Message to log
 */
export function log(message) {
  if (!debugEnabled) return;
  
  console.log(`[DEBUG] ${message}`);
  
  if (debugElement) {
    const timestamp = new Date().toLocaleTimeString();
    debugElement.innerHTML = `${timestamp}: ${message}<br>${debugElement.innerHTML}`.split('<br>').slice(0, 10).join('<br>');
  }
}

/**
 * Log an error message to console and debug display
 * @param {string} message - Error message
 * @param {Error} [err] - Error object (optional)
 */
export function error(message, err) {
  console.error(`[ERROR] ${message}`, err);
  
  if (debugEnabled && debugElement) {
    const timestamp = new Date().toLocaleTimeString();
    const errorMsg = err ? `${message}: ${err.message}` : message;
    debugElement.innerHTML = `<span style="color:#ff3030">${timestamp}: ERROR: ${errorMsg}</span><br>${debugElement.innerHTML}`.split('<br>').slice(0, 10).join('<br>');
  }
}

/**
 * Measure performance of a function
 * @param {string} label - Performance measurement label
 * @param {Function} fn - Function to measure
 * @returns {*} - Result of the function
 */
export function measurePerformance(label, fn) {
  if (!debugEnabled) return fn();
  
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  log(`${label}: ${(endTime - startTime).toFixed(2)}ms`);
  
  return result;
}