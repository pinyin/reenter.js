import { Context, into } from "../core/core";
import { Variable, variable } from "./variable";

describe(`${variable.name}`, () => {
  test("should init variable on first run", () => {
    const context: Context = [];
    const at = into(context);
    const v = variable(at, () => 1);
    expect(v.justInitialized).toBeTruthy();
    expect(v.value).toBe(1);
    const nextLoop = variable(into(context), () => 2);
    expect(nextLoop).toMatchObject({
      justInitialized: false,
      value: 1,
    } as Variable<number>);
    nextLoop.set(3);
    expect(context[0]).toMatchObject({ value: 3 });
  });
});
