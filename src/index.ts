import * as core from "./core/core";
import * as c from "./extensions/cache";
import * as fo from "./extensions/fork";
import * as f from "./extensions/forkable";
import * as p from "./extensions/prevOrCurr";
import * as r from "./extensions/reuseByKey";
import * as re from "./extensions/reuseGroup";
import * as v from "./extensions/variable";
import * as va from "./extensions/variate";

export namespace reenter {
  export const into = core.into;
  export type Cursor = core.Cursor;
  export type Context = core.Context;
  export type Value = core.Value;

  export const cache = c.cache;

  export const fork = fo.fork;

  export const forkable = f.forkable;
  export type Forkable<K> = f.Forkable<K>;

  export const prevOrCurr = p.prevOrCurr;
  export type PrevOrCurr<T> = p.PrevOrCurr<T>;

  export const reuseGroup = re.reuseGroup;
  export type ReuseGroup = re.ReuseGroup;

  export const reuseByKey = r.reuseByKey;
  export type ReuseByKey<P extends any[], R, K> = r.ReuseByKey<P, R, K>;

  export const variable = v.variable;
  export type Variable<T> = v.Variable<T>;

  export const variate = va.variate;
  export type Variate<T> = va.Variate<T>;
  export type Timestamp = va.Timestamp;
  export type Sample<T> = va.Sample<T>;
}
