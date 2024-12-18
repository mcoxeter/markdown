import { BoldIndicator } from '../constants';
import { PositionInSource, Token, TokenType } from '../../token';
import { createTokenStack } from '../token-factory';

/**
 * The BoldToken class represents a token for parsing and compiling bold text in markdown syntax.
 * It identifies and processes text wrapped with the markdown bold indicator (e.g., **).
 *
 * This class implements the Token interface and provides the following functionality:
 * - Verifies the presence and validity of bold markdown syntax within a given source text.
 * - Tracks the start and end positions of the bold syntax in the source.
 * - Compiles the bold token, processes child tokens (e.g., italic or plain text), and validates the token structure.
 * - Outputs an abstract syntax tree (AST) representation of the bold token, including its children.
 *
 * Use this class in a markdown parser to handle and validate bold text, ensuring proper nesting and structure.
 *
 * Example of bold text in markdown:
 * **Bold text**
 *
 * Bold can be mixed with italic like this.
 * **Bold and *italic***
 */
export class BoldToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'bold';
  private source: string = '';
  private processingOrder: TokenType[] = ['text', 'italic'];
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

  private isBoldIndicator(source: string, pos: PositionInSource): boolean {
    return source.substring(pos, pos + BoldIndicator.length) === BoldIndicator;
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
      !this.isBoldIndicator(source, start)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + BoldIndicator.length;

    let tokens = createTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.processingOrder);
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isBoldIndicator(source, this.endCursorPosition)) {
          this.endCursorPosition += BoldIndicator.length;
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
