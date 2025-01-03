import { expect, test, describe } from 'vitest';
import { MDRootToken } from './md-root-token';

describe('endCursorPosition Tests', () => {
  test('endCursorPosition initializes correctly', () => {
    const markdownToken = new MDRootToken();
    expect(markdownToken.children).toStrictEqual([]);
    expect(markdownToken.endCursorPosition).toBe(0);
    expect(markdownToken.startCursorPosition).toBe(0);
    expect(markdownToken.valid).toBe(false);
    expect(markdownToken.processingOrder).toStrictEqual([
      'heading',
      'paragraph'
    ]);
    expect(markdownToken.source).toBe('');
    expect(markdownToken.name).toBe('root');
  });

  test('endCursorPosition compiles to two paragraphs', () => {
    const markdownToken = new MDRootToken();
    const rawSource = 'paragraph1\nhello\n\nparagraph2';
    markdownToken.compile(rawSource, 0, rawSource.length);
    expect(markdownToken.source).toStrictEqual(
      'paragraph1\nhello\n\nparagraph2'
    );
    const children = markdownToken.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toStrictEqual('paragraph');
    expect(children[0].source).toStrictEqual('paragraph1\nhello');
    expect(children[1].name).toStrictEqual('paragraph');
    expect(children[1].source).toStrictEqual('paragraph2');
  });

  test('endCursorPosition compiles to a heading and a paragraph', () => {
    const markdownToken = new MDRootToken();
    const rawSource = '# heading 1\nHello';
    markdownToken.compile(rawSource, 0, rawSource.length);
    expect(markdownToken.source).toStrictEqual('# heading 1\nHello');
    const children = markdownToken.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toStrictEqual('heading');
    expect(children[0].source).toStrictEqual('# heading 1\n');
    expect(children[1].name).toStrictEqual('paragraph');
    expect(children[1].source).toStrictEqual('Hello');
  });
  test('endCursorPosition compiles to a paragraph and a heading', () => {
    const markdownToken = new MDRootToken();
    const rawSource = 'one\n# heading 1';
    markdownToken.compile(rawSource, 0, rawSource.length);
    expect(markdownToken.source).toStrictEqual('one\n# heading 1');
    const children = markdownToken.children;
    expect(children.length).toBe(2);
    expect(children[0].name).toStrictEqual('paragraph');
    expect(children[0].source).toStrictEqual('one\n');
    expect(children[1].name).toStrictEqual('heading');
    expect(children[1].source).toStrictEqual('# heading 1');
  });
});
