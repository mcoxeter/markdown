import { expect, test, describe } from 'vitest';
import { ItalicToken } from './italic-token';

describe('ItalicToken Initialization', () => {
  test('should initialize correctly', () => {
    const italicToken = new ItalicToken();
    expect(italicToken.getChildren()).toStrictEqual([]);
    expect(italicToken.getEndCursorPosition()).toBe(0);
    expect(italicToken.getStartCursorPosition()).toBe(0);
    expect(italicToken.isValid()).toBeFalsy();
    expect(italicToken.getProcessingOrder()).toStrictEqual(['text', 'bold']);
    expect(italicToken.getTokenSource()).toBe('');
    expect(italicToken.getName()).toBe('italic');
  });
});

describe('ItalicToken Validation', () => {
  test.each(['*i*', '*This **is** italic*', '*This **is italic and bold***'])(
    '"%s" should be a valid italic token',
    (source) => {
      const italicToken = new ItalicToken();
      italicToken.compile(source, 0, source.length);
      expect(italicToken.isValid()).toBeTruthy();
      expect(italicToken.getTokenSource()).toBe(source);
      expect(italicToken.getChildren().length).toBeGreaterThanOrEqual(0);
      expect(italicToken.getEndCursorPosition()).toBe(source.length);
    }
  );

  test.each([
    '**b**', // Incorrect indicator
    '*', // No content
    '', // Empty input
    '*i', // Missing closing indicator
    '**', // Only indicators
    '*This is italic', // Missing closing indicator
    'Text *italic* text' // Not at the start
  ])('"%s" should be an invalid italic token', (source) => {
    const italicToken = new ItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.isValid()).toBeFalsy();
  });

  test('should handle tokens with invalid ranges', () => {
    const source = '*i*';
    const italicToken = new ItalicToken();
    italicToken.compile(source, -1, source.length); // Invalid start
    expect(italicToken.isValid()).toBeFalsy();

    italicToken.compile(source, 0, -1); // Invalid end
    expect(italicToken.isValid()).toBeFalsy();

    italicToken.compile(source, 5, 3); // End before start
    expect(italicToken.isValid()).toBeFalsy();
  });

  test('should handle empty or whitespace-only input', () => {
    const italicToken = new ItalicToken();
    italicToken.compile('', 0, 0);
    expect(italicToken.isValid()).toBeFalsy();

    italicToken.compile('   ', 0, 3);
    expect(italicToken.isValid()).toBeFalsy();
  });

  test('should handle bold within', () => {
    const italicToken = new ItalicToken();
    const source = '*This is **bold** in the middle*';
    italicToken.compile(source, 0, source.length);
    expect(italicToken.isValid()).toBeTruthy();
    const children = italicToken.getChildren();

    expect(children.length).toBe(3);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('bold');
    expect(children[1].getTokenSource()).toStrictEqual('**bold**');
    expect(children[2].getName()).toStrictEqual('text');
  });

  test('should correctly set start and end cursor positions for valid tokens', () => {
    const source = '*italic*';
    const italicToken = new ItalicToken();
    italicToken.compile(source, 0, source.length);

    expect(italicToken.isValid()).toBeTruthy();
    expect(italicToken.getStartCursorPosition()).toBe(0);
    expect(italicToken.getEndCursorPosition()).toBe(source.length);
  });
});
