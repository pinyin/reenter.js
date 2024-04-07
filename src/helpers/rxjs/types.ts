import { SchedulerLike, SubscriptionLike } from "rxjs";

export function rxScheduler(): [RunRx, SchedulerLike] {
  return [
    {},
    {
      now(): number {
        return 0;
      },
      schedule<T>(
        work: (this: SchedulerLike, state?: T) => void,
        delay?: number,
        state?: T,
      ): SubscriptionLike {
        work.call();
        return {
          unsubscribe() {},
        };
      },
    },
  ];
}

type RunRx = {};
