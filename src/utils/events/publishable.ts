export function publishable<T>(now: () => number): [Publish<T>, Stream<T>] {
  let unreadEvents: Streamed<T>[] = [];

  function publish(value: T): Streamed<T> {
    const published: Streamed<T> = { value: value, timestamp: now() };
    unreadEvents.push(published);
    return published;
  }

  const stream = createStream(
    {
      get events() {
        return unreadEvents;
      },
      set events(to: Streamed<T>[]) {
        unreadEvents = to;
      },
    },
    now,
  );

  return [publish, stream];
}

function createStream<T>(
  data: {
    get events(): Streamed<T>[];
    set events(value: Streamed<T>[]);
  },
  now: () => number,
): Stream<T> {
  function pull(): Streamed<T>[] {
    const result = data.events;
    data.events = [];
    return result;
  }

  function pipe<R>(operator: Operation<T, R>): Stream<R> {
    const self = createStream(data, now);
    return operator(self, now);
  }

  return { pipe: pipe, pull: pull };
}

export type Publish<T> = (t: T) => Streamed<T>;
export type Stream<T> = {
  pipe<R>(operator: Operation<T, R>): Stream<R>;
  pull(): Streamed<T>[];
};

export type Streamed<T> = {
  readonly timestamp: number;
  readonly value: T;
};

export type Operation<T, R> = (from: Stream<T>, now: () => number) => Stream<R>;
