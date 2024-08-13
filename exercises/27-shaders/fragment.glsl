precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Get random colors based on attribute -> varying
  // gl_FragColor = vec4(vRandom * 0.5, vRandom, 0.5, 1.0);

  // Set color based on uniform
  // gl_FragColor = vec4(uColor, 1.0);

  // Use texture
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 3.5 + .9;
  gl_FragColor = textureColor;
}