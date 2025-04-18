import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import { useEffect, useState } from 'react';

/**
 * Main App component that renders the 3D scene and control panel
 * for the disc visualization application
 */
function App() {
  // State for controlling panel visibility
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-900">
      {/* Control panel on the left side */}
      <div className={`h-full transition-all duration-300 z-10 ${showControls ? 'w-64' : 'w-12'}`}>
        <ControlPanel 
          showControls={showControls} 
          setShowControls={setShowControls} 
        />
      </div>
      
      {/* Main 3D canvas container */}
      <div className="flex-grow relative">
        <ThreeScene />
      </div>
    </div>
  );
}

export default App;
