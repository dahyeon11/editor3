import React from 'react';
import type { Block } from '../../types/block';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { ListBlock } from './ListBlock';
import { CodeBlock } from './CodeBlock';
import { ImageBlock } from './ImageBlock';
import { TableBlock } from './TableBlock';
import { BlockWrapper } from './BlockWrapper';

interface BlockRendererProps {
  block: Block;
  index: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, index }) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlock block={block} />;
      case 'h1':
      case 'h2':
      case 'h3':
        return <HeadingBlock block={block} />;
      case 'bulletList':
      case 'numberedList':
      case 'checkList':
        return <ListBlock block={block} />;
      case 'code':
        return <CodeBlock block={block} />;
      case 'image':
        return <ImageBlock block={block} />;
      case 'table':
        return <TableBlock block={block} />;
      default:
        return <ParagraphBlock block={block} />;
    }
  };

  return (
    <BlockWrapper block={block} index={index}>
      {renderBlockContent()}
    </BlockWrapper>
  );
};
