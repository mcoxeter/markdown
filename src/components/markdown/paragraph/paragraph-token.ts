/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmptyLine, NewLine } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class ParagraphToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'paragraph';
  private source: string = '';
  private proccessingOrder: TokenType[] = ['text', 'soft-break'];

  private children: Token[] = [];
  /**
   * Specifies the order in which this token processes child tokens.
   */
  getProcessingOrder(): TokenType[] {
    return this.proccessingOrder;
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

  private isEndOfParagraph(source: string): boolean {
    return (
      source.substring(this.endCursorPosition, this.endCursorPosition + 2) ===
      EmptyLine
    );
  }

  private hasReachedSourceEnd(end: PositionInSource): boolean {
    return this.endCursorPosition >= end;
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (start > end) {
      this.valid = false;
      return;
    }
    this.startCursorPosition = start;
    this.endCursorPosition = this.startCursorPosition;
    this.valid = true;

    let tokens = createTokenStack(this.getProcessingOrder());

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.getProcessingOrder());
        this.endCursorPosition = token.getEndCursorPosition();

        // Exit condition 1: End of paragraph (empty line).
        if (this.isEndOfParagraph(source)) {
          this.source = source.substring(start, this.endCursorPosition);
          this.endCursorPosition += 2; // Move past the empty line.
          return;
        }

        // Exit condition 2: Reached the end of the source.
        if (this.hasReachedSourceEnd(end)) {
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }

        if (
          source.substring(
            this.endCursorPosition,
            this.endCursorPosition + 1
          ) === NewLine
        ) {
          this.endCursorPosition++; // Move past NewLine.
        }
      }
    }
  }
}
