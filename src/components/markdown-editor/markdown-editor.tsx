import React from 'react';
import styles from './markdown-editor.module.scss';
import Toolbar from './toolbar';
import WYSIWYGInput from './panels/wysiwyg-input';
import { MarkdownContextProvider } from './markdown-context';
import HTMLInput from './panels/html-input';
import ASTInput from './panels/ast-input';
import MarkdownInput from './panels/markdown-input';

const Markdown: React.FC = () => {
  return (
    <MarkdownContextProvider>
      <div className={styles.markdown}>
        <Toolbar />
        <WYSIWYGInput />
        <HTMLInput />
        <MarkdownInput />
        <ASTInput />
      </div>
    </MarkdownContextProvider>
  );
};

export default Markdown;
