import { expect, test, describe } from 'vitest';
import { HTMLItalicToken } from './html-italic-token';

describe('HTMLItalicToken Initialization', () => {
  test('HTMLItalicToken should initialize correctly', () => {
    const italicToken = new HTMLItalicToken();
    expect(italicToken.getChildren()).toStrictEqual([]);
    expect(italicToken.getEndCursorPosition()).toBe(0);
    expect(italicToken.getStartCursorPosition()).toBe(0);
    expect(italicToken.isValid()).toBeFalsy();
    expect(italicToken.getProcessingOrder()).toStrictEqual(['bold', 'text']);
    expect(italicToken.getTokenSource()).toBe('');
    expect(italicToken.getName()).toBe('italic');
  });
});

describe('HTMLItalicToken Validation', () => {
  test.each([
    '<i>i</i>',
    '<i>This <b>is</b> italic</i>',
    '<i>This <b>is italic and bold</b></i>'
  ])('HTMLItalicToken "%s" should be a valid italic token', (source) => {
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.isValid()).toBeTruthy();
    expect(italicToken.getTokenSource()).toBe(source);
    expect(italicToken.getChildren().length).toBeGreaterThanOrEqual(0);
    expect(italicToken.getEndCursorPosition()).toBe(source.length);
  });

  test.each([
    '<b>b</b>', // Incorrect indicator
    '<i></i>', // No content
    '', // Empty input
    '<i>i', // Missing closing indicator
    '<b>', // Only indicators
    '<i>This is italic', // Missing closing indicator
    'Text <i>italic</i> text' // Not at the start
  ])('HTMLItalicToken "%s" should be an invalid italic token', (source) => {
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);
    expect(italicToken.isValid()).toBeFalsy();
  });

  test('HTMLItalicToken should handle tokens with invalid ranges', () => {
    const source = '<i>i</i>';
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, -1, source.length); // Invalid start
    expect(italicToken.isValid()).toBeFalsy();

    italicToken.compile(source, 0, -1); // Invalid end
    expect(italicToken.isValid()).toBeFalsy();

    italicToken.compile(source, 5, 3); // End before start
    expect(italicToken.isValid()).toBeFalsy();
  });

  test('HTMLItalicToken should handle bold within', () => {
    const italicToken = new HTMLItalicToken();
    const source = '<i>This is <b>bold</b> in the middle</i>';
    italicToken.compile(source, 0, source.length);
    expect(italicToken.isValid()).toBeTruthy();
    const children = italicToken.getChildren();

    expect(children.length).toBe(3);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('bold');
    expect(children[1].getTokenSource()).toStrictEqual('<b>bold</b>');
    expect(children[2].getName()).toStrictEqual('text');
  });

  test('HTMLItalicToken should correctly set start and end cursor positions for valid tokens', () => {
    const source = '<i>italic</i>';
    const italicToken = new HTMLItalicToken();
    italicToken.compile(source, 0, source.length);

    expect(italicToken.isValid()).toBeTruthy();
    expect(italicToken.getStartCursorPosition()).toBe(0);
    expect(italicToken.getEndCursorPosition()).toBe(source.length);
  });
});
