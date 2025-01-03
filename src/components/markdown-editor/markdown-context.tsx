import { createContext, useMemo, useState } from 'react';

export type PanelType = 'markdown' | 'ast' | 'html' | 'wysiwyg';

export type MarkdownContextType = {
  currentPanel: PanelType;
  setCurrentPanel: React.Dispatch<React.SetStateAction<PanelType>>;
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
};

const defaultMarkdownContext: MarkdownContextType = {
  currentPanel: 'wysiwyg',
  setCurrentPanel: () => {},
  markdown: '',
  setMarkdown: () => {}
};

export const MarkdownContext = createContext<MarkdownContextType>({
  ...defaultMarkdownContext
});

export const MarkdownContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>('wysiwyg');
  const [markdown, setMarkdown] = useState<string>('');
  const value = useMemo(
    () => ({ currentPanel, setCurrentPanel, markdown, setMarkdown }),
    [currentPanel, markdown]
  );

  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  );
};
