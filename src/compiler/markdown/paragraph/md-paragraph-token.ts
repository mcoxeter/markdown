import { EmptyLine, NewLine } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';
import { createMDTokenStack } from '../token-factory';

/**
 *
 *
 * Example of a paragraph in markdown (paragraphs are seperated by one or more blank lines):
 * a paragraph
 *
 * a second paragraph
 */
export class MDParagraphToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'paragraph';
  private source: string = '';
  private processingOrder: TokenType[] = [
    'bold',
    'italic',
    'soft-break',
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

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== 'string' || start < 0 || end < start;
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
    if (this.areInvalidArgs(source, start, end)) {
      this.valid = false;
      return;
    }
    this.startCursorPosition = start;
    this.endCursorPosition = this.startCursorPosition;
    this.valid = true;

    let tokens = createMDTokenStack(this.getProcessingOrder());

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createMDTokenStack(this.getProcessingOrder());
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
