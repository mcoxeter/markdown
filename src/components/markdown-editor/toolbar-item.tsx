import React from 'react';
import styles from './toolbar-item.module.scss';

export type ToolbarItemProps = {
  children: React.ReactNode;
};

const ToolbarItem: React.FC<ToolbarItemProps> = ({ children }) => {
  return <li className={styles.toolbaritem}>{children}</li>;
};

export default ToolbarItem;
