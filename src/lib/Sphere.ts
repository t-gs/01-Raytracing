import { DummyTexture, Texture } from "./Texture";
import { Color, Intersection, Ray, RTObject, Vec } from "./types";
import { c, len, mul, normalize, sq, sub, v } from "./util";

export class Sphere implements RTObject {
  private readonly texture: Texture;

  constructor(
    public position: Vec,
    public radius: number,
    color: Color | Texture
  ) {
    this.texture = color instanceof Texture ? color : new DummyTexture(color);
  }

  intersect(ray: Ray): Intersection | undefined {
    // 카메라가 구 안에 있는 경우
    if (len(sub(ray.origin, this.position)) < this.radius) {
      return { distance: 0, normal: mul(ray.direction, -1) };
    }

    // 편의상 ray와 sphere의 위치에서 sphere의 위치를 빼서 sphere를 원점으로 만듦
    const origin = sub(ray.origin, this.position);

    /*
      이제 sphere를 x^2 + y^2 + z^2 - r^2 = 0으로 나타낼 수 있음
      x, y, z는 ray.origin + ray.direction * t의 x, y, z가 됨
      여기서 t는 광선이 이동한 거리, r은 ray.origin

      x^2 + y^2 + z^2 - r^2 = 0이라는 식에서 x^2는 이렇게 다시 쓸 수 있음
      (ray.origin.x + ray.direction.x * t)^2

      편의상 ray.origin을 (a, b, c), ray.direction을 (u, v, w)라고 하면
      (a + ut)^2 + (b + vt)^2 + (c + wt)^2 = r^2이 되고, 이를 풀어 쓰면
      a^2 + 2aut + (ut)^2 + b^2 + 2bvt + (vt)^2 + c^2 + 2cwt + (wt)^2 - r^2 = 0
      이를 만족하는 t를 찾아야 함

      근의 공식에 따라 A𝑥^2 + B𝑥 + C = 0이라고 할 때
      x는 (-B ± sqrt(B^2 - 4AC)) / 2A가 되고,
      여기서 𝑥가 t라고 할 때 a, b, c를 구해서 근의 공식대로 𝑥(=t)를 구하면 된다

      여기서의 A와 B, C를 각각 구하면 다음과 같다
      A = u^2 + v^2 + w^2
      B = 2au + 2bv + 2cw
      C = a^2 + b^2 + c^2 - r^2
    */
    const a = sq(ray.direction.x) + sq(ray.direction.y) + sq(ray.direction.z);
    const b =
      2 *
      (origin.x * ray.direction.x +
        origin.y * ray.direction.y +
        origin.z * ray.direction.z);
    const c = sq(origin.x) + sq(origin.y) + sq(origin.z) - sq(this.radius);
    const discriminant = sq(b) - 4 * a * c;

    if (discriminant < 0) {
      // 실수 x가 존재하지 않으면 교점이 없는 것, 즉 충돌하지 않음
      return undefined;
    }
    // t 후보 두 개
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const [tMin, tMax] = t1 < t2 ? [t1, t2] : [t2, t1];
    // 음수인 경우 충돌 안 함
    const t = tMin < 0 ? tMax : tMin;
    if (t < 0) {
      return undefined;
    }

    // t를 통해 x^2 + y^2 + z^2 - r^2 = 0애서의 x, y, z를 구할 수 있음
    const x = origin.x + ray.direction.x * t;
    const y = origin.y + ray.direction.y * t;
    const z = origin.z + ray.direction.z * t;

    // x^2 + y^2 + z^2 - r^2를 각각 x, y, z에 대해 편미분하면 법선 벡터가 나옴
    const normalX = 2 * x; // f(x) = x^2 + y^2 + z^2, f'(x) = 2x
    const normalY = 2 * y; // f(y) = x^2 + y^2 + z^2, f'(y) = 2y
    const normalZ = 2 * z; // f(z) = x^2 + y^2 + z^2, f'(z) = 2z
    // 하지만 길이가 1이 아닐 수 있으므로 정규화를 해야 함
    return {
      distance: t,
      normal: normalize(v(normalX, normalY, normalZ)),
    };
  }

  color(position: Vec): Color {
    // 편의상 sphere를 원점으로 만듦
    const localPos = sub(position, this.position);
    // 좌표 계산을 위해 정규화
    const dir = normalize(localPos);

    // 좌표 계산
    const theta = Math.atan2(dir.x, dir.y); // 경도: [-π, π]
    const phi = Math.acos(dir.z); // 위도: [0, π]

    // [0, 1] 범위로 계산
    const u = (theta + Math.PI) / (2 * Math.PI); // [-π, π]에서 [0, 1]로
    const v = phi / Math.PI; // [0, π]에서 [0, 1]로

    return c(this.texture.r(u, v), this.texture.g(u, v), this.texture.b(u, v));
  }
}
