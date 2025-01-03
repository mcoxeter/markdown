import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { SoftBreakIndicator } from "../constants";
import { HTMLfromAST, HTMLgetAST } from "../token-factory";

export class HTMLSoftBreakToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  source: string = "";
  readonly children: Token[] = [];
  readonly name: TokenType = "soft-break";

  readonly processingOrder: TokenType[] = [];

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  private isSoftBreakIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + SoftBreakIndicator.length) ===
      SoftBreakIndicator
    );
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (
      this.areInvalidArgs(source, start, end) ||
      !this.isSoftBreakIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + SoftBreakIndicator.length;
    this.source = source.substring(start, this.endCursorPosition);

    this.valid = true;
  }
}
