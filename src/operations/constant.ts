import { UsedInContext } from "../core/reenter";
import { variable } from "./variable";

export function constant<T>(init: () => T): UsedInContext<T> {
  return (context) => {
    const [read, _] = context.use(variable(init));
    return read();
  };
}
