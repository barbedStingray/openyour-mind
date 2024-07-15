import React, { useEffect, useRef } from 'react';
import { VFX } from '@vfx-js/core';
import './App.css';

function App() {


  const h1Refs = useRef([]);

  useEffect(() => {

    // new instance of VFX
    const vfx = new VFX();

    // transitions a value from a to b based on a ratio of 't'
    const lerp = (a, b, t) => a * (1 - t) + b * t;

    // This is used to create the visuals on the text per VFX
    const shaderH = `
      precision highp float;
      uniform vec2 resolution;
      uniform vec2 offset;
      uniform float time;
      uniform sampler2D src;
      uniform float scroll;

      float inside(vec2 uv) {
        return step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
      }
      vec4 readTex(vec2 uv) {
        return texture2D(src, uv) * inside(uv);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        float d = scroll;

        // Shift by x position
        d *= abs(
          sin(floor(gl_FragCoord.x / 17.) * 7. + time * 2.) + 
          sin(floor(gl_FragCoord.x / 19.) * 19. - time * 3.)
        );

        vec4 cr = readTex(uv + vec2(0, d));
        vec4 cg = readTex(uv + vec2(0, d * 2.));
        vec4 cb = readTex(uv + vec2(0, d * 3.));

        gl_FragColor = vec4(
          cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a)
        );
      }
    `;

    // variable used to keep track of the scroll position
    let scroll = 0;

    // iterates over each element
    // e checks if it exists
    // vfx.add(e, {}) adds the visual effect to the element using the VFX library
    h1Refs.current.forEach((e) => {
      if (e) {
        vfx.add(e, {
          shader: shaderH, // specifies shader program from vfx
          overflow: 500,
          uniforms: { // dynamic uniforms for shader
            scroll: () => { // calculates scroll differences and interpolates position to smooth 
              const diff = window.scrollY - scroll;
              scroll = lerp(scroll, window.scrollY, 0.03);
              return diff / window.innerHeight;
            },
          },
        });
      }
    });
  }, []);

  return (
    <div className="App">
      <div>
        <h1 ref={(el) => (h1Refs.current[0] = el)}>Open</h1>
      </div>
      <div>
        <h1 ref={(el) => (h1Refs.current[1] = el)}>Your</h1>
      </div>
      <div>
        <h1 ref={(el) => (h1Refs.current[2] = el)}>Mind</h1>
      </div>
    </div>
  );
}

export default App;
