import { Type, BaseType, TypeStatic } from "../base";
import { Temporal } from "temporal-polyfill";

class DATEBase extends BaseType<Temporal.Instant> {
  serialize(data: Temporal.Instant) {
    this.dv.setUint32(
      this.offset,
      data.since(Temporal.Instant.fromEpochMilliseconds(0)).seconds,
      true,
    );
  }
  deserialize() {
    return Temporal.Instant.fromEpochMilliseconds(0).add({
      seconds: this.dv.getUint32(this.offset, true),
    });
  }
}

export const DATE: TypeStatic<DATEBase, 4> = {
  getAlignment() {
    return 4;
  },
  getLength() {
    return 4;
  },
  create(dv, buffer, offset = 0) {
    return new DATEBase(dv, offset, buffer);
  },
};

export const DATE_AND_TIME = DATE;
export const DT = DATE;

class LDATEBase extends BaseType<Temporal.Instant> {
  serialize(data: Temporal.Instant) {
    this.dv.setBigUint64(this.offset, data.epochNanoseconds, true);
  }
  deserialize() {
    return Temporal.Instant.fromEpochNanoseconds(
      this.dv.getBigUint64(this.offset, true),
    );
  }
}

export const LDATE: TypeStatic<LDATEBase, 8> = {
  getAlignment() {
    return 8;
  },
  getLength() {
    return 8;
  },
  create(dv, buffer, offset = 0) {
    return new LDATEBase(dv, offset, buffer);
  },
};
