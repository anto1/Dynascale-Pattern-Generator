import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Import shader raw text directly to avoid type issues
const discVertexShader = `
// Vertex shader for the disc gradient
varying vec2 vUv;
varying float vDistance;
varying vec2 vPosition;

uniform float uCenterOffsetX;
uniform float uCenterOffsetY;

void main() {
  vUv = uv;
  vPosition = position.xy;
  
  // Standard position calculation
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const discFragmentShader = `
// Fragment shader for the disc gradient
varying vec2 vUv;
varying float vDistance;
varying vec2 vPosition;

uniform float uTime;
uniform float uSize;
uniform float uEllipsisProportion; // Aspect ratio for ellipsis
uniform float uCenterOffsetX; // X offset for gradient center
uniform float uCenterOffsetY; // Y offset for gradient center
uniform vec3 uColor0;   // 0%
uniform vec3 uColor75;  // 75%
uniform vec3 uColor90;  // 90%
uniform vec3 uColor100; // 100%

void main() {
  // Calculate distance from the offset center
  vec2 offsetCenter = vec2(uCenterOffsetX, uCenterOffsetY);
  float dist = length(vPosition - offsetCenter) / uSize;
  
  // Add subtle animation to the gradient
  float animatedDist = dist + 0.03 * sin(uTime * 0.5 + dist * 10.0);
  
  // Create multi-stop color gradient
  vec3 color;
  
  // Calculate color based on the 4 color stops
  if (animatedDist < 0.75) {
    // Between 0% and 75%
    float t = animatedDist / 0.75; // normalize to 0-1 range
    color = mix(uColor0, uColor75, smoothstep(0.0, 1.0, t));
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
  ellipsisProportion?: number; // Optional aspect ratio for creating ellipses
  centerOffsetX?: number; // Optional x-offset for the gradient center
  centerOffsetY?: number; // Optional y-offset for the gradient center
}

/**
 * Disc component that renders a single disc with a blue gradient shader
 */
const Disc = ({ 
  size, 
  position, 
  rotation, 
  ellipsisProportion = 1.0, 
  centerOffsetX = 0.0, 
  centerOffsetY = 0.0 
}: DiscProps) => {
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
        uEllipsisProportion: { value: ellipsisProportion },
        uCenterOffsetX: { value: centerOffsetX },
        uCenterOffsetY: { value: centerOffsetY },
        uColor0: { value: new THREE.Color("#000000") },   // 0% - Center
        uColor75: { value: new THREE.Color("#030B3E") },  // 75%
        uColor90: { value: new THREE.Color("#112670") },  // 90%
        uColor100: { value: new THREE.Color("#294BAB") }, // 100% - Edge
      },
    });
  }, [size, ellipsisProportion, centerOffsetX, centerOffsetY]);

  // Update shader uniforms on each frame
  useFrame((state) => {
    if (meshRef.current) {
      // Update time uniform for subtle animations
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update size uniform if it changes
      material.uniforms.uSize.value = size;
      
      // Update ellipsis proportion if it changes
      material.uniforms.uEllipsisProportion.value = ellipsisProportion;
      
      // Update center offset if it changes
      material.uniforms.uCenterOffsetX.value = centerOffsetX;
      material.uniforms.uCenterOffsetY.value = centerOffsetY;
    }
  });

  // Create a more detailed circle for smoother edges
  // Use 128 segments instead of 64 for smoother appearance
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
      scale={[1, ellipsisProportion, 1]} // Apply scaling for ellipsis effect
    >
      <circleGeometry args={[size, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export default Disc;
