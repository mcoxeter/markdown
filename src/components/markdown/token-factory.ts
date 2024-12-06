import { BoldToken } from './bold/bold-token';
import { ItalicToken } from './italic/italic-token';
import { TextToken } from './text/text-token';
import { TokenType, Token } from './token';

export function createTokenStack(tokenTypes: TokenType[]): Token[] {
  return tokenTypes.map((tokenType) => {
    switch (tokenType) {
      case 'italic':
        return new ItalicToken();
      case 'bold':
        return new BoldToken();
      case 'text':
        return new TextToken();
      default:
        return null as unknown as Token;
    }
  });
}
