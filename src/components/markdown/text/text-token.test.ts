import { expect, test, describe } from 'vitest';
import { TextToken } from './text-token';

describe('TextToken Tests', () => {
  test('TextToken initializes correctly', () => {
    const textToken = new TextToken();
    expect(textToken.getChildren()).toStrictEqual([]);
    expect(textToken.getEndCursorPosition()).toBe(0);
    expect(textToken.getStartCursorPosition()).toBe(0);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getProcessingOrder()).toStrictEqual([]);
    expect(textToken.getTokenSource()).toBe('');
    expect(textToken.getName()).toBe('text');
  });

  test('TextToken has no children after compilation', () => {
    const textToken = new TextToken();
    textToken.compile('example text', 0, 10);
    expect(textToken.getChildren()).toStrictEqual([]);
  });

  test('TextToken extracts source correctly', () => {
    const textToken = new TextToken();
    textToken.compile('example text', 0, 7);
    expect(textToken.getTokenSource()).toBe('example');
  });

  test('TextToken validates after compilation', () => {
    const textToken = new TextToken();
    textToken.compile('example text', 0, 7);
    expect(textToken.isValid()).toBe(true);
  });

  test.each([
    ['the *b* quick brown 1. fox', 'the '],
    ['This is a simple text', 'This is a simple text'],
    ['', ''],
    ['This is a #header', 'This is a '],
    ['This is a `Some code`', 'This is a '],
    ['*a', '*'],
    ['**a', '**'],
    ['line1\nline2', 'line1']
  ])('TextToken compiles "%s" to "%s"', (rawSource, expected) => {
    const textToken = new TextToken();
    textToken.compile(rawSource, 0, rawSource.length);
    expect(textToken.isValid()).toBe(true);
    expect(textToken.getTokenSource()).toBe(expected);
  });

  test('TextToken debug output matches expected structure', () => {
    const textToken = new TextToken();
    textToken.compile('the *b* quick brown 1. fox', 0, 4);
    expect(textToken.getAST()).toBe(
      '{"startCursorPosition":0,"endCursorPosition":4,"valid":true,"name":"text","source":"the ","children":[]}'
    );
  });

  test.each([
    ['the *b* quick brown 1. fox', 'he '],
    ['This is a simple text', 'his is a simple text'],
    ['This is a #header', 'his is a '],
    ['This is a `Some code`', 'his is a ']
  ])(
    'TextToken starting at position 1 for "%s" compiles to "%s"',
    (rawSource, expected) => {
      const textToken = new TextToken();
      textToken.compile(rawSource, 1, rawSource.length);
      expect(textToken.isValid()).toBe(true);
      expect(textToken.getTokenSource()).toBe(expected);
    }
  );

  test('TextToken handles invalid start and end range', () => {
    const textToken = new TextToken();
    textToken.compile('example text', 10, 5);
    expect(textToken.isValid()).toBe(false);
    expect(textToken.getTokenSource()).toBe('');
  });

  test('TextToken handles empty string', () => {
    const textToken = new TextToken();
    textToken.compile('', 0, 0);
    expect(textToken.isValid()).toBe(true);
    expect(textToken.getTokenSource()).toBe('');
  });

  test.each([
    ['***bold text', '***'],
    ['``ss``', '``'],
    ['#header', '#']
  ])(
    'TextToken handles termination %s characters at the start',
    (rawSource, expected) => {
      const textToken = new TextToken();
      textToken.compile(rawSource, 0, rawSource.length);
      expect(textToken.getTokenSource()).toBe(expected);
    }
  );

  test('TextToken stops at termination character mid-source', () => {
    const textToken = new TextToken();
    textToken.compile('example #header text', 0, 18);
    expect(textToken.getTokenSource()).toBe('example ');
  });
});
