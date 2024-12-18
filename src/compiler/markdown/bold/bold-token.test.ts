import { expect, test, describe } from 'vitest';
import { BoldToken } from './bold-token';

describe('BoldToken Initialization', () => {
  test('should initialize correctly', () => {
    const boldToken = new BoldToken();
    expect(boldToken.getChildren()).toStrictEqual([]);
    expect(boldToken.getEndCursorPosition()).toBe(0);
    expect(boldToken.getStartCursorPosition()).toBe(0);
    expect(boldToken.isValid()).toBeFalsy();
    expect(boldToken.getProcessingOrder()).toStrictEqual(['text', 'italic']);
    expect(boldToken.getTokenSource()).toBe('');
    expect(boldToken.getName()).toBe('bold');
  });
});

describe('BoldToken Validation', () => {
  test.each(['**b**', '**This *is* bold**', '**This *is bold***'])(
    '"%s" should be a valid bold token',
    (source) => {
      const boldToken = new BoldToken();
      boldToken.compile(source, 0, source.length);
      expect(boldToken.isValid()).toBeTruthy();
      expect(boldToken.getTokenSource()).toBe(source);
      expect(boldToken.getChildren().length).toBeGreaterThanOrEqual(0);
      expect(boldToken.getEndCursorPosition()).toBe(source.length);
    }
  );

  test.each([
    '*b*', // Incorrect indicator
    '**', // No content
    '', // Empty input
    '**b', // Missing closing indicator
    '****', // Only indicators
    '**This is bold', // Missing closing indicator
    'Text **bold** text' // Not at the start
  ])('"%s" should be an invalid bold token', (source) => {
    const boldToken = new BoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('should handle tokens with invalid ranges', () => {
    const source = '**b**';
    const boldToken = new BoldToken();
    boldToken.compile(source, -1, source.length); // Invalid start
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile(source, 0, -1); // Invalid end
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile(source, 5, 3); // End before start
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('should handle empty or whitespace-only input', () => {
    const boldToken = new BoldToken();
    boldToken.compile('', 0, 0);
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile('   ', 0, 3);
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('should handle italic within', () => {
    const boldToken = new BoldToken();
    const source = '**This is *italic* in the middle**';
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeTruthy();
    const children = boldToken.getChildren();

    expect(children.length).toBe(3);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('italic');
    expect(children[1].getTokenSource()).toStrictEqual('*italic*');
    expect(children[2].getName()).toStrictEqual('text');
  });

  test('should correctly set start and end cursor positions for valid tokens', () => {
    const source = '**bold**';
    const boldToken = new BoldToken();
    boldToken.compile(source, 0, source.length);

    expect(boldToken.isValid()).toBeTruthy();
    expect(boldToken.getStartCursorPosition()).toBe(0);
    expect(boldToken.getEndCursorPosition()).toBe(source.length);
  });
});