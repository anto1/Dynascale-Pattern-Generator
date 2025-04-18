import { create } from 'zustand';
import * as THREE from 'three';
import { WebGLRenderer, Scene, Camera, Vector2 } from 'three';

interface ScreenshotState {
  isCapturing: boolean;
  lastCapturedImage: string | null;
  errorMessage: string | null;
  
  // Capture a screenshot from the Three.js renderer
  captureScreenshot: (renderer: WebGLRenderer, scene: Scene, camera: Camera) => Promise<void>;
  
  // Clear the captured image
  clearImage: () => void;
  
  // Set error message
  setError: (message: string | null) => void;
}

export const useScreenshot = create<ScreenshotState>((set) => ({
  isCapturing: false,
  lastCapturedImage: null,
  errorMessage: null,
  
  captureScreenshot: async (renderer: WebGLRenderer, scene: Scene, camera: Camera) => {
    set({ isCapturing: true, errorMessage: null });
    
    try {
      // Store original renderer properties
      const originalSize = renderer.getSize(new Vector2());
      const originalRatio = renderer.getPixelRatio();
      
      // Set high-quality rendering for the screenshot
      renderer.setPixelRatio(window.devicePixelRatio * 2); // Increase quality
      
      // Render the scene
      renderer.render(scene, camera);
      
      // Get the image data
      const imageData = renderer.domElement.toDataURL('image/png');
      
      // Restore original renderer properties
      renderer.setPixelRatio(originalRatio);
      renderer.setSize(originalSize.width, originalSize.height, false);
      
      // Render once more with original settings
      renderer.render(scene, camera);
      
      // Save the image data
      set({ lastCapturedImage: imageData, isCapturing: false });
      
      // Download the image
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `disc-visualization-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      set({ 
        errorMessage: error instanceof Error ? error.message : 'Unknown error capturing screenshot', 
        isCapturing: false 
      });
    }
  },
  
  clearImage: () => set({ lastCapturedImage: null }),
  
  setError: (message: string | null) => set({ errorMessage: message })
}));