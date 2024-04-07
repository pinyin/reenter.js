import { Context, Cursor, into } from "../core/core";
import { variable } from "./variable";

function fork(at: Cursor): Cursor {
  const context = variable<Context>(at, () => []).value;
  return into(context);
}

export { fork };
