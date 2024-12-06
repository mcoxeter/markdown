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

export type PositionInSource = number;

export interface Token {
  getProcessingOrder(): TokenType[];
  getChildren(): Token[];
  getStartCursorPosition(): PositionInSource;
  getEndCursorPosition(): PositionInSource;
  isValid(): boolean;
  compile(source: string, start: PositionInSource, end: PositionInSource): void;
  getName(): TokenType;
  getTokenSource(): string;
  getAST(): string;
}
