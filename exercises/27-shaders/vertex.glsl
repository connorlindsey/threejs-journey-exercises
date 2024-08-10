uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime * 0.6) * 0.05;
  elevation += sin(modelPosition.y * uFrequency.y - uTime * 0.1) * 0.05;
  vElevation = elevation;
  
  // Random z position to create 'mountains'
  // modelPosition.z += aRandom * 0.1;
  // vRandom = aRandom;

  // Waves set by the uniform frequency
  modelPosition.z += elevation;


  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}