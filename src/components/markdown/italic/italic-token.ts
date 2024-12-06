/* eslint-disable @typescript-eslint/no-unused-vars */
import { PositionInSource, Token, TokenType } from '../token';

export class ItalicToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'italic';
  private source: string = '';

  private children: Token[] = [];
  getProcessingOrder(): TokenType[] {
    return ['bold', 'text'];
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
    return this.source.substring(
      this.startCursorPosition,
      this.endCursorPosition
    );
  }

  getAST(): string {
    return '';
  }

  toDebug(): string {
    return JSON.stringify(this);
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

    this.getProcessingOrder().forEach((tokenType) => {
      switch (tokenType) {
        case 'italic':
          break;
        case 'text':
          break;
      }
    });

    // Next process possible child tokens.
    this.valid = true;
  }
}

// First and second character must be *
function rule_first_and_second_character(
  source: string,
  start: PositionInSource,
  end: PositionInSource
): boolean {
  return source.substring(start, start + 1) === '*';
}

// *i*
function rule_minimum_length(
  source: string,
  start: PositionInSource,
  end: PositionInSource
): boolean {
  const result = end - start > 2;
  return result;
}
