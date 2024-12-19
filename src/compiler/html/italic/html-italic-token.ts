import { ItalicStartIndicator, ItalicEndIndicator } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';
import { createHTMLTokenStack } from '../token-factory';

export class HTMLItalicToken implements Token {
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

  private isItalicStartIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    return (
      source.substring(pos, pos + ItalicStartIndicator.length) ===
      ItalicStartIndicator
    );
  }

  private isItalicEndIndicator(source: string, pos: PositionInSource): boolean {
    return (
      source.substring(pos, pos + ItalicEndIndicator.length) ===
      ItalicEndIndicator
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
      !this.isItalicStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + ItalicStartIndicator.length;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isItalicEndIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += ItalicEndIndicator.length;
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
