/* eslint-disable @typescript-eslint/no-unused-vars */
import { BoldIndicator } from '../constants';
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class BoldToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'bold';
  private source: string = '';
  private processingOrder: TokenType[] = ['text'];
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

  private isEndOfBold(source: string): boolean {
    return (
      source.substring(this.endCursorPosition, this.endCursorPosition + 2) ===
      BoldIndicator
    );
  }

  compile(
    source: string,
    start: PositionInSource,
    end: PositionInSource
  ): void {
    this.startCursorPosition = start;
    this.endCursorPosition = end;
    this.source = source;

    const rules = [rule_first_and_second_character, rule_minimum_length];
    if (rules.some((rule) => rule(source, start, end) === false)) {
      return;
    }

    this.valid = true;

    this.endCursorPosition = this.startCursorPosition + 2;

    let tokens = createTokenStack(this.processingOrder);

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children.push(token);
        tokens = createTokenStack(this.getProcessingOrder());
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (this.isEndOfBold(source)) {
          this.endCursorPosition += 2;
          this.source = source.substring(start, this.endCursorPosition);
          return;
        }

        if (this.endCursorPosition > end) {
          this.valid = false;
          return;
        }
      }
    }
  }
}

// First and second character must be *
function rule_first_and_second_character(
  source: string,
  start: PositionInSource,
  end: PositionInSource
): boolean {
  return source.substring(start, start + 2) === BoldIndicator;
}

// **d**
function rule_minimum_length(
  source: string,
  start: PositionInSource,
  end: PositionInSource
): boolean {
  const result = end - start > 4;
  return result;
}
