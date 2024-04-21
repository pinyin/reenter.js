import { Cursor } from "../core/core";
import { variable } from "./variable";

export function variate<T>(
  at: Cursor,
  now: () => Timestamp,
  compress: (history: Sample<T>[]) => Sample<T>[],
): [UpdateVariate<T>, Variate<T>] {
  const history = variable(at, (): Sample<T>[] => []);
  history.set(compress(history.get()));
  let convergeAfter = variable(at, () => future);

  return [
    {
      set(value: T): void {
        const nowAt = now();
        if (nowAt > convergeAfter.value) return;
        history.value.push({ value: value, at: nowAt });
      },
      converge(): void {
        if (Number.isFinite(convergeAfter.value)) return;
        convergeAfter.value = now();
      },
    },
    {
      get(): Sample<T>[] {
        return history.value;
      },
      convergeAt() {
        return convergeAfter.value;
      },
      didConverge(): boolean {
        return Number.isFinite(convergeAfter.value);
      },
    },
  ];
}

export type UpdateVariate<T> = {
  set(value: T): void;
  converge(): void;
};

export type Variate<T> = {
  didConverge(): boolean;
  convergeAt(): Timestamp;
  get(): Sample<T>[];
};

export type Sample<T> = {
  readonly value: T;
  readonly at: Timestamp;
};

export type Timestamp = number;

export const future: Timestamp = Infinity;
