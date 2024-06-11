import {ContextStorage, reenter, UsedInContext} from "../core/reenter";
import {constant} from "../operations/constant";

export function singleton<P extends any[], R>(
  func: UsedInContext<(...p: P) => R>,
): UsedInContext<(...p: P) => R> {
  return (context) => {
    const storage = context.use(constant(() => [null] as ContextStorage));
    return (...p: P) => {
      const [subcontext, archiveSubcontext] = reenter(storage);
      archiveSubcontext();
      context.effect(archiveSubcontext);
      return func(subcontext)(...p);
    };
  };
}
