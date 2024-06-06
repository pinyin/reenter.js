import { UsedInContext } from "../core/reenter";
import { fork } from "./fork";
import { variable } from "./variable";

export function cache<T>(
  compute: UsedInContext<T>,
  until: boolean,
): UsedInContext<T> {
  return (context) => {
    const [isInit, setIsInit] = context.use(variable(() => true));
    const valueContext = context.use(fork());
    const [cached, setCached] = valueContext.use(
      variable(() => null as null | T),
    );
    if (isInit() || until) {
      setCached(compute(valueContext));
      setIsInit(false);
    }
    return cached()!;
  };
}
