import { IAST, Token, TokenType } from "../token";
import { HTMLBoldToken } from "./bold/html-bold-token";
import { HTMLHeadingToken } from "./heading/html-heading-token";
import { HTMLItalicToken } from "./italic/html-italic-token";
import { HTMLParagraphToken } from "./paragraph/html-paragraph-token";
import { HTMLRootToken } from "./root/html-root-token";
import { HTMLSoftBreakToken } from "./soft-break/html-soft-break-token";
import { HTMLTextToken } from "./text/html-text-token";

/**
 * Creates a stack of tokens based on the provided token types.
 *
 * @param tokenTypes - An array of token types to create instances for.
 * @returns An array of token instances corresponding to the provided types.
 * @throws An error if an unsupported token type is encountered.
 */
export const htmlTokenMap = new Map<TokenType, () => Token>([
  ["bold", () => new HTMLBoldToken()],
  ["italic", () => new HTMLItalicToken()],
  ["text", () => new HTMLTextToken()],
  ["soft-break", () => new HTMLSoftBreakToken()],
  ["paragraph", () => new HTMLParagraphToken()],
  ["heading", () => new HTMLHeadingToken()],
  ["root", () => new HTMLRootToken()],
]);

export function createHTMLTokenStack(tokenTypes: TokenType[]): Token[] {
  const tokenTypesReversed = [...tokenTypes].reverse();

  return tokenTypesReversed.map((tokenType) => {
    const createToken = htmlTokenMap.get(tokenType);
    if (!createToken) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }
    return createToken();
  });
}

export function HTMLgetAST(token: Token): IAST {
  const ast: IAST = {
    type: token.name,
    start: token.startCursorPosition,
    end: token.endCursorPosition,
    value: token.source,
    children: token.children.map((child) => child.getAST()),
  };
  return ast;
}

export function HTMLfromAST(ast: IAST): Token {
  let factory = htmlTokenMap.get(ast.type);
  if (!factory) {
    throw new Error(`Unsupported token type: ${ast.type}`);
  }
  const token: Token = factory();

  token.startCursorPosition = ast.start;
  token.endCursorPosition = ast.end;
  token.source = ast.value;
  token.valid = true;

  for (const childAST of ast.children) {
    let factory = htmlTokenMap.get(childAST.type);
    if (!factory) {
      throw new Error(`Unsupported token type: ${childAST.type}`);
    }
    token.children.push(factory().fromAST(childAST));
  }
  return token;
}
