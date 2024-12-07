import { expect, test, describe } from 'vitest';
import { MarkdownToken } from './markdown-token';

describe('MarkdownToken Tests', () => {
  test('MarkdownToken initializes correctly', () => {
    const markdownToken = new MarkdownToken();
    expect(markdownToken.getChildren()).toStrictEqual([]);
    expect(markdownToken.getEndCursorPosition()).toBe(0);
    expect(markdownToken.getStartCursorPosition()).toBe(0);
    expect(markdownToken.isValid()).toBe(false);
    expect(markdownToken.getProcessingOrder()).toStrictEqual([
      'paragraph',
      'text'
    ]);
    expect(markdownToken.getTokenSource()).toBe('');
    expect(markdownToken.getName()).toBe('markdown');
  });

  test('MarkdownToken compiles to two paragraphs', () => {
    const markdownToken = new MarkdownToken();
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
