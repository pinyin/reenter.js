import { forkable } from "./forkable";
import { variable } from "./variable";
import { At, Context, into } from "../core/core";

function reuseByKey<P extends any[], R, K>(
  at: At,
  impureFunc: (cursor: At, ...p: P) => ResultAndEffect<R>,
  computeKey: (...p: P) => K,
): ReuseByKey<P, R, K> {
  const contexts = forkable<K>(at);
  const pending = variable(at, () => new Map<K, ResultAndEffect<R>>()).value;
  const leaving = variable(at, () => new Map<K, ResultAndEffect<R>>()).value;

  pending.forEach((value, key) => {
    leaving.set(key, value);
  });
  pending.clear();

  return {
    call(...p): R {
      const key = computeKey(...p);
      pending.set(key, impureFunc(contexts.fork(key), ...p));
      leaving.delete(key);
      return pending.get(key)!.result;
    },
    diff() {
      leaving.forEach((value, key) => {
        if (value.stopEffect?.() ?? true) {
          leaving.delete(key);
          contexts.contexts.delete(key);
        }
      });

      return {
        pending: pending,
        leaving: leaving,
      };
    },
  };
}

type ResultAndEffect<R> = {
  stopEffect?(): boolean;
  result: R;
};

type ReuseByKey<P extends any[], R, K> = {
  call(...p: P): R;
  diff(): {
    pending: Map<K, ResultAndEffect<R>>;
    leaving: Map<K, ResultAndEffect<R>>;
  };
};

export { reuseByKey };
export type { ReuseByKey, ResultAndEffect };

describe(`${reuseByKey.name}`, () => {
  test(`should provide same context for same key before diff`, () => {
    const storage: Context = [];
    const func = () =>
      reuseByKey(
        into(storage),
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
