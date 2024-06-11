export function reenter(storage: ContextStorage): [Context, RunEffect] {
  let index = 1;

  if (storage.length == 0) {
    storage.push(null);
  }
  const status: ContextStatus = (storage[0] ??= {
    effects: new Set(),
    runEffects: (): CancelEffect => {
      status.effects.forEach((_, run) => {
        const cleanup = run();
        if (cleanup ! instanceof Function) {
          status.effects.delete(run);
        }
      });
      return () => {
        let didFinish = true;
        status.effects.forEach((cancel, run) => {
          const didFinishCurrent = cancel?.() ?? true
          if (didFinishCurrent) {
            status.effects.delete(run);
          }
          didFinish = didFinish && didFinishCurrent;
        })
        return didFinish;
      };
    },
  });

  const context: Context = {
    property<T>(): Property<T> {
      if (index > storage.length) {
        throw new Error("unexpected context end.");
      } else if (index === storage.length) {
        storage.push(null);
      }
      const currentIndex = index;
      index++;
      return [
        () => storage[currentIndex] as T | null,
        (value: T) => (storage[currentIndex] = value),
      ];
    },
    effect(snapshot: RunEffect): CancelEffect {
      status.effects.add(snapshot);
      return () => {
        status.effects.delete(snapshot);
        return true;
      };
    },
    use<T>(func: (context: Context) => T): T {
      return func(this);
    },
  };

  return [context, status.runEffects];
}

export type Context = {
  property<T>(): Property<T>;
  effect(effect: RunEffect): CancelEffect;

  use<T>(by: UsedInContext<T>): T;
};

export type UsedInContext<T> = (context: Context) => T;

export type RunEffect = () => CancelEffect | void;

export type CancelEffect = () => DidFinish

export type Property<T> = [() => T | null, (value: T) => typeof value];

export type ContextStorage = [ContextStatus | null, ...any[]];

export type DidFinish = boolean;

type ContextStatus = {
  effects: Map<RunEffect, CancelEffect | void>
  runEffects: RunEffect;
};

