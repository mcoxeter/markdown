import { BoldToken } from '../bold/bold-token';
import { ItalicIndicator } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class ItalicToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'italic';
  private source: string = '';
  private processingOrder: TokenType[] = ['text', 'bold'];
  private children: Token[] = [];
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

  private isItalicIndicator(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    // The italicIndicator can give a false positive with the bold token.
    // So only check if the next token is not a bold token.
    const boldToken = new BoldToken();
    boldToken.compile(source, start, end);
    if (boldToken.isValid()) {
      return false;
    }
    return (
      source.substring(start, start + ItalicIndicator.length) ===
      ItalicIndicator
    );
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== 'string' || start < 0 || end < start;
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (
      this.areInvalidArgs(source, start, end) ||
      !this.isItalicIndicator(source, start, end)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + ItalicIndicator.length;

    let tokens = createTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isItalicIndicator(source, this.endCursorPosition, end)) {
          this.endCursorPosition += ItalicIndicator.length;
          this.valid = true;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }
      }
    }
    // If we exit the loop, the token is invalid.
    this.valid = false;
  }
}
