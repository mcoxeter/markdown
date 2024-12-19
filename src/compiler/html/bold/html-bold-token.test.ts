import { expect, test, describe } from 'vitest';
import { HTMLBoldToken } from './html-bold-token';

describe('HTMLBoldToken Initialization', () => {
  test('HTMLBoldToken should initialize correctly', () => {
    const boldToken = new HTMLBoldToken();
    expect(boldToken.getChildren()).toStrictEqual([]);
    expect(boldToken.getEndCursorPosition()).toBe(0);
    expect(boldToken.getStartCursorPosition()).toBe(0);
    expect(boldToken.isValid()).toBeFalsy();
    expect(boldToken.getProcessingOrder()).toStrictEqual(['italic', 'text']);
    expect(boldToken.getTokenSource()).toBe('');
    expect(boldToken.getName()).toBe('bold');
  });
});

describe('HTMLBoldToken Validation', () => {
  test.each([
    '<b>b</b>',
    '<b>This <i>is</i> bold</b>',
    '<b>This <i>is bold</i></b>'
  ])('HTMLBoldToken "%s" should be a valid bold token', (source) => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeTruthy();
    expect(boldToken.getTokenSource()).toBe(source);
    expect(boldToken.getChildren().length).toBeGreaterThanOrEqual(0);
    expect(boldToken.getEndCursorPosition()).toBe(source.length);
  });

  test.each([
    '<i>i</i>', // Incorrect indicator
    '<b></b>', // No content
    '', // Empty input
    '<b>b', // Missing closing indicator
    '<b><b>', // Only indicators
    '<b>This is bold', // Missing closing indicator
    'Text <b>bold</b> text' // Not at the start
  ])('HTMLBoldToken "%s" should be an invalid bold token', (source) => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('HTMLBoldToken should handle tokens with invalid ranges', () => {
    const source = '<b>b</b>';
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, -1, source.length); // Invalid start
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile(source, 0, -1); // Invalid end
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile(source, 5, 3); // End before start
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('HTMLBoldToken should handle empty or whitespace-only input', () => {
    const boldToken = new HTMLBoldToken();
    boldToken.compile('', 0, 0);
    expect(boldToken.isValid()).toBeFalsy();

    boldToken.compile('   ', 0, 3);
    expect(boldToken.isValid()).toBeFalsy();
  });

  test('HTMLBoldToken should handle italic within', () => {
    const boldToken = new HTMLBoldToken();
    const source = '<b>This is <i>italic</i> in the middle</b>';
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeTruthy();
    const children = boldToken.getChildren();

    expect(children.length).toBe(3);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('italic');
    expect(children[1].getTokenSource()).toStrictEqual('<i>italic</i>');
    expect(children[2].getName()).toStrictEqual('text');
  });

  test('HTMLBoldToken should correctly set start and end cursor positions for valid tokens', () => {
    const source = '<b>bold</b>';
    const boldToken = new HTMLBoldToken();
    boldToken.compile(source, 0, source.length);

    expect(boldToken.isValid()).toBeTruthy();
    expect(boldToken.getStartCursorPosition()).toBe(0);
    expect(boldToken.getEndCursorPosition()).toBe(source.length);
  });
});
