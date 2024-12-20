import React from 'react';
import styles from './ast-input.module.scss';
import { MarkdownContext } from '../markdown-context';

const ASTInput: React.FC = () => {
  const context = React.useContext(MarkdownContext);
  if (context.currentPanel !== 'ast') return null;
  return <textarea className={styles.astinput} />;
};

export default ASTInput;
