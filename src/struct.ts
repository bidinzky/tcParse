import { Add, Max, Mod, Subtract } from "ts-arithmetic";
import { Type, TypeStatic, Unwrap, UnwrapAlignment, UnwrapSize } from "./base";

type UnwrapObject<T extends Record<string, TypeStatic<any, number>>> = {
  [name in keyof T]: Unwrap<T[name]>;
} & {};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

type TupleSum<T extends unknown[]> = T extends []
  ? 0
  : T extends [infer H, ...infer T]
    ? H extends number
      ? T extends number[]
        ? Add<H, TupleSum<T>>
        : never
      : never
    : never;

type TupleMax<T extends unknown[]> = T extends []
  ? 0
  : T extends [infer H, ...infer T]
    ? H extends number
      ? T extends number[]
        ? Max<H, TupleMax<T>>
        : never
      : never
    : never;

type UnwrapObjectSize<T extends Record<string, TypeStatic<any, number>>> =
  TupleSum<TuplifyUnion<UnwrapSize<T[keyof T]>>>;
type UnwrapObjectAlignment<T extends Record<string, TypeStatic<any, number>>> =
  TupleMax<TuplifyUnion<UnwrapAlignment<T[keyof T]>>>;
class StructBase<T extends Record<string, TypeStatic<any, number>>>
  implements Type<UnwrapObject<T>>
{
  deserialize() {
    return {} as UnwrapObject<T>;
  }
  serialize(data: UnwrapObject<T>) {}
}

type ObjectAlignedSize<T extends Record<string, TypeStatic<any, number>>> = Add<
  UnwrapObjectSize<T>,
  Subtract<
    UnwrapObjectAlignment<T>,
    Mod<UnwrapObjectSize<T>, UnwrapObjectAlignment<T>>
  >
>;
export function STRUCT<T extends Record<string, TypeStatic<any, number>>>(
  fields: T,
): TypeStatic<StructBase<T>, ObjectAlignedSize<T>, UnwrapObjectAlignment<T>> {
  return {
    create(buffer) {
      return new StructBase();
    },
    getAlignment() {
      return Math.max(
        ...Object.keys(fields).map((f) => fields[f]!.getAlignment()),
      ) as UnwrapObjectAlignment<T>;
    },
    getLength() {
      const length = Object.keys(fields)
        .map((f) => fields[f]!.getLength())
        .reduce((a, b) => a + b, 0);
      return (length + (length % this.getAlignment())) as ObjectAlignedSize<T>;
    },
  };
}
