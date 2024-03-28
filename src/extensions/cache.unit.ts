import { Context, into } from "../core/core";
import { cache } from "./cache";
import { variable } from "./variable";

describe(`${cache.name} should`, () => {
  test("should save computed value until necessary", () => {
    const context: Context = [];

    function func(until: boolean) {
      return cache(
        into(context),
        (at) => {
          const computed = variable(at, () => 0);
          computed.value++;
          return computed.value;
        },
        until,
      );
    }

    expect(func(false)).toEqual(1);
    expect(func(false)).toEqual(1);
    expect(func(false)).toEqual(1);
    expect(func(false)).toEqual(1);
    expect(func(true)).toEqual(2);
    expect(func(true)).toEqual(3);
    expect(func(false)).toEqual(3);
    expect(func(false)).toEqual(3);
  });
});
