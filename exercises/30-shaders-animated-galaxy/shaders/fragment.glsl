precision mediump float;

varying vec3 vColor;

void main() {
  // Disc pattern
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = 1.0 - step(0.5, strength);

  // Diffuse point pattern
  // float strength = 1.0 - (2.0 * distance(gl_PointCoord, vec2(0.5)));

  // Star pattern - fades out exponentially
  float strength = 1.0 - distance(gl_PointCoord, vec2(0.5));
  strength = pow(strength, 10.0);

  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
