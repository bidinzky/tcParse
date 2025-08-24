import { ENUM, INT, BYTE, STRING, STRUCT, ARRAY, DWORD, LWORD } from "./src";

enum TEST {
  Z = 0,
  X = 1,
  Y = 2,
}
const st = STRUCT({
  x: ENUM(TEST, LWORD),
  y: BYTE,
});

st.getLength();
st.getAlignment();
