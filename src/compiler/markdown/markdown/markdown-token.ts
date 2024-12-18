import { PositionInSource, Token, TokenType } from '../../token';
import { createTokenStack } from '../token-factory';

/**
 * The MarkdownToken class serves as the root token in a markdown parser, representing the entirety of a markdown document.
 *
 * This class is responsible for:
 * - Orchestrating the parsing process by delegating to child tokens, such as paragraphs, headings, or inline elements, in a specified processing order.
 * - Managing the start and end positions of the parsed document within the source text.
 * - Validating the structure of the markdown content and compiling it into a hierarchical structure of child tokens.
 * - Providing an abstract syntax tree (AST) representation of the parsed markdown document for further processing or rendering.
 *
 * The MarkdownToken acts as the entry point for parsing a markdown source string, ensuring all nested tokens are processed and assembled into a cohesive token tree.
 * Use this class in markdown parsers to handle and process the entire markdown content.
 */
export class MarkdownToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'root';
  private source: string = '';
  private processingOrder: TokenType[] = ['paragraph'];
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

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== 'string' || start < 0 || end < start;
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

    let tokens = createTokenStack(this.processingOrder);

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.processingOrder);
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
