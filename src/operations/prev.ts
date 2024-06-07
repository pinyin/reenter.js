import { UsedInContext } from "../core/reenter";
import { isInitializing } from "./isInitializing";
import { variable } from "./variable";

export function prev<T>(current: T, init: () => T): UsedInContext<T> {
  return (context) => {
    const isInit = context.use(isInitializing);
    const [prev, setPrev] = context.use(variable(() => null as T | null));
    if (isInit) {
      setPrev(init());
    }
    const result = prev();
    setPrev(current);
    return result!;
  };
}
