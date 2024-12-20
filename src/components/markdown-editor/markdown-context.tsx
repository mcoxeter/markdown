import { createContext, useState } from 'react';

export type PanelType = 'markdown' | 'ast' | 'html' | 'wysiwyg';

export type MarkdownContextType = {
  currentPanel: PanelType;
  setCurrentPanel: React.Dispatch<React.SetStateAction<PanelType>>;
};

const defaultMarkdownContext: MarkdownContextType = {
  currentPanel: 'wysiwyg',
  setCurrentPanel: () => {}
};

export const MarkdownContext = createContext<MarkdownContextType>({
  ...defaultMarkdownContext
});

export const MarkdownContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>('wysiwyg');
  return (
    <MarkdownContext.Provider value={{ currentPanel, setCurrentPanel }}>
      {children}
    </MarkdownContext.Provider>
  );
};
