import { Pixel } from "../common/types";
import { Context } from "./Context";
import { scene } from "./scene";
import { Color, Intersection, Ray, RTObject } from "./types";
import { add, c, dot, len, mul, normalize, sub, v } from "./util";

function intersect(ray: Ray): [Intersection, RTObject] | undefined {
  let result: [Intersection, RTObject] | undefined;

  for (const object of scene.objects) {
    const intersection = object.intersect(ray);
    if (
      intersection &&
      (!result || intersection.distance < result[0].distance)
    ) {
      result = [intersection, object];
    }
  }

  return result;
}

export function renderPixel(context: Context, x: number, y: number): Pixel {
  const ray: Ray = {
    origin: v(0, 0, 0),
    direction: normalize(
      v(context.tanFovX * (x * 2 - 1), 1, -context.tanFovY * (y * 2 - 1))
    ),
  };

  const hit = intersect(ray);
  if (!hit) {
    return c(0, 0, 0);
  }
  const [intersection, object] = hit;
  let sum: Color = {
    r: scene.ambientLight.r * object.color.r,
    g: scene.ambientLight.g * object.color.g,
    b: scene.ambientLight.b * object.color.b,
  };
  const point = add(
    add(ray.origin, mul(ray.direction, intersection.distance)),
    mul(intersection.normal, 0.0001)
  );
  for (const light of scene.lights) {
    const pointToLight = sub(light.position, point);
    const ray: Ray = { origin: point, direction: normalize(pointToLight) };
    const distance = intersect(ray)?.[0].distance ?? Infinity;
    if (distance > len(pointToLight)) {
      const factor = Math.max(
        0,
        dot(intersection.normal, normalize(pointToLight))
      );
      sum = {
        r: sum.r + light.color.r * object.color.r * factor,
        g: sum.g + light.color.g * object.color.g * factor,
        b: sum.b + light.color.b * object.color.b * factor,
      };
    }
  }
  return sum;
}
