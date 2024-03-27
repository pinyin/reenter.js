import { At, Context, into } from "../core/core";

function variable<T>(cursor: At, init: () => T): Variable<T> {
  const status = cursor.next();
  const isInit = status.needsInit;
  if (isInit) {
    status.value = init();
    status.needsInit = false;
  }

  return {
    justInited: isInit,
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
  justInited: boolean;

  get value(): T;
  set value(value: T);

  get(): T;
  set(value: T): void;
};

export { variable };
export type { Variable };

describe(`${variable.name}`, () => {
  test("should init variable on first run", () => {
    const context: Context = [];
    const cursor = into(context);
    const v = variable(cursor, () => 1);
    expect(v.justInited).toBeTruthy();
    expect(v.value).toBe(1);
    const nextLoop = variable(into(context), () => 2);
    expect(nextLoop).toMatchObject({
      isInit: false,
      value: 1,
    });
    nextLoop.set(3);
    expect(context[0]).toMatchObject({ value: 3 });
  });
});
