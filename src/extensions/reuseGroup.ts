import { Cursor } from "../core/core";
import { ResultAndEffect, reuseByKey } from "./reuseByKey";

function reuseGroup(at: Cursor): ReuseGroup {
  return reuseByKey<any, any, any>(
    at,
    <P extends any[], R>(
      at: Cursor,
      func: (at: Cursor, ...p: P) => ResultAndEffect<R>,
      ...p: P
    ): ResultAndEffect<R> => {
      return func(at, ...p);
    },
    (f: Function, ..._: any[]) => f,
  );
}

type ReuseGroup = {
  call<P extends any[], R>(
    func: (at: Cursor, ...p: P) => ResultAndEffect<R>,
    ...p: P[]
  ): R;
  diff(): {
    pending: Map<Function, ResultAndEffect<any>>;
    leaving: Map<Function, ResultAndEffect<any>>;
  };
};

export { reuseGroup };
export type { ReuseGroup };
