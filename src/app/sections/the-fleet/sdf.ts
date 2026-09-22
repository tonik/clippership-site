/**
 * Signed distance field of an alpha mask, via the exact Euclidean distance
 * transform of Felzenszwalb & Huttenlocher (two separable 1D passes).
 *
 * Why a distance field: interpolating two distance fields and thresholding at
 * zero morphs one outline into another in place - lobes grow and recede, the
 * edge stays crisp, and nothing slides, turns or ripples. Blending alpha masks
 * instead just pops every pixel at the midpoint.
 */

const INF = 1e20;

/** 1D squared distance transform of `f` (length n) into `d`. */
function edt1d(
  f: Float64Array,
  n: number,
  d: Float64Array,
  v: Int32Array,
  z: Float64Array,
) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dq = q - v[k];
    d[q] = dq * dq + f[v[k]];
  }
}

/** Squared distance from every cell to the nearest cell where `seed` is true. */
function edt2d(seed: Uint8Array, w: number, h: number) {
  const grid = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) grid[i] = seed[i] ? 0 : INF;
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
  return grid;
}

/**
 * Signed distance in texels, positive outside the shape. `alpha` is RGBA
 * image data; a texel is inside when its alpha is at least half.
 */
export function signedDistance(
  rgba: Uint8ClampedArray,
  w: number,
  h: number,
): Float32Array {
  const inside = new Uint8Array(w * h);
  const outside = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const on = rgba[i * 4 + 3] >= 128;
    inside[i] = on ? 1 : 0;
    outside[i] = on ? 0 : 1;
  }
  const toInside = edt2d(inside, w, h);
  const toOutside = edt2d(outside, w, h);
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    /* Half a texel either way puts the zero crossing on the edge itself. */
    out[i] = inside[i]
      ? 0.5 - Math.sqrt(toOutside[i])
      : Math.sqrt(toInside[i]) - 0.5;
  }
  return out;
}
