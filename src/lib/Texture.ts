import { Color } from "./types";

export abstract class Texture {
  abstract r(x: number, y: number): number;
  abstract g(x: number, y: number): number;
  abstract b(x: number, y: number): number;
  abstract a(x: number, y: number): number;
}

export class DummyTexture extends Texture {
  constructor(public color: Color) {
    super();
  }

  override r(_x: number, _y: number): number {
    return this.color.r;
  }

  override g(_x: number, _y: number): number {
    return this.color.g;
  }

  override b(_x: number, _y: number): number {
    return this.color.b;
  }

  override a(_x: number, _y: number): number {
    return 1;
  }
}

export class RGBTexture extends Texture {
  constructor(
    public data: Uint8ClampedArray,
    public width: number,
    public height: number
  ) {
    super();
    if (data.length !== width * height * 3) {
      throw new Error("Incorrect data length");
    }
  }

  override r(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          3
      ] / 255
    );
  }

  override g(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          3 +
          1
      ] / 255
    );
  }

  override b(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          3 +
          2
      ] / 255
    );
  }

  override a(_x: number, _y: number): number {
    return 1;
  }
}

export class RGBATexture extends Texture {
  constructor(
    public data: Uint8ClampedArray,
    public width: number,
    public height: number
  ) {
    super();
    if (data.length !== width * height * 4) {
      throw new Error("Incorrect data length");
    }
  }

  override r(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          4
      ] / 255
    );
  }

  override g(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          4 +
          1
      ] / 255
    );
  }

  override b(x: number, y: number) {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          4 +
          2
      ] / 255
    );
  }

  override a(x: number, y: number): number {
    return (
      this.data[
        (Math.floor(y * (this.height - 1)) * this.width +
          Math.floor(x * (this.width - 1))) *
          4 +
          3
      ] / 255
    );
  }
}
