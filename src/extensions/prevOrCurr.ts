import { At } from "../core/core";
import { variable } from "./variable";

function prevOrCurr<T>(at: At, value: T): PrevOrCurr<T> {
  const saved = variable(at, () => value);
  const prevOrCurr = saved.get();
  const hasPrev = !saved.justInitialized;
  saved.set(value);
  return {
    hasPrev: hasPrev,
    value: prevOrCurr,
  };
}

type PrevOrCurr<T> = {
  hasPrev: boolean;
  value: T;
};

export { prevOrCurr };
export type { PrevOrCurr };
