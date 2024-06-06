import { Context, UsedInContext } from "../core/reenter";

export function variable<T>(init: () => T): UsedInContext<Variable<T>> {
  return (context: Context): Variable<T> => {
    const [needsInit, setNeedsInit] = context.property<boolean>();
    const property = context.property<T>();
    const [_, setStatus] = property;

    if (needsInit()) {
      setStatus(init());
      setNeedsInit(false);
    }

    return property as Variable<T>;
  };
}

export type Variable<T> = [() => T, (value: T) => typeof value];
