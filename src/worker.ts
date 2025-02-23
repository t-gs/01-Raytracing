import { FromWorkerData, ToWorkerData } from "./common/types";
import { Context } from "./lib/Context";
import { renderPixel } from "./lib/renderPixel";

const FOV = 0.5 * Math.PI;
const TAN_HALF_FOV = Math.tan(FOV / 2);

self.onmessage = async function (event: MessageEvent<ToWorkerData>) {
  const { row, width, height, aspectRatio } = event.data;
  const context: Context = {
    aspectRatio,
    tanFovX: aspectRatio < 1 ? TAN_HALF_FOV : TAN_HALF_FOV * aspectRatio,
    tanFovY: aspectRatio < 1 ? TAN_HALF_FOV / aspectRatio : TAN_HALF_FOV,
  };

  const data = new Uint8ClampedArray(width * 4);

  for (let x = 0; x < width; x++) {
    const { r, g, b } = renderPixel(
      context,
      x / (width - 1),
      row / (height - 1)
    );
    const index = x * 4;
    data[index] = Math.floor(r * 255);
    data[index + 1] = Math.floor(g * 255);
    data[index + 2] = Math.floor(b * 255);
    data[index + 3] = 255;
  }

  const message: FromWorkerData = { row, data };
  self.postMessage(message);
};
