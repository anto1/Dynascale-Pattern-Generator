import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getLocalStorage = (key: string): any =>
  JSON.parse(window.localStorage.getItem(key) || "null");
const setLocalStorage = (key: string, value: any): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

/**
 * Utility function to capture a screenshot from a Three.js renderer
 * @param renderer The Three.js WebGLRenderer instance
 * @param scene The Three.js Scene instance
 * @param camera The Three.js Camera instance
 * @returns A data URL of the PNG image
 */
export function captureScreenshot(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
): string {
  // Store original size
  const originalSize = {
    width: renderer.domElement.width,
    height: renderer.domElement.height
  };
  
  // Temporarily set renderer to full resolution (for high quality image)
  renderer.setSize(
    renderer.domElement.clientWidth, 
    renderer.domElement.clientHeight, 
    false
  );
  
  // Clear the canvas and render the scene
  renderer.clear();
  renderer.render(scene, camera);
  
  // Get the image data
  const dataURL = renderer.domElement.toDataURL("image/png");
  
  // Restore original size
  renderer.setSize(originalSize.width, originalSize.height, false);
  
  return dataURL;
}

export { getLocalStorage, setLocalStorage };
