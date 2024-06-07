import {
  Context,
  ContextStorage,
  reenter,
  UsedInContext,
} from "../core/reenter";
import { variable } from "./variable";

export const fork: UsedInContext<Context> = (context) => {
  const [storage] = context.use(variable(() => [null] as ContextStorage));
  const [forked, archiveForked] = reenter(storage());
  context.onArchive(archiveForked);
  return forked;
};
