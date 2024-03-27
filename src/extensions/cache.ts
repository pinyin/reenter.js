import { variable } from "./variable";
import { fork } from "./fork";
import { At } from "../core/core";

function cache<T>(cursor: At, compute: (at: At) => T, until: boolean): T {
  const initContext = fork(cursor);
  const value = variable(cursor, () => compute(initContext));
  if (!until || value.justInited) {
    return value.value;
  }
  return (value.value = compute(initContext));
}

export { cache };
