import { RGBTexture } from "../Texture";

export const dummyTexture = new RGBTexture(
  Uint8ClampedArray.from(
    Array.from({ length: 256 * 256 * 3 }, (_, i) => {
      const channelIndex = i % 3;
      const pixelIndex = Math.floor(i / 3);
      const x = pixelIndex % 256;
      const y = Math.floor(pixelIndex / 256);

      switch (channelIndex) {
        case 0:
          return x;
        case 1:
          return y;
        case 2:
          return 255;
      }
    })
  ),
  256,
  256
);
