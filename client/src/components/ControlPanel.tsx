import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useDiscs } from "@/lib/stores/useDiscs";
import { useAudio } from "@/lib/stores/useAudio";
import { VolumeX, Volume2, RotateCw, TimerReset } from "lucide-react";

/**
 * ControlPanel component for adjusting disc properties and view controls
 */
const ControlPanel = () => {
  const [showControls, setShowControls] = useState(true);
  const { 
    size1, setSize1, 
    size2, setSize2, 
    size3, setSize3,
    distance, setDistance,
    resetValues
  } = useDiscs();
  
  const { backgroundMusic, isMuted, toggleMute } = useAudio();

  // Handle mute toggle
  const handleMuteToggle = () => {
    toggleMute();
    
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.play().catch(e => console.log("Error playing music:", e));
      } else {
        backgroundMusic.pause();
      }
    }
  };

  // Handle play music
  const handlePlayMusic = () => {
    if (backgroundMusic && isMuted) {
      toggleMute();
      backgroundMusic.play().catch(e => console.log("Error playing music:", e));
    }
  };

  return (
    <div className={`bg-gray-800 text-white p-4 transition-all duration-300 ${showControls ? 'h-auto' : 'h-12 overflow-hidden'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Disc Controls</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowControls(!showControls)}
          className="text-gray-400 hover:text-white"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
        </Button>
      </div>

      {/* Control sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Disc Size</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Disc 1 Size: {size1.toFixed(1)}</label>
              <Slider 
                value={[size1]} 
                min={0.5} 
                max={3} 
                step={0.1} 
                onValueChange={(value) => setSize1(value[0])} 
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Disc 2 Size: {size2.toFixed(1)}</label>
              <Slider 
                value={[size2]} 
                min={0.5} 
                max={3} 
                step={0.1} 
                onValueChange={(value) => setSize2(value[0])} 
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Disc 3 Size: {size3.toFixed(1)}</label>
              <Slider 
                value={[size3]} 
                min={0.5} 
                max={3} 
                step={0.1} 
                onValueChange={(value) => setSize3(value[0])} 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Composition</h3>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Distance Between Discs: {distance.toFixed(1)}</label>
            <Slider 
              value={[distance]} 
              min={0.1} 
              max={2} 
              step={0.1} 
              onValueChange={(value) => setDistance(value[0])} 
            />
          </div>
          
          <div className="pt-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetValues}
                className="flex items-center space-x-1"
              >
                <TimerReset size={16} />
                <span>Reset Values</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMuteToggle}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                
                {isMuted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayMusic}
                  >
                    Play Music
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500">
              Use mouse to rotate view: Drag to rotate, scroll to zoom, right-click to pan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
