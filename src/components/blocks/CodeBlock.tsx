import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface CodeBlockProps {
  block: Block;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current && !block.content) {
      ref.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    updateBlock(block.id, { content });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        language: e.target.value,
      },
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 my-2">
      <div className="flex justify-between items-center mb-2">
        <select
          value={block.metadata?.language || 'javascript'}
          onChange={handleLanguageChange}
          className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded border-none outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="bash">Bash</option>
        </select>
      </div>
      <textarea
        ref={ref}
        value={block.content}
        onChange={handleChange}
        placeholder="Enter code..."
        className="w-full bg-transparent text-gray-100 font-mono text-sm outline-none resize-none min-h-[100px] placeholder-gray-500"
        spellCheck={false}
      />
    </div>
  );
};
