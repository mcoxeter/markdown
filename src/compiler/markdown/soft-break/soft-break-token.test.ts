import { expect, test, describe } from 'vitest';
import { SoftBreakToken } from './soft-break-token';

describe('SoftBreakToken Tests', () => {
  test('SoftBreakToken initializes correctly', () => {
    const softbreakToken = new SoftBreakToken();
    expect(softbreakToken.getChildren()).toStrictEqual([]);
    expect(softbreakToken.getEndCursorPosition()).toBe(0);
    expect(softbreakToken.getStartCursorPosition()).toBe(0);
    expect(softbreakToken.isValid()).toBe(false);
    expect(softbreakToken.getProcessingOrder()).toStrictEqual([]);
    expect(softbreakToken.getTokenSource()).toBe('');
    expect(softbreakToken.getName()).toBe('soft-break');
  });

  test('SoftBreakToken has a text child after compilation', () => {
    const softbreakToken = new SoftBreakToken();
    softbreakToken.compile('not a softbreak', 0, 15);
    expect(softbreakToken.isValid()).toBe(false);
  });

  test('SoftBreakToken has a two spaces', () => {
    const softbreakToken = new SoftBreakToken();
    softbreakToken.compile('  ', 0, 2);
    expect(softbreakToken.isValid()).toBe(true);
  });
});
