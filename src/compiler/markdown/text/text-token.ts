import { Backtick, Hash, NewLine, Star } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';

/**
 * The TextToken class represents a token for parsing and compiling plain text in markdown syntax.
 * It processes non-formatted text, which serves as the foundational content between other markdown elements.
 *
 * This class implements the Token interface and provides the following functionality:
 * - Identifies and compiles plain text while avoiding termination characters (e.g., *, #, `) and line breaks.
 * - Tracks the start and end positions of the text in the source content.
 * - Validates the token to ensure it represents meaningful content.
 * - Handles special cases such as consecutive termination characters and trailing spaces before a line break.
 * - Outputs an abstract syntax tree (AST) representation of the text token.
 *
 * Use this class in a markdown parser as the base token to process and validate plain text content,
 * ensuring proper integration with other tokens in the processing order.
 *
 * Tokens are processed in a specific order and the TextToken is the last in the line.
 * A TextToken has no child tokens.
 *
 * Example of a paragraph in markdown:
 * some text
 */
export class TextToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'text';
  private source: string = '';

  private children: Token[] = [];
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

  getAST(): string {
    return JSON.stringify(this);
  }

  /**
   * Checks if a character is a termination character.
   * @param char The character to check.
   */
  private isTerminationChar(char: string): boolean {
    return new Set([Star, Hash, Backtick]).has(char);
  }

  private invalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return (
      typeof source !== 'string' ||
      typeof start !== 'number' ||
      typeof end !== 'number' ||
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

    // Case 1: Handle tokens starting with termination characters.
    //         Consumes all consecutive occurrences of the same character
    const initialChar = source[start];
    if (this.isTerminationChar(initialChar)) {
      while (
        this.endCursorPosition < end &&
        source[this.endCursorPosition] === initialChar
      ) {
        this.endCursorPosition++;
      }
      this.source = source.substring(start, this.endCursorPosition);
      this.valid = true;
      return;
    }

    // Case 2: Handle normal text tokens, stopping at termination characters or newlines.
    while (
      this.endCursorPosition < end &&
      !this.isTerminationChar(source[this.endCursorPosition]) &&
      source[this.endCursorPosition] !== NewLine
    ) {
      this.endCursorPosition++;
    }

    this.source = source.substring(start, this.endCursorPosition);

    // Case 3: When the token ends with a double space at the end of the line.
    if (
      this.source.endsWith('  ') &&
      source.substring(this.endCursorPosition, this.endCursorPosition + 1) ===
        '\n'
    ) {
      this.source = this.source.trimEnd();
      this.endCursorPosition -= 2;
    }
    this.valid = this.source.length > 0;
  }
}
