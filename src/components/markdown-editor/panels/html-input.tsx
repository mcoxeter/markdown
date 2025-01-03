import React from 'react';
import styles from './html-input.module.scss';
import { MarkdownContext } from '../markdown-context';
import { HTMLRootToken } from '../../../compiler/html/root/html-root-token';
import { MDRootToken } from '../../../compiler/markdown/root/md-root-token';

const HTMLInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  const [html, setHtml] = React.useState<string>('');

  React.useEffect(() => {
    const mdRootToken = new MDRootToken();
    mdRootToken.compile(context.markdown, 0, context.markdown.length);
    const htmlToken = new HTMLRootToken().fromAST(mdRootToken.getAST());
    setHtml(htmlToken.decompile());
  }, [context.markdown]);

  return (
    <textarea
      className={styles.htmlinput}
      value={html}
      onChange={(e) => setHtml(e.target.value)}
    />
  );
};

export default HTMLInput;
