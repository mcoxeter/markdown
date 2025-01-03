import { expect, test, describe } from "vitest";
import { MDTextToken } from "./md-text-token";

describe("MDTextToken Tests", () => {
  test("MDTextToken initializes correctly", () => {
    const textToken = new MDTextToken();
    expect(textToken.children).toStrictEqual([]);
    expect(textToken.endCursorPosition).toBe(0);
    expect(textToken.startCursorPosition).toBe(0);
    expect(textToken.valid).toBe(false);
    expect(textToken.processingOrder).toStrictEqual([]);
    expect(textToken.source).toBe("");
    expect(textToken.name).toBe("text");
  });

  test("MDTextToken has no children after compilation", () => {
    const textToken = new MDTextToken();
    textToken.compile("example text", 0, 10);
    expect(textToken.children).toStrictEqual([]);
  });

  test("MDTextToken extracts source correctly", () => {
    const textToken = new MDTextToken();
    textToken.compile("example text", 0, 7);
    expect(textToken.source).toBe("example");
  });

  test("MDTextToken validates after compilation", () => {
    const textToken = new MDTextToken();
    textToken.compile("example text", 0, 7);
    expect(textToken.valid).toBe(true);
  });

  test("MDTextToken allows whitespace at end", () => {
    const textToken = new MDTextToken();
    const rawSource = "example text  ";
    textToken.compile(rawSource, 0, rawSource.length);
    expect(textToken.source).toStrictEqual("example text");
  });

  test.each([
    ["the *b* quick brown 1. fox", "the "],
    ["This is a simple text", "This is a simple text"],
    ["This is a #header", "This is a "],
    ["This is a `Some code`", "This is a "],
    ["*a", "*"],
    ["**a", "**"],
    ["line1\nline2", "line1"],
    ["line1  ", "line1"],
  ])('MDTextToken compiles "%s" to "%s"', (rawSource, expected) => {
    const textToken = new MDTextToken();
    textToken.compile(rawSource, 0, rawSource.length);
    expect(textToken.valid).toBe(true);
    expect(textToken.source).toBe(expected);
  });

  test("MDTextToken debug output matches expected structure", () => {
    const textToken = new MDTextToken();
    textToken.compile("the *b* quick brown 1. fox", 0, 4);
    expect(JSON.stringify(textToken.getAST())).toBe(
      '{"type":"text","start":0,"end":4,"value":"the ","children":[]}'
    );
  });

  test.each([
    ["the *b* quick brown 1. fox", "he "],
    ["This is a simple text", "his is a simple text"],
    ["This is a #header", "his is a "],
    ["This is a `Some code`", "his is a "],
  ])(
    'MDTextToken starting at position 1 for "%s" compiles to "%s"',
    (rawSource, expected) => {
      const textToken = new MDTextToken();
      textToken.compile(rawSource, 1, rawSource.length);
      expect(textToken.valid).toBe(true);
      expect(textToken.source).toBe(expected);
    }
  );

  test("MDTextToken handles invalid start and end range", () => {
    const textToken = new MDTextToken();
    textToken.compile("example text", 10, 5);
    expect(textToken.valid).toBe(false);
    expect(textToken.source).toBe("");
  });

  test("MDTextToken does not accept empty string", () => {
    const textToken = new MDTextToken();
    textToken.compile("", 0, 0);
    expect(textToken.valid).toBe(false);
    expect(textToken.source).toBe("");
  });

  test.each([
    ["***bold text", "***"],
    ["``ss``", "``"],
    ["#header", "#"],
  ])(
    "MDTextToken handles termination %s characters at the start",
    (rawSource, expected) => {
      const textToken = new MDTextToken();
      textToken.compile(rawSource, 0, rawSource.length);
      expect(textToken.source).toBe(expected);
    }
  );

  test("MDTextToken stops at termination character mid-source", () => {
    const textToken = new MDTextToken();
    textToken.compile("example #header text", 0, 18);
    expect(textToken.source).toBe("example ");
  });

  test("MDTextToken handles null or undefined input", () => {
    const textToken = new MDTextToken();
    textToken.compile(null as unknown as string, 0, 5);
    expect(textToken.valid).toBe(false);
    expect(textToken.source).toBe("");

    textToken.compile(undefined as unknown as string, 0, 5);
    expect(textToken.valid).toBe(false);
    expect(textToken.source).toBe("");
  });

  test.each([
    [-1, 0, false, "is neg is not allowed"],
    [10, -6, false, "is neg is not allowed"],
    [2, 1, false, "end is less than start"],
    [2, 2, false, "its not ok to have the two the same"],
  ])(
    "MDTextToken start %d and end %s is considered valid === %s, because %s",
    (start, end, valid) => {
      const textToken = new MDTextToken();
      textToken.compile("test", start, end);
      expect(textToken.valid).toBe(valid);
    }
  );
});
