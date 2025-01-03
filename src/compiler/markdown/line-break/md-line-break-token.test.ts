import { expect, test, describe } from "vitest";
import { MDLineBreakToken } from "./md-line-break-token";

describe("MDLineBreakToken Tests", () => {
  test("MDLineBreakToken initializes correctly", () => {
    const softbreakToken = new MDLineBreakToken();
    expect(softbreakToken.children).toStrictEqual([]);
    expect(softbreakToken.endCursorPosition).toBe(0);
    expect(softbreakToken.startCursorPosition).toBe(0);
    expect(softbreakToken.valid).toBe(false);
    expect(softbreakToken.processingOrder).toStrictEqual([]);
    expect(softbreakToken.source).toBe("");
    expect(softbreakToken.name).toBe("line-break");
  });

  test("MDLineBreakToken has a text child after compilation", () => {
    const softbreakToken = new MDLineBreakToken();
    softbreakToken.compile("not a linebreak", 0, 15);
    expect(softbreakToken.valid).toBe(false);
  });

  test("MDLineBreakToken has a two spaces", () => {
    const softbreakToken = new MDLineBreakToken();
    softbreakToken.compile("  ", 0, 2);
    expect(softbreakToken.valid).toBe(true);
  });
});
