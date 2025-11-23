import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEditorStore } from '../store/editorStore';
import { BlockRenderer } from './blocks/BlockRenderer';
import { SlashMenu } from './slashmenu/SlashMenu';
import { FormattingToolbar } from './toolbar/FormattingToolbar';

export const Editor: React.FC = () => {
  const blocks = useEditorStore((state) => state.blocks);
  const addBlock = useEditorStore((state) => state.addBlock);

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking on the editor background (not a block), add a new paragraph
    if (e.target === e.currentTarget) {
      addBlock('paragraph');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg min-h-[600px]">
          {/* Editor Header */}
          <div className="border-b border-gray-200 px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Notion-Style Editor</h1>
            <p className="text-sm text-gray-500 mt-1">
              Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> for commands
            </p>
          </div>

          {/* Editor Content */}
          <div
            className="px-8 py-6 min-h-[500px] cursor-text"
            onClick={handleEditorClick}
          >
            {blocks.map((block, index) => (
              <BlockRenderer key={block.id} block={block} index={index} />
            ))}

            {blocks.length === 0 && (
              <div className="text-gray-400 text-center py-20">
                Click here to start writing...
              </div>
            )}
          </div>
        </div>

        {/* Floating UI Components */}
        <SlashMenu />
        <FormattingToolbar />
      </div>
    </DndProvider>
  );
};
