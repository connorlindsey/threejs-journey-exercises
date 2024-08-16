precision mediump float;

uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include ./utils/rotate2D.glsl


void main() {
    vec3 newPosition = position;

    // Twist
    float twistFrequency = 0.2;
    float twistPerlin = texture(
      uPerlinTexture, 
      vec2(0.5, uv.y * twistFrequency)
    ).r;
    float twistStrength = 10.0;
    float angle = twistPerlin * twistStrength;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    float windSpeed = 0.01;
    vec2 windOffset = vec2(
      texture(uPerlinTexture, vec2(0.25, uTime * windSpeed)).r - 0.5,
      texture(uPerlinTexture, vec2(0.75, uTime * windSpeed)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vUv = uv;
}