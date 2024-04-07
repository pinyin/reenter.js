import { Published, sameTimestamp, Source, Timestamp } from "./source";

export function sink<T>(clock: Clock): [Sink<T>, Source<T>] {
  const data: { current: Published<T>[]; cursor: Timestamp } = {
    current: [],
    cursor: clock(),
  };
  let completedAt: Timestamp | null = null;

  function publish(value: T): Published<T> | null {
    if (completedAt !== null) return null;

    const now = clock();
    if (!sameTimestamp(data.cursor, now)) {
      data.current = [];
    }

    const published: Published<T> = {
      value,
      timestamp: clock(),
    };
    data.current.push(published);

    return published;
  }

  function complete(): Timestamp {
    if (completedAt !== null) return completedAt;
    return (completedAt = clock());
  }
}

export type Sink<T> = {
  publish(value: T): Published<T>;
  complete(): Timestamp;
};

export type Clock = () => Timestamp;
