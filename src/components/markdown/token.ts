export type TokenType =
  | 'markdown'
  | 'bold'
  | 'italic'
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'list-item'
  | 'block-code'
  | 'inline-code'
  | 'text'
  | 'image'
  | 'hard-line';

/** Type alias representing a position within a source string. */
export type PositionInSource = number;

/**
 * Interface representing a token in the markdown processor.
 */
export interface Token {
  /** Returns the order in which child tokens should be processed. */
  getProcessingOrder(): TokenType[];

  /** Returns the child tokens of this token. */
  getChildren(): Token[];

  /** Returns the starting position of the token in the source string. */
  getStartCursorPosition(): PositionInSource;

  /** Returns the ending position of the token in the source string. */
  getEndCursorPosition(): PositionInSource;

  /** Returns whether the token is valid. */
  isValid(): boolean;

  /**
   * Compiles the token from a given source string, using the provided range.
   * @param source - The source string to compile the token from.
   * @param start - The start position in the source string.
   * @param end - The end position in the source string.
   */
  compile(source: string, start: PositionInSource, end: PositionInSource): void;

  /** Returns the name/type of this token. */
  getName(): TokenType;

  /** Returns the source string content associated with this token. */
  getTokenSource(): string;

  /** Returns a stringified Abstract Syntax Tree (AST) representation of the token. */
  getAST(): string;
}
