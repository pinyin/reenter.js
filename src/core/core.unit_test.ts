import { Context, Cursor, into } from "./core";

describe(`${into}`, () => {
  test("should save cursors in storage", () => {
    const context: Context = [];
    const cursor = into(context);
    const values = [cursor.next(), cursor.next(), cursor.next(), cursor.next()];
    expect(values).toEqual(context);
  });

  test("should return the cursors from storage", () => {
    const context: Context = [
      {
        needsInit: true,
        value: 1,
      },
      {
        needsInit: true,
        value: 2,
      },
      {
        needsInit: false,
        value: 3,
      },
    ];
    const cursor = into(context);
    expect([cursor.next(), cursor.next(), cursor.next()]).toEqual(context);
  });
  test("should be able to add more cursors", () => {
    const context: Context = [
      {
        needsInit: true,
        value: 1,
      },
      {
        needsInit: true,
        value: 2,
      },
      {
        needsInit: false,
        value: 3,
      },
    ];
    const cursor = into(context);
    expect([
      cursor.next(),
      cursor.next(),
      cursor.next(),
      cursor.next(),
    ]).toEqual(context);
    expect(context.length).toBe(4);
  });

  it("should return a cursor object", () => {
    const context: Context = [{ needsInit: false, value: 1 }];
    const cursor: Cursor = into(context);
    expect(cursor).toHaveProperty("next");
    expect(typeof cursor.next).toBe("function");
  });

  it("should throw an error when context is empty", () => {
    const context: Context = [];
    const cursor: Cursor = into(context);
    expect(() => cursor.next()).not.toThrow();
  });

  it("should return the next value in the context", () => {
    const context: Context = [
      { needsInit: false, value: 1 },
      { needsInit: false, value: 2 },
    ];
    const cursor: Cursor = into(context);
    expect(cursor.next()).toEqual(context[0]);
    expect(cursor.next()).toEqual(context[1]);
  });

  it("should add a new value to the context when it reaches the end", () => {
    const context: Context = [{ needsInit: false, value: 1 }];
    const cursor: Cursor = into(context);
    cursor.next(); // reach the end of context
    expect(context.length).toBe(1);
    expect(context[0]).toEqual({ needsInit: false, value: 1 });
    cursor.next(); // reach the end of context
    expect(context.length).toBe(2);
    expect(context[1]).toEqual({ needsInit: true, value: undefined });
  });
});
