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
  
  // Create smooth gradient from inner to outer color
  vec3 color = mix(uInnerColor, uOuterColor, smoothstep(0.0, 1.0, animatedDist));
  
  // Add a subtle pulsing effect to the alpha
  float alpha = 1.0 - 0.1 * sin(uTime + dist * 5.0);
  
  // Set the final color with alpha
  gl_FragColor = vec4(color, alpha);
}
