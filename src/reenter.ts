import * as core from "./core/core";
import * as v from "./extensions/variable";
import * as f from "./extensions/forkable";

export namespace reenter {
  export const into = core.into;
  export type At = core.At;
  export type Context = core.Context;
  export type Value = core.Value;

  export const variable = v.variable;
  export type Variable<T> = v.Variable<T>;

  export const forkable = f.forkable;
  export type Forkable<K> = f.Forkable<K>;
}
