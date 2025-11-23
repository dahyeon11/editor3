import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface ListBlockProps {
  block: Block;
}

export const ListBlock: React.FC<ListBlockProps> = ({ block }) => {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !block.content) {
      ref.current.focus();
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    updateBlock(block.id, { content });
  };

  const handleCheckboxChange = () => {
    if (block.type === 'checkList') {
      updateBlock(block.id, {
        metadata: {
          ...block.metadata,
          checked: !block.metadata?.checked,
        },
      });
    }
  };

  const renderListIcon = () => {
    switch (block.type) {
      case 'bulletList':
        return <span className="mr-2 text-gray-600">•</span>;
      case 'numberedList':
        return <span className="mr-2 text-gray-600">1.</span>;
      case 'checkList':
        return (
          <input
            type="checkbox"
            checked={block.metadata?.checked || false}
            onChange={handleCheckboxChange}
            className="mr-2 w-4 h-4 cursor-pointer"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start py-1">
      {renderListIcon()}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className={`outline-none flex-1 px-2 text-gray-900 empty:before:content-['List_item'] empty:before:text-gray-400 ${
          block.metadata?.checked ? 'line-through text-gray-500' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  );
};
