/**
 * Watercolour mask for the fleet backdrop, as a single full-panel WebGL2 quad.
 *
 * Tied to the design rather than procedural: the picture is the real painted
 * sea (Figma 181:538) and the resting outline is the real blot (Figma 181:537),
 * both placed with the same geometry the CSS fallback uses. The painting itself
 * is never distorted - only the mask changes.
 *
 * The blot is turned into a signed distance field once, on load. Each roadmap
 * scale defines its own outline as that field plus a few broad lobes of ink
 * (October 2026 adds none, so it is the drawn blot), and a scale change
 * interpolates the two fields in place: the outline morphs, crisp, without
 * sliding or rippling. The entry reveal grows that same outline in from the
 * vessel, so it reads like a scale change. Nothing moves at rest: the canvas
 * only renders while a tween runs or a tweak changes. The wash (Figma 181:539)
 * is drawn here too, so it follows the outline.
 */
import { NOISE_GLSL } from "@/lib/noise-glsl";
import { signedDistance } from "./sdf";

export type WatercolorParams = {
  /** Density of pigment specks just outside the edge. */
  speck: number;
  /** Pigment pooling just inside the edge. */
  rim: number;
  /** Blot scale about its own centre. */
  size: number;
  /** How far the per-scale outlines move from the drawn blot (0 = all the same). */
  morph: number;
  /** How far the reveal front retreats while the outline morphs (0 = no dip). */
  bleed: number;
  /** Duration of the entry reveal, ms. */
  revealMs: number;
  /** Duration of the outline morph on a scale change, ms. */
  switchMs: number;
  /** Delay between the content items of the entry sequence, ms. */
  staggerMs: number;
};

export const DEFAULT_PARAMS: WatercolorParams = {
  speck: 0.55,
  rim: 0.14,
  size: 1,
  morph: 1,
  bleed: 0,
  revealMs: 2100,
  switchMs: 1400,
  staggerMs: 110,
};

/**
 * Outline of one roadmap scale: the blot's distance field, grown by `scale`
 * about its centre, pushed by `lobes` CSS px of low-frequency noise (seeded by
 * `seed`) so ink swells out in some places and recedes in others, then torn by
 * `fray` CSS px of fine noise so the new edge reads as paint, not a blob.
 */
export type WatercolorShape = {
  scale: number;
  lobes: number;
  fray: number;
  seed: number;
};

/** A placed image, in panel UV (0-1, y down): x, y, w, h. */
export type Rect = [number, number, number, number];

export type WatercolorLayout = {
  width: number;
  height: number;
  sea: Rect;
  blot: Rect;
  /** Where the reveal starts, panel UV. */
  origin: [number, number];
};

/** Distance field resolution (width, texels). Detail finer than ~1 texel of
 *  this, drawn at ~1713 CSS px on desktop, is smoothed away. */
const SDF_WIDTH = 1400;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uSea;
uniform sampler2D uSdf;
uniform vec4 uSeaRect;
uniform vec4 uBlotRect;
uniform vec2 uRes;       // canvas px
uniform vec2 uSdfSize;   // texels
uniform float uDpr;      // canvas px per CSS px
uniform vec2 uOrigin;
uniform vec4 uShapeA, uShapeB; // scale, lobes (CSS px), fray (CSS px), seed
uniform float uMix, uProgress, uSpeck, uRim, uSize, uMorph, uOpacity;
uniform float uReach; // CSS px the entry blob must grow to clear the whole panel

${NOISE_GLSL}

/* Signed distance to one scale's outline, in CSS px, positive outside. */
float outline(vec2 p,vec4 shape,vec2 a){
  vec2 c=uBlotRect.xy+uBlotRect.zw*.5;
  float scale=mix(1.,shape.x,uMorph)*uSize;
  vec2 uv=((p-c)/scale+c-uBlotRect.xy)/uBlotRect.zw;
  float d=texture2D(uSdf,clamp(uv,0.,1.)).r;
  d+=length(max(abs(uv-.5)-.5,0.)*uSdfSize);   // beyond the texture
  d*=uBlotRect.z*uRes.x/uDpr/uSdfSize.x*scale; // texels -> CSS px
  // broad lobes: two octaves only, so the outline swells, it does not ripple
  float n=snoise(p*a*1.1+shape.w)*.7+snoise(p*a*2.3+shape.w*1.7)*.3;
  d-=n*shape.y*uMorph;
  // torn paint edge: fine fibrous noise, only near the edge (cheap elsewhere)
  if(shape.z>0.&&abs(d)<shape.z*2.5){
    float t=fbm(p*a*14.+shape.w*2.3)*.75+snoise(p*a*46.+shape.w)*.25;
    d-=t*shape.z*uMorph;
  }
  return d;
}

