import { expect, test, describe } from 'vitest';
import { HTMLTextToken } from './html-text-token';

describe('HTMLTextToken Tests', () => {
  test('HTMLTextToken initializes correctly', () => {
    const textToken = new HTMLTextToken();
    expect(textToken.getChildren()).toStrictEqual([]);
    expect(textToken.getEndCursorPosition()).toBe(0);
    expect(textToken.getStartCursorPosition()).toBe(0);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getProcessingOrder()).toStrictEqual([]);
    expect(textToken.getTokenSource()).toBe('');
    expect(textToken.getName()).toBe('text');
  });

  test('HTMLTextToken has no children after compilation', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('example text', 0, 10);
    expect(textToken.getChildren()).toStrictEqual([]);
  });

  test('HTMLTextToken extracts source correctly', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('example text', 0, 7);
    expect(textToken.getTokenSource()).toBe('example');
  });

  test('HTMLTextToken validates after compilation', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('example text', 0, 7);
    expect(textToken.isValid()).toBe(true);
  });

  test('HTMLTextToken allows whitespace at end', () => {
    const textToken = new HTMLTextToken();
    const rawSource = 'example text  ';
    textToken.compile(rawSource, 0, rawSource.length);
    expect(textToken.getTokenSource()).toStrictEqual('example text  ');
  });

  test.each([
    ['the <i>b</i> quick brown 1. fox', 'the '],
    ['This is a simple text', 'This is a simple text'],
    ['This is a <code>Some code</code>', 'This is a '],
    ['<a', '<a'],
    ['>a', '>a'],
    ['line1\nline2', 'line1\nline2']
  ])('HTMLTextToken compiles "%s" to "%s"', (rawSource, expected) => {
    const textToken = new HTMLTextToken();
    textToken.compile(rawSource, 0, rawSource.length);
    expect(textToken.isValid()).toBe(true);
    expect(textToken.getTokenSource()).toBe(expected);
  });

  test('HTMLTextToken debug output matches expected structure', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('the <i>b</i> quick brown 1. fox', 0, 4);
    expect(textToken.getAST()).toBe(
      '{"startCursorPosition":0,"endCursorPosition":4,"valid":true,"name":"text","source":"the ","children":[]}'
    );
  });

  test.each([
    ['the <i>b</i> quick brown 1. fox', 'he '],
    ['This is a simple text', 'his is a simple text'],
    ['This is a <code>Some code</code>', 'his is a ']
  ])(
    'HTMLTextToken starting at position 1 for "%s" compiles to "%s"',
    (rawSource, expected) => {
      const textToken = new HTMLTextToken();
      textToken.compile(rawSource, 1, rawSource.length);
      expect(textToken.isValid()).toBe(true);
      expect(textToken.getTokenSource()).toBe(expected);
    }
  );

  test('HTMLTextToken handles invalid start and end range', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('example text', 10, 5);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getTokenSource()).toBe('');
  });

  test('HTMLTextToken does not accept empty string', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('', 0, 0);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getTokenSource()).toBe('');
  });

  test.each([['<<<bold text', '<<<bold text']])(
    'HTMLTextToken handles termination %s characters at the start',
    (rawSource, expected) => {
      const textToken = new HTMLTextToken();
      textToken.compile(rawSource, 0, rawSource.length);
      expect(textToken.getTokenSource()).toBe(expected);
    }
  );

  test('HTMLTextToken stops at termination character mid-source', () => {
    const textToken = new HTMLTextToken();
    textToken.compile('example <header text', 0, 18);
    expect(textToken.getTokenSource()).toBe('example ');
  });

  test('HTMLTextToken handles null or undefined input', () => {
    const textToken = new HTMLTextToken();
    textToken.compile(null as unknown as string, 0, 5);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getTokenSource()).toBe('');

    textToken.compile(undefined as unknown as string, 0, 5);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getTokenSource()).toBe('');
  });

  test.each([
    [-1, 0, false, 'is neg is not allowed'],
    [10, -6, false, 'is neg is not allowed'],
    [2, 1, false, 'end is less than start'],
    [2, 2, false, 'its not ok to have the two the same']
  ])(
    'HTMLTextToken start %d and end %s is considered valid === %s, because %s',
    (start, end, valid) => {
      const textToken = new HTMLTextToken();
      textToken.compile('test', start, end);
      expect(textToken.isValid()).toBe(valid);
    }
  );
});
