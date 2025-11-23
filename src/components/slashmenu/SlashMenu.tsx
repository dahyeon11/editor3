import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import type { BlockType } from '../../types/block';

interface MenuItem {
  id: BlockType;
  label: string;
  description: string;
  icon: string;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'paragraph',
    label: 'Paragraph',
    description: 'Plain text paragraph',
    icon: '¶',
    category: 'Basic Blocks',
  },
  {
    id: 'h1',
    label: 'Heading 1',
    description: 'Large heading',
    icon: 'H1',
    category: 'Basic Blocks',
  },
  {
    id: 'h2',
    label: 'Heading 2',
    description: 'Medium heading',
    icon: 'H2',
    category: 'Basic Blocks',
  },
  {
    id: 'h3',
    label: 'Heading 3',
    description: 'Small heading',
    icon: 'H3',
    category: 'Basic Blocks',
  },
  {
    id: 'bulletList',
    label: 'Bullet List',
    description: 'Create a bulleted list',
    icon: '•',
    category: 'Basic Blocks',
  },
  {
    id: 'numberedList',
    label: 'Numbered List',
    description: 'Create a numbered list',
    icon: '1.',
    category: 'Basic Blocks',
  },
  {
    id: 'checkList',
    label: 'Checklist',
    description: 'Create a checklist',
    icon: '☑',
    category: 'Basic Blocks',
  },
  {
    id: 'code',
    label: 'Code Block',
    description: 'Insert code with syntax highlighting',
    icon: '</>',
    category: 'Media',
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Upload or embed an image',
    icon: '🖼',
    category: 'Media',
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Insert a table',
    icon: '▦',
    category: 'Advanced',
  },
];

export const SlashMenu: React.FC = () => {
  const slashMenuOpen = useEditorStore((state) => state.slashMenuOpen);
  const slashMenuQuery = useEditorStore((state) => state.slashMenuQuery);
  const slashMenuPosition = useEditorStore((state) => state.slashMenuPosition);
  const closeSlashMenu = useEditorStore((state) => state.closeSlashMenu);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const convertBlockType = useEditorStore((state) => state.convertBlockType);
  const addBlock = useEditorStore((state) => state.addBlock);
  const blocks = useEditorStore((state) => state.blocks);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = menuItems.filter(
    (item) =>
      item.label.toLowerCase().includes(slashMenuQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(slashMenuQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [slashMenuQuery]);

  useEffect(() => {
    if (!slashMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectItem(filteredItems[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeSlashMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [slashMenuOpen, selectedIndex, filteredItems]);

  const handleSelectItem = (item: MenuItem) => {
    if (selectedBlockId) {
      const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
      if (selectedBlock && selectedBlock.content === '/') {
        convertBlockType(selectedBlockId, item.id);
      } else {
        const blockIndex = blocks.findIndex((b) => b.id === selectedBlockId);
        addBlock(item.id, blockIndex + 1);
      }
    }
    closeSlashMenu();
  };

  if (!slashMenuOpen || !slashMenuPosition) return null;

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-y-auto"
      style={{
        top: slashMenuPosition.y,
        left: slashMenuPosition.x,
      }}
    >
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
            {category}
          </div>
          {items.map((item) => {
            const globalIndex = filteredItems.indexOf(item);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-100 transition ${
                  globalIndex === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-2xl w-8 text-center">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          No results found
        </div>
      )}
    </div>
  );
};
