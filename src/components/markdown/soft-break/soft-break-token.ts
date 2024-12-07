/* eslint-disable @typescript-eslint/no-unused-vars */
import { SoftBreak } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';

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
    if (start < 0 || end < 0 || start > end) {
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
