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
