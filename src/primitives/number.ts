import { Type, BaseType, TypeStatic, UnwrapSize } from "../base";

class Uint8Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setUint8(this.offset, data);
  }
  deserialize() {
    return this.dv.getUint8(this.offset);
  }
}

class Int8Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setInt8(this.offset, data);
  }
  deserialize() {
    return this.dv.getInt8(this.offset);
  }
}

class Uint16Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setUint16(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getUint16(this.offset, true);
  }
}
class Int16Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setInt16(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getInt16(this.offset, true);
  }
}

class Uint32Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setUint32(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getUint32(this.offset, true);
  }
}
class Int32Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setInt32(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getInt32(this.offset, true);
  }
}

class Float32Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setFloat32(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getFloat32(this.offset, true);
  }
}

class Float64Base extends BaseType<number> {
  serialize(data: number) {
    this.dv.setFloat64(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getFloat64(this.offset, true);
  }
}

class BigUint64Base extends BaseType<bigint> {
  serialize(data: bigint) {
    this.dv.setBigUint64(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getBigUint64(this.offset, true);
  }
}

class BigInt64Base extends BaseType<bigint> {
  serialize(data: bigint) {
    this.dv.setBigInt64(this.offset, data, true);
  }
  deserialize() {
    return this.dv.getBigInt64(this.offset, true);
  }
}

interface TypeConstructor<T> {
  new (dv: DataView, offset: number, buffer: Uint8Array): Type<T>;
}

function createType<
  T extends TypeConstructor<number | bigint>,
  SIZE extends number,
>(TY: T, size: SIZE): TypeStatic<Type<number | bigint>, SIZE> {
  return {
    getAlignment() {
      return size;
    },
    getLength() {
      return size;
    },
    create(dv, buffer, offset = 0) {
      return new TY(dv, offset, buffer);
    },
  };
}

export const BYTE = createType(Uint8Base, 1);
export const USINT = BYTE;

export const SINT = createType(Int8Base, 1);

export const WORD = createType(Uint16Base, 2);
export const UINT = WORD;

export const INT = createType(Int16Base, 2);

export const DWORD = createType(Uint32Base, 4);
export const UDINT = DWORD;

export const DINT = createType(Int32Base, 4);

export const LWORD = createType(BigUint64Base, 8);

export const ULINT = LWORD;

export const LINT = createType(BigInt64Base, 8);

export const FLOAT = createType(Float32Base, 4);

export const LREAL = createType(Float64Base, 8);
