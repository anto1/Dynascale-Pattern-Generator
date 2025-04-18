import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useDiscs } from "@/lib/stores/useDiscs";
import { TimerReset, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ControlPanel component for adjusting disc properties and view controls
 */
const ControlPanel = ({ 
  showControls, 
  setShowControls 
}: { 
  showControls: boolean; 
  setShowControls: (show: boolean) => void;
}) => {
  const { 
    distance, setDistance,
    ellipsisProportion, setEllipsisProportion,
    centerOffsetX, setCenterOffsetX,
    centerOffsetY, setCenterOffsetY,
    resetValues
  } = useDiscs();

  return (
    <div className="h-full bg-gray-800 text-white transition-all duration-300 flex flex-col">
      {/* Header with collapse toggle */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        {showControls && <h2 className="text-lg font-bold">Disc Controls</h2>}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowControls(!showControls)}
          className="text-gray-400 hover:text-white"
        >
          {showControls ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {/* Control sliders in a vertical layout */}
      {showControls && (
        <div className="p-3 space-y-6 overflow-y-auto">
          {/* Gradient center offset section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Gradient Center</h3>
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
          
          {/* Appearance section */}
          <div className="space-y-2">
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
          
          {/* Composition section */}
          <div className="space-y-2">
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

          {/* Reset and instructions */}
          <div className="pt-4 border-t border-gray-700">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetValues}
              className="flex items-center space-x-1 text-xs h-8 w-full justify-center mb-4"
            >
              <TimerReset size={14} />
              <span>Reset All Values</span>
            </Button>
            <p className="text-xs text-gray-500">
              Use mouse:<br />
              • Drag to rotate<br />
              • Scroll to zoom
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
