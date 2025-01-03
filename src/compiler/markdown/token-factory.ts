import { MDBoldToken } from "./bold/md-bold-token";
import { MDItalicToken } from "./italic/md-italic-token";
import { MDParagraphToken } from "./paragraph/md-paragraph-token";
import { MDLineBreakToken } from "./line-break/md-line-break-token";
import { MDTextToken } from "./text/md-text-token";
import { TokenType, Token, IAST } from "../token";
import { MDHeadingToken } from "./heading/md-heading-token";
import { MDRootToken } from "./root/md-root-token";
import { MDSoftBreakToken } from "./soft-break/md-soft-break-token";

export const mdTokenMap = new Map<TokenType, () => Token>([
  ["bold", () => new MDBoldToken()],
  ["heading", () => new MDHeadingToken()],
  ["italic", () => new MDItalicToken()],
  ["root", () => new MDRootToken()],
  ["text", () => new MDTextToken()],
  ["paragraph", () => new MDParagraphToken()],
  ["line-break", () => new MDLineBreakToken()],
  ["soft-break", () => new MDSoftBreakToken()],
]);

/**
 * Creates a stack of tokens based on the provided token types.
 *
 * @param tokenTypes - An array of token types to create instances for.
 * @returns An array of token instances corresponding to the provided types.
 * @throws An error if an unsupported token type is encountered.
 */
export function createMDTokenStack(tokenTypes: TokenType[]): Token[] {
  const tokenTypesReversed = [...tokenTypes].reverse();
  return tokenTypesReversed.map((tokenType) => {
    const createToken = mdTokenMap.get(tokenType);
    if (!createToken) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }
    return createToken();
  });
}

export function MDfromAST(ast: IAST): Token {
  let factory = mdTokenMap.get(ast.type);
  if (!factory) {
    throw new Error(`Unsupported token type: ${ast.type}`);
  }
  const token: Token = factory();

  token.startCursorPosition = ast.start;
  token.endCursorPosition = ast.end;
  token.source = ast.value;
  token.valid = true;

  for (const childAST of ast.children) {
    let factory = mdTokenMap.get(childAST.type);
    if (!factory) {
      throw new Error(`Unsupported token type: ${childAST.type}`);
    }
    token.children.push(factory().fromAST(childAST));
  }
  return token;
}

export function MDgetAST(token: Token): IAST {
  const ast: IAST = {
    type: token.name,
    start: token.startCursorPosition,
    end: token.endCursorPosition,
    value: token.source,
    children: token.children.map((child) => child.getAST()),
  };
  return ast;
}
