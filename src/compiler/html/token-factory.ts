import { Token, TokenType } from '../token';
import { HTMLBoldToken } from './bold/html-bold-token';
import { HTMLItalicToken } from './italic/html-italic-token';
import { HTMLParagraphToken } from './paragraph/html-paragraph-token';
import { HTMLSoftBreakToken } from './soft-break/html-soft-break-token';
import { HTMLTextToken } from './text/html-text-token';

/**
 * Creates a stack of tokens based on the provided token types.
 *
 * @param tokenTypes - An array of token types to create instances for.
 * @returns An array of token instances corresponding to the provided types.
 * @throws An error if an unsupported token type is encountered.
 */
export function createHTMLTokenStack(tokenTypes: TokenType[]): Token[] {
  const tokenFactory = new Map<TokenType, () => Token>([
    ['bold', () => new HTMLBoldToken()],
    ['italic', () => new HTMLItalicToken()],
    ['text', () => new HTMLTextToken()],
    ['soft-break', () => new HTMLSoftBreakToken()],
    ['paragraph', () => new HTMLParagraphToken()]
  ]);

  const tokenTypesReversed = [...tokenTypes].reverse();

  return tokenTypesReversed.map((tokenType) => {
    const createToken = tokenFactory.get(tokenType);
    if (!createToken) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }
    return createToken();
  });
}
