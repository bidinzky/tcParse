import { BaseType, Type, TypeStatic } from "../base";
import { Temporal } from "temporal-polyfill";

class TIMEBase extends BaseType<Temporal.Instant> {
  serialize(data: Temporal.Instant) {
    this.dv.setUint32(this.offset, data.epochMilliseconds, true);
  }
  deserialize() {
    return Temporal.Instant.fromEpochMilliseconds(
      this.dv.getUint32(this.offset, true),
    );
  }
}

export const TIME: TypeStatic<TIMEBase, 4> = {
  getAlignment() {
    return 4;
  },
  getLength() {
    return 4;
  },
  create(dv, buffer, offset = 0) {
    return new TIMEBase(dv, offset, buffer);
  },
};

class LTIMEBase extends BaseType<Temporal.Instant> {
  serialize(data: Temporal.Instant) {
    this.dv.setBigUint64(this.offset, data.epochNanoseconds, true);
  }
  deserialize() {
    return Temporal.Instant.fromEpochNanoseconds(
      this.dv.getBigUint64(this.offset, true),
    );
  }
}

export const LTIME: TypeStatic<LTIMEBase, 8> = {
  getAlignment() {
    return 8;
  },
  getLength() {
    return 8;
  },
  create(dv, buffer, offset = 0) {
    return new LTIMEBase(dv, offset, buffer);
  },
};
