import { Context, into } from "../core/core";
import { forkable } from "./forkable";

describe(`${forkable.name} should`, () => {
  test("should allow creation of new cursors by key", () => {
    const context: Context = [];

    function func<T>(key: T) {
      const at = into(context);
      const forkAnchor = forkable<T>(at);
      const v = forkAnchor.fork(key).next();
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
    expect(func("a")).toEqual(2);
    expect(func("b")).toEqual(2);
    expect(func("a")).toEqual(3);
  });
});
