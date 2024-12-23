import { PositionInSource, Token, TokenType } from '../../token';
import { BoldEndIndicator, BoldStartIndicator } from '../constants';
import { createHTMLTokenStack } from '../token-factory';

export class HTMLBoldToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'bold';
  private source: string = '';
  private processingOrder: TokenType[] = ['italic', 'text'];
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

  private isBoldStartIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + BoldStartIndicator.length) ===
      BoldStartIndicator
    );
  }

  private isBoldEndIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + BoldEndIndicator.length) === BoldEndIndicator
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
      !this.isBoldStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + BoldStartIndicator.length;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isBoldEndIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += BoldEndIndicator.length;
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
