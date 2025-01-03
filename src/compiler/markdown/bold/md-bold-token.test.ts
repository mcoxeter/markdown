import { expect, test, describe } from "vitest";
import { MDBoldToken } from "./md-bold-token";

describe("MDBoldToken Initialization", () => {
  test("MDBoldToken should initialize correctly", () => {
    const boldToken = new MDBoldToken();
    expect(boldToken.children).toStrictEqual([]);
    expect(boldToken.endCursorPosition).toBe(0);
    expect(boldToken.startCursorPosition).toBe(0);
    expect(boldToken.valid).toBeFalsy();
    expect(boldToken.processingOrder).toStrictEqual(["italic", "text"]);
    expect(boldToken.source).toBe("");
    expect(boldToken.name).toBe("bold");
  });
});

describe("MDBoldToken Validation", () => {
  test.each(["**b**", "**This *is* bold**", "**This *is bold***"])(
    'MDBoldToken "%s" should be a valid bold token',
    (source) => {
      const boldToken = new MDBoldToken();
      boldToken.compile(source, 0, source.length);
      expect(boldToken.valid).toBeTruthy();
      expect(boldToken.source).toBe(source);
      expect(boldToken.children.length).toBeGreaterThanOrEqual(0);
      expect(boldToken.endCursorPosition).toBe(source.length);
    }
  );

  test.each([
    "*b*", // Incorrect indicator
    "**", // No content
    "", // Empty input
    "**b", // Missing closing indicator
    "****", // Only indicators
    "**This is bold", // Missing closing indicator
    "Text **bold** text", // Not at the start
  ])('MDBoldToken "%s" should be an invalid bold token', (source) => {
    const boldToken = new MDBoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.valid).toBeFalsy();
  });

  test("MDBoldToken should handle tokens with invalid ranges", () => {
    const source = "**b**";
    const boldToken = new MDBoldToken();
    boldToken.compile(source, -1, source.length); // Invalid start
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile(source, 0, -1); // Invalid end
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile(source, 5, 3); // End before start
    expect(boldToken.valid).toBeFalsy();
  });

  test("MDBoldToken should handle empty or whitespace-only input", () => {
    const boldToken = new MDBoldToken();
    boldToken.compile("", 0, 0);
    expect(boldToken.valid).toBeFalsy();

    boldToken.compile("   ", 0, 3);
    expect(boldToken.valid).toBeFalsy();
  });

  test("MDBoldToken should handle italic within", () => {
    const boldToken = new MDBoldToken();
    const source = "**This is *italic* in the middle**";
    boldToken.compile(source, 0, source.length);
    expect(boldToken.valid).toBeTruthy();
    const children = boldToken.children;

    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("italic");
    expect(children[1].source).toStrictEqual("*italic*");
    expect(children[2].name).toStrictEqual("text");
  });

  test("MDBoldToken should correctly set start and end cursor positions for valid tokens", () => {
    const source = "**bold**";
    const boldToken = new MDBoldToken();
    boldToken.compile(source, 0, source.length);

    expect(boldToken.valid).toBeTruthy();
    expect(boldToken.startCursorPosition).toBe(0);
    expect(boldToken.endCursorPosition).toBe(source.length);
  });
});
