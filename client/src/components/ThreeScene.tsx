import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Disc from "./Disc";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDiscs } from "@/lib/stores/useDiscs";
import { useScreenshot } from "@/lib/stores/useScreenshot";
import * as THREE from "three";

// Define a type for rotation degrees
interface RotationDegrees {
  x: number;
  y: number;
  z: number;
}

// Utility function to create a static default rotation matrix
const createDefaultRotation = () => {
  // Convert Euler angles to matrix
  const matrix = new THREE.Matrix4();
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(150), // X: 150 degrees
    THREE.MathUtils.degToRad(0),   // Y: 0 degrees
    THREE.MathUtils.degToRad(180), // Z: 180 degrees
    'XYZ'
  );
  matrix.makeRotationFromEuler(euler);
  return matrix;
};

/**
 * Scene content component that contains all 3D objects
 * This component is used inside the Canvas and can use hooks like useFrame
 */
const SceneContent = ({ 
  onRotationUpdate, 
  maxZoom = 50,
  onCaptureScreenshot = false,
  onCaptureComplete = () => {}
}: { 
  onRotationUpdate: (degrees: RotationDegrees) => void;
  maxZoom?: number;
  onCaptureScreenshot?: boolean;
  onCaptureComplete?: () => void;
}) => {
  const controlsRef = useRef<any>(null);
  const { 
    size1, 
    size2, 
    size3, 
    distance, 
    ellipsisProportion, 
    centerOffsetX, 
    centerOffsetY,
    fov
  } = useDiscs();
  
  // Get access to the renderer, scene, and camera
  const { gl, scene, camera } = useThree();
  
  // Get screenshot function
  const captureScreenshot = useScreenshot(state => state.captureScreenshot);

  // Initialize with default rotation
  useEffect(() => {
    // Send initial values to parent
    onRotationUpdate({
      x: 150,
      y: 0,
      z: 180
    });
    
    console.log("Initial rotation set to:", {x: 150, y: 0, z: 180});
    
    // Set initial rotation in orbit controls
    if (controlsRef.current) {
      controlsRef.current.object.rotation.x = THREE.MathUtils.degToRad(150);
      controlsRef.current.object.rotation.y = THREE.MathUtils.degToRad(0);
      controlsRef.current.object.rotation.z = THREE.MathUtils.degToRad(180);
      controlsRef.current.update();
    }
  }, []);

  // Track camera rotation using useFrame for continuous updates
  useFrame(() => {
    if (controlsRef.current) {
      // Get the camera rotation in radians
      const rotation = controlsRef.current.object.rotation;
      
      // Convert radians to degrees and send to parent
      const degrees = {
        x: Math.round((rotation.x * 180) / Math.PI),
        y: Math.round((rotation.y * 180) / Math.PI),
        z: Math.round((rotation.z * 180) / Math.PI)
      };
      
      onRotationUpdate(degrees);
    }
  });
  
  // Handle screenshot capturing when triggered from parent
  useEffect(() => {
    if (onCaptureScreenshot) {
      // Set black background for the screenshot
      const originalBackground = gl.domElement.style.background;
      gl.setClearColor(new THREE.Color('#000000'), 1);
      
      // Capture screenshot
      captureScreenshot(gl, scene, camera)
        .then(() => {
          console.log('Screenshot captured successfully');
          // Reset background
          gl.setClearColor(new THREE.Color('#000000'), 0);
          gl.domElement.style.background = originalBackground;
          // Notify parent that capture is complete
          onCaptureComplete();
        })
        .catch(error => {
          console.error('Error capturing screenshot:', error);
          // Reset background even on error
          gl.setClearColor(new THREE.Color('#000000'), 0);
          gl.domElement.style.background = originalBackground;
          // Notify parent that capture is complete
          onCaptureComplete();
        });
    }
  }, [onCaptureScreenshot, gl, scene, camera, captureScreenshot, onCaptureComplete]);

  return (
    <>
      {/* Set up the scene lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[0, -10, -5]} intensity={0.5} color="#ffffff" />

      {/* Configure the camera with initial rotation */}
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 10]}  
        rotation={[
          THREE.MathUtils.degToRad(150),
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(180)
        ]}
        up={[0, 1, 0]}
        fov={fov} 
        near={0.1} 
        far={1000} 
      />

      {/* Add orbit controls with minimal configuration */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={2}
        maxDistance={maxZoom}
        target={[0, 0, 0]}
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
      />

      {/* Create the three discs with their respective sizes and positions */}
      <group rotation={[
        THREE.MathUtils.degToRad(150), // X rotation: 150 degrees
        THREE.MathUtils.degToRad(0),   // Y rotation: 0 degrees
        THREE.MathUtils.degToRad(180)  // Z rotation: 180 degrees
      ]}>
        <Disc 
          size={size1} 
          position={new THREE.Vector3(0, 0, -distance)} 
          rotation={[0, 0, 0]} 
          ellipsisProportion={ellipsisProportion}
          centerOffsetX={centerOffsetX}
          centerOffsetY={centerOffsetY}
        />
        <Disc 
          size={size2} 
          position={new THREE.Vector3(0, 0, 0)} 
          rotation={[0, 0, 0]} 
          ellipsisProportion={ellipsisProportion}
          centerOffsetX={centerOffsetX}
          centerOffsetY={centerOffsetY}
        />
        <Disc 
          size={size3} 
          position={new THREE.Vector3(0, 0, distance)} 
          rotation={[0, 0, 0]} 
          ellipsisProportion={ellipsisProportion}
          centerOffsetX={centerOffsetX}
          centerOffsetY={centerOffsetY}
        />
      </group>
    </>
  );
};

/**
 * ThreeScene component that renders the 3D scene with the discs
 * and orbit controls for camera manipulation
 */
const ThreeScene = ({ 
  maxZoom = 50,
  captureScreenshotTrigger = false,
  onCaptureComplete
}: { 
  maxZoom?: number;
  captureScreenshotTrigger?: boolean;
  onCaptureComplete?: () => void;
}) => {
  const [rotationDegrees, setRotationDegrees] = useState<RotationDegrees>({ x: 150, y: 0, z: 180 });
  const { isCapturing } = useScreenshot();
  const { fov } = useDiscs();

  // Pass the rotation update function to the scene content
  const handleRotationUpdate = (degrees: RotationDegrees) => {
    setRotationDegrees(degrees);
  };

  // Handle screenshot capture complete
  const handleCaptureComplete = useCallback(() => {
    if (onCaptureComplete) {
      onCaptureComplete();
    }
  }, [onCaptureComplete]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
        camera={{
          position: [0, 0, 10],
          fov: fov, // Use FOV from store
          rotation: [
            THREE.MathUtils.degToRad(150),
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(180)
          ],
          up: [0, 1, 0],
          far: 1000,
          near: 0.1
        }}
      >
        <SceneContent 
          onRotationUpdate={handleRotationUpdate} 
          maxZoom={maxZoom}
          onCaptureScreenshot={captureScreenshotTrigger}
          onCaptureComplete={handleCaptureComplete}
        />
      </Canvas>
      
      {/* Display rotation degrees overlay */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Rotation: X: {rotationDegrees.x}° Y: {rotationDegrees.y}° Z: {rotationDegrees.z}°
      </div>
      
      {/* Display screenshot status overlay */}
      {isCapturing && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/30">
          <div className="bg-black/80 text-white px-4 py-2 rounded-md">
            Capturing scene...
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeScene;
