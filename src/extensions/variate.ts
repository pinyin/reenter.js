import { Cursor } from "../core/core";
import { variable } from "./variable";

export function variate<T>(
  at: Cursor,
  now: () => Timestamp,
  compress: (history: Sample<T>[]) => Sample<T>[],
): Variate<T> {
  const history = variable(at, (): Sample<T>[] => []);
  history.set(compress(history.get()));
  let convergeAfter = variable(at, () => future);

  return {
    set(value: T): void {
      const nowAt = now();
      if (isRealTime(convergeAfter.value) && nowAt > convergeAfter.value)
        return;
      history.value.push({ value: value, at: nowAt });
    },
    get(): Sample<T>[] {
      return history.value;
    },
    converge(): void {
      if (isRealTime(convergeAfter.value)) return;
      convergeAfter.value = now();
    },
    convergedAfter() {
      return convergeAfter.value;
    },
  };
}

export type Variate<T> = {
  set(value: T): void;
  get(): Sample<T>[];

  converge(): void;
  convergedAfter(): Timestamp;
};

export type Sample<T> = {
  readonly value: T;
  readonly at: Timestamp;
};

export type Timestamp = number;

export const future: Timestamp = Infinity;

export function isRealTime(timestamp: Timestamp) {
  return Number.isFinite(timestamp);
}
