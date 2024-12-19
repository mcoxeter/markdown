import React from 'react';
import styles from './toolbar.module.scss';
import ToolbarItem from './toolbar-item';
import Button from './button';

const Toolbar: React.FC = () => {
  return (
    <menu className={styles.toolbar}>
      <ToolbarItem id='write'>
        <Button id='write' label='Write' active />
      </ToolbarItem>
      <ToolbarItem id='markdown'>
        <Button id='markdown' label='Preview' />
      </ToolbarItem>
      <ToolbarItem id='ast'>
        <Button id='ast' label='AST.' />
      </ToolbarItem>
      <div style={{ flex: '1' }}></div>
      <ToolbarItem id='heading'>
        <Button id='heading' label='H' />
      </ToolbarItem>
      <ToolbarItem id='bold'>
        <Button id='bold' label='B' bold />
      </ToolbarItem>
      <ToolbarItem id='italic'>
        <Button id='italic' label='I' italic />
      </ToolbarItem>
    </menu>
  );
};

export default Toolbar;
