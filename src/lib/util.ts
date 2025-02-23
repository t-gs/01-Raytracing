import { Color, Vec } from "./types";

export function v(x: number, y: number, z: number): Vec {
  return { x, y, z };
}

export function c(r: number, g: number, b: number): Color {
  return { r, g, b };
}

export function sq(a: number): number {
  return a * a;
}

export function len(a: Vec): number {
  return Math.sqrt(sq(a.x) + sq(a.y) + sq(a.z));
}

export function normalize(a: Vec): Vec {
  return div(a, len(a));
}

export function add(a: Vec, b: Vec): Vec {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
}

export function sub(a: Vec, b: Vec): Vec {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

export function mul(a: Vec, b: Vec | number): Vec {
  return {
    x: a.x * (typeof b === "number" ? b : b.x),
    y: a.y * (typeof b === "number" ? b : b.y),
    z: a.z * (typeof b === "number" ? b : b.z),
  };
}

export function div(a: Vec, b: Vec | number): Vec {
  return {
    x: a.x / (typeof b === "number" ? b : b.x),
    y: a.y / (typeof b === "number" ? b : b.y),
    z: a.z / (typeof b === "number" ? b : b.z),
  };
}
