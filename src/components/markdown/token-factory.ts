import { BoldToken } from './bold/bold-token';
import { ItalicToken } from './italic/italic-token';
import { ParagraphToken } from './paragraph/paragraph-token';
import { TextToken } from './text/text-token';
import { TokenType, Token } from './token';

/**
 * Creates a stack of tokens based on the provided token types.
 *
 * @param tokenTypes - An array of token types to create instances for.
 * @returns An array of token instances corresponding to the provided types.
 * @throws An error if an unsupported token type is encountered.
 */
export function createTokenStack(tokenTypes: TokenType[]): Token[] {
  const tokenFactory = new Map<TokenType, () => Token>([
    ['italic', () => new ItalicToken()],
    ['bold', () => new BoldToken()],
    ['text', () => new TextToken()],
    ['paragraph', () => new ParagraphToken()]
  ]);

  return tokenTypes.reverse().map((tokenType) => {
    const createToken = tokenFactory.get(tokenType);
    if (!createToken) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }
    return createToken();
  });
}
