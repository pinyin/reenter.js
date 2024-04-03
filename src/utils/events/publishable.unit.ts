import { publishable, Streamed } from "./publishable";

describe(`${publishable.name}`, () => {
  test("should accept publish event", (_) => {
    const [publish, stream] = publishable<number>(() => Date.now());

    const published: Streamed<number>[] = [];
    published.push(publish(1));
    published.push(publish(3));
    expect(stream.pull()).toEqual(published);
  });

  test(`should clear published events after called pull`, (_) => {
    const [publish, stream] = publishable<number>(() => Date.now());

    const published: Streamed<number>[] = [];
    published.push(publish(1));
    published.push(publish(3));
    expect(stream.pull()).toEqual(published);
    expect(stream.pull()).toEqual([]);
  });
});
