import { At } from "../core/core";

function variable<T>(at: At, init: () => T): Variable<T> {
  const status = at.next();
  const isInit = status.needsInit;
  if (isInit) {
    status.value = init();
    status.needsInit = false;
  }

  return {
    justInitialized: isInit,
    get() {
      return status.value;
    },
    set(value: T): void {
      status.value = value;
    },
    get value(): T {
      return status.value;
    },
    set value(value: T) {
      status.value = value;
    },
  };
}

type Variable<T> = {
  justInitialized: boolean;

  get value(): T;
  set value(value: T);

  get(): T;
  set(value: T): void;
};

export { variable };
export type { Variable };
