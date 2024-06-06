import {
  Context,
  ContextStorage,
  reenter,
  UsedInContext,
} from "../core/reenter";
import { variable } from "./variable";

export function branch(n: number): UsedInContext<Branches> {
  return (context: Context) => {
    const [storages] = context.use(variable(() => [] as ContextStorage[]));
    while (storages().length < n) storages().push([null]);

    return (index: number) => {
      const [branch, archive] = reenter(storages()[index]!);
      context.register(archive);
      return branch;
    };
  };
}

export type Branches = (index: number) => Context;
