import { expect, test, describe } from "vitest";
import { MDItalicToken } from "./md-italic-token";

describe("MDItalicToken Initialization", () => {
  test("MDItalicToken should initialize correctly", () => {
    const italicToken = new MDItalicToken();
    expect(italicToken.children).toStrictEqual([]);
    expect(italicToken.endCursorPosition).toBe(0);
    expect(italicToken.startCursorPosition).toBe(0);
    expect(italicToken.valid).toBeFalsy();
    expect(italicToken.processingOrder).toStrictEqual(["bold", "text"]);
    expect(italicToken.source).toBe("");
    expect(italicToken.name).toBe("italic");
  });
});

describe("MDItalicToken Validation", () => {
  test.each(["*i*", "*This **is** italic*", "*This **is italic and bold***"])(
    'MDItalicToken "%s" should be a valid italic token',
    (source) => {
      const italicToken = new MDItalicToken();
      italicToken.compile(source, 0, source.length);
      expect(italicToken.valid).toBeTruthy();
      expect(italicToken.source).toBe(source);
      expect(italicToken.children.length).toBeGreaterThanOrEqual(0);
      expect(italicToken.endCursorPosition).toBe(source.length);
    }
  );

  test.each([
    "**b**", // Incorrect indicator
    "*", // No content
    "", // Empty input
    "*i", // Missing closing indicator
    "**", // Only indicators
    "*This is italic", // Missing closing indicator
    "Text *italic* text", // Not at the start
  ])('MDItalicToken "%s" should be an invalid italic token', (source) => {
    const italicToken = new MDItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.valid).toBeFalsy();
  });

  test("MDItalicToken should handle tokens with invalid ranges", () => {
    const source = "*i*";
    const italicToken = new MDItalicToken();
    italicToken.compile(source, -1, source.length); // Invalid start
    expect(italicToken.valid).toBeFalsy();

    italicToken.compile(source, 0, -1); // Invalid end
    expect(italicToken.valid).toBeFalsy();

    italicToken.compile(source, 5, 3); // End before start
    expect(italicToken.valid).toBeFalsy();
  });

  test("MDItalicToken should handle bold within", () => {
    const italicToken = new MDItalicToken();
    const source = "*This is **bold** in the middle*";
    italicToken.compile(source, 0, source.length);
    expect(italicToken.valid).toBeTruthy();
    const children = italicToken.children;

    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("bold");
    expect(children[1].source).toStrictEqual("**bold**");
    expect(children[2].name).toStrictEqual("text");
  });

  test("MDItalicToken should correctly set start and end cursor positions for valid tokens", () => {
    const source = "*italic*";
    const italicToken = new MDItalicToken();
    italicToken.compile(source, 0, source.length);

    expect(italicToken.valid).toBeTruthy();
    expect(italicToken.startCursorPosition).toBe(0);
    expect(italicToken.endCursorPosition).toBe(source.length);
  });
});
