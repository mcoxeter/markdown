import { expect, test, describe } from "vitest";
import { MDHeadingToken } from "./md-heading-token";

describe("MDHeadingToken Initialization", () => {
  test("MDHeadingToken should initialize correctly", () => {
    const headingToken = new MDHeadingToken();
    expect(headingToken.children).toStrictEqual([]);
    expect(headingToken.endCursorPosition).toBe(0);
    expect(headingToken.startCursorPosition).toBe(0);
    expect(headingToken.valid).toBeFalsy();
    expect(headingToken.processingOrder).toStrictEqual([
      "bold",
      "italic",
      "text",
    ]);
    expect(headingToken.source).toBe("");
    expect(headingToken.name).toBe("heading");
  });
});

describe("MDHeadingToken Validation", () => {
  test.each([
    ["# Heading 1", 1],
    ["## Heading 2", 2],
    ["### Heading 3", 3],
    ["#### **Bold Heading**", 4],
  ])('MDHeadingToken "%s" should be a valid italic token', (source, level) => {
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);
    expect(headingToken.valid).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(level);
    expect(headingToken.source).toBe(source);
    expect(headingToken.children.length).toBeGreaterThanOrEqual(0);
    expect(headingToken.endCursorPosition).toBe(source.length);
  });
  test.each([
    ["#NoSpace", "No space after heading indicator"],
    ["Text before # Heading", "Heading indicator not at start"],
    ["#", "Heading not formed correctly"],
    ["", "Empty string"],
    ["######", "Heading level only without content"],
  ])('MDHeadingToken "%s" should be invalid: %s', (source) => {
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.valid).toBeFalsy();
    expect(headingToken.getHeadingLevel()).toBe(0);
    expect(headingToken.children).toStrictEqual([]);
    expect(headingToken.source).toBe("");
  });

  test("MDHeadingToken should handle partial valid headers gracefully", () => {
    const source = "### Heading\nInvalid Content";
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.valid).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(3);
    expect(headingToken.source).toBe("### Heading\n");
    expect(headingToken.endCursorPosition).toBe(12);
  });

  test("MDHeadingToken can handle bold within", () => {
    const source = "# Head**ing**";
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.valid).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(1);
    const children = headingToken.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toBe("text");
    expect(children[1].name).toBe("bold");
  });

  test.each([
    [" # Heading", 1, 10, false],
    ["# Heading", 0, 10, true],
    ["some text\n# Heading", 10, 19, true],
  ])(
    "MDHeadingToken are only valid at the start text or at the start of a new line",
    (src, start, end, valid) => {
      const headingToken = new MDHeadingToken();
      headingToken.compile(src, start, end);

      expect(headingToken.valid).toBe(valid);
    }
  );

  test.each(["# Heading\n", "# Heading\n\n"])(
    "MDHeadingToken should consume an ending CR",
    (src) => {
      const headingToken = new MDHeadingToken();
      headingToken.compile(src, 0, src.length);
      expect(headingToken.valid).toBeTruthy();
      expect(headingToken.source).toBe(src);
    }
  );
  test("MDHeadingToken should handle tokens with invalid ranges", () => {
    const source = "*i*";
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, -1, source.length); // Invalid start
    expect(headingToken.valid).toBeFalsy();

    headingToken.compile(source, 0, -1); // Invalid end
    expect(headingToken.valid).toBeFalsy();

    headingToken.compile(source, 5, 3); // End before start
    expect(headingToken.valid).toBeFalsy();
  });
});
