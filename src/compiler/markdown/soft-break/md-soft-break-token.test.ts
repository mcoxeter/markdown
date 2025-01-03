import { expect, test, describe } from "vitest";
import { MDSoftBreakToken } from "./md-soft-break-token";
import { SoftBreak } from "../constants";

describe("MDSoftBreakToken Tests", () => {
  test("MDSoftBreakToken initializes correctly", () => {
    const softbreakToken = new MDSoftBreakToken();
    expect(softbreakToken.children).toStrictEqual([]);
    expect(softbreakToken.endCursorPosition).toBe(0);
    expect(softbreakToken.startCursorPosition).toBe(0);
    expect(softbreakToken.valid).toBe(false);
    expect(softbreakToken.processingOrder).toStrictEqual([]);
    expect(softbreakToken.source).toBe("");
    expect(softbreakToken.name).toBe("soft-break");
  });

  test("MDSoftBreakToken has a text child after compilation", () => {
    const softbreakToken = new MDSoftBreakToken();
    softbreakToken.compile("not a softbreak", 0, 15);
    expect(softbreakToken.valid).toBe(false);
  });

  test("MDSoftBreakToken has a two spaces", () => {
    const softbreakToken = new MDSoftBreakToken();
    softbreakToken.compile(SoftBreak, 0, 2);
    expect(softbreakToken.valid).toBe(true);
  });
});
