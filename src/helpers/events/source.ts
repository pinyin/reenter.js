export function source<T>(
  data: () => Published<T>[],
  completedAt: () => Timestamp | null,
): Source<T> {
  let sourceCompletedAt: Timestamp | null = null;

  function read(): Published<T>[] {
    if (sourceCompletedAt) return [];
    const value = data();
    sourceCompletedAt = completedAt();
    return value;
  }

  return {
    read,
    completedAt(): Timestamp | null {
      return sourceCompletedAt;
    },
  };
}

export type Published<T> = {
  value: T;
  timestamp: Timestamp;
};

export type Timestamp = {
  sinceEpochMilli: number;
};

export function sameTimestamp(a: Timestamp | null, b: Timestamp) {
  return a?.sinceEpochMilli === b.sinceEpochMilli;
}

export type Source<T> = {
  read(): Published<T>[];
  completedAt(): Timestamp | null;
};
