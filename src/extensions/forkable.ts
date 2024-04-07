import { Context, Cursor, into } from "../core/core";
import { variable } from "./variable";

function forkable<K>(at: Cursor): Forkable<K> {
  const contexts = variable(at, () => new Map<K, Context>()).value;
  return {
    contexts,
    fork(key: K) {
      if (contexts.has(key)) return into(contexts.get(key)!);
      return into(contexts.set(key, []).get(key)!);
    },
  } as Forkable<K>;
}

type Forkable<K> = {
  contexts: Map<K, Context>;
  fork(key: K): Cursor;
};

export { forkable };
export type { Forkable };
