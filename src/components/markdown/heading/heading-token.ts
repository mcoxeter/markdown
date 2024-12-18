import { HeadingIndicator, NewLine } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

/**
 * The HeadingToken class represents a token for parsing and compiling markdown headings.
 * It identifies and processes heading syntax (e.g., #, ##, ###) and its content, including any nested formatting.
 *
 * This class implements the Token interface and provides the following functionality:
 * - Detects markdown heading indicators (#) and determines the heading level (1-6).
 * - Verifies the validity of heading syntax (e.g., ensuring it is followed by a space).
 * - Tracks the start and end positions of the heading in the source text.
 * - Processes child tokens (e.g., bold, italic, text) within the heading content.
 * - Outputs an abstract syntax tree (AST) representation of the heading token, including its level and child tokens.
 *
 * Use this class in a markdown parser to handle and validate heading structures, ensuring proper syntax and nesting.
 *
 * Examples of a heading in markdown:
 * # Heading level 1
 * ## Heading level 2
 * ...
 * ###### Heading level 6
 *
 * Heading can be mixed with bold and italic like this.
 * # Heading **level 1**
 * # Heading *level 1*
 * # Heading ***level** 1*
 */
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
