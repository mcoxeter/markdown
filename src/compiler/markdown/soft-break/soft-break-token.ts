import { SoftBreak } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';

/**
 * The SoftBreakToken class represents a token for identifying and processing soft breaks in markdown syntax.
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
export class SoftBreakToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'soft-break';
  private source: string = '';

  private children: Token[] = [];
  /**
   * Specifies the order in which this token processes child tokens.
   */
  getProcessingOrder(): TokenType[] {
    return [];
  }

  getChildren(): Token[] {
    return this.children;
  }

  getStartCursorPosition(): PositionInSource {
    return this.startCursorPosition;
  }

  getEndCursorPosition(): PositionInSource {
    return this.endCursorPosition;
  }
  isValid(): boolean {
    return this.valid;
  }
  getName(): TokenType {
    return this.name;
  }
  getTokenSource(): string {
    return this.source;
  }

  /**
   * Returns an abstract syntax tree (AST) representation of the token as a JSON string.
   */ getAST(): string {
    return JSON.stringify(this);
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== 'string' || start < 0 || end < start;
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
      source[start] === SoftBreak &&
      source[start + 1] === SoftBreak;

    this.endCursorPosition = this.valid ? start + 2 : start;
    this.source = source.substring(start, this.endCursorPosition);
  }
}
