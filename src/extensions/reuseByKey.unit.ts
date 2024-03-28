import { Context, into } from "../core/core";
import { reuseByKey } from "./reuseByKey";
import { variable } from "./variable";

describe(`${reuseByKey.name}`, () => {
  test(`should provide same context for same key before diff`, () => {
    const context: Context = [];
    const func = () =>
      reuseByKey(
        into(context),
        (context, a: number, b: number) => {
          const v = variable(context, () => 0);
          v.value++;
          return {
            result: [a, b, v.value],
          };
        },
        (a, _) => a,
      );

    const loop = func();
    expect(loop.call(1, 2)).toEqual([1, 2, 1]);
    expect(loop.call(1, 3)).toEqual([1, 3, 2]);
    expect(loop.call(1, 4)).toEqual([1, 4, 3]);
    expect(loop.call(2, 1)).toEqual([2, 1, 1]);
    expect(loop.call(2, 2)).toEqual([2, 2, 2]);
    expect(loop.call(1, 2)).toEqual([1, 2, 4]);
    loop.diff();
    const nextLoop = func();
    expect(loop.call(1, 4)).toEqual([1, 4, 5]);
    nextLoop.diff();
    func();
    expect(loop.call(1, 8)).toEqual([1, 8, 6]);
    expect(loop.call(2, 9)).toEqual([2, 9, 1]);
  });
});
