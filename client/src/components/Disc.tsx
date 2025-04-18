import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Import shader raw text directly to avoid type issues
const discVertexShader = `
// Vertex shader for the disc gradient
varying vec2 vUv;
varying float vDistance;

void main() {
  vUv = uv;
  
  // Calculate distance from center for gradient
  vDistance = length(position.xy);
  
  // Standard position calculation
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const discFragmentShader = `
// Fragment shader for the disc gradient
varying vec2 vUv;
varying float vDistance;

uniform float uTime;
uniform float uSize;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;

void main() {
  // Calculate normalized distance from center
  float dist = vDistance / uSize;
  
  // Add subtle animation to the gradient
  float animatedDist = dist + 0.05 * sin(uTime * 0.5 + dist * 10.0);
  
  // Create smooth gradient from inner to outer color with more glow at edges
  vec3 color = mix(uInnerColor, uOuterColor, pow(smoothstep(0.0, 1.0, animatedDist), 0.8));
  
  // Add edge glow effect
  float glow = pow(dist, 3.0) * 1.5;
  color += uOuterColor * glow;
  
  // Add a subtle pulsing effect to the alpha
  float alpha = 1.0 - 0.1 * sin(uTime + dist * 5.0);
  
  // Set the final color with alpha
  gl_FragColor = vec4(color, alpha);
}
`;

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
        uInnerColor: { value: new THREE.Color("#000020") },  // Darker blue center
        uOuterColor: { value: new THREE.Color("#135EF1") },  // Requested blue color
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
