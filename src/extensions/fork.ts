import { variable } from "./variable";
import { At, Context, into } from "../core/core";

function fork(cursor: At): At {
  const context = variable<Context>(cursor, () => []).value;
  return into(context);
}

export { fork };
