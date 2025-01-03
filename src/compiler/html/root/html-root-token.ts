import { IAST, PositionInSource, Token, TokenType } from "../../token";
import {
  createHTMLTokenStack,
  HTMLfromAST,
  HTMLgetAST,
} from "../token-factory";

/**
 * The MDRootToken class serves as the root token in a markdown parser, representing the entirety of a markdown document.
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
export class HTMLRootToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  readonly name: TokenType = "root";
  source: string = "";
  readonly processingOrder: TokenType[] = [
    "heading",
    "paragraph",
    "bold",
    "italic",
    "text",
  ];
  readonly children: Token[] = [];

  getAST(): IAST {
    return HTMLgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return HTMLfromAST(ast);
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
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

    let tokens = createHTMLTokenStack(this.processingOrder);

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createHTMLTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Exit condition 1: Reached the end of the source.
        if (this.hasReachedSourceEnd(end)) {
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }
      }
    }
  }
  decompile(): string {
    return this.children.map((child) => child.decompile()).join("");
  }
}
