varying vec3 vPosition;
varying float vUpDot;

void main() {
  vPosition = csm_Position;
  vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}