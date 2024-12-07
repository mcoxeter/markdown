import { expect, test, describe } from 'vitest';
import { ParagraphToken } from './paragraph-token';

describe('ParagraphToken Tests', () => {
  test('ParagraphToken initializes correctly', () => {
    const paragraphToken = new ParagraphToken();
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getEndCursorPosition()).toBe(0);
    expect(paragraphToken.getStartCursorPosition()).toBe(0);
    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getProcessingOrder()).toStrictEqual(['text']);
    expect(paragraphToken.getTokenSource()).toBe('');
    expect(paragraphToken.getName()).toBe('paragraph');
  });

  test('ParagraphToken has a text child after compilation', () => {
    const paragraphToken = new ParagraphToken();
    paragraphToken.compile('example text', 0, 12);
    expect(paragraphToken.getChildren().length).toBe(1);
    expect(paragraphToken.isValid).toBeTruthy();
    expect(paragraphToken.getChildren()[0].getAST()).toBe(
      '{"startCursorPosition":0,"endCursorPosition":12,"valid":true,"name":"text","source":"example text","children":[]}'
    );
  });

  test('ParagraphToken extracts source correctly', () => {
    const paragraphToken = new ParagraphToken();
    paragraphToken.compile('example text', 0, 12);
    expect(paragraphToken.getTokenSource()).toStrictEqual('example text');
  });

  test('ParagraphToken end on a double newline', () => {
    const paragraphToken = new ParagraphToken();
    const rawSource = 'Paragraph 1\n\nNext Paragraph';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.getTokenSource()).toStrictEqual('Paragraph 1');
  });

  test('Handles invalid range (start > end)', () => {
    const paragraphToken = new ParagraphToken();
    const source = 'This is invalid.';
    paragraphToken.compile(source, 10, 5);

    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getTokenSource()).toBe('');
  });
});
