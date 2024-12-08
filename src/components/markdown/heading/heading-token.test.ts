import { expect, test, describe } from 'vitest';
import { HeadingToken } from './heading-token';

describe('HeadingToken Initialization', () => {
  test('should initialize correctly', () => {
    const headingToken = new HeadingToken();
    expect(headingToken.getChildren()).toStrictEqual([]);
    expect(headingToken.getEndCursorPosition()).toBe(0);
    expect(headingToken.getStartCursorPosition()).toBe(0);
    expect(headingToken.isValid()).toBeFalsy();
    expect(headingToken.getProcessingOrder()).toStrictEqual([
      'text',
      'bold',
      'italic'
    ]);
    expect(headingToken.getTokenSource()).toBe('');
    expect(headingToken.getName()).toBe('heading');
  });
});

describe('HeadingToken Validation', () => {
  test.each([
    ['# Heading 1', 1],
    ['## Heading 2', 2],
    ['### Heading 3', 3],
    ['#### **Bold Heading**', 4]
  ])('"%s" should be a valid italic token', (source, level) => {
    const headingToken = new HeadingToken();
    headingToken.compile(source, 0, source.length);
    expect(headingToken.isValid()).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(level);
    expect(headingToken.getTokenSource()).toBe(source);
    expect(headingToken.getChildren().length).toBeGreaterThanOrEqual(0);
    expect(headingToken.getEndCursorPosition()).toBe(source.length);
  });
  test.each([
    ['#NoSpace', 'No space after heading indicator'],
    ['Text before # Heading', 'Heading indicator not at start'],
    ['#', 'Heading not formed correctly'],
    ['', 'Empty string'],
    ['######', 'Heading level only without content']
  ])('"%s" should be invalid: %s', (source) => {
    const headingToken = new HeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.isValid()).toBeFalsy();
    expect(headingToken.getHeadingLevel()).toBe(0);
    expect(headingToken.getChildren()).toStrictEqual([]);
    expect(headingToken.getTokenSource()).toBe('');
  });

  test('should handle partial valid headers gracefully', () => {
    const source = '### Heading\nInvalid Content';
    const headingToken = new HeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.isValid()).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(3);
    expect(headingToken.getTokenSource()).toBe('### Heading');
    expect(headingToken.getEndCursorPosition()).toBe(11); // End before newline
  });

  test('should handle tokens with invalid ranges', () => {
    const source = '*i*';
    const headingToken = new HeadingToken();
    headingToken.compile(source, -1, source.length); // Invalid start
    expect(headingToken.isValid()).toBeFalsy();

    headingToken.compile(source, 0, -1); // Invalid end
    expect(headingToken.isValid()).toBeFalsy();

    headingToken.compile(source, 5, 3); // End before start
    expect(headingToken.isValid()).toBeFalsy();
  });
});
