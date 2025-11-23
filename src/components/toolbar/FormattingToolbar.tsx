import React, { useState, useEffect } from 'react';

export const FormattingToolbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50,
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-gray-800 rounded-lg shadow-xl px-2 py-1 flex items-center gap-1"
      style={{
        top: position.y,
        left: position.x,
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => applyFormat('bold')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm font-bold"
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button
        onClick={() => applyFormat('italic')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm italic"
        title="Italic (Ctrl+I)"
      >
        I
      </button>
      <button
        onClick={() => applyFormat('underline')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm underline"
        title="Underline (Ctrl+U)"
      >
        U
      </button>
      <button
        onClick={() => applyFormat('strikeThrough')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm line-through"
        title="Strikethrough"
      >
        S
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={() => applyFormat('foreColor', '#ef4444')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition"
        title="Text Color"
      >
        <span className="text-red-500">A</span>
      </button>
      <button
        onClick={() => applyFormat('hiliteColor', '#fef08a')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition"
        title="Highlight"
      >
        <span className="bg-yellow-200 text-gray-900 px-1">H</span>
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) applyFormat('createLink', url);
        }}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm"
        title="Link"
      >
        🔗
      </button>
      <button
        onClick={() => applyFormat('removeFormat')}
        className="px-2 py-1 text-white hover:bg-gray-700 rounded transition text-sm"
        title="Clear Formatting"
      >
        ✕
      </button>
    </div>
  );
};
