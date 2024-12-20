import React from 'react';
import styles from './markdown-input.module.scss';
import { MarkdownContext } from '../markdown-context';

const MarkdownInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  if (context.currentPanel !== 'markdown') return null;
  return <textarea className={styles.markdowninput} />;
};

export default MarkdownInput;
