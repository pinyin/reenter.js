import { variable } from "./variable";
import { cache } from "./cache";
import { At, Context, into } from "../core/core";

function view<KS, TS>(
  cursor: At,
  timeline: Timeline<KS, TS>,
): NextFrame<KS, TS> {
  const context = variable<Context>(cursor, () => []).value;
  return (duration: number) => {
    const at = into(context);
    const needsKeyFrame = variable(at, () => true);
    const keyFrame = cache(
      at,
      (context) => timeline(context),
      needsKeyFrame.value,
    );
    const tweenFrame = keyFrame.tween(at, duration);
    needsKeyFrame.value = tweenFrame.needsKeyframe;
    return [keyFrame, tweenFrame];
  };
}

type Timeline<KS, TS> = (context: At) => KeyFrame<KS, TS>;

type KeyFrame<KS, TS> = { status: KS; tween: Tween<TS> };

type Tween<S> = (context: At, duration: number) => TweenFrame<S>;

type TweenFrame<S> = {
  status: S;
  dispose(): void;
  needsKeyframe: boolean;
};

type NextFrame<KS, TS> = (
  duration: number,
) => [KeyFrame<KS, TS>, TweenFrame<TS>];

export { view };
export type { Timeline, KeyFrame, Tween, NextFrame };
