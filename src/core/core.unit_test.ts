import { Context, into } from "./core";

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
});
