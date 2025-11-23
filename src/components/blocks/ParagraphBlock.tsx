import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface ParagraphBlockProps {
  block: Block;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block }) => {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const openSlashMenu = useEditorStore((state) => state.openSlashMenu);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !block.content) {
      ref.current.focus();
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';

    // Check for slash command
    if (content === '/') {
      const rect = e.currentTarget.getBoundingClientRect();
      openSlashMenu({ x: rect.left, y: rect.bottom });
    }

    updateBlock(block.id, { content });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Will be implemented with block insertion logic
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="outline-none min-h-[1.5em] py-1 px-2 text-gray-900 empty:before:content-['Type_/_for_commands...'] empty:before:text-gray-400"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};
