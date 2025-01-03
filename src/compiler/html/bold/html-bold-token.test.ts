import { expect, test, describe } from "vitest";
import { HTMLBoldToken } from "./html-bold-token";

describe("HTMLBoldToken Initialization", () => {
  test("HTMLBoldToken should initialize correctly", () => {
    const boldToken = new HTMLBoldToken();
    expect(boldToken.children).toStrictEqual([]);
    expect(boldToken.endCursorPosition).toBe(0);
    expect(boldToken.startCursorPosition).toBe(0);
    expect(boldToken.valid).toBeFalsy();
    expect(boldToken.processingOrder).toStrictEqual(["italic", "text"]);
    expect(boldToken.source).toBe("");
    expect(boldToken.name).toBe("bold");
  });
});

describe("HTMLBoldToken Validation", () => {
  test.each([
    "<b>b</b>",
    "<b>This <i>is</i> bold</b>",
    "<b>This <i>is bold</i></b>",
  ])('HTMLBoldToken "%s" should be a valid bold token', (source) => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.valid).toBeTruthy();
    expect(boldToken.source).toBe(source);
    expect(boldToken.children.length).toBeGreaterThanOrEqual(0);
    expect(boldToken.endCursorPosition).toBe(source.length);
  });

  test.each([
    "<i>i</i>", // Incorrect indicator
    "<b></b>", // No content
    "", // Empty input
    "<b>b", // Missing closing indicator
    "<b><b>", // Only indicators
    "<b>This is bold", // Missing closing indicator
    "Text <b>bold</b> text", // Not at the start
  ])('HTMLBoldToken "%s" should be an invalid bold token', (source) => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.valid).toBeFalsy();
  });

  test("HTMLBoldToken should handle tokens with invalid ranges", () => {
    const source = "<b>b</b>";
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, -1, source.length); // Invalid start
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile(source, 0, -1); // Invalid end
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile(source, 5, 3); // End before start
    expect(boldToken.valid).toBeFalsy();
  });

  test("HTMLBoldToken should handle empty or whitespace-only input", () => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile("", 0, 0);
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile("   ", 0, 3);
    expect(boldToken.valid).toBeFalsy();
  });

  test("HTMLBoldToken should handle italic within", () => {
    const boldToken = new HTMLBoldToken();
    const source = "<b>This is <i>italic</i> in the middle</b>";
    boldToken.compile(source, 0, source.length);
    expect(boldToken.valid).toBeTruthy();
    const children = boldToken.children;

    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("italic");
    expect(children[1].source).toStrictEqual("<i>italic</i>");
    expect(children[2].name).toStrictEqual("text");
  });

  test("HTMLBoldToken should correctly set start and end cursor positions for valid tokens", () => {
    const source = "<b>bold</b>";
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);

    expect(boldToken.valid).toBeTruthy();
    expect(boldToken.startCursorPosition).toBe(0);
    expect(boldToken.endCursorPosition).toBe(source.length);
  });
});
