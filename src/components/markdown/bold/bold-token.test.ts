import { expect, test } from 'vitest';
import { BoldToken } from './bold-token';

test('bold token is initialized correctly', () => {
  const boldToken = new BoldToken();
  expect(boldToken.getChildren()).toStrictEqual([]);
  expect(boldToken.getEndCursorPosition()).toBe(0);
  expect(boldToken.getStartCursorPosition()).toBe(0);
  expect(boldToken.isValid()).toBeFalsy();
  expect(boldToken.getProcessingOrder()).toStrictEqual(['text']);
  expect(boldToken.getTokenSource()).toStrictEqual('');
  expect(boldToken.getName()).toStrictEqual('bold');
});

test.each(['**b**', '**This *is* bold**', '**This *is bold***'])(
  '"%s" is a valid bold token',
  (source) => {
    const boldToken = new BoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeTruthy();
  }
);

test.each(['*b*', '**', '', '**b', '****'])(
  '"%s" is not a valid bold token',
  (source) => {
    const boldToken = new BoldToken();
    boldToken.compile(source, 0, source.length);
    expect(boldToken.isValid()).toBeFalsy();
  }
);
