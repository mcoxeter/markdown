import { ElementStartIndicator } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { HTMLfromAST, HTMLgetAST } from "../token-factory";

export class HTMLTextToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  source: string = "";
  readonly children: Token[] = [];
  readonly name: TokenType = "text";
  readonly processingOrder: TokenType[] = [];

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  /**
   * Checks if a character is a termination character.
   * @param char The character to check.
   */
  private isTerminationChar(char: string): boolean {
    return new Set([ElementStartIndicator]).has(char);
  }

  private invalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return (
      typeof source !== "string" ||
      typeof start !== "number" ||
      typeof end !== "number" ||
      start < 0 ||
      end < start
    );
  }

  /**
   * Compiles the token from the source text and sets its validity.
   * @param source The source text.
   * @param start The starting position in the source.
   * @param end The ending position in the source.
   */
  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (this.invalidArgs(source, start, end)) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start;
    const initialChar = source[start];
    if (this.isTerminationChar(initialChar)) {
      while (
        this.endCursorPosition < end &&
        source[this.endCursorPosition] === initialChar
      ) {
        this.endCursorPosition++;
      }
    }

    // Handle normal text tokens, stopping at termination characters or newlines.
    while (
      this.endCursorPosition < end &&
      !this.isTerminationChar(source[this.endCursorPosition])
    ) {
      this.endCursorPosition++;
    }

    this.source = source.substring(start, this.endCursorPosition);

    this.valid = this.source.length > 0;
  }

  decompile(): string {
    return this.source;
  }
}
