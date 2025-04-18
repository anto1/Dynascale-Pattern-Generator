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
    distance, setDistance,
    ellipsisProportion, setEllipsisProportion,
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
    <div className={`bg-gray-800 text-white p-3 transition-all duration-300 ${showControls ? 'h-auto' : 'h-12 overflow-hidden'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Disc Controls</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowControls(!showControls)}
          className="text-gray-400 hover:text-white"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
        </Button>
      </div>

      {/* Control sliders in a compact layout */}
      <div className="flex flex-wrap items-start gap-4">
        {/* Left column - Appearance */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-medium mb-2">Appearance</h3>
          <div>
            <label className="text-xs text-gray-400 block">Ellipsis Proportion: {ellipsisProportion.toFixed(2)}</label>
            <Slider 
              value={[ellipsisProportion]} 
              min={0.3} 
              max={1.0} 
              step={0.05} 
              onValueChange={(value) => setEllipsisProportion(value[0])} 
              className="my-1"
            />
            <p className="text-xs text-gray-500">
              1.0 = Circle, Lower values = Elliptical
            </p>
          </div>
        </div>
        
        {/* Middle column - Composition */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-medium mb-2">Composition</h3>
          <div>
            <label className="text-xs text-gray-400 block">Distance: {distance.toFixed(1)}</label>
            <Slider 
              value={[distance]} 
              min={0.1} 
              max={2} 
              step={0.1} 
              onValueChange={(value) => setDistance(value[0])} 
              className="my-1"
            />
          </div>
        </div>
        
        {/* Right column - Controls */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-medium mb-2">Controls</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetValues}
              className="flex items-center space-x-1 text-xs h-8"
            >
              <TimerReset size={14} />
              <span>Reset</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute" : "Mute"}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </Button>
            
            {isMuted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayMusic}
                className="text-xs h-8"
              >
                Play Music
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use mouse: Drag = rotate, Scroll = zoom
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
