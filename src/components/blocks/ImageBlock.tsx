import React, { useRef } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';

interface ImageBlockProps {
  block: Block;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        updateBlock(block.id, {
          metadata: {
            ...block.metadata,
            url,
            alt: file.name,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBlock(block.id, { content: e.target.value });
  };

  return (
    <div className="my-4">
      {block.metadata?.url ? (
        <div className="space-y-2">
          <img
            src={block.metadata.url}
            alt={block.metadata.alt || 'Uploaded image'}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
          <input
            type="text"
            value={block.content}
            onChange={handleCaptionChange}
            placeholder="Add a caption..."
            className="w-full text-sm text-gray-600 italic outline-none border-none px-2 py-1"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Upload Image
          </button>
          <p className="text-gray-500 text-sm mt-2">
            or drag and drop an image here
          </p>
        </div>
      )}
    </div>
  );
};
