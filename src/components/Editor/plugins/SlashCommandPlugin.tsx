import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical';
import React, { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

class CommandPickerOption extends MenuOption {
  title: string;
  icon?: React.ReactElement;
  keywords: Array<string>;
  keyboardShortcut?: string;
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: React.ReactElement;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function CommandPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: CommandPickerOption;
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {option.icon && <span className="text-lg">{option.icon}</span>}
      <span className="flex-1 text-sm">{option.title}</span>
      {option.keyboardShortcut && (
        <span className="text-xs text-gray-400">{option.keyboardShortcut}</span>
      )}
    </li>
  );
}

export default function SlashCommandPlugin(): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const getDynamicOptions = useCallback(() => {
    const options: Array<CommandPickerOption> = [];

    if (queryString == null) {
      return options;
    }

    const fullTableRegex = new RegExp(/^([1-9]|10)x([1-9]|10)$/);
    const partialTableRegex = new RegExp(/^([1-9]|10)x?$/);

    if (partialTableRegex.test(queryString)) {
      const [rows, columns] = queryString.split('x').map((n: string) => parseInt(n, 10));

      if (fullTableRegex.test(queryString)) {
        options.push(
          new CommandPickerOption(`${rows}x${columns} Table`, {
            icon: <span>📊</span>,
            keywords: ['table'],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: String(columns), rows: String(rows) }),
          }),
        );
      }
    }

    return options;
  }, [editor, queryString]);

  const options = useMemo(() => {
    const baseOptions = [
      new CommandPickerOption('Paragraph', {
        icon: <span>¶</span>,
        keywords: ['normal', 'paragraph', 'p', 'text'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          }),
      }),
      ...([1, 2, 3] as const).map(
        (n) =>
          new CommandPickerOption(`Heading ${n}`, {
            icon: <span>H{n}</span>,
            keywords: ['heading', 'header', `h${n}`],
            onSelect: () =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
                }
              }),
          }),
      ),
      new CommandPickerOption('Numbered List', {
        icon: <span>1.</span>,
        keywords: ['numbered list', 'ordered list', 'ol'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new CommandPickerOption('Bulleted List', {
        icon: <span>•</span>,
        keywords: ['bulleted list', 'unordered list', 'ul'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new CommandPickerOption('Check List', {
        icon: <span>☑</span>,
        keywords: ['check list', 'todo list', 'checkbox'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new CommandPickerOption('Quote', {
        icon: <span>"</span>,
        keywords: ['block quote', 'quote'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          }),
      }),
      new CommandPickerOption('Code', {
        icon: <span>{'{ }'}</span>,
        keywords: ['javascript', 'python', 'js', 'codeblock'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
              } else {
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
              }
            }
          }),
      }),
      new CommandPickerOption('Table', {
        icon: <span>📊</span>,
        keywords: ['table', 'grid', 'spreadsheet'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: '3',
            rows: '3',
          }),
      }),
      new CommandPickerOption('Image', {
        icon: <span>🖼</span>,
        keywords: ['image', 'photo', 'picture', 'img'],
        onSelect: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    altText: file.name,
                    src: event.target.result as string,
                  });
                }
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        },
      }),
    ];

    const dynamicOptions = getDynamicOptions();

    return queryString
      ? [
          ...dynamicOptions,
          ...baseOptions.filter((option) => {
            return new RegExp(queryString, 'gi').exec(option.title) ||
              option.keywords != null
              ? option.keywords.some((keyword) =>
                  new RegExp(queryString, 'gi').exec(keyword),
                )
              : false;
          }),
        ]
      : baseOptions;
  }, [editor, getDynamicOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: CommandPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<CommandPickerOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="absolute z-50 mt-6 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-80 overflow-y-auto">
                <ul className="list-none m-0 p-0">
                  {options.map((option, i: number) => (
                    <CommandPickerMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
