uniform float uTime;
uniform float uSize;

attribute float scale;
attribute vec3 randomness;

varying vec3 vColor;

void main() {
  /**
  * Position
  */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.25;

  modelPosition.x = cos(angle + angleOffset) * distanceToCenter;
  modelPosition.z = sin(angle + angleOffset) * distanceToCenter;

  // Randomness
  modelPosition.xyz += randomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  
  // Size & size attenutation
  gl_PointSize = uSize * scale;
  gl_PointSize *=( 1.0 / -viewPosition.z);

  vColor = color;
}