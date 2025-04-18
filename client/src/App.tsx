import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import { useEffect } from 'react';
import { useAudio } from './lib/stores/useAudio';

/**
 * Main App component that renders the 3D scene and control panel
 * for the disc visualization application
 */
function App() {
  const { setBackgroundMusic } = useAudio();

  // Load and configure audio elements
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // No need to play music automatically - user can control via UI
  }, [setBackgroundMusic]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Main 3D canvas container */}
      <div className="flex-grow relative">
        <ThreeScene />
      </div>
      
      {/* Control panel at the bottom */}
      <div className="relative z-10">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
