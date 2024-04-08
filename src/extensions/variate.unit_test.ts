import { Context, into } from "../core/core";
import { variate } from "./variate";

describe(`${variate.name} should`, () => {
  test("accept new sample", () => {
    const context: Context = [];

    function run(time: number) {
      const cursor = into(context);

      return variate<number>(
        cursor,
        () => time,
        (history) => history,
      );
    }

    let v = run(0);
    expect(v.get()).toEqual([]);
    v.set(0);
    expect(v.get()).toEqual([{ value: 0, at: 0 }]);
    v = run(2);
    expect(v.get()).toEqual([{ value: 0, at: 0 }]);
    v.set(3);
    expect(v.get()).toEqual([
      { value: 0, at: 0 },
      { value: 3, at: 2 },
    ]);
  });

  test("be marked as converged", () => {
    const context: Context = [];

    function run(time: number) {
      const cursor = into(context);

      return variate<number>(
        cursor,
        () => time,
        (history) => history,
      );
    }

    let v = run(2);
    v.set(3);
    expect(v.get()).toEqual([{ value: 3, at: 2 }]);
    v = run(4);
    v.converge();
    v.set(3);
    expect(v.get()).toEqual([
      { value: 3, at: 2 },
      { value: 3, at: 4 },
    ]);
    expect(v.convergedAfter()).toEqual(4);
    v = run(5);
    v.set(4);
    expect(v.get()).toEqual([
      { value: 3, at: 2 },
      { value: 3, at: 4 },
    ]);
  });
});
