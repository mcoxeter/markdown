import { expect, test, describe } from 'vitest';
import { MDParagraphToken } from './md-paragraph-token';

describe('MDParagraphToken Tests', () => {
  test('MDParagraphToken initializes correctly', () => {
    const paragraphToken = new MDParagraphToken();
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getEndCursorPosition()).toBe(0);
    expect(paragraphToken.getStartCursorPosition()).toBe(0);
    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getProcessingOrder()).toStrictEqual([
      'bold',
      'italic',
      'soft-break',
      'text'
    ]);
    expect(paragraphToken.getTokenSource()).toBe('');
    expect(paragraphToken.getName()).toBe('paragraph');
  });

  test('MDParagraphToken has a text child after compilation', () => {
    const paragraphToken = new MDParagraphToken();
    paragraphToken.compile('example text', 0, 12);
    expect(paragraphToken.getChildren().length).toBe(1);
    expect(paragraphToken.isValid).toBeTruthy();
    expect(paragraphToken.getChildren()[0].getAST()).toBe(
      '{"startCursorPosition":0,"endCursorPosition":12,"valid":true,"name":"text","source":"example text","children":[]}'
    );
  });

  test('MDParagraphToken extracts source correctly', () => {
    const paragraphToken = new MDParagraphToken();
    paragraphToken.compile('example text', 0, 12);
    expect(paragraphToken.getTokenSource()).toStrictEqual('example text');
  });

  test('MDParagraphToken end on a double newline', () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = 'Paragraph 1\n\nNext Paragraph';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.getTokenSource()).toStrictEqual('Paragraph 1');
  });

  test('MDParagraphToken can have several texts in it', () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = 'text 1\ntext 2\ntext 3';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.getChildren();
    expect(children.length).toBe(3);
    expect(paragraphToken.getTokenSource()).toStrictEqual(
      'text 1\ntext 2\ntext 3'
    );
  });

  test('MDParagraphToken can have several texts delimited by soft breaks', () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = 'text 1  \ntext 2\ntext 3';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.getChildren();
    expect(children.length).toBe(4);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('soft-break');
    expect(children[2].getName()).toStrictEqual('text');
    expect(children[3].getName()).toStrictEqual('text');
  });

  test('MDParagraphToken can have several bold and italic with in it', () => {
    const paragraphToken = new MDParagraphToken();
    const rawSource = '*text* 1  \ntext **2**\ntext 3';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.getChildren();
    expect(children.length).toBe(6);
    expect(children[0].getName()).toStrictEqual('italic');
    expect(children[1].getName()).toStrictEqual('text');
    expect(children[2].getName()).toStrictEqual('soft-break');
    expect(children[3].getName()).toStrictEqual('text');
    expect(children[4].getName()).toStrictEqual('bold');
    expect(children[5].getName()).toStrictEqual('text');
  });

  test('MDParagraphToken handles invalid range (start > end)', () => {
    const paragraphToken = new MDParagraphToken();
    const source = 'This is invalid.';
    paragraphToken.compile(source, 10, 5);

    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getTokenSource()).toBe('');
  });
});
