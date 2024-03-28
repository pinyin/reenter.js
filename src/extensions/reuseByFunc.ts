import { At } from "../core/core";
import { ResultAndEffect, reuseByKey } from "./reuseByKey";

function reuseByFunc(at: At): ReuseByFunc {
  return reuseByKey<any, any, any>(
    at,
    <P extends any[], R>(
      at: At,
      func: (at: At, ...p: P) => ResultAndEffect<R>,
      ...p: P
    ): ResultAndEffect<R> => {
      return func(at, ...p);
    },
    (f: Function, ..._: any[]) => f,
  );
}

type ReuseByFunc = {
  call<P extends any[], R>(
    func: (at: At, ...p: P) => ResultAndEffect<R>,
    ...p: P[]
  ): R;
  diff(): {
    pending: Map<Function, ResultAndEffect<any>>;
    leaving: Map<Function, ResultAndEffect<any>>;
  };
};

export { reuseByFunc };
export type { ReuseByFunc };
