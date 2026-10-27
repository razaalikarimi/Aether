/**
 * Custom GLSL Shaders for Luxury Fluid Aura Background Effect
 * Atmospheric energy field with domain-warped simplex noise, pointer velocity distortion,
 * and subtle chromatic dispersion.
 */

export const fluidAuraVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fluidAuraFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPointerVelocity;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;

  // 2D Simplex Noise implementation
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion with multi-octave distortion
  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      total += amplitude * snoise(p * frequency);
      frequency *= 2.05;
      amplitude *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 st = vUv;
    
    // Pointer influence distortion
    vec2 toPointer = st - uPointer;
    float dist = length(toPointer);
    float pointerDistort = exp(-dist * 3.5) * (0.15 + uPointerVelocity * 0.4);
    
    // Domain warping (Inigo Quilez technique)
    vec2 q = vec2(
      fbm(st * 2.2 + vec2(0.0, uTime * 0.08)),
      fbm(st * 2.2 + vec2(5.2, 1.3 - uTime * 0.06))
    );

    vec2 r = vec2(
      fbm(st * 3.0 + 4.0 * q + vec2(1.7, 9.2) + toPointer * pointerDistort),
      fbm(st * 3.0 + 4.0 * q + vec2(8.3, 2.8) + vec2(uTime * 0.04))
    );

    float f = fbm(st + 4.0 * r);

    // Subtle chromatic dispersion
    float fRed = fbm(st + 4.0 * r + vec2(0.015, 0.0));
    float fBlue = fbm(st + 4.0 * r - vec2(0.015, 0.0));

    // Color mixing
    vec3 col = uColorBase;
    
    // Midground liquid glow
    col = mix(col, vec3(0.08, 0.09, 0.13), clamp(f * f * 2.5, 0.0, 1.0));
    
    // Luminous accent threads (Champagne Gold / Cyan)
    vec3 accentGrad = vec3(
      mix(col.r, uColorAccent.r, fRed * 1.2),
      mix(col.g, uColorAccent.g, f * 1.2),
      mix(col.b, uColorAccent.b, fBlue * 1.2)
    );

    col = mix(col, accentGrad, clamp(pow(f, 3.2) * 1.8 * uIntensity, 0.0, 1.0));

    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 0.95, length(st - 0.5));
    col *= vignette;

    gl_FragColor = vec4(col, 0.88);
  }
`;
