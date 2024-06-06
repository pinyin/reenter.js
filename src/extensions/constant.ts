import { Cursor } from "../core/core";
import { variable } from "./variable";

export function constant<T>(at: Cursor, init: () => T): T {
  return variable(at, init).get();
}
