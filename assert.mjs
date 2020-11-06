import assert from "assert";

export const equal = (got, want) => {
  assert.deepEqual(got, want, `got '${got}', but want '${want}'`);
};
