import {
  Context,
  ContextStorage,
  reenter,
  UsedInContext,
} from "../core/reenter";
import { variable } from "./variable";

export function fork(): UsedInContext<Context> {
  return (context) => {
    const [storage] = context.use(variable(() => [null] as ContextStorage));
    const [forked, archiveForked] = reenter(storage());
    context.register(archiveForked);
    return forked;
  };
}
