import { Backtick, Hash, NewLine, Star } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';

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
    // Validate input positions.
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

    // Trim trailing whitespace from the token's source.
    const untrimmedSource = source.substring(start, this.endCursorPosition);
    const trimmedSource = untrimmedSource.trimEnd();

    this.source = trimmedSource;
    this.endCursorPosition -= untrimmedSource.length - trimmedSource.length;
    this.valid = true;
  }
}
