import { Type, BaseType, TypeStatic } from "../base";

class BOOLSerialize extends BaseType<boolean> {
  serialize(data: boolean) {
    this.dv.setUint8(this.offset, !!data ? 1 : 0);
  }
  deserialize() {
    return !!this.dv.getUint8(this.offset);
  }
}

export const BOOL: TypeStatic<BOOLSerialize, 1> = {
  getAlignment() {
    return 1;
  },
  getLength() {
    return 1;
  },
  create(dv, buffer, offset = 0) {
    return new BOOLSerialize(dv, offset, buffer);
  },
};
