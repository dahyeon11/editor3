import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface HeadingBlockProps {
  block: Block;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
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

  const getHeadingClass = () => {
    switch (block.type) {
      case 'h1':
        return 'text-4xl font-bold';
      case 'h2':
        return 'text-3xl font-bold';
      case 'h3':
        return 'text-2xl font-bold';
      default:
        return 'text-xl font-bold';
    }
  };

  const Tag = block.type === 'h1' ? 'h1' : block.type === 'h2' ? 'h2' : 'h3';

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      className={`outline-none py-2 px-2 text-gray-900 ${getHeadingClass()} empty:before:content-['Heading'] empty:before:text-gray-400`}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};
