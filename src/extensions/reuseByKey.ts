import { At } from "../core/core";
import { forkable } from "./forkable";
import { variable } from "./variable";

function reuseByKey<P extends any[], R, K>(
  at: At,
  impureFunc: (at: At, ...p: P) => ResultAndEffect<R>,
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
