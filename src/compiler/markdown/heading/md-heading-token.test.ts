import { expect, test, describe } from 'vitest';
import { MDHeadingToken } from './md-heading-token';

describe('MDHeadingToken Initialization', () => {
  test('MDHeadingToken should initialize correctly', () => {
    const headingToken = new MDHeadingToken();
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

describe('MDHeadingToken Validation', () => {
  test.each([
    ['# Heading 1', 1],
    ['## Heading 2', 2],
    ['### Heading 3', 3],
    ['#### **Bold Heading**', 4]
  ])('MDHeadingToken "%s" should be a valid italic token', (source, level) => {
    const headingToken = new MDHeadingToken();
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
  ])('MDHeadingToken "%s" should be invalid: %s', (source) => {
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.isValid()).toBeFalsy();
    expect(headingToken.getHeadingLevel()).toBe(0);
    expect(headingToken.getChildren()).toStrictEqual([]);
    expect(headingToken.getTokenSource()).toBe('');
  });

  test('MDHeadingToken should handle partial valid headers gracefully', () => {
    const source = '### Heading\nInvalid Content';
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, 0, source.length);

    expect(headingToken.isValid()).toBeTruthy();
    expect(headingToken.getHeadingLevel()).toBe(3);
    expect(headingToken.getTokenSource()).toBe('### Heading');
    expect(headingToken.getEndCursorPosition()).toBe(11); // End before newline
  });

  test.each([
    [' # Heading', 1, 10, false],
    ['# Heading', 0, 10, true],
    ['some text\n# Heading', 10, 19, true]
  ])(
    'MDHeadingToken are only valid at the start text or at the start of a new line',
    (src, start, end, valid) => {
      const headingToken = new MDHeadingToken();
      headingToken.compile(src, start, end);

      expect(headingToken.isValid()).toBe(valid);
    }
  );

  test('MDHeadingToken should handle tokens with invalid ranges', () => {
    const source = '*i*';
    const headingToken = new MDHeadingToken();
    headingToken.compile(source, -1, source.length); // Invalid start
    expect(headingToken.isValid()).toBeFalsy();

    headingToken.compile(source, 0, -1); // Invalid end
    expect(headingToken.isValid()).toBeFalsy();

    headingToken.compile(source, 5, 3); // End before start
    expect(headingToken.isValid()).toBeFalsy();
  });
});
