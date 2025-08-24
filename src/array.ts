import { Multiply } from "ts-arithmetic";
import {
  BaseType,
  Type,
  TypeStatic,
  UnwrapStatic,
  UnwrapAlignment,
  UnwrapSize,
} from "./base";

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

class ArrayBase<
  const N extends number,
  T extends TypeStatic<Type<unknown>, any>,
  RDATA extends unknown[] = Tuple<UnwrapStatic<T>, N>,
> extends BaseType<RDATA> {
  private type: Type<unknown>[];
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
      );
  }
  deserialize(): RDATA {
    const result = Array(this.type.length) as RDATA;
    for (let i = 0; i < this.type.length; i++) {
      result[i] = this.type[i]!.deserialize();
    }
    return result;
  }
  serialize(data: RDATA): void {
    for (let i = 0; i < data.length; i++) {
      this.type[i]!.serialize(data[i]);
    }
  }
}

export function ARRAY<
  T extends TypeStatic<any, any>,
  const N extends number,
  SIZE extends Multiply<N, UnwrapSize<T>>,
  ALIGNEMENT extends UnwrapAlignment<T>,
>(type: T, count: N): TypeStatic<ArrayBase<N, T>, SIZE, ALIGNEMENT> {
  return {
    getAlignment() {
      return type.getAlignment();
    },
    getLength() {
      return (type.getLength() * count) as SIZE;
    },
    create(dv, buffer, offset = 0) {
      return new ArrayBase(dv, offset, buffer, type, count);
    },
  };
}
