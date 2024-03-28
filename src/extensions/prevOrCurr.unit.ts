import { Context, into } from "../core/core";
import { prevOrCurr } from "./prevOrCurr";

describe(`${prevOrCurr.name} should`, () => {
  test("should return previous value if exists", () => {
    const context: Context = [];

    function func() {
      const at = into(context);
      const value = at.next();
      value.value ??= 0;
      value.value++;
      return prevOrCurr(at, value.value);
    }

    expect(func()).toEqual({ hasPrev: false, value: 1 });
    expect(func()).toEqual({ hasPrev: true, value: 1 });
    expect(func()).toEqual({ hasPrev: true, value: 2 });
    expect(func()).toEqual({ hasPrev: true, value: 3 });
  });
});
