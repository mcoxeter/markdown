import { expect, test, describe } from "vitest";
import { HTMLParagraphToken } from "./html-paragraph-token";

describe("HTMLParagraphToken Tests", () => {
  test("HTMLParagraphToken initializes correctly", () => {
    const paragraphToken = new HTMLParagraphToken();
    expect(paragraphToken.children).toStrictEqual([]);
    expect(paragraphToken.endCursorPosition).toBe(0);
    expect(paragraphToken.startCursorPosition).toBe(0);
    expect(paragraphToken.valid).toBe(false);
    expect(paragraphToken.processingOrder).toStrictEqual([
      "bold",
      "italic",
      "soft-break",
      "paragraph",
      "text",
    ]);
    expect(paragraphToken.source).toBe("");
    expect(paragraphToken.name).toBe("paragraph");
  });

  test("HTMLParagraphToken has a text child after compilation", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p>example text</p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.children.length).toBe(1);
    expect(paragraphToken.valid).toBeTruthy();
    expect(JSON.stringify(paragraphToken.children[0].getAST())).toBe(
      '{"type":"text","start":3,"end":15,"value":"example text","children":[]}'
    );
  });

  test("HTMLParagraphToken extracts source correctly", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p>example text</p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.source).toStrictEqual(rawSource);
  });

  test("HTMLParagraphToken ends on a single paragraph", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p>Paragraph 1</p><p>Next Paragraph</p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.source).toStrictEqual("<p>Paragraph 1</p>");
  });

  test("HTMLParagraphToken can have several paragraphs in it", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p>text<p>text<p>ntext 3</p></p></p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(2);
    expect(paragraphToken.source).toStrictEqual(
      "<p>text<p>text<p>ntext 3</p></p></p>"
    );
  });

  test("HTMLParagraphToken can have several texts delimited by soft breaks", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p>text 1<br />text 2\ntext 3</p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(3);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("soft-break");
    expect(children[2].name).toStrictEqual("text");
    expect(children[2].source).toStrictEqual("text 2\ntext 3");
  });

  test("HTMLParagraphToken can have several bold and italic with in it", () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = "<p><i>text</i> 1  \ntext <b>2</b>\ntext 3</p>";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(4);
    expect(children[0].name).toStrictEqual("italic");
    expect(children[1].name).toStrictEqual("text");
    expect(children[2].name).toStrictEqual("bold");
    expect(children[3].name).toStrictEqual("text");
  });

  test("HTMLParagraphToken handles invalid range (start > end)", () => {
    const paragraphToken = new HTMLParagraphToken();
    const source = "This is invalid.";
    paragraphToken.compile(source, 10, 5);

    expect(paragraphToken.valid).toBe(false);
    expect(paragraphToken.children).toStrictEqual([]);
    expect(paragraphToken.source).toBe("");
  });
});
