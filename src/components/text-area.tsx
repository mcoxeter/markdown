import React from 'react';
import styles from './text-area.module.scss';

export type TextAreaProps = {
  id: string;
};

const TextArea: React.FC<TextAreaProps> = ({ id }) => {
  return <textarea className={styles.textarea} id={id} />;
};

export default TextArea;
