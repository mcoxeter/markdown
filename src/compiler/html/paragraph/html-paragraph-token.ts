import { ParagraphStartIndicator, ParagraphEndIndicator } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import {
  createHTMLTokenStack,
  HTMLfromAST,
  HTMLgetAST,
} from "../token-factory";

export class HTMLParagraphToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  source: string = "";
  readonly children: Token[] = [];
  readonly name: TokenType = "paragraph";
  readonly processingOrder: TokenType[] = [
    "bold",
    "italic",
    "soft-break",
    "paragraph",
    "text",
  ];

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  private isParagraphStartIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    return (
      source.substring(pos, pos + ParagraphStartIndicator.length) ===
      ParagraphStartIndicator
    );
  }

  private isParagraphEndIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    return (
      source.substring(pos, pos + ParagraphEndIndicator.length) ===
      ParagraphEndIndicator
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
      !this.isParagraphStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + ParagraphStartIndicator.length;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Is End condition matched.
        if (this.isParagraphEndIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += ParagraphEndIndicator.length;
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
    return (
      `<p>` + this.children.map((child) => child.decompile()).join("") + `</p>`
    );
  }
}
