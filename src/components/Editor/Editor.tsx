import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import SlashCommandPlugin from './plugins/SlashCommandPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import { ImageNode } from './nodes/ImageNode';
import theme from './theme/EditorTheme';
import { useRef } from 'react';

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Type '/' for commands...
    </div>
  );
}

const editorConfig = {
  namespace: 'NotionEditor',
  theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
};

export default function Editor() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <LexicalComposer initialConfig={editorConfig}>
          <div className="editor-container relative">
            <ToolbarPlugin />
            <div className="relative" ref={scrollRef}>
              <RichTextPlugin
                contentEditable={
                  <div className="editor-scroller">
                    <div className="editor">
                      <ContentEditable className="editor-input" />
                    </div>
                  </div>
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <CheckListPlugin />
              <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
              <ImagesPlugin />
              <SlashCommandPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              {scrollRef.current && (
                <DraggableBlockPlugin anchorElem={scrollRef.current} />
              )}
            </div>
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
