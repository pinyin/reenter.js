export function reenter(storage: ContextStorage): [Context, Archive] {
  let index = 1;

  if (storage.length == 0) {
    storage.push(null);
  }
  const status: ContextStatus = (storage[0] ??= {
    onArchive: new Set(),
    archive: (): DidFinish => {
      let didFinish = true;
      status.onArchive.forEach((effect) => {
        const didFinishCurrent = effect();
        if (didFinishCurrent) {
          status.onArchive.delete(effect);
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
      status.onArchive.add(archive);
      return () => {
        status.onArchive.delete(archive);
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
  onArchive: Set<Archive>;
  archive: Archive;
};

export type CancelOnArchive = () => void;
