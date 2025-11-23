import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface BlockWrapperProps {
  block: Block;
  index: number;
  children: React.ReactNode;
}

const ItemType = 'BLOCK';

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, index, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const moveBlock = useEditorStore((state) => state.moveBlock);
  const deleteBlock = useEditorStore((state) => state.deleteBlock);
  const setSelectedBlock = useEditorStore((state) => state.setSelectedBlock);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const isSelected = selectedBlockId === block.id;

  return (
    <div
      ref={ref}
      className={`
        group relative py-1 px-2 rounded
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isOver ? 'bg-blue-50' : ''}
        ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'}
      `}
      onClick={() => setSelectedBlock(block.id)}
    >
      {/* Drag Handle */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6
                   opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing
                   text-gray-400 hover:text-gray-600 transition-opacity"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="10" cy="3" r="1.5" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="10" cy="13" r="1.5" />
        </svg>
      </div>

      {/* Block Content */}
      <div className="relative">
        {children}
      </div>

      {/* Delete Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteBlock(block.id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     opacity-0 group-hover:opacity-100
                     text-gray-400 hover:text-red-600 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>
        </button>
      )}
    </div>
  );
};
