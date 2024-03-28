import { At } from "../core/core";
import { fork } from "./fork";
import { variable } from "./variable";

function cache<T>(at: At, compute: (at: At) => T, until: boolean): T {
  const computeAt = fork(at);
  const saved = variable(at, () => compute(computeAt));
  if (!until || saved.justInitialized) {
    return saved.value;
  }
  saved.value = compute(computeAt);
  return saved.value;
}

export { cache };
