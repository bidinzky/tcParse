import { BaseType, Type, TypeStatic } from "../base";
import { Add } from "ts-arithmetic";

class STRINGBase extends BaseType<string> {
  private decoder: TextDecoder;
  private encoder: TextEncoder;
  constructor(dv: DataView, offset: number, buffer: Uint8Array) {
    super(dv, offset, buffer);
    this.decoder = new TextDecoder("ascii");
    this.encoder = new TextEncoder();
  }

  deserialize() {
    return this.decoder.decode(this.buffer);
  }

  serialize(data: string) {
    const stats = this.encoder.encodeInto(data, this.buffer);
    if (stats.written < this.buffer.byteLength) {
      this.buffer[stats.written] = 0;
    }
  }
}

export function STRING<SIZE extends number>(
  size: SIZE,
): TypeStatic<STRINGBase, Add<SIZE, 1>, 1> {
  return {
    create(dv, buffer, offset = 0) {
      return new STRINGBase(
        dv,
        offset,
        buffer.subarray(offset, offset + size + 1),
      );
    },
    getAlignment() {
      return 1;
    },
    getLength() {
      return (size + 1) as Add<SIZE, 1>;
    },
  };
}
