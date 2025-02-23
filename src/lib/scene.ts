import { Sphere } from "./Sphere";
import { Scene } from "./types";
import { c, v } from "./util";

export const scene: Scene = {
  objects: [new Sphere(v(0, 10, 0), 1, c(1, 0, 0))],
  lights: [],
  ambientLight: c(0.1, 0.1, 0.1),
};
