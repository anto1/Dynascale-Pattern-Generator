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
uniform vec3 uColor0;   // 0%
uniform vec3 uColor50;  // 50%
uniform vec3 uColor75;  // 75%
uniform vec3 uColor90;  // 90%
uniform vec3 uColor100; // 100%

void main() {
  // Calculate normalized distance from center
  float dist = vDistance / uSize;
  
  // Add subtle animation to the gradient
  float animatedDist = dist + 0.03 * sin(uTime * 0.5 + dist * 10.0);
  
  // Create multi-stop color gradient
  vec3 color;
  
  // Calculate color based on the 5 color stops
  if (animatedDist < 0.5) {
    // Between 0% and 50%
    float t = animatedDist / 0.5; // normalize to 0-1 range
    color = mix(uColor0, uColor50, smoothstep(0.0, 1.0, t));
  } else if (animatedDist < 0.75) {
    // Between 50% and 75%
    float t = (animatedDist - 0.5) / 0.25; // normalize to 0-1 range
    color = mix(uColor50, uColor75, smoothstep(0.0, 1.0, t));
  } else if (animatedDist < 0.9) {
    // Between 75% and 90%
    float t = (animatedDist - 0.75) / 0.15; // normalize to 0-1 range
    color = mix(uColor75, uColor90, smoothstep(0.0, 1.0, t));
  } else {
    // Between 90% and 100%
    float t = (animatedDist - 0.9) / 0.1; // normalize to 0-1 range
    color = mix(uColor90, uColor100, smoothstep(0.0, 1.0, t));
  }
  
  // Add edge glow effect
  float glow = pow(dist, 3.0) * 1.2;
  color += uColor100 * glow;
  
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
        uColor0: { value: new THREE.Color("#0A0D2C") },   // 0% - Center
        uColor50: { value: new THREE.Color("#090C26") },  // 50%
        uColor75: { value: new THREE.Color("#0D1548") },  // 75%
        uColor90: { value: new THREE.Color("#1B307A") },  // 90%
        uColor100: { value: new THREE.Color("#294BAB") }, // 100% - Edge
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
