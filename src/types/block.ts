export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'code'
  | 'image'
  | 'table';

export interface InlineStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  backgroundColor?: string;
}

export interface TableCell {
  id: string;
  content: string;
  rowSpan?: number;
  colSpan?: number;
  merged?: boolean; // If true, this cell is merged into another cell
}

export interface TableData {
  rows: TableCell[][];
  colWidths?: number[]; // Column widths in pixels
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  children?: Block[];
  metadata?: {
    checked?: boolean; // For checkList
    language?: string; // For code blocks
    url?: string; // For images
    alt?: string; // For images
    tableData?: TableData; // For tables
    level?: number; // For nested lists
    styles?: InlineStyle[];
  };
}

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  slashMenuOpen: boolean;
  slashMenuQuery: string;
  slashMenuPosition: { x: number; y: number } | null;
}
