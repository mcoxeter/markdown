import { HeadingIndicator, NewLine } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { createMDTokenStack, MDfromAST, MDgetAST } from "../token-factory";

/**
 * The MDHeadingToken class represents a token for parsing and compiling markdown headings.
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
export class MDHeadingToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  readonly name: TokenType = "heading";
  source: string = "";
  readonly processingOrder: TokenType[] = ["bold", "italic", "text"];
  readonly children: Token[] = [];

  private headingLevel = 0;

  getAST(): IAST {
    return MDgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return MDfromAST(ast);
  }

  getHeadingLevel(): number {
    return this.headingLevel;
  }

  private isHeadingIndicator(source: string, start: PositionInSource): boolean {
    const hasIndicator =
      source.substring(start, start + HeadingIndicator.length) ===
      HeadingIndicator;

    // The heading should start at the beginning of the source or start on a new line
    const isAtStart = start === 0;
    const isStartingOnANewLine = source[start - 1] === NewLine;
    return hasIndicator && (isAtStart || isStartingOnANewLine);
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
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
    if (source[this.endCursorPosition] !== " ") {
      this.resetState();
      return;
    }

    // Process children tokens.
    let tokens = createMDTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createMDTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        if (source[this.endCursorPosition] === NewLine) {
          while (source[this.endCursorPosition] === NewLine) {
            this.endCursorPosition++;
          }
          this.valid = true;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }

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

  decompile(): string {
    const header = Array(this.headingLevel).fill("#").join("");
    return (
      header + " " + this.children.map((child) => child.decompile()).join("")
    );
  }
  // Reset the state for invalid headings
  private resetState(): void {
    this.headingLevel = 0;
    this.valid = false;
  }
}
