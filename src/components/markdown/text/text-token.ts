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

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    this.startCursorPosition = start;
    this.endCursorPosition = this.startCursorPosition;

    if (start > end) {
      this.valid = false;
      return;
    }
    this.valid = true;

    const terminationChars = new Set([Star, Hash, Backtick]);
    const isTerminationChar = (char: string): boolean =>
      terminationChars.has(char);

    /**
     * Case 1: If the token starts with a termination character, it consumes all
     * consecutive occurrences of the same character until a different character
     * or the end of the source is reached.
     */
    if (isTerminationChar(source[start])) {
      const initialChar = source[start];
      while (
        this.endCursorPosition < end &&
        source[this.endCursorPosition] === initialChar
      ) {
        this.endCursorPosition++;
      }
      this.source = source.substring(start, this.endCursorPosition);
      return;
    }

    /**
     * Case 2: Normal flow where the token consumes characters until a
     * termination character is encountered or the end of the range is reached.
     * The termination character is not included in the token.
     */
    while (
      this.endCursorPosition < end &&
      !isTerminationChar(source[this.endCursorPosition]) &&
      source[this.endCursorPosition] !== NewLine
    ) {
      this.endCursorPosition++;
    }

    this.source = source.substring(start, this.endCursorPosition);
    // if (source[this.endCursorPosition] === NewLine) {
    //   // When terminating of a newline charater, move the endCursorPosition past it.
    //   this.endCursorPosition++;
    // }
  }
}
