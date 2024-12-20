import React from 'react';
import styles from './html-input.module.scss';

const HTMLInput: React.FC = () => {
  const [html, setHtml] = React.useState<string>('');
  return (
    <textarea
      className={styles.htmlinput}
      value={html}
      onChange={(e) => setHtml(e.target.value)}
    />
  );
};

export default HTMLInput;
