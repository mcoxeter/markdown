import React from 'react';
import styles from './html-input.module.scss';
import { MarkdownContext } from '../markdown-context';

const HTMLInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  if (context.currentPanel !== 'html') return null;
  return <textarea className={styles.htmlinput} />;
};

export default HTMLInput;
