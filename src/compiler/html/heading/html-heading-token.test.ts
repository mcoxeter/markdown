import { expect, test, describe } from "vitest";
import { HTMLHeadingToken } from "./html-heading-token";

describe("HTMLHeadingToken Initialization", () => {
  test("HTMLHeadingToken should initialize correctly", () => {
    const headingToken = new HTMLHeadingToken();
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

describe("HTMLHeadingToken Validation", () => {
  test.each([
    ["<h1>Heading 1</h1>", 1],
    ["<h2>Heading 2</h2>", 2],
    ["<h3>Heading 3</h3>", 3],
    ["<h4>Heading 4</h4>", 4],
    ["<h5>Heading 5</h5>", 5],
    ["<h6>Heading 6</h6>", 6],
  ])(
    'HTMLHeadingToken "%s" should be a valid header token',
    (source, level) => {
      const headingToken = new HTMLHeadingToken();
      headingToken.compile(source, 0, source.length);
      expect(headingToken.valid).toBeTruthy();
      expect(headingToken.getHeadingLevel()).toBe(level);
      expect(headingToken.source).toBe(source);
      expect(headingToken.children.length).toBeGreaterThanOrEqual(0);
      expect(headingToken.endCursorPosition).toBe(source.length);
    }
  );
  test.each([
    ["<h1>Heading 1", "No closing tag"],
    ["<h1>Heading 2</h2>", "Wrong closing tag"],
  ])('HTMLHeadingToken "%s" should be invalid: %s', (source) => {
    const headingToken = new HTMLHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.valid).toBeFalsy();
    expect(headingToken.getHeadingLevel()).toBe(0);
    expect(headingToken.children).toStrictEqual([]);
    expect(headingToken.source).toBe("");
  });

  test("HTMLHeadingToken can handle bold within", () => {
    const source = "<h1>text<b>bold</b></h1>";
    const headingToken = new HTMLHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.valid).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(1);
    const children = headingToken.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toBe("text");
    expect(children[1].name).toBe("bold");
  });

  test.each([
    [" <h1>Heading 1</h1>", 0, 17, false],
    ["<h1>Heading 1</h1>", 0, 16, true],
    ["some text\n<h1>Heading 1</h1>", 10, 28, true],
  ])(
    "HTMLHeadingToken are only valid at the start text or at the start of a new line",
    (src, start, end, valid) => {
      const headingToken = new HTMLHeadingToken();
      headingToken.compile(src, start, end);

      expect(headingToken.valid).toBe(valid);
    }
  );

  test("HTMLHeadingToken should handle tokens with invalid ranges", () => {
    const source = "*i*";
    const headingToken = new HTMLHeadingToken();
    headingToken.compile(source, -1, source.length); // Invalid start
    expect(headingToken.valid).toBeFalsy();

    headingToken.compile(source, 0, -1); // Invalid end
    expect(headingToken.valid).toBeFalsy();

    headingToken.compile(source, 5, 3); // End before start
    expect(headingToken.valid).toBeFalsy();
  });
});
