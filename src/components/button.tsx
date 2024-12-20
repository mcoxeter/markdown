import React from 'react';
import styles from './button.module.scss';

export type ButtonProps = {
  id: string;
  label: string;
  italic?: boolean;
  bold?: boolean;
  active?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  id,
  label,
  italic = false,
  bold = false,
  active = false,
  onClick
}) => {
  return (
    <button
      className={[styles.button, active ? styles.active : ''].join(' ')}
      id={id}
      onClick={onClick}
    >
      <Italic italic={italic}>
        <Bold bold={bold}>{label}</Bold>
      </Italic>
    </button>
  );
};

export default Button;

const Italic: React.FC<{ italic: boolean; children: React.ReactNode }> = ({
  italic,
  children
}) => {
  return italic ? <i>{children}</i> : children;
};

const Bold: React.FC<{ bold: boolean; children: React.ReactNode }> = ({
  bold,
  children
}) => {
  return bold ? <b>{children}</b> : children;
};
