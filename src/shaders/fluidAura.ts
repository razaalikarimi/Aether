/**
 * Ultra-Luxury Fluid Aura GLSL Shaders
 * Organic liquid silk dynamics with domain-warped fractional Brownian motion,
 * subtle film-grain optical dispersion, and velocity-responsive caustic filaments.
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

  // Pseudo-random hash for film grain
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2D Simplex Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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

  // Multi-scale Fractional Brownian Motion
  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.52;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      total += amplitude * snoise(p * frequency);
      frequency *= 2.08;
      amplitude *= 0.48;
    }
    return total;
  }

  void main() {
    vec2 st = vUv;
    
    // Inertial pointer influence
    vec2 toPointer = st - uPointer;
    float dist = length(toPointer);
    float pointerDistort = exp(-dist * 2.8) * (0.12 + uPointerVelocity * 0.35);
    
    // Inigo Quilez-style deep liquid domain warping
    vec2 q = vec2(
      fbm(st * 1.8 + vec2(0.0, uTime * 0.05)),
      fbm(st * 1.8 + vec2(4.8, 1.2 - uTime * 0.04))
    );

    vec2 r = vec2(
      fbm(st * 2.4 + 3.2 * q + vec2(1.5, 8.4) + toPointer * pointerDistort),
      fbm(st * 2.4 + 3.2 * q + vec2(7.2, 2.6) + vec2(uTime * 0.03))
    );

    float f = fbm(st + 3.6 * r);

    // Subtle optical chromatic separation along flow direction
    float fRed = fbm(st + 3.6 * r + vec2(0.012, -0.006));
    float fBlue = fbm(st + 3.6 * r - vec2(0.012, 0.006));

    // Deep luxury background palette (Obsidian void -> Graphite silk)
    vec3 col = uColorBase;
    vec3 graphite = vec3(0.07, 0.075, 0.095);
    col = mix(col, graphite, clamp(f * f * 2.2, 0.0, 1.0));

    // Caustic luminous threads tailored to active variant color
    vec3 accentGrad = vec3(
      mix(col.r, uColorAccent.r, fRed * 1.15),
      mix(col.g, uColorAccent.g, f * 1.15),
      mix(col.b, uColorAccent.b, fBlue * 1.15)
    );

    float filamentGlow = pow(f, 3.4) * 1.75 * uIntensity;
    col = mix(col, accentGrad, clamp(filamentGlow, 0.0, 1.0));

    // Subtle analog luxury film grain
    float grain = (hash(st * 500.0 + fract(uTime)) - 0.5) * 0.024;
    col += grain;

    // Vignette
    float vignette = 1.0 - smoothstep(0.28, 0.98, length(st - 0.5));
    col *= vignette;

    gl_FragColor = vec4(col, 0.92);
  }
`;
