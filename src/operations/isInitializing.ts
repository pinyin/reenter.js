import { UsedInContext } from "../core/reenter";
import { variable } from "./variable";

export const isInitializing: UsedInContext<boolean> = (context) => {
  const [isInit, setIsInit] = context.use(variable(() => true));
  const result = isInit();
  setIsInit(false);
  return result;
};
