export type Context = Value[];

export function into(context: Context): Cursor {
  let index = 0;

  function next(): Value {
    if (index > context.length) {
      throw new Error("unexpected context end.");
    } else if (index === context.length) {
      context.push({ needsInit: true, value: undefined });
    }
    index++;
    return context[index - 1]!;
  }

  return { next };
}

export type Cursor = {
  next(): Value;
};

export type Value = {
  needsInit: boolean;
  value: any;
};
