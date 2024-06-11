import {ContextStorage, reenter, UsedInContext} from "../core/reenter";
import {constant} from "../operations/constant";

export function keyed<P extends any[], R, K>(
  func: UsedInContext<(...p: P) => R>,
  computeKey: (...p: P) => K,
  cleanup: (contexts: Map<K, ContextStorage>) => void,
): UsedInContext<(...p: P) => R> {
  return (context) => {
    const storages = context.use(constant(() => new Map<K, ContextStorage>()));
    cleanup(storages);

    return (...p: P) => {
      const key = computeKey(...p);
      if (!storages.has(key)) storages.set(key, [null] as ContextStorage);
      const [subcontext, archiveSubcontext] = reenter(storages.get(key)!);
      archiveSubcontext();
      context.effect(archiveSubcontext);
      return func(subcontext)(...p);
    };
  };
}
