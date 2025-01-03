export type TokenType =
  | "root"
  | "bold"
  | "italic"
  | "paragraph"
  | "heading"
  | "list"
  | "list-item"
  | "block-code"
  | "inline-code"
  | "text"
  | "image"
  | "line-break"
  | "soft-break";

/** Type alias representing a position within a source string. */
export type PositionInSource = number;

/**
 * Interface representing a token in the markdown processor.
 */
export interface Token {
  fromAST(ast: IAST): Token;

  /**
   * Compiles the token from a given source string, using the provided range.
   * @param source - The source string to compile the token from.
   * @param start - The start position in the source string.
   * @param end - The end position in the source string.
   */
  compile(source: string, start: PositionInSource, end: PositionInSource): void;

  decompile(): string;

  /** Returns the name/type of this token. */
  // name: TokenType;

  /** Returns the source string content associated with this token. */
  // source: string;

  /** Returns a stringified Abstract Syntax Tree (AST) representation of the token. */
  getAST(): IAST;

  processingOrder: TokenType[];
  startCursorPosition: number;
  endCursorPosition: number;
  valid: boolean;
  source: string;
  children: Token[];
  name: TokenType;
}

export interface IAST {
  type: TokenType;
  start: number;
  end: number;
  value: string;
  children: IAST[];
}
