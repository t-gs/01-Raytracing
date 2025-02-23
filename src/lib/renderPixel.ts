import { Pixel } from "../common/types";
import { Context } from "./Context";
import { scene } from "./scene";
import { Ray } from "./types";
import { c, normalize, v } from "./util";

export function renderPixel(context: Context, x: number, y: number): Pixel {
  const ray: Ray = {
    origin: v(0, 0, 0),
    direction: normalize(
      v(context.tanFovX * (x * 2 - 1), 1, -context.tanFovY * (y * 2 - 1))
    ),
  };

  let distance = Infinity;
  let color = c(0, 0, 0);
  for (const object of scene.objects) {
    const intersection = object.intersect(ray);
    if (intersection && intersection.distance < distance) {
      distance = intersection.distance;
      color = {
        r: (intersection.normal.x + 1) / 2,
        g: (intersection.normal.y + 1) / 2,
        b: (intersection.normal.z + 1) / 2,
      };
    }
  }

  return color;
}
