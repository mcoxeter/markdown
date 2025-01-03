import React from 'react';
import styles from './markdown-input.module.scss';
import { MarkdownContext } from '../markdown-context';

const MarkdownInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  const [markdown, setMarkdown] = React.useState<string>('');

  React.useEffect(() => {
    setMarkdown(context.markdown);
  }, [context.markdown]);
  return (
    <textarea
      className={styles.markdowninput}
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      onBlur={() => {
        context.setMarkdown(markdown);
      }}
    />
  );
};

export default MarkdownInput;
