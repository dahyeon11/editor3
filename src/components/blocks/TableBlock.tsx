import React, { useState } from 'react';
import type { Block } from '../../types/block';
import { useEditorStore } from '../../store/editorStore';
import { v4 as uuidv4 } from 'uuid';

interface TableBlockProps {
  block: Block;
}

export const TableBlock: React.FC<TableBlockProps> = ({ block }) => {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  const tableData = block.metadata?.tableData;
  if (!tableData) return null;

  const handleCellChange = (rowIndex: number, colIndex: number, content: string) => {
    const newRows = tableData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? { ...cell, content } : cell))
        : row
    );

    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          rows: newRows,
        },
      },
    });
  };

  const addRow = (index: number) => {
    const newRow = Array(tableData.rows[0].length)
      .fill(null)
      .map(() => ({
        id: uuidv4(),
        content: '',
      }));

    const newRows = [...tableData.rows];
    newRows.splice(index + 1, 0, newRow);

    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          rows: newRows,
        },
      },
    });
  };

  const deleteRow = (index: number) => {
    if (tableData.rows.length <= 1) return;

    const newRows = tableData.rows.filter((_, idx) => idx !== index);
    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          rows: newRows,
        },
      },
    });
  };

  const addColumn = (index: number) => {
    const newRows = tableData.rows.map((row) => {
      const newRow = [...row];
      newRow.splice(index + 1, 0, { id: uuidv4(), content: '' });
      return newRow;
    });

    const newColWidths = [...(tableData.colWidths || [])];
    newColWidths.splice(index + 1, 0, 200);

    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          rows: newRows,
          colWidths: newColWidths,
        },
      },
    });
  };

  const deleteColumn = (index: number) => {
    if (tableData.rows[0].length <= 1) return;

    const newRows = tableData.rows.map((row) => row.filter((_, idx) => idx !== index));
    const newColWidths = (tableData.colWidths || []).filter((_, idx) => idx !== index);

    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          rows: newRows,
          colWidths: newColWidths,
        },
      },
    });
  };

  const handleResizeStart = (colIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingCol(colIndex);
    setResizeStartX(e.clientX);
    setInitialWidth(tableData.colWidths?.[colIndex] || 200);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (resizingCol === null) return;

    const delta = e.clientX - resizeStartX;
    const newWidth = Math.max(100, initialWidth + delta);

    const newColWidths = [...(tableData.colWidths || [])];
    newColWidths[resizingCol] = newWidth;

    updateBlock(block.id, {
      metadata: {
        ...block.metadata,
        tableData: {
          ...tableData,
          colWidths: newColWidths,
        },
      },
    });
  };

  const handleResizeEnd = () => {
    setResizingCol(null);
  };

  React.useEffect(() => {
    if (resizingCol !== null) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingCol, resizeStartX, initialWidth]);

  return (
    <div className="my-4 overflow-x-auto">
      <table className="border-collapse border border-gray-300">
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="group/row">
              {/* Row Actions */}
              <td className="relative w-8 bg-gray-50 border border-gray-300">
                <div className="flex flex-col items-center justify-center h-full opacity-0 group-hover/row:opacity-100 transition-opacity">
                  <button
                    onClick={() => addRow(rowIndex)}
                    className="text-xs text-gray-600 hover:text-blue-600 p-1"
                    title="Add row below"
                  >
                    +
                  </button>
                  {tableData.rows.length > 1 && (
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="text-xs text-gray-600 hover:text-red-600 p-1"
                      title="Delete row"
                    >
                      ×
                    </button>
                  )}
                </div>
              </td>

              {row.map((cell, colIndex) => (
                <td
                  key={cell.id}
                  className="border border-gray-300 p-2 relative group/cell"
                  style={{ width: tableData.colWidths?.[colIndex] || 200 }}
                  rowSpan={cell.rowSpan}
                  colSpan={cell.colSpan}
                >
                  {!cell.merged && (
                    <>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) =>
                          handleCellChange(rowIndex, colIndex, e.currentTarget.textContent || '')
                        }
                        className="outline-none min-h-[24px] empty:before:content-[''] empty:before:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: cell.content }}
                      />

                      {/* Column Resize Handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 group-hover/cell:bg-gray-300"
                        onMouseDown={(e) => handleResizeStart(colIndex, e)}
                      />
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Column Actions Row */}
          <tr>
            <td className="border border-gray-300 bg-gray-50"></td>
            {tableData.rows[0].map((_, colIndex) => (
              <td
                key={colIndex}
                className="border border-gray-300 bg-gray-50 p-1 group/col"
              >
                <div className="flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity">
                  <button
                    onClick={() => addColumn(colIndex)}
                    className="text-xs text-gray-600 hover:text-blue-600 px-2"
                    title="Add column"
                  >
                    +
                  </button>
                  {tableData.rows[0].length > 1 && (
                    <button
                      onClick={() => deleteColumn(colIndex)}
                      className="text-xs text-gray-600 hover:text-red-600 px-2"
                      title="Delete column"
                    >
                      ×
                    </button>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
