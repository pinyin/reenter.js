export function reenter(storage: ContextStorage): [Context, Archive] {
  let index = 1;

  if (storage.length == 0) {
    storage.push(null);
  }
  const status: ContextStatus = (storage[0] ??= {
    onArchiveSet: new Set(),
    archive: (): DidFinish => {
      let didFinish = true;
      status.onArchiveSet.forEach((effect) => {
        const didFinishCurrent = effect();
        if (didFinishCurrent) {
          status.onArchiveSet.delete(effect);
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
    onArchive(archive: Archive): CancelOnArchive {
      status.onArchiveSet.add(archive);
      return () => {
        status.onArchiveSet.delete(archive);
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
  onArchive(archive: Archive): CancelOnArchive;

  use<T>(by: UsedInContext<T>): T;
};

export type UsedInContext<T> = (context: Context) => T;

export type Archive = () => DidFinish;

export type Property<T> = [() => T | null, (value: T) => typeof value];

export type ContextStorage = [ContextStatus | null, ...any[]];

export type DidFinish = boolean;

type ContextStatus = {
  onArchiveSet: Set<Archive>;
  archive: Archive;
};

export type CancelOnArchive = () => void;
