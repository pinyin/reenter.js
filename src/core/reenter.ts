export function reenter(storage: ContextStorage): [Context, ArchiveContext] {
  let index = 1;

  if (storage.length == 0) {
    storage.push(null);
  }
  const status: ContextStatus = (storage[0] ??= {
    effects: new Set(),
    archive: (): DidFinish => {
      let didFinish = true;
      status.effects.forEach((effect) => {
        const didFinishCurrent = effect();
        if (didFinishCurrent) {
          status.effects.delete(effect);
        }
        didFinish = didFinishCurrent && didFinish;
      });
      return didFinish;
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
    onArchive(snapshot: ArchiveContext): MarkConsistent {
      status.effects.add(snapshot);
      return () => {
        status.effects.delete(snapshot);
      };
    },
    use<T>(func: (context: Context) => T): T {
      return func(this);
    },
  };

  return [context, status.archive];
}

export type Context = {
  property<T>(): Property<T>;
  onArchive(archive: ArchiveContext): MarkConsistent;

  use<T>(by: UsedInContext<T>): T;
};

export type UsedInContext<T> = (context: Context) => T;

export type ArchiveContext = () => DidFinish;

export type Property<T> = [() => T | null, (value: T) => typeof value];

export type ContextStorage = [ContextStatus | null, ...any[]];

export type DidFinish = boolean;

type ContextStatus = {
  effects: Set<() => DidFinish>;
  archive: ArchiveContext;
};

export type MarkConsistent = () => void;
