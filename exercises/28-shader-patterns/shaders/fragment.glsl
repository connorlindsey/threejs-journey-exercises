#define PI 3.1415926535897932384626433832795

precision mediump float;

varying vec2 vUv;


float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y 
  );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
  // 3. Left to right gradient
  // float strength = float(vUv.x);

  // 4. Bottom to top gradient
  // float strength = float(vUv.x);

  // 5. Inverted gradient
  // float strength = 1.0 - vUv.y;

  // 6. Fast gradient
  // float strength = vUv.y * 10.0;

  // 7. Repeating gradient
  // float strength = mod(vUv.y * 10.0, 1.0);

  // 8. Repeating colors
  // float strength = step(0.5, mod(vUv.y * 5.0, 1.0));
  
  // 9. Repeating colors
  // float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
  
  // 10. Vertical stripes
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));

  // 11. Grid
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0));

  // 12. Dot grid
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));

  // 13. Dot grid 2
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));

  // 14. Dot grid 3 - combine x and y to create > shape
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
  // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));
  // float strength = barX + barY;

  // 15. Plus grid - offset x and y values
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
  // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  // float strength = barX + barY;

  // 16. Middle black to white sides
  // float strength = abs(vUv.x - 0.5);

  // 17. Dark in middle cross
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // 18. Dark in star
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // 19. Dark square in center
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // 20. Large dark square in center
  // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float square2 = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float strength = square1 - square2;

  // 21. Banded gradient
  // float strength = floor((vUv.x * 10.0)) / 10.0;

  // 22. XY Banded gradient
  // float strength = floor((vUv.x * 10.0)) / 10.0 * floor((vUv.y * 10.0)) / 10.0;

  // 23. Random noise - func from Book of Shaders
  // float strength = random(vUv);

  // 24. Random checkerboard
  // float gridUv = floor((vUv.x * 10.0)) / 10.0 * floor((vUv.y * 10.0)) / 10.0;
  // float strength = random(vec2(gridUv));

  // 25. Slant based on x
  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
  // );
  // float strength = random(gridUv);

  // 26. Gradient in bottom left
  // float strength = length(vUv);

  // 27. Circular gradient in center
  // float strength = length(vUv - 0.5);
  // float strength = distance(vUv, vec2(0.5));

  // 28. Circular gradient in center
  // float strength = 1.0 - distance(vUv, vec2(0.5));

  // 29. Circular gradient in center
  // float strength = 0.015 / distance(vUv, vec2(0.5));

  // 30. Stretched circular gradient
  // vec2 lightUv = vec2(
  //   vUv.x  * 0.2 + 0.4,
  //   vUv.y
  // );
  // float strength = 0.015 / distance(lightUv, vec2(0.5));

  // ! 31. Star
  // vec2 lightUvX = vec2(vUv.x  * 0.2 + 0.4,vUv.y);
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
  // vec2 lightUvY= vec2(vUv.x, vUv.y * 0.2 + 0.4);
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY;

  // ! 32. Star - rotated
  // vec2 rotatedUV = rotate(vUv, PI / 8.0, vec2(0.5));
  // vec2 lightUvX = vec2(rotatedUV.x * 0.2 + 0.4, rotatedUV.y);
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
  // vec2 lightUvY= vec2(rotatedUV.x, rotatedUV.y * 0.2 + 0.4);
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY;

  // 33. Circles
  // float strength = step(0.25, distance(vUv, vec2(0.5)));

  // 34. Circles
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.34);

  // 35. Splashs
  // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.34));

  // 36. Circles
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.34));

  // 37. Squircle
  // vec2 waveUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.34));

  // ! 38. SplashSplash
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

  // ! 39. SplashS
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) * 0.1,
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

  // 40. Angle
  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;

  // 41. 
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // float strength = angle;

  // ! 42. Centered  Angle
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = angle;

  // ! 43. Dart board
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  // float strength = mod(angle * 20.0, 1.0);

  // 44. Dart board
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  // float strength = sin(angle * 100.0);

  // 45. Squiqqly circle
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.2;
  // float radius = 0.25 + sin(angle * 100.0) * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  // ! 46. Perlin noise
  // float strength = cnoise(vUv * 10.0);

  // 47. Stepped Perlin noise
  // float strength = step(0.0, cnoise(vUv * 10.0));

  // ! 48. Vibrant Perlin noise
  // float strength = 1. - abs(cnoise(vUv * 10.0));

  // ! 49. Topograhy Perlin noise
  // float strength = sin(cnoise(vUv * 10.0) * 20.0);

  // ! 50. Topograhy Perlin noise
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // Black and white
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // ! Mixing colors
  // Limit strength to 1.0 to avoid color overflow
  strength = clamp(strength, 0.0, 1.0);

  vec3 black = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(black, uvColor, strength);
  gl_FragColor = vec4(mixedColor, 1.0);
}
