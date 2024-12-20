import React from 'react';
import styles from './wysiwyg-input.module.scss';
import { MarkdownContext } from '../markdown-context';

const WYSIWYGInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  if (context.currentPanel !== 'wysiwyg') return null;
  return <textarea className={styles.wysiwyginput} />;
};

export default WYSIWYGInput;
