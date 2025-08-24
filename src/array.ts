import { Multiply } from "ts-arithmetic";
import { BaseType, Type, TypeStatic, Unwrap, UnwrapSize } from "./base";

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

class ArrayBase<
  N extends number,
  T extends TypeStatic<any, any>,
> extends BaseType<Tuple<Unwrap<T>, N>> {
  private type: Tuple<ReturnType<T["create"]>, N>;
  constructor(
    dv: DataView,
    offset: number,
    buffer: Uint8Array,
    type: T,
    count: N,
  ) {
    super(dv, offset, buffer);
    this.type = Array(count)
      .fill(0)
      .map((_, i) =>
        type.create(
          dv,
          buffer.subarray(
            this.offset + type.getLength() * i,
            this.offset + type.getLength() * (i + 1),
          ),
          offset + type.getLength() * i,
        ),
      ) as Tuple<ReturnType<T["create"]>, N>;
  }
  deserialize(): Tuple<Unwrap<T>, N> {
    const result = Array(this.type.length) as Tuple<Unwrap<T>, N>;
    for (let i = 0; i < this.type.length; i++) {
      result[i] = this.type[i]!.deserialize();
    }
    return result;
  }
  serialize(data: Tuple<Unwrap<T>, N>): void {
    for (let i = 0; i < data.length; i++) {
      this.type[i]!.serialize(data[i]);
    }
  }
}

export function ARRAY<T extends TypeStatic<any, any>, const N extends number>(
  type: T,
  count: N,
): TypeStatic<ArrayBase<N, T>, Multiply<N, UnwrapSize<T>>> {
  return {
    getAlignment() {
      return type.getAlignment();
    },
    getLength() {
      return (type.getLength() * count) as Multiply<N, UnwrapSize<T>> & {};
    },
    create(dv, buffer, offset = 0) {
      return new ArrayBase(dv, offset, buffer, type, count);
    },
  };
}
