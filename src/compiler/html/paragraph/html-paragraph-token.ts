import { ParagraphStartIndicator, ParagraphEndIndicator } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';
import { createHTMLTokenStack } from '../token-factory';

export class HTMLParagraphToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'paragraph';
  private source: string = '';
  private processingOrder: TokenType[] = [
    'bold',
    'italic',
    'soft-break',
    'paragraph',
    'text'
  ];

  private children: Token[] = [];
  /**
   * Specifies the order in which this token processes child tokens.
   */
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

  private isParagraphStartIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    return (
      source.substring(pos, pos + ParagraphStartIndicator.length) ===
      ParagraphStartIndicator
    );
  }

  private isParagraphEndIndicator(
    source: string,
    pos: PositionInSource
  ): boolean {
    return (
      source.substring(pos, pos + ParagraphEndIndicator.length) ===
      ParagraphEndIndicator
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
      !this.isParagraphStartIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + ParagraphStartIndicator.length;

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isParagraphEndIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += ParagraphEndIndicator.length;
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
