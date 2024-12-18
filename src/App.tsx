import { useState, useCallback } from 'react';

function App() {
  const [content, setContent] = useState(
    'This is <b>bold and <i>italic</i></b>'
  );
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const selection = window.getSelection();
      if (selection) {
        const savedRange = saveRange(selection.getRangeAt(0));
        setContent((e.target as Element).innerHTML);
        window.setTimeout(() => {
          if (window.getSelection) {
            //non IE and there is already a selection
            const s = window.getSelection();
            if (s) {
              if (s.rangeCount > 0) {
                s.removeAllRanges();
              }

              s.addRange(restoreRange(savedRange));
            }
          }
        }, 0);
      }
    },
    [setContent]
  );

  const saveSelection = () => {};

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyUp={saveSelection}
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '50px',
        outline: 'none'
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
}

interface SavedRange {
  startContainerPath: number[];
  startOffset: number;
  endContainerPath: number[];
  endOffset: number;
}
// Function to save a Range object
function saveRange(range: Range): SavedRange {
  return {
    startContainerPath: getNodePath(range.startContainer),
    startOffset: range.startOffset,
    endContainerPath: getNodePath(range.endContainer),
    endOffset: range.endOffset
  };
}

// Function to restore a Range object
function restoreRange(savedRange: SavedRange): Range {
  const range = document.createRange();
  const startContainer = resolveNodePath(savedRange.startContainerPath);
  const endContainer = resolveNodePath(savedRange.endContainerPath);
  range.setStart(startContainer, savedRange.startOffset);
  range.setEnd(endContainer, savedRange.endOffset);
  return range;
}

function getNodePath(node: Node): number[] {
  const path: number[] = [];
  while (node.parentNode) {
    const parent = node.parentNode as Node;
    const index = Array.prototype.indexOf.call(parent.childNodes, node);
    path.unshift(index);
    node = parent;
  }
  return path;
}

function resolveNodePath(path: number[]): Node {
  let node: Node = document;
  for (const index of path) {
    node = node.childNodes[index] as Node;
  }
  return node;
}

export default App;
