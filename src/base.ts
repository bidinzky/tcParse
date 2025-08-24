import { Add } from "ts-arithmetic";

export interface Type<T> {
  deserialize(): T;
  serialize(data: T): void;
}

export abstract class BaseType<T> implements Type<T> {
  abstract deserialize(): T;
  abstract serialize(data: T): void;

  protected buffer: Uint8Array;
  protected dv: DataView;
  protected offset: number;
  constructor(dv: DataView, offset: number, buffer: Uint8Array) {
    this.buffer = buffer;
    this.dv = dv;
    this.offset = offset;
  }
}

export interface TypeStatic<
  T extends Type<any>,
  SIZE extends number,
  ALIGNMENT extends number = SIZE,
> {
  create(dv: DataView, buffer: Uint8Array, offset?: number): T;
  getAlignment(): ALIGNMENT;
  getLength(): SIZE;
}

export type UnwrapType<T extends Type<any>> =
  T extends Type<infer U> ? U : never;
export type UnwrapStatic<T extends TypeStatic<any, any, any>> =
  T extends TypeStatic<infer Z, any, any> ? UnwrapType<Z> : never;
export type UnwrapSize<T extends any> =
  T extends TypeStatic<any, infer SIZE, any> ? SIZE : never;
export type UnwrapAlignment<T extends any> =
  T extends TypeStatic<any, any, infer ALIGNEMENT> ? ALIGNEMENT : never;
