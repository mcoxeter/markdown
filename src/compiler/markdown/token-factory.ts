import { MDBoldToken } from './bold/md-bold-token';
import { MDItalicToken } from './italic/md-italic-token';
import { MDParagraphToken } from './paragraph/md-paragraph-token';
import { MDSoftBreakToken } from './soft-break/md-soft-break-token';
import { MDTextToken } from './text/md-text-token';
import { TokenType, Token } from '../token';
import { MDHeadingToken } from './heading/md-heading-token';
import { MDRootToken } from './root/md-root-token';

/**
 * Creates a stack of tokens based on the provided token types.
 *
 * @param tokenTypes - An array of token types to create instances for.
 * @returns An array of token instances corresponding to the provided types.
 * @throws An error if an unsupported token type is encountered.
 */
export function createMDTokenStack(tokenTypes: TokenType[]): Token[] {
  const tokenFactory = new Map<TokenType, () => Token>([
    ['bold', () => new MDBoldToken()],
    ['heading', () => new MDHeadingToken()],
    ['italic', () => new MDItalicToken()],
    ['root', () => new MDRootToken()],
    ['text', () => new MDTextToken()],
    ['paragraph', () => new MDParagraphToken()],
    ['soft-break', () => new MDSoftBreakToken()]
  ]);

  return tokenTypes.reverse().map((tokenType) => {
    const createToken = tokenFactory.get(tokenType);
    if (!createToken) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }
    return createToken();
  });
}
