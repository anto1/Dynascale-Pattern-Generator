import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import discVertexShader from "../shaders/discVertexShader.glsl";
import discFragmentShader from "../shaders/discFragmentShader.glsl";

interface DiscProps {
  size: number;
  position: THREE.Vector3;
  rotation: [number, number, number];
}

/**
 * Disc component that renders a single disc with a blue gradient shader
 */
const Disc = ({ size, position, rotation }: DiscProps) => {
  // Reference to the mesh for animations
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create the shader material with uniform values
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: discVertexShader,
      fragmentShader: discFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uInnerColor: { value: new THREE.Color("#000033") },  // Dark blue center
        uOuterColor: { value: new THREE.Color("#0066ff") },  // Brighter blue edges
      },
    });
  }, [size]);

  // Update shader uniforms on each frame
  useFrame((state) => {
    if (meshRef.current) {
      // Update time uniform for subtle animations
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update size uniform if it changes
      material.uniforms.uSize.value = size;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
    >
      <circleGeometry args={[size, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export default Disc;
