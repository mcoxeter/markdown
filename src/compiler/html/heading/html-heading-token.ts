import { IAST, PositionInSource, Token, TokenType } from "../../token";
import {
  createHTMLTokenStack,
  HTMLfromAST,
  HTMLgetAST,
} from "../token-factory";

export class HTMLHeadingToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  source: string = "";
  readonly children: Token[] = [];
  readonly name: TokenType = "heading";
  readonly processingOrder: TokenType[] = ["bold", "italic", "text"];
  private headingLevel = 0;

  private readonly startIndicatorLength = 4;
  private readonly endIndicatorLength = 5;

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  getHeadingLevel(): number {
    return this.headingLevel;
  }

  private isHeadingStartIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    const regexMatch = source.substring(pos).match(/<h([1-6])>(.*?)<\/h\1>/);
    return regexMatch !== null && regexMatch.length > 0;
  }

  private isHeadingEndIndicator(
    source: string,
    pos: PositionInSource,
    level: number
  ): boolean {
    const check = `</h${level}>`;
    return source.substring(pos, pos + check.length) === check;
  }

  private getHeaderLevel(source: string, pos: PositionInSource): number {
    const headerRegex = /^<h([1-6])>(.*?)<\/h\1>/i;
    const match = RegExp(headerRegex).exec(source.substring(pos));
    return match ? parseInt(match[1], 10) : 0;
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
      !this.isHeadingStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.headingLevel = this.getHeaderLevel(source, start);

    this.startCursorPosition = start;
    this.endCursorPosition = start + this.startIndicatorLength;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Is End condition matched.
        if (
          this.isHeadingEndIndicator(
            source,
            this.endCursorPosition,
            this.headingLevel
          )
        ) {
          this.endCursorPosition += this.endIndicatorLength;
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
      `<h${this.headingLevel}>` +
      this.children.map((child) => child.decompile()).join("") +
      `</h${this.headingLevel}>`
    );
  }
}
