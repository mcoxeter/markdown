import { expect, test, describe } from 'vitest';
import { HTMLParagraphToken } from './html-paragraph-token';

describe('HTMLParagraphToken Tests', () => {
  test('HTMLParagraphToken initializes correctly', () => {
    const paragraphToken = new HTMLParagraphToken();
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getEndCursorPosition()).toBe(0);
    expect(paragraphToken.getStartCursorPosition()).toBe(0);
    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getProcessingOrder()).toStrictEqual([
      'bold',
      'italic',
      'soft-break',
      'paragraph',
      'text'
    ]);
    expect(paragraphToken.getTokenSource()).toBe('');
    expect(paragraphToken.getName()).toBe('paragraph');
  });

  test('HTMLParagraphToken has a text child after compilation', () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = '<p>example text</p>';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.getChildren().length).toBe(1);
    expect(paragraphToken.isValid).toBeTruthy();
    expect(paragraphToken.getChildren()[0].getAST()).toBe(
      '{"startCursorPosition":3,"endCursorPosition":15,"valid":true,"name":"text","source":"example text","children":[]}'
    );
  });

  test('HTMLParagraphToken extracts source correctly', () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = '<p>example text</p>';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.getTokenSource()).toStrictEqual(rawSource);
  });

  test('HTMLParagraphToken ends on a single paragraph', () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = '<p>Paragraph 1</p><p>Next Paragraph</p>';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    expect(paragraphToken.getTokenSource()).toStrictEqual('<p>Paragraph 1</p>');
  });

  test('HTMLParagraphToken can have several paragraphs in it', () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = '<p>text<p>text<p>ntext 3</p></p></p>';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.getChildren();
    expect(children.length).toBe(2);
    expect(paragraphToken.getTokenSource()).toStrictEqual(
      '<p>text<p>text<p>ntext 3</p></p></p>'
    );
  });

  test('HTMLParagraphToken can have several texts delimited by soft breaks', () => {
    const paragraphToken = new HTMLParagraphToken();
    const rawSource = '<p>text 1<br />text 2\ntext 3</p>';
    paragraphToken.compile(rawSource, 0, rawSource.length);
    const children = paragraphToken.getChildren();
    expect(children.length).toBe(3);
    expect(children[0].getName()).toStrictEqual('text');
    expect(children[1].getName()).toStrictEqual('soft-break');
    expect(children[2].getName()).toStrictEqual('text');
    expect(children[2].getTokenSource()).toStrictEqual('text 2\ntext 3');
  });

  // test('HTMLParagraphToken can have several bold and italic with in it', () => {
  //   const paragraphToken = new HTMLParagraphToken();
  //   const rawSource = '<p><i>text</i> 1  \ntext <b>2</b>\ntext 3</p>';
  //   paragraphToken.compile(rawSource, 0, rawSource.length);
  //   const children = paragraphToken.getChildren();
  //   expect(children.length).toBe(6);
  //   expect(children[0].getName()).toStrictEqual('italic');
  //   expect(children[1].getName()).toStrictEqual('text');
  //   expect(children[2].getName()).toStrictEqual('text');
  //   expect(children[3].getName()).toStrictEqual('bold');
  //   expect(children[4].getName()).toStrictEqual('text');
  // });

  test('HTMLParagraphToken handles invalid range (start > end)', () => {
    const paragraphToken = new HTMLParagraphToken();
    const source = 'This is invalid.';
    paragraphToken.compile(source, 10, 5);

    expect(paragraphToken.isValid()).toBe(false);
    expect(paragraphToken.getChildren()).toStrictEqual([]);
    expect(paragraphToken.getTokenSource()).toBe('');
  });
});
