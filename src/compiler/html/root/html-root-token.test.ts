import { expect, test, describe } from "vitest";
import { HTMLRootToken } from "./html-root-token";

describe("HTMLRootToken Tests", () => {
  test("HTMLRootToken initializes correctly", () => {
    const token = new HTMLRootToken();
    expect(token.children).toStrictEqual([]);
    expect(token.endCursorPosition).toBe(0);
    expect(token.startCursorPosition).toBe(0);
    expect(token.valid).toBe(false);
    expect(token.processingOrder).toStrictEqual([
      "heading",
      "paragraph",
      "bold",
      "italic",
      "text",
    ]);
    expect(token.source).toBe("");
    expect(token.name).toBe("root");
  });

  test("HTMLRootToken compiles to two paragraphs", () => {
    const token = new HTMLRootToken();
    const rawSource = "<p>paragraph1\nhello</p><p>paragraph2</p>";
    token.compile(rawSource, 0, rawSource.length);
    expect(token.source).toStrictEqual(
      "<p>paragraph1\nhello</p><p>paragraph2</p>"
    );
    const children = token.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toStrictEqual("paragraph");
    expect(children[0].source).toStrictEqual("<p>paragraph1\nhello</p>");
    expect(children[1].name).toStrictEqual("paragraph");
    expect(children[1].source).toStrictEqual("<p>paragraph2</p>");
  });

  test("HTMLRootToken compiles to a heading and a paragraph", () => {
    const token = new HTMLRootToken();
    const rawSource = "<h1>heading 1</h1>\n<p>Hello</p>";
    token.compile(rawSource, 0, rawSource.length);
    expect(token.source).toStrictEqual("<h1>heading 1</h1>\n<p>Hello</p>");
    const children = token.children;
    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("heading");
    expect(children[0].source).toStrictEqual("<h1>heading 1</h1>");
    expect(children[1].name).toStrictEqual("text");
    expect(children[1].source).toStrictEqual("\n");
    expect(children[2].name).toStrictEqual("paragraph");
    expect(children[2].source).toStrictEqual("<p>Hello</p>");
  });
  test("HTMLRootToken compiles to a paragraph and a heading", () => {
    const token = new HTMLRootToken();
    const rawSource = "<p>one</p>\n<h3>heading 3</h3>";
    token.compile(rawSource, 0, rawSource.length);
    expect(token.source).toStrictEqual("<p>one</p>\n<h3>heading 3</h3>");
    const children = token.children;
    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("paragraph");
    expect(children[0].source).toStrictEqual("<p>one</p>");
    expect(children[1].name).toStrictEqual("text");
    expect(children[1].source).toStrictEqual("\n");
    expect(children[2].name).toStrictEqual("heading");
    expect(children[2].source).toStrictEqual("<h3>heading 3</h3>");
  });
});
