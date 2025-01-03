import { expect, test, describe } from "vitest";
import { HTMLItalicToken } from "./html-italic-token";

describe("HTMLItalicToken Initialization", () => {
  test("HTMLItalicToken should initialize correctly", () => {
    const italicToken = new HTMLItalicToken();
    expect(italicToken.children).toStrictEqual([]);
    expect(italicToken.endCursorPosition).toBe(0);
    expect(italicToken.startCursorPosition).toBe(0);
    expect(italicToken.valid).toBeFalsy();
    expect(italicToken.processingOrder).toStrictEqual(["bold", "text"]);
    expect(italicToken.source).toBe("");
    expect(italicToken.name).toBe("italic");
  });
});

describe("HTMLItalicToken Validation", () => {
  test.each([
    "<i>i</i>",
    "<i>This <b>is</b> italic</i>",
    "<i>This <b>is italic and bold</b></i>",
  ])('HTMLItalicToken "%s" should be a valid italic token', (source) => {
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.valid).toBeTruthy();
    expect(italicToken.source).toBe(source);
    expect(italicToken.children.length).toBeGreaterThanOrEqual(0);
    expect(italicToken.endCursorPosition).toBe(source.length);
  });

  test.each([
    "<b>b</b>", // Incorrect indicator
    "<i></i>", // No content
    "", // Empty input
    "<i>i", // Missing closing indicator
    "<b>", // Only indicators
    "<i>This is italic", // Missing closing indicator
    "Text <i>italic</i> text", // Not at the start
  ])('HTMLItalicToken "%s" should be an invalid italic token', (source) => {
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.valid).toBeFalsy();
  });

  test("HTMLItalicToken should handle tokens with invalid ranges", () => {
    const source = "<i>i</i>";
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, -1, source.length); // Invalid start
    expect(italicToken.valid).toBeFalsy();

    italicToken.compile(source, 0, -1); // Invalid end
    expect(italicToken.valid).toBeFalsy();

    italicToken.compile(source, 5, 3); // End before start
    expect(italicToken.valid).toBeFalsy();
  });

  test("HTMLItalicToken should handle bold within", () => {
    const italicToken = new HTMLItalicToken();
    const source = "<i>This is <b>bold</b> in the middle</i>";
    italicToken.compile(source, 0, source.length);
    expect(italicToken.valid).toBeTruthy();
    const children = italicToken.children;

    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("bold");
    expect(children[1].source).toStrictEqual("<b>bold</b>");
    expect(children[2].name).toStrictEqual("text");
  });

  test("HTMLItalicToken should correctly set start and end cursor positions for valid tokens", () => {
    const source = "<i>italic</i>";
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);

    expect(italicToken.valid).toBeTruthy();
    expect(italicToken.startCursorPosition).toBe(0);
    expect(italicToken.endCursorPosition).toBe(source.length);
  });
});
