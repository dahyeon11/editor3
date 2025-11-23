import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Block, BlockType, EditorState } from '../types/block';

interface EditorActions {
  addBlock: (type: BlockType, position?: number) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  setSelectedBlock: (id: string | null) => void;
  openSlashMenu: (position: { x: number; y: number }) => void;
  closeSlashMenu: () => void;
  setSlashMenuQuery: (query: string) => void;
  convertBlockType: (id: string, newType: BlockType) => void;
  duplicateBlock: (id: string) => void;
}

type EditorStore = EditorState & EditorActions;

const createEmptyBlock = (type: BlockType): Block => {
  const block: Block = {
    id: uuidv4(),
    type,
    content: '',
    children: [],
  };

  // Initialize metadata based on block type
  if (type === 'checkList') {
    block.metadata = { checked: false };
  } else if (type === 'code') {
    block.metadata = { language: 'javascript' };
  } else if (type === 'image') {
    block.metadata = { url: '', alt: '' };
  } else if (type === 'table') {
    // Create a default 3x3 table
    const defaultRows = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => ({
            id: uuidv4(),
            content: '',
          }))
      );
    block.metadata = {
      tableData: {
        rows: defaultRows,
        colWidths: [200, 200, 200],
      },
    };
  }

  return block;
};

export const useEditorStore = create<EditorStore>((set) => ({
  // Initial state
  blocks: [createEmptyBlock('paragraph')],
  selectedBlockId: null,
  slashMenuOpen: false,
  slashMenuQuery: '',
  slashMenuPosition: null,

  // Actions
  addBlock: (type: BlockType, position?: number) =>
    set((state) => {
      const newBlock = createEmptyBlock(type);
      const blocks = [...state.blocks];

      if (position !== undefined) {
        blocks.splice(position, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }

      return { blocks, slashMenuOpen: false, selectedBlockId: newBlock.id };
    }),

  deleteBlock: (id: string) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    })),

  updateBlock: (id: string, updates: Partial<Block>) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    })),

  moveBlock: (fromIndex: number, toIndex: number) =>
    set((state) => {
      const blocks = [...state.blocks];
      const [movedBlock] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, movedBlock);
      return { blocks };
    }),

  setSelectedBlock: (id: string | null) =>
    set({ selectedBlockId: id }),

  openSlashMenu: (position: { x: number; y: number }) =>
    set({ slashMenuOpen: true, slashMenuPosition: position, slashMenuQuery: '' }),

  closeSlashMenu: () =>
    set({ slashMenuOpen: false, slashMenuPosition: null, slashMenuQuery: '' }),

  setSlashMenuQuery: (query: string) =>
    set({ slashMenuQuery: query }),

  convertBlockType: (id: string, newType: BlockType) =>
    set((state) => {
      const block = state.blocks.find((b) => b.id === id);
      if (!block) return state;

      const newBlock = createEmptyBlock(newType);
      newBlock.id = id;
      newBlock.content = block.content;

      return {
        blocks: state.blocks.map((b) => (b.id === id ? newBlock : b)),
        slashMenuOpen: false,
      };
    }),

  duplicateBlock: (id: string) =>
    set((state) => {
      const blockIndex = state.blocks.findIndex((b) => b.id === id);
      if (blockIndex === -1) return state;

      const block = state.blocks[blockIndex];
      const newBlock = { ...block, id: uuidv4() };
      const blocks = [...state.blocks];
      blocks.splice(blockIndex + 1, 0, newBlock);

      return { blocks };
    }),
}));
