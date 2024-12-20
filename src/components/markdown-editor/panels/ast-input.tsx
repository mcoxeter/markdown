import React from 'react';
import styles from './ast-input.module.scss';
import { MarkdownContext } from '../markdown-context';
import { MDRootToken } from '../../../compiler/markdown/root/md-root-token';

const ASTInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  const [ast, setAST] = React.useState<string>('');

  React.useEffect(() => {
    const rootToken = new MDRootToken();
    rootToken.compile(context.markdown, 0, context.markdown.length);
    setAST(rootToken.getAST());
  }, [context.markdown]);

  return (
    <textarea
      className={styles.astinput}
      value={ast}
      onChange={(e) => setAST(e.target.value)}
    />
  );
};

export default ASTInput;
