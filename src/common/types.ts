export type Awaitable<T> = T | Promise<T>;

export type Pixel = Record<"r" | "g" | "b", number>;

export interface ToWorkerData {
  row: number;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface FromWorkerData {
  row: number;
  data: Uint8ClampedArray;
}
