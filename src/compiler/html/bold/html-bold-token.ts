import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { BoldEndIndicator, BoldStartIndicator } from "../constants";
import {
  createHTMLTokenStack,
  HTMLfromAST,
  HTMLgetAST,
} from "../token-factory";

export class HTMLBoldToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  source: string = "";
  readonly name: TokenType = "bold";
  readonly children: Token[] = [];
  readonly processingOrder: TokenType[] = ["italic", "text"];

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  private isBoldStartIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + BoldStartIndicator.length) ===
      BoldStartIndicator
    );
  }

  private isBoldEndIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + BoldEndIndicator.length) === BoldEndIndicator
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
      !this.isBoldStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + BoldStartIndicator.length;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Is End condition matched.
        if (this.isBoldEndIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += BoldEndIndicator.length;
          this.valid = true;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }
      }
    }
    // If we exit the loop, the token is invalid.
    this.valid = false;
  }

  decompile(): string {
    return `<b>${this.children.map((child) => child.decompile()).join("")}</b>`;
  }
}
