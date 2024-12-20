import styles from './toolbar.module.scss';
import { FC, useContext } from 'react';
import ToolbarItem from './toolbar-item';
import Button from '../button';
import { MarkdownContext } from './markdown-context';

const Toolbar: FC = () => {
  const context = useContext(MarkdownContext);
  return (
    <menu className={styles.toolbar}>
      <ToolbarItem>
        <Button
          id='write'
          label='Editor'
          active={context.currentPanel === 'wysiwyg'}
          onClick={() => context.setCurrentPanel('wysiwyg')}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Button
          id='ast'
          label='Markdown'
          active={context.currentPanel === 'markdown'}
          onClick={() => context.setCurrentPanel('markdown')}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Button
          id='html'
          label='HTML'
          active={context.currentPanel === 'html'}
          onClick={() => context.setCurrentPanel('html')}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Button
          id='markdown'
          label='AST'
          active={context.currentPanel === 'ast'}
          onClick={() => context.setCurrentPanel('ast')}
        />
      </ToolbarItem>

      <div style={{ flex: '1' }}></div>
      <ToolbarItem>
        <Button id='heading' label='H' />
      </ToolbarItem>
      <ToolbarItem>
        <Button id='bold' label='B' bold />
      </ToolbarItem>
      <ToolbarItem>
        <Button id='italic' label='I' italic />
      </ToolbarItem>
    </menu>
  );
};

export default Toolbar;
