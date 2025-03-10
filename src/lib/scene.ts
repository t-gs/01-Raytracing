import { dummyTexture } from "./assets/dummyTexture";
import { Sphere } from "./Sphere";
import { Scene } from "./types";
import { c, v } from "./util";

export const scene: Scene = {
  objects: [
    new Sphere(v(0, 0, -100000), 99995, c(1, 1, 1)),
    new Sphere(v(0, 10, 0), 1, c(1, 0, 0)),
    new Sphere(v(-5, 10, 0), 1, c(0, 1, 0)),
    new Sphere(v(5, 10, 0), 1, dummyTexture),
  ],
  lights: [
    { position: v(0, 10, 10), color: c(0.45, 0.15, 0.15) },
    { position: v(-4, 10, 10), color: c(0.15, 0.45, 0.15) },
    { position: v(4, 10, 10), color: c(0.15, 0.15, 0.45) },
  ],
  ambientLight: c(0.1, 0.1, 0.1),
};