/* Figma 181:539, the wash over the sea: two radial ellipses of #F6F6F7. */
float wash(vec2 p){
  float b=.64*(1.-clamp(length(p/vec2(1.2,1.)),0.,1.));
  float t=length((p-vec2(.35,.75))/vec2(.7,.55));
  float a=t<.45?mix(.28,.14,t/.45):mix(.14,0.,clamp((t-.45)/.55,0.,1.));
  return a+b*(1.-a);
}

void main(){
  vec2 p=vUv;
  vec2 a=vec2(uRes.x/uRes.y,1.);
  const float seed=1.3;
  float px=1./uDpr; // one canvas pixel in CSS px

  vec3 col=texture2D(uSea,(p-uSeaRect.xy)/uSeaRect.zw).rgb;

  // the morph: two outlines interpolated in place
  float d=outline(p,uShapeA,a);
  if(uMix>0.) d=mix(d,outline(p,uShapeB,a),uMix);
  // entry: a lobed blob grows out of the vessel and uncovers the outline, with
  // the same broad swell as a scale change and a soft join where the two meet
  if(uProgress<1.){
    vec2 q=(p-uOrigin)*uRes/uDpr;
    float n=snoise(p*a*1.1+4.1)*.7+snoise(p*a*2.3+7.3)*.3;
    float grow=length(q*vec2(.8,1.))*(1.+.35*n)-uProgress*uReach;
    // the same torn fibres the outlines carry, so the front reads as paint
    if(abs(grow)<100.){
      float t=fbm(p*a*8.+2.3)*.75+snoise(p*a*26.+1.1)*.25;
      grow-=t*40.;
    }
    const float k=12.;
    float h=clamp(.5+.5*(grow-d)/k,0.,1.);
    d=mix(d,grow,h)+k*h*(1.-h);
  }
  float blot=smoothstep(px,-px,d);

  // pigment specks: islands in a thin band just outside the edge
  float sp=fbm(p*a*20.+seed*3.)*.5+.5;
  float islands=step(1.-uSpeck*.35,sp)*step(0.,d)*smoothstep(26.,4.,d);
  float shape=max(blot,islands);

  float mask=shape;

  // darker pooled pigment just inside the edge
  float rim=smoothstep(-36.,0.,d);
  col*=1.-clamp(rim,0.,1.)*uRim;

  // sea at its drawn opacity, the wash over it, both clipped by the mask
  float wa=wash(p);
  vec3 c=vec3(246.,246.,247.)/255.*wa+col*uOpacity*(1.-wa);
  float al=wa+uOpacity*(1.-wa);
  gl_FragColor=vec4(c,al)*mask;
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("watercolor: createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`watercolor: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`watercolor: failed to load ${src}`));
    img.src = src;
  });
}

type Field = { w: number; h: number; data: Float32Array };

/**
 * The blot as a distance field in texels, built in a worker so neither the
 * 3426px decode nor the transform touches the main thread. Falls back to the
 * main thread only where workers or OffscreenCanvas are missing.
 */
function blotField(src: string): Promise<Field> {
  if (typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined") {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./sdf.worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = ({
        data,
      }: MessageEvent<Field | { error: string }>) => {
        worker.terminate();
        if ("error" in data) reject(new Error(`watercolor: ${data.error}`));
        else resolve(data);
      };
      worker.onerror = (event) => {
        worker.terminate();
        reject(new Error(`watercolor: ${event.message}`));
      };
      worker.postMessage({
        src: new URL(src, location.href).href,
        width: SDF_WIDTH,
      });
    });
  }
  return loadImage(src).then((img) => {
    const w = SDF_WIDTH;
    const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("watercolor: no 2D context");
    ctx.drawImage(img, 0, 0, w, h);
    return {
      w,
      h,
      data: signedDistance(ctx.getImageData(0, 0, w, h).data, w, h),
    };
  });
}

export type Watercolor = {
  resize: (layout: WatercolorLayout, dpr: number) => void;
  render: (state: {
    progress: number;
    /** Outgoing and incoming outline, and how far along the morph is (0-1). */
    from: WatercolorShape;
    to: WatercolorShape;
    mix: number;
    params: WatercolorParams;
  }) => void;
  dispose: () => void;
};

