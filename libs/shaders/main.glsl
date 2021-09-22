#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define time iTime
#define resolution ( iResolution.xy )
#define PI 3.14159265

uniform sampler2D u_texture0;
uniform float staticStrength;

// leave this @import in place!
// @import ./utils;

vec3 tex2D(sampler2D tex, vec2 uv) {
  vec3 col = texture2D(tex, uv).xyz;
  if(abs(uv.x - 0.5) > 0.5) {
    col = vec3(0.1);
  }
  return col;
}

// uv = our current coordinate
// pixels = pixel count for this dimension
// opacity = pitch (space between pixels) darkness
vec3 scanLine(float uv, float pixels, float opacity) {
  float intensity = (0.5 * sin(uv * pixels * PI * 2.) + 0.5) * 0.9 + 0.05;
  return vec3(pow(intensity, opacity));
}

void main() {
    // raw UV coordinates
  vec2 uv = gl_FragCoord.xy / resolution;
    // we'll edit these coordinates
  vec2 uvn = uv;
    // final color
  vec3 col = vec3(0.0);

  // Tape wave:
  // spatial distortion like a jitter effect
  // ==========
  // higher = smaller distortion size (more pronounced distortion)
  float waveFrequency = 15.;
  // higher = faster jitter
  float waveTimescale = 50.;
  // higher = more intense jitter
  float waveAmplitude = 0.002;
  uvn.x += (noise(vec2(uvn.y * waveFrequency, time * waveTimescale)) - 0.5) * waveAmplitude;

  // tape crease
    // float tcPhase = clamp((sin(uvn.y * 8.0 - time * PI * 1.2) - 0.92) * noise(vec2(time)), 0.0, 0.01) * 10.0;
    // float tcNoise = max(noise(vec2(uvn.y * 100.0, time * 10.0)) - 0.5, 0.0);
    // uvn.x = uvn.x - tcNoise * tcPhase;

  // switching noise
  // (more pronounced distortion at bottom of screen)
  float distortionStart = clamp(sin(time * 0.1), 0.001, 0.01);
  float switchingNoisePhase = smoothstep(distortionStart, 0.0, uvn.y);
  uvn.y += switchingNoisePhase * 0.1;
  uvn.x += switchingNoisePhase * (noise(vec2(uv.y * 100.0, time * 10.0)) - 0.5) * 0.2;

  col = tex2D(u_texture0, uvn);

  // purplish color at bottom of screen
  col = mix(col, col.gbr, switchingNoisePhase);

  // Static:
  // fuzz during loading state
  // ==========
  float staticColor = rand(uv + iTime);
  staticColor *= staticStrength * 0.2;
  col += vec3(staticColor);

  // Moving scanlines
  float lineCount = 100.0;
  float timeScale = 5.;
  col *= mix(0.9, 1., step(fract(uv.y * lineCount - time * timeScale), 0.5));

  // Doubling:
  // slightly misaligns texture, like color burned into the screen
  // ============
  // distance per color channel
  // higher = each iteration is further away
  vec3 doublingDistance = vec3(0.001, 0.003, 0.002);
  // for loop start: how far right the doubling goes (lower = farther)
  // for loop end: how far left the doubling goes (higher = farther)
  vec3 doubling = vec3(0.);
  for(float delta = -4.; delta < 2.; delta += 1.) {
    // add a tiny touch of RGB channels from...
    doubling += vec3(
      // ...red: uv.x + delta * strength...
    tex2D(u_texture0, uvn + vec2(delta, 0.0) * doublingDistance.r).r, 
      // ...green: uv.x + delta * strength
    // col.g,
    tex2D(u_texture0, uvn + vec2(delta + 2.0, 0.0) * doublingDistance.g).g, 
      //
    // col.b)
    tex2D(u_texture0, uvn + vec2(delta - 4.0, 0.0) * doublingDistance.b).b) 
      //
    * 0.1;
  }
  // doubling saturates colors, so let's darken a bit
  // length(bloom) creates a nice effect too
  float bloomDim = 0.6;
  col = (col + doubling) * bloomDim;

      // pitch between scanlines
  col *= scanLine(uv.x, iResolution.x * 0.5, 0.2);
  col *= scanLine(uv.y, iResolution.y * 0.5, 0.2);
  col *= 1.5;

  // slowly adjust brightness in band moving down the screen, between 1.0 and 1.1
  col *= 1.0 + clamp(noise(vec2(0.0, uv.y + time)) * 0.6 - 0.25, 0.0, 0.1);

  gl_FragColor = vec4(col, 1.0);
}