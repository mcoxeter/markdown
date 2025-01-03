import { expect, test, describe } from "vitest";
import { MDParagraphToken } from "./md-paragraph-token";

describe("MDParagraphToken Tests", () => {
  test("MDParagraphToken initializes correctly", () => {
    const paragraphToken = new MDParagraphToken();
    expect(paragraphToken.children).toStrictEqual([]);
    expect(paragraphToken.endCursorPosition).toBe(0);
    expect(paragraphToken.startCursorPosition).toBe(0);
    expect(paragraphToken.valid).toBe(false);
    expect(paragraphToken.processingOrder).toStrictEqual([
      "bold",
      "italic",
      "line-break",
      "text",
    ]);
    expect(paragraphToken.source).toBe("");
    expect(paragraphToken.name).toBe("paragraph");
  });

  test("MDParagraphToken has a text child after compilation", () => {
    const paragraphToken = new MDParagraphToken();
    paragraphToken.compile("example text", 0, 12);
    expect(paragraphToken.children.length).toBe(1);
    expect(paragraphToken.valid).toBeTruthy();
    expect(JSON.stringify(paragraphToken.children[0].getAST())).toBe(
      '{"type":"text","start":0,"end":12,"value":"example text","children":[]}'
    );
  });

  test("MDParagraphToken extracts source correctly", () => {
    const paragraphToken = new MDParagraphToken();
    paragraphToken.compile("example text", 0, 12);
    expect(paragraphToken.source).toStrictEqual("example text");
  });

  test("MDParagraphToken end on a double newline", () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = "Paragraph 1\n\nNext Paragraph";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.source).toStrictEqual("Paragraph 1");
  });

  test("MDParagraphToken can have several texts in it", () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = "text 1\ntext 2\ntext 3";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(5);
    expect(paragraphToken.source).toStrictEqual("text 1\ntext 2\ntext 3");
  });

  test("MDParagraphToken can have several texts delimited by soft breaks", () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = "text 1  \ntext 2\ntext 3";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(5);
    expect(children[0].name).toStrictEqual("text");
    expect(children[1].name).toStrictEqual("line-break");
    expect(children[2].name).toStrictEqual("text");
    expect(children[3].name).toStrictEqual("soft-break");
    expect(children[4].name).toStrictEqual("text");
  });

  test("MDParagraphToken can have several bold and italic with in it", () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = "*text* 1  \ntext **2**\ntext 3";
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.children;
    expect(children.length).toBe(6);
    expect(children[0].name).toStrictEqual("italic");
    expect(children[1].name).toStrictEqual("text");
    expect(children[2].name).toStrictEqual("line-break");
    expect(children[3].name).toStrictEqual("text");
    expect(children[4].name).toStrictEqual("bold");
    expect(children[5].name).toStrictEqual("text");
  });

  test("MDParagraphToken handles invalid range (start > end)", () => {
    const paragraphToken = new MDParagraphToken();
    const source = "This is invalid.";
    paragraphToken.compile(source, 10, 5);

    expect(paragraphToken.valid).toBe(false);
    expect(paragraphToken.children).toStrictEqual([]);
    expect(paragraphToken.source).toBe("");
  });
});
