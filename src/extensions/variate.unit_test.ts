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

    let [w, r] = run(0);
    expect(r.get()).toEqual([]);
    w.set(0);
    expect(r.get()).toEqual([{ value: 0, at: 0 }]);
    [w, r] = run(2);
    expect(r.get()).toEqual([{ value: 0, at: 0 }]);
    w.set(3);
    expect(r.get()).toEqual([
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

    let [w, r] = run(2);
    w.set(3);
    expect(r.get()).toEqual([{ value: 3, at: 2 }]);
    [w, r] = run(4);
    w.converge();
    w.set(3);
    expect(r.get()).toEqual([
      { value: 3, at: 2 },
      { value: 3, at: 4 },
    ]);
    expect(r.convergeAt()).toEqual(4);
    [w, r] = run(5);
    w.set(4);
    expect(r.get()).toEqual([
      { value: 3, at: 2 },
      { value: 3, at: 4 },
    ]);
  });
});
