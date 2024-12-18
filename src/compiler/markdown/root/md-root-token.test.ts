import { expect, test, describe } from 'vitest';
import { MDRootToken } from './md-root-token';

describe('MDRootToken Tests', () => {
  test('MDRootToken initializes correctly', () => {
    const markdownToken = new MDRootToken();
    expect(markdownToken.getChildren()).toStrictEqual([]);
    expect(markdownToken.getEndCursorPosition()).toBe(0);
    expect(markdownToken.getStartCursorPosition()).toBe(0);
    expect(markdownToken.isValid()).toBe(false);
    expect(markdownToken.getProcessingOrder()).toStrictEqual(['paragraph']);
    expect(markdownToken.getTokenSource()).toBe('');
    expect(markdownToken.getName()).toBe('root');
  });

  test('MDRootToken compiles to two paragraphs', () => {
    const markdownToken = new MDRootToken();
    const rawSource = 'paragraph1\nhello\n\nparagraph2';
    markdownToken.compile(rawSource, 0, rawSource.length);
    const children = markdownToken.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getName()).toStrictEqual('paragraph');
    expect(children[0].getTokenSource()).toStrictEqual('paragraph1\nhello');
    expect(children[1].getName()).toStrictEqual('paragraph');
    expect(children[1].getTokenSource()).toStrictEqual('paragraph2');
  });
});
