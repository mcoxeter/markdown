import { LineBreak, SoftBreak } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { MDgetAST, MDfromAST } from "../token-factory";

/**
 * The MDSoftBreakToken class represents a token for identifying and processing soft breaks in markdown syntax.
 * A soft break occurs when two consecutive spaces appear at the end of a line, signaling a line break without starting a new paragraph.
 *
 * This class implements the Token interface and provides the following functionality:
 * - Detects and validates the presence of a soft break in the source text.
 * - Tracks the start and end positions of the soft break in the source.
 * - Marks the token as valid only if it represents a valid soft break structure (e.g., exactly two spaces before a line break).
 * - Outputs an abstract syntax tree (AST) representation of the soft break token.
 *
 * Use this class in a markdown parser to handle soft breaks, ensuring they are correctly interpreted as line breaks while preserving paragraph continuity.
 */
export class MDLineBreakToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  readonly name: TokenType = "line-break";
  source: string = "";

  readonly processingOrder: TokenType[] = [];
  readonly children: Token[] = [];

  getAST(): IAST {
    return MDgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return MDfromAST(ast);
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
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
    if (this.areInvalidArgs(source, start, end)) {
      this.valid = false;
      return;
    }
    this.startCursorPosition = start;
    this.endCursorPosition = this.startCursorPosition;
    this.valid =
      end - start > 1 &&
      source.substring(start, start + LineBreak.length) === LineBreak;

    this.endCursorPosition = this.valid ? start + 2 : start;
    this.source = source.substring(start, this.endCursorPosition);
  }
  decompile(): string {
    return `  `;
  }
}
