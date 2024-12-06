/* eslint-disable @typescript-eslint/no-unused-vars */
import { PositionInSource, Token, TokenType } from '../token';
import { createTokenStack } from '../token-factory';

export class BoldToken implements Token {
  private startCursorPosition: number = 0;
  private endCursorPosition: number = 0;
  private valid: boolean = false;
  private name: TokenType = 'bold';
  private source: string = '';

  private children: Token[] = [];
  getProcessingOrder(): TokenType[] {
    return ['italic', 'text'];
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

    this.valid = true;

    this.endCursorPosition = this.startCursorPosition + 2;

    let tokens = createTokenStack(this.getProcessingOrder());

    while (tokens.length > 0) {
      const token = tokens.pop();
      token?.compile(source, this.endCursorPosition, end);
      if (token?.isValid()) {
        this.children = this.children.concat(token);
        tokens = createTokenStack(this.getProcessingOrder());
        this.endCursorPosition = token.getEndCursorPosition();

        // Is End condition matched.
        if (
          source.substring(
            this.endCursorPosition,
            this.endCursorPosition + 2
          ) === '**'
        ) {
          this.endCursorPosition++;
          return;
        }

        if (this.endCursorPosition > end) {
          this.valid = false;
          return;
        }
      }
    }

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
  return source.substring(start, start + 2) === '**';
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
