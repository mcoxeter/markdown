import { EmptyLine, Hash, NewLine, SoftBreak } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { createMDTokenStack, MDfromAST, MDgetAST } from "../token-factory";
import { MDSoftBreakToken } from "../soft-break/md-soft-break-token";

/**
 *
 *
 * Example of a paragraph in markdown (paragraphs are seperated by one or more blank lines):
 * a paragraph
 *
 * a second paragraph
 */
export class MDParagraphToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  readonly name: TokenType = "paragraph";
  source: string = "";
  readonly processingOrder: TokenType[] = [
    "bold",
    "italic",
    "line-break",
    "text",
  ];

  children: Token[] = [];

  getAST(): IAST {
    return MDgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return MDfromAST(ast);
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
  }

  private isEndOfParagraph(source: string): boolean {
    return (
      source.substring(
        this.endCursorPosition,
        this.endCursorPosition + EmptyLine.length
      ) === EmptyLine ||
      source.substring(
        this.endCursorPosition,
        this.endCursorPosition + Hash.length
      ) === Hash
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

    let tokens = createMDTokenStack(this.processingOrder);

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createMDTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Exit condition 1: End of paragraph (empty line).
        if (this.isEndOfParagraph(source)) {
          this.source = source.substring(start, this.endCursorPosition);
          this.endCursorPosition += EmptyLine.length; // Move past the empty line.
          this.addSoftBreakToChildren();

          return;
        }

        // Exit condition 2: Reached the end of the source.
        if (this.hasReachedSourceEnd(end)) {
          this.source = source.substring(start, this.endCursorPosition);
          this.addSoftBreakToChildren();
          return;
        }

        if (
          source.substring(
            this.endCursorPosition,
            this.endCursorPosition + 1
          ) === NewLine
        ) {
          this.endCursorPosition++; // Consume NewLines.

          if (this.isEndOfParagraph(source)) {
            this.source = source.substring(start, this.endCursorPosition);
            this.addSoftBreakToChildren();

            return;
          }
        }
      }
    }
  }

  decompile(): string {
    return this.children.map((child) => child.decompile()).join("");
  }

  addSoftBreakToChildren() {
    const newChildren = this.children.reduce<Token[]>(
      (prevToken, currentToken) => {
        if (
          prevToken[prevToken.length - 1]?.name === "text" &&
          currentToken.name === "text"
        ) {
          const token = new MDSoftBreakToken();
          token.compile(SoftBreak, 0, SoftBreak.length);
          return prevToken.concat(token, currentToken);
        }
        return prevToken.concat(currentToken);
      },
      []
    );
    this.children = newChildren;
  }
}
