import { expect, test, describe } from 'vitest';
import { HTMLSoftBreakToken } from './html-soft-break-token';

describe('HTMLSoftBreakToken Tests', () => {
  test('HTMLSoftBreakToken initializes correctly', () => {
    const softbreakToken = new HTMLSoftBreakToken();
    expect(softbreakToken.getChildren()).toStrictEqual([]);
    expect(softbreakToken.getEndCursorPosition()).toBe(0);
    expect(softbreakToken.getStartCursorPosition()).toBe(0);
    expect(softbreakToken.isValid()).toBe(false);
    expect(softbreakToken.getProcessingOrder()).toStrictEqual([]);
    expect(softbreakToken.getTokenSource()).toBe('');
    expect(softbreakToken.getName()).toBe('soft-break');
  });

  test('HTMLSoftBreakToken has a text child after compilation', () => {
    const softbreakToken = new HTMLSoftBreakToken();
    softbreakToken.compile('not a softbreak', 0, 15);
    expect(softbreakToken.isValid()).toBe(false);
  });

  test('HTMLSoftBreakToken is valid', () => {
    const softbreakToken = new HTMLSoftBreakToken();
    softbreakToken.compile('<br />', 0, 2);
    expect(softbreakToken.isValid()).toBe(true);
  });
});
