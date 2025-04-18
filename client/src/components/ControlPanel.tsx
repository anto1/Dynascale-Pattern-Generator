import { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useDiscs } from "@/lib/stores/useDiscs";
import { TimerReset, ChevronLeft, ChevronRight, Download, Upload, Image } from "lucide-react";

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
  
  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for status message
  const [importStatus, setImportStatus] = useState<string | null>(null);

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

          {/* Reset and export/import buttons */}
          <div className="pt-4 border-t border-gray-700 space-y-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetValues}
              className="flex items-center space-x-1 text-xs h-8 w-full justify-center"
            >
              <TimerReset size={14} />
              <span>Reset All Values</span>
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                try {
                  // Find the canvas element - target the specific canvas used by Three.js
                  const canvases = document.getElementsByTagName('canvas');
                  
                  if (!canvases || canvases.length === 0) {
                    setImportStatus("Error: Canvas not found");
                    setTimeout(() => setImportStatus(null), 3000);
                    return;
                  }
                  
                  // Use the first canvas (there should only be one Three.js canvas)
                  const canvas = canvases[0];
                  
                  // Get the WebGL context if needed for some browsers
                  const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
                  // WebGL context properties are read-only, we'll work with what we have
                  
                  // Try to get the image directly from the canvas
                  let dataUrl = '';
                  
                  try {
                    // First try to get the data directly from the WebGL canvas
                    dataUrl = canvas.toDataURL('image/png');
                    
                    // Check if the dataUrl is empty or just a transparent image
                    if (dataUrl === 'data:,' || dataUrl.length < 1000) {
                      // If it's an empty or very small image, try another method
                      throw new Error("Empty canvas data");
                    }
                  } catch (err) {
                    console.log("Direct canvas export failed, trying alternative method", err);
                    
                    // Alternative method: use html2canvas
                    // Create a new canvas for copying
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    if (tempCtx) {
                      // Force GPU rendering if possible
                      tempCtx.imageSmoothingEnabled = true;
                      
                      // Draw the original canvas onto the temporary canvas
                      tempCtx.drawImage(canvas, 0, 0);
                      dataUrl = tempCanvas.toDataURL('image/png');
                    } else {
                      // Last resort: just try the direct method again
                      dataUrl = canvas.toDataURL('image/png');
                    }
                  }
                  
                  // Create a link and trigger download
                  const exportName = `disc-image-${new Date().toISOString().slice(0,10)}.png`;
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUrl);
                  linkElement.setAttribute('download', exportName);
                  linkElement.click();
                  
                  // Show success message
                  setImportStatus("Image exported successfully");
                  setTimeout(() => setImportStatus(null), 3000);
                } catch (error) {
                  console.error("Error exporting image:", error);
                  setImportStatus("Error exporting image");
                  setTimeout(() => setImportStatus(null), 3000);
                }
              }}
              className="flex items-center space-x-1 text-xs h-8 w-full justify-center"
            >
              <Image size={14} />
              <span>Export Image</span>
            </Button>
            
            {/* Hidden file input for import */}
            <input 
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                // Read the file contents
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    // Parse the JSON content
                    const content = event.target?.result as string;
                    const configData = JSON.parse(content);
                    
                    // Validate and apply the disc settings
                    if (configData?.discs) {
                      const { distance, ellipsisProportion, centerOffsetX, centerOffsetY } = configData.discs;
                      
                      // Apply each setting if it exists and is valid
                      if (typeof distance === 'number' && !isNaN(distance)) {
                        setDistance(distance);
                      }
                      
                      if (typeof ellipsisProportion === 'number' && !isNaN(ellipsisProportion)) {
                        setEllipsisProportion(ellipsisProportion);
                      }
                      
                      if (typeof centerOffsetX === 'number' && !isNaN(centerOffsetX)) {
                        setCenterOffsetX(centerOffsetX);
                      }
                      
                      if (typeof centerOffsetY === 'number' && !isNaN(centerOffsetY)) {
                        setCenterOffsetY(centerOffsetY);
                      }
                      
                      setImportStatus("Configuration imported successfully");
                    } else {
                      setImportStatus("Invalid configuration format");
                    }
                  } catch (error) {
                    console.error("Error parsing configuration:", error);
                    setImportStatus("Error importing configuration");
                  }
                  
                  // Clear the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  
                  // Clear status message after a delay
                  setTimeout(() => setImportStatus(null), 3000);
                };
                
                reader.readAsText(file);
              }}
            />
            
            {/* Import button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 text-xs h-8 w-full justify-center"
            >
              <Upload size={14} />
              <span>Import Configuration</span>
            </Button>
              
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Create a data object with all the current settings
                const exportData = {
                  discs: {
                    distance,
                    ellipsisProportion,
                    centerOffsetX,
                    centerOffsetY
                  },
                  // Can add more data categories here in the future
                };
                
                // Convert to JSON and create a downloadable file
                const dataStr = JSON.stringify(exportData, null, 2);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                
                // Create a link and trigger download
                const exportName = `disc-configuration-${new Date().toISOString().slice(0,10)}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportName);
                linkElement.click();
                
                // Show success message
                setImportStatus("Configuration exported successfully");
                setTimeout(() => setImportStatus(null), 3000);
              }}
              className="flex items-center space-x-1 text-xs h-8 w-full justify-center"
            >
              <Download size={14} />
              <span>Save Settings</span>
            </Button>
            
            {/* Status message */}
            {importStatus && (
              <div className="text-xs text-center py-1 px-2 bg-blue-900/50 rounded">
                {importStatus}
              </div>
            )}
            
            <p className="text-xs text-gray-500 pt-2">
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
