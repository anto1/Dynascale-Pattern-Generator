import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useDiscs } from "@/lib/stores/useDiscs";
import { TimerReset } from "lucide-react";

/**
 * ControlPanel component for adjusting disc properties and view controls
 */
const ControlPanel = () => {
  const [showControls, setShowControls] = useState(true);
  const { 
    distance, setDistance,
    ellipsisProportion, setEllipsisProportion,
    centerOffsetX, setCenterOffsetX,
    centerOffsetY, setCenterOffsetY,
    resetValues
  } = useDiscs();

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
        {/* Gradient center offset column */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-medium mb-2">Gradient Center</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 block">Center X: {centerOffsetX.toFixed(2)}</label>
              <Slider 
                value={[centerOffsetX]} 
                min={-1.0} 
                max={1.0} 
                step={0.05} 
                onValueChange={(value) => setCenterOffsetX(value[0])} 
                className="my-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block">Center Y: {centerOffsetY.toFixed(2)}</label>
              <Slider 
                value={[centerOffsetY]} 
                min={-1.0} 
                max={1.0} 
                step={0.05} 
                onValueChange={(value) => setCenterOffsetY(value[0])} 
                className="my-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              0,0 = Centered, ±1 = Edge offsets
            </p>
          </div>
        </div>
        
        {/* Appearance column */}
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
        
        {/* Composition column */}
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
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetValues}
                className="flex items-center space-x-1 text-xs h-8"
              >
                <TimerReset size={14} />
                <span>Reset All Values</span>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Use mouse: Drag to rotate, Scroll to zoom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
