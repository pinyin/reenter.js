import * as core from "./core/core";
import * as c from "./extensions/cache";
import * as fo from "./extensions/fork";
import * as f from "./extensions/forkable";
import * as p from "./extensions/prevOrCurr";
import * as re from "./extensions/reuseByFunc";
import * as r from "./extensions/reuseByKey";
import * as v from "./extensions/variable";
import * as vi from "./extensions/view";
import * as s from "./utils/events";

export namespace reenter {
  export const into = core.into;
  export type At = core.At;
  export type Context = core.Context;
  export type Value = core.Value;

  export const cache = c.cache;

  export const fork = fo.fork;

  export const forkable = f.forkable;
  export type Forkable<K> = f.Forkable<K>;

  export const prevOrCurr = p.prevOrCurr;

  export const reuseByFunc = re.reuseByFunc;

  export const reuseByKey = r.reuseByKey;

  export const variable = v.variable;
  export type Variable<T> = v.Variable<T>;

  export const view = vi.view;

  export const events = s.events;
  export type Operation<T, R> = s.Operation<T, R>;
  export type Publish<T> = s.Publish<T>;
  export type Stream<T> = s.Stream<T>;
  export type Streamed<T> = s.Streamed<T>;
}
