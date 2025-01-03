import { MDBoldToken } from "../bold/md-bold-token";
import { ItalicIndicator } from "../constants";
import { IAST, PositionInSource, Token, TokenType } from "../../token";
import { createMDTokenStack, MDfromAST, MDgetAST } from "../token-factory";

/**
 * The MDItalicToken class represents a token for parsing and compiling italicized text in markdown syntax.
 * It identifies and processes text wrapped with the markdown italic indicator (e.g., *).
 *
 * This class implements the Token interface and provides the following functionality:
 * - Detects and validates the italic syntax while ensuring it does not conflict with bold formatting.
 * - Tracks the start and end positions of the italic syntax in the source text.
 * - Compiles the italic token, processes nested or child tokens (e.g., bold, plain text), and validates the token structure.
 * - Outputs an abstract syntax tree (AST) representation of the italic token, including its child tokens.
 *
 * Use this class in a markdown parser to handle and validate italic text, supporting proper nesting with other formatting like bold.
 *
 * Example of italic text in markdown:
 * *Italic text*
 *
 * Italic can be mixed with bold like this.
 * *Italic and **bold***
 */
export class MDItalicToken implements Token {
  startCursorPosition: number = 0;
  endCursorPosition: number = 0;
  valid: boolean = false;
  readonly name: TokenType = "italic";
  source: string = "";
  readonly processingOrder: TokenType[] = ["bold", "text"];
  readonly children: Token[] = [];

  getAST(): IAST {
    return MDgetAST(this);
  }

  fromAST(ast: IAST): Token {
    return MDfromAST(ast);
  }

  private isItalicIndicator(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    // The italicIndicator can give a false positive with the bold token.
    // So only check if the next token is not a bold token.
    const boldToken = new MDBoldToken();
    boldToken.compile(source, start, end);
    if (boldToken.valid) {
      return false;
    }
    return (
      source.substring(start, start + ItalicIndicator.length) ===
      ItalicIndicator
    );
  }

  private areInvalidArgs(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): boolean {
    return typeof source !== "string" || start < 0 || end < start;
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    if (
      this.areInvalidArgs(source, start, end) ||
      !this.isItalicIndicator(source, start, end)
    ) {
      this.valid = false;
      return;
    }

    this.startCursorPosition = start;
    this.endCursorPosition = start + ItalicIndicator.length;

    let tokens = createMDTokenStack(this.processingOrder);

    while (this.endCursorPosition < end) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.valid) {
        this.children.push(token);
        tokens = createMDTokenStack(this.processingOrder);
        this.endCursorPosition = token.endCursorPosition;

        // Is End condition matched.
        if (this.isItalicIndicator(source, this.endCursorPosition, end)) {
          this.endCursorPosition += ItalicIndicator.length;
          this.valid = true;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }
      }
    }
    // If we exit the loop, the token is invalid.
    this.valid = false;
  }
  decompile(): string {
    return `*` + this.children.map((child) => child.decompile()).join("") + `*`;
  }
}
