import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Disc from "./Disc";
import { useRef, useState, useEffect } from "react";
import { useDiscs } from "@/lib/stores/useDiscs";
import * as THREE from "three";

// Define a type for rotation degrees
interface RotationDegrees {
  x: number;
  y: number;
  z: number;
}

/**
 * Scene content component that contains all 3D objects
 * This component is used inside the Canvas and can use hooks like useFrame
 */
const SceneContent = ({ onRotationUpdate }: { onRotationUpdate: (degrees: RotationDegrees) => void }) => {
  const controlsRef = useRef<any>(null);
  const { 
    size1, 
    size2, 
    size3, 
    distance, 
    ellipsisProportion, 
    centerOffsetX, 
    centerOffsetY 
  } = useDiscs();

  // Track camera rotation
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

  return (
    <>
      {/* Set up the scene lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[0, -10, -5]} intensity={0.5} color="#ffffff" />

      {/* Configure the camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} near={0.1} far={1000} />

      {/* Add orbit controls for interactive camera movement */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={20}
      />

      {/* Create the three discs with their respective sizes and positions */}
      <group>
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

      {/* Add coordinate axes for reference (only in development) */}
      {/* <axesHelper args={[5]} /> */}
    </>
  );
};

/**
 * ThreeScene component that renders the 3D scene with the discs
 * and orbit controls for camera manipulation
 */
const ThreeScene = () => {
  const [rotationDegrees, setRotationDegrees] = useState<RotationDegrees>({ x: 0, y: 0, z: 0 });

  // Pass the rotation update function to the scene content
  const handleRotationUpdate = (degrees: RotationDegrees) => {
    setRotationDegrees(degrees);
  };

  // Add the rotation degrees to the parent component for use in app state or UI
  useEffect(() => {
    // This could be used to sync with global state, etc.
    // console.log('Rotation updated:', rotationDegrees);
  }, [rotationDegrees]);

  return (
    <div className="relative">
      <Canvas>
        <SceneContent onRotationUpdate={handleRotationUpdate} />
      </Canvas>
      
      {/* Display rotation degrees overlay */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Rotation: X: {rotationDegrees.x}° Y: {rotationDegrees.y}° Z: {rotationDegrees.z}°
      </div>
    </div>
  );
};

export default ThreeScene;
