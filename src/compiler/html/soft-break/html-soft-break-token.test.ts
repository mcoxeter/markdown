import { expect, test, describe } from "vitest";
import { HTMLSoftBreakToken } from "./html-soft-break-token";

describe("HTMLSoftBreakToken Tests", () => {
  test("HTMLSoftBreakToken initializes correctly", () => {
    const softbreakToken = new HTMLSoftBreakToken();
    expect(softbreakToken.children).toStrictEqual([]);
    expect(softbreakToken.endCursorPosition).toBe(0);
    expect(softbreakToken.startCursorPosition).toBe(0);
    expect(softbreakToken.valid).toBe(false);
    expect(softbreakToken.processingOrder).toStrictEqual([]);
    expect(softbreakToken.source).toBe("");
    expect(softbreakToken.name).toBe("soft-break");
  });

  test("HTMLSoftBreakToken has a text child after compilation", () => {
    const softbreakToken = new HTMLSoftBreakToken();
    softbreakToken.compile("not a softbreak", 0, 15);
    expect(softbreakToken.valid).toBe(false);
  });

  test("HTMLSoftBreakToken is valid", () => {
    const softbreakToken = new HTMLSoftBreakToken();
    softbreakToken.compile("<br />", 0, 2);
    expect(softbreakToken.valid).toBe(true);
  });
});
