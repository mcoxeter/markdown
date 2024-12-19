import React from 'react';
import styles from './markdown.module.scss';
import Toolbar from './toolbar';
import TextArea from './text-area';

const Markdown: React.FC = () => {
  return (
    <div className={styles.markdown}>
      <Toolbar />
      <TextArea id='textarea' />
    </div>
  );
};

export default Markdown;
