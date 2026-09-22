/**
 * Builds the blot's distance field off the main thread. Decoding the 3426px
 * blot and running the distance transform took ~1.1s in one task, which froze
 * the page (and stuttered the hero parallax) right after load.
 */
import { signedDistance } from "./sdf";

type Request = { src: string; width: number };

const scope = self as unknown as {
  addEventListener: (
    type: "message",
    fn: (e: MessageEvent<Request>) => void,
  ) => void;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};

scope.addEventListener("message", async ({ data: { src, width } }) => {
  try {
    const blob = await (await fetch(src)).blob();
    const bitmap = await createImageBitmap(blob);
    const w = width;
    const h = Math.round((bitmap.height / bitmap.width) * w);
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("no 2D context");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const field = signedDistance(ctx.getImageData(0, 0, w, h).data, w, h);
    scope.postMessage({ w, h, data: field }, [field.buffer]);
  } catch (error) {
    scope.postMessage({ error: String(error) });
  }
});
