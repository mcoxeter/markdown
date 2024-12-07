/* eslint-disable @typescript-eslint/no-unused-vars */
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class MarkdownToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'markdown';
  private source: string = '';

  private children: Token[] = [];
  getProcessingOrder(): TokenType[] {
    return ['paragraph', 'text'];
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

        // Exit condition 1: Reached the end of the source.
        if (this.hasReachedSourceEnd(end)) {
          this.source = source.substring(
            token.getStartCursorPosition(),
            this.endCursorPosition
          );
          return;
        }
      }
    }
  }
}