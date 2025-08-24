import {
  ENUM,
  INT,
  BYTE,
  STRING,
  STRUCT,
  ARRAY,
  DWORD,
  LWORD,
  LTIME,
  FLOAT,
  LREAL,
  UINT,
  USINT,
  SINT,
  WORD,
  UDINT,
  DINT,
  ULINT,
  LINT,
  DATE,
  DT,
  DATE_AND_TIME,
  BOOL,
  TIME,
  LDATE,
  LDATE_AND_TIME,
  LDT,
} from "./src";
import { bench } from "@ark/attest";

enum TEST {
  Z = 0,
  X = 1,
  Y = 2,
}
bench("struct", () =>
  STRUCT({
    bool: BOOL,

    byte: BYTE,
    uint8: USINT,
    int8: SINT,

    word: WORD,
    uint16: UINT,
    int16: INT,

    dword: DWORD,
    uint32: UDINT,
    int32: DINT,

    lword: LWORD,
    ulint: ULINT,
    lint: LINT,

    float: FLOAT,
    lreal: LREAL,

    date: DATE,
    dt: DT,
    date_and_time: DATE_AND_TIME,

    ldate: LDATE,
    ldate_and_time: LDATE_AND_TIME,
    ldt: LDT,

    time: TIME,
    ltime: LTIME,

    string: STRING(80),

    arr: ARRAY(LDT, 10),

    enum: ENUM(TEST, DINT),

    st: STRUCT({
      lreal: LREAL,
      bool: BOOL,
    }),
  }),
).types([47739, "instantiations"]);
