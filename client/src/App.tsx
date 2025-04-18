import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import { useEffect, useState, useCallback } from 'react';
import { useScreenshot } from '@/lib/stores/useScreenshot';

/**
 * Main App component that renders the 3D scene and control panel
 * for the disc visualization application
 */
function App() {
  // State for controlling panel visibility
  const [showControls, setShowControls] = useState(true);
  
  // State for screenshot capture trigger
  const [captureScreenshot, setCaptureScreenshot] = useState(false);
  
  // Get error message from screenshot store
  const { errorMessage } = useScreenshot();
  
  // Create a function to trigger screenshot capture
  const handleCaptureScreenshot = useCallback(() => {
    setCaptureScreenshot(true);
  }, []);
  
  // Handle capture completion
  const handleCaptureComplete = useCallback(() => {
    setCaptureScreenshot(false);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-900">
      {/* Control panel on the left side */}
      <div className={`h-full transition-all duration-300 z-10 ${showControls ? 'w-64' : 'w-12'}`}>
        <ControlPanel 
          showControls={showControls} 
          setShowControls={setShowControls}
          onCaptureScreenshot={handleCaptureScreenshot}
          captureError={errorMessage}
        />
      </div>
      
      {/* Main 3D canvas container */}
      <div className="flex-grow relative w-full h-full">
        <ThreeScene 
          captureScreenshotTrigger={captureScreenshot}
          onCaptureComplete={handleCaptureComplete}
        />
      </div>
    </div>
  );
}

export default App;
