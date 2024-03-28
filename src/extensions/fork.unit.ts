import { Context, into } from "../core/core";
import { fork } from "./fork";

describe(`${fork.name} should`, () => {
  test("should return new cursor at current cursor", () => {
    const context: Context = [];

    function func(forked: boolean) {
      const at = into(context);
      const forkedAt = fork(at);
      if (forked) {
        const v = forkedAt.next();
        v.value ??= 1;
        v.value++;
        return v.value;
      }
      const v = at.next();
      v.value ??= 1;
      v.value++;
      return v.value;
    }

    expect(func(false)).toEqual(2);
    expect(func(false)).toEqual(3);
    expect(func(false)).toEqual(4);
    expect(func(false)).toEqual(5);
    expect(func(true)).toEqual(2);
    expect(func(true)).toEqual(3);
    expect(func(false)).toEqual(6);
    expect(func(false)).toEqual(7);
  });
});