export async function createWatercolor(
  canvas: HTMLCanvasElement,
  sources: { sea: string; blot: string },
  opacity: number,
  signal: AbortSignal,
): Promise<Watercolor> {
  /* Load before touching GL. The canvas has one context for its lifetime, so an
     instance torn down mid-load (StrictMode runs effects twice in dev) must not
     create state in it or rebind the live instance's textures. */
  const [seaImg, field] = await Promise.all([
    loadImage(sources.sea),
    blotField(sources.blot),
  ]);
  if (signal.aborted) throw new Error("watercolor: aborted");

  const gl = canvas.getContext("webgl2", {
    premultipliedAlpha: true,
    alpha: true,
    antialias: false,
  });
  if (!gl) throw new Error("watercolor: no WebGL2");

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`watercolor: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    sea: u("uSea"),
    sdf: u("uSdf"),
    seaRect: u("uSeaRect"),
    blotRect: u("uBlotRect"),
    res: u("uRes"),
    sdfSize: u("uSdfSize"),
    dpr: u("uDpr"),
    origin: u("uOrigin"),
    shapeA: u("uShapeA"),
    shapeB: u("uShapeB"),
    mix: u("uMix"),
    morph: u("uMorph"),
    progress: u("uProgress"),
    reach: u("uReach"),
    speck: u("uSpeck"),
    rim: u("uRim"),
    size: u("uSize"),
    opacity: u("uOpacity"),
  };

  const texture = (unit: number, upload: () => void) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    upload();
    return tex;
  };
  const textures = [
    texture(0, () =>
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        seaImg,
      ),
    ),
    /* R16F: linearly filterable in core WebGL2, and bilinear filtering of a
       distance field is what keeps the magnified edge crisp. */
    texture(1, () => {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.R16F,
        field.w,
        field.h,
        0,
        gl.RED,
        gl.FLOAT,
        field.data,
      );
    }),
  ];
  gl.uniform1i(loc.sea, 0);
  gl.uniform1i(loc.sdf, 1);
  gl.uniform1f(loc.opacity, opacity);
  gl.uniform2f(loc.sdfSize, field.w, field.h);

  return {
    resize(layout, dpr) {
      gl.useProgram(program);
      canvas.width = Math.max(1, Math.round(layout.width * dpr));
      canvas.height = Math.max(1, Math.round(layout.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform4fv(loc.seaRect, layout.sea);
      gl.uniform4fv(loc.blotRect, layout.blot);
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.dpr, canvas.width / layout.width);
      gl.uniform2fv(loc.origin, layout.origin);
      gl.uniform1f(loc.reach, Math.hypot(layout.width, layout.height) * 0.85);
    },
    render({ progress, from, to, mix, params }) {
      /* Own the context state on every draw rather than trusting what an
         earlier instance left bound. */
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      textures.forEach((tex, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
      });
      gl.uniform4f(loc.shapeA, from.scale, from.lobes, from.fray, from.seed);
      gl.uniform4f(loc.shapeB, to.scale, to.lobes, to.fray, to.seed);
      gl.uniform1f(loc.mix, mix);
      gl.uniform1f(loc.morph, params.morph);
      gl.uniform1f(loc.progress, progress);
      gl.uniform1f(loc.speck, params.speck);
      gl.uniform1f(loc.rim, params.rim);
      gl.uniform1f(loc.size, params.size);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      textures.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

/** CSS `background-size: cover` placement of an iw x ih image in a box, in px. */
function cover(
  box: [number, number, number, number],
  iw: number,
  ih: number,
  pos: [number, number] = [0.5, 0.5],
): [number, number, number, number] {
  const [bx, by, bw, bh] = box;
  const s = Math.max(bw / iw, bh / ih);
  const w = iw * s;
  const h = ih * s;
  return [bx + (bw - w) * pos[0], by + (bh - h) * pos[1], w, h];
}

/**
 * Mirrors the CSS fallback in the-fleet.module.css exactly, so the WebGL frame
 * at rest and the static frame are the same picture:
 *  - lg (>= 992): sea plate 111.017% x 135.825% at -5.508% / -31.314%, image
 *    cover inside it; blot 121% wide, auto height, at 28% / 66%.
 *  - below: sea covers the panel; blot covers it at 50% / 40%.
 */
export function layoutFor(
  width: number,
  height: number,
  desktop: boolean,
  images: { sea: [number, number]; blot: [number, number] },
  origin: [number, number],
): WatercolorLayout {
  const toUv = ([x, y, w, h]: number[]): Rect => [
    x / width,
    y / height,
    w / width,
    h / height,
  ];
  const [sw, sh] = images.sea;
  const [bw, bh] = images.blot;

  const plate: [number, number, number, number] = desktop
    ? [-0.05508 * width, -0.31314 * height, 1.11017 * width, 1.35825 * height]
    : [0, 0, width, height];
  const sea = cover(plate, sw, sh);

  let blot: [number, number, number, number];
  if (desktop) {
    const w = 1.21 * width;
    const h = (w * bh) / bw;
    blot = [(width - w) * 0.28, (height - h) * 0.66, w, h];
  } else {
    blot = cover([0, 0, width, height], bw, bh, [0.5, 0.4]);
  }

  return { width, height, sea: toUv(sea), blot: toUv(blot), origin };
}
