import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Disc from "./Disc";
import { useRef } from "react";
import { useDiscs } from "@/lib/stores/useDiscs";
import * as THREE from "three";

/**
 * ThreeScene component that renders the 3D scene with the discs
 * and orbit controls for camera manipulation
 */
const ThreeScene = () => {
  const controlsRef = useRef<any>(null);
  const { size1, size2, size3, distance, ellipsisProportion } = useDiscs();

  return (
    <Canvas>
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
        />
        <Disc 
          size={size2} 
          position={new THREE.Vector3(0, 0, 0)} 
          rotation={[0, 0, 0]} 
          ellipsisProportion={ellipsisProportion}
        />
        <Disc 
          size={size3} 
          position={new THREE.Vector3(0, 0, distance)} 
          rotation={[0, 0, 0]} 
          ellipsisProportion={ellipsisProportion}
        />
      </group>

      {/* Add coordinate axes for reference (only in development) */}
      {/* <axesHelper args={[5]} /> */}
    </Canvas>
  );
};

export default ThreeScene;
