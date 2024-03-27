import { variable } from "./variable";
import { At } from "../core/core";

function prevOrCurr<T>(cursor: At, value: T): PrevOrCurr<T> {
  const saved = variable(cursor, () => value);
  const prevOrCurr = saved.get();
  const hasPrev = !saved.justInited;
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
