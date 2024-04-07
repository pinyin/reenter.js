import { Context, Cursor, into } from "../core/core";
import { cache } from "./cache";
import { variable } from "./variable";

function view<KS, TS>(
  at: Cursor,
  timeline: Timeline<KS, TS>,
): NextFrame<KS, TS> {
  const keyframeContext = variable<Context>(at, () => []).value;
  return (duration: number) => {
    const keyframeAt = into(keyframeContext);
    const needsKeyFrame = variable(keyframeAt, () => true);
    const keyFrame = cache(
      keyframeAt,
      (at) => timeline(at),
      needsKeyFrame.value,
    );
    const tweenFrame = keyFrame.tween(keyframeAt, duration);
    needsKeyFrame.value = tweenFrame.needsKeyframe;
    return [keyFrame, tweenFrame];
  };
}

type Timeline<KS, TS> = (at: Cursor) => KeyFrame<KS, TS>;

type KeyFrame<KS, TS> = { status: KS; tween: Tween<TS> };

type Tween<S> = (at: Cursor, duration: number) => TweenFrame<S>;

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
