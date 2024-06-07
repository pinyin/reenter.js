import { ContextStorage, reenter, UsedInContext } from "../core/reenter";
import { constant } from "../operations/constant";

export function keyed<P extends any[], R>(
  func: UsedInContext<(...p: P) => R>,
  computeKey: (...p: P) => any,
): UsedInContext<(...p: P) => R> {
  return (context) => {
    const storages = context.use(
      constant(() => new Map<any, ContextStorage>()),
    );

    return (...p: P) => {
      const key = computeKey(...p);
      if (!storages.has(key)) storages.set(key, [null] as ContextStorage);
      const [subcontext, archiveSubcontext] = reenter(storages.get(key)!);
      archiveSubcontext();
      context.onArchive(archiveSubcontext);
      return func(subcontext)(...p);
    };
  };
}
