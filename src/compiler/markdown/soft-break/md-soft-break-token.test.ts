import { expect, test, describe } from 'vitest';
import { MDSoftBreakToken } from './md-soft-break-token';

describe('MDSoftBreakToken Tests', () => {
  test('MDSoftBreakToken initializes correctly', () => {
    const softbreakToken = new MDSoftBreakToken();
    expect(softbreakToken.getChildren()).toStrictEqual([]);
    expect(softbreakToken.getEndCursorPosition()).toBe(0);
    expect(softbreakToken.getStartCursorPosition()).toBe(0);
    expect(softbreakToken.isValid()).toBe(false);
    expect(softbreakToken.getProcessingOrder()).toStrictEqual([]);
    expect(softbreakToken.getTokenSource()).toBe('');
    expect(softbreakToken.getName()).toBe('soft-break');
  });

  test('MDSoftBreakToken has a text child after compilation', () => {
    const softbreakToken = new MDSoftBreakToken();
    softbreakToken.compile('not a softbreak', 0, 15);
    expect(softbreakToken.isValid()).toBe(false);
  });

  test('MDSoftBreakToken has a two spaces', () => {
    const softbreakToken = new MDSoftBreakToken();
    softbreakToken.compile('  ', 0, 2);
    expect(softbreakToken.isValid()).toBe(true);
  });
});
