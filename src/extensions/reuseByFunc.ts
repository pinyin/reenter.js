import { ResultAndEffect, reuseByKey } from "./reuseByKey";
import { At } from "../core/core";

function reuseByFunc(at: At): ReuseByFunc {
  return reuseByKey<any, any, any>(
    at,
    <P extends any[], R>(
      context: At,
      func: (context: At, ...p: P) => ResultAndEffect<R>,
      ...p: P
    ): ResultAndEffect<R> => {
      return func(context, ...p);
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
