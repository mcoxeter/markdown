import React from 'react';
import styles from './toolbar-item.module.scss';

export type ToolbarItemProps = {
  id: string;
  children: React.ReactNode;
};

const ToolbarItem: React.FC<ToolbarItemProps> = ({ id, children }) => {
  return (
    <li className={styles.toolbaritem} id={id}>
      {children}
    </li>
  );
};

export default ToolbarItem;
