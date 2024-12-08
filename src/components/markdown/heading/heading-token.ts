import { HeadingIndicator, NewLine } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class HeadingToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'heading';
  private source: string = '';
  private processingOrder: TokenType[] = ['text', 'bold', 'italic'];
  private children: Token[] = [];

  private headingLevel = 0;
  getProcessingOrder(): TokenType[] {
    return this.processingOrder;
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

  getHeadingLevel(): number {
    return this.headingLevel;
  }

  private isHeadingIndicator(source: string, start: PositionInSource): boolean {
    return (
      source.substring(start, start + HeadingIndicator.length) ===
      HeadingIndicator
    );
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== 'string' || start < 0 || end < start;
  }

  private countHeadingIndicators(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): number {
    let level = 0;
    let cursor = start;

    while (cursor < end && source[cursor] === HeadingIndicator) {
      cursor++;
      level++;
    }
    return level;
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (
      this.areInvalidArgs(source, start, end) ||
      !this.isHeadingIndicator(source, start)
    ) {
      this.resetState();
      return;
    }

    this.startCursorPosition = start;

    // Determine the heading level
    const level = this.countHeadingIndicators(source, start, end);
    this.headingLevel = level;
    this.endCursorPosition = start + level;

    // A valid heading must be followed by a space.
    if (source[this.endCursorPosition] !== ' ') {
      this.resetState();
      return;
    }

    // Process children tokens.
    let tokens = createTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Check for the end of the heading.
        if (
          source[this.endCursorPosition] === NewLine ||
          this.endCursorPosition >= end
        ) {
          this.valid = true;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }
      }
    }
  }
  // Reset the state for invalid headings
  private resetState(): void {
    this.headingLevel = 0;
    this.valid = false;
  }
}
