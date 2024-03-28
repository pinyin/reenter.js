import { At, Context, into } from "../core/core";
import { variable } from "./variable";

function fork(at: At): At {
  const context = variable<Context>(at, () => []).value;
  return into(context);
}

export { fork };
