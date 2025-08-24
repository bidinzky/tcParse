import { BaseType, Type, TypeStatic, UnwrapSize } from "./base";

type EnumValue<TEnum> = ((TEnum[keyof TEnum] & number) | string) & {};
type EnumObject<TEnum> = {
  [k: number]: string;
  [k: string]: EnumValue<TEnum>;
};

export function ENUM<
  T extends EnumObject<T>,
  TY extends TypeStatic<Type<number | bigint>, number>,
>(filed: T, ty: TY): TypeStatic<Type<T>, UnwrapSize<TY>> {
  return {
    getAlignment() {
      return ty.getAlignment();
    },
    getLength() {
      return ty.getLength() as UnwrapSize<TY>;
    },
    create(dv, buffer, offset = 0) {
      return new (class implements Type<T> {
        private inner: Type<number | bigint>;
        constructor() {
          this.inner = ty.create(dv, buffer, offset);
        }
        deserialize(): T {
          return this.inner.deserialize() as unknown as T;
        }
        serialize(data: T): void {
          return this.inner.serialize(data as unknown as number | bigint);
        }
      })();
    },
  };
}
