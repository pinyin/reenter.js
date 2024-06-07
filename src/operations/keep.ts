import { UsedInContext } from "../core/reenter";
import { fork } from "./fork";
import { isInitializing } from "./isInitializing";
import { variable } from "./variable";

export function keep<T>(
  compute: UsedInContext<T>,
  until: boolean,
): UsedInContext<T> {
  return (context) => {
    const isInit = context.use(isInitializing);
    const valueContext = context.use(fork);
    const [cached, setCached] = valueContext.use(
      variable(() => null as null | T),
    );
    if (isInit || until) {
      setCached(compute(valueContext));
    }
    return cached()!;
  };
}
