import ChatCommands from './ChatCommands';
import CommandDropdown from './CommandDropdown';
import Element from './Element';
import SendIcon from '@mui/icons-material/Send';

import { Box, IconButton } from '@mui/material';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import React, { useCallback, useState } from 'react';
import { Transforms, createEditor } from 'slate';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
const insertBox = (editor, arg) => {
  const box = {
    type: 'box',
    prompt: arg,
    content: '',
    children: [{ text: '' }],
  };

  Transforms.insertText(editor, ' ');
  Transforms.move(editor);
  Transforms.insertText(editor, '\u200B');
  Transforms.move(editor, { distance: 1, reverse: true });
  Transforms.insertNodes(editor, box);
};

const extractTextFromNodes = (nodes) => {
  let text = '';

  nodes.forEach((node) => {
    if (node.text) {
      text += node.text;
    } else if (node.children) {
      text += extractTextFromNodes(node.children);
    }
  });

  return text;
};

const withInlines = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'box' ? true : isInline(element);
  };

  return editor;
};

function MessageInput() {
  const [editor] = useState(() => withInlines(withReact(createEditor())));
  const [showCommands, setShowCommands] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(-1);
  const [editorEmpty, setEditorEmpty] = useState(true);

  const handleSend = useCallback(() => {
    const content = extractTextFromNodes(editor.children[0].children);
    console.log(content);
    Transforms.delete(editor, { at: [0], unit: 'block' });
    Transforms.insertNodes(editor, initialValue[0]);
  }, [editor]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        const content = extractTextFromNodes(editor.children[0].children);
        const command = ChatCommands.find((c) => content.trim().startsWith(c.command));

        if (command && command.inputs && command.inputs[currentInputIndex + 1]) {
          insertBox(editor, command.inputs[currentInputIndex + 1].title);
          setCurrentInputIndex(currentInputIndex + 1);
        }
      } else if (event.key === '/') {
        const content = extractTextFromNodes(editor.children[0].children);
        if (content.endsWith('/')) {
          setShowCommands(true);
        } else {
          setShowCommands(false);
        }
      }
    },
    [editor, currentInputIndex, handleSend]
  );

  const handleKeyUp = useCallback(() => {
    const content = editor.children[0].children.map((n) => n.text).join('');
    if (content.endsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [editor.children]);

  const handleCommandSelect = (command) => {
    Transforms.insertText(editor, command.command.replace(/^\//, ''));

    if (command.inputs && command.inputs[0]) {
      insertBox(editor, command.inputs[0].title);
      setCurrentInputIndex(0);
    }
    setShowCommands(false);
    ReactEditor.focus(editor);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderTop: '1px solid #202225',
        backgroundColor: '#2f3136',
      }}
    >
      <div
        style={{
          position: 'relative',
          flexGrow: 1,
        }}
      >
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={() => {
            const content = extractTextFromNodes(editor.children[0].children);
            if (content.trim().length === 0) {
              setEditorEmpty(true);
            } else {
              setEditorEmpty(false);
            }
          }}
        >
          <Editable
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            renderElement={Element}
            data-testid="message-input"
            style={{
              flexGrow: 1,
              borderRadius: '25px',
              backgroundColor: '#40444B',
              padding: '10px 14px',
              outline: 'none',
              minWidth: 0,
              color: 'white',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              border: '1px solid #40444B',
              '&:focus': {
                borderColor: '#7289da',
              },
            }}
          />
        </Slate>
        {showCommands && <CommandDropdown commands={ChatCommands} onSelect={handleCommandSelect} />}
      </div>
      <IconButton
        data-testid="send-button"
        onClick={handleSend}
        color="primary"
        disabled={editorEmpty}
        sx={{
          color: '#7289da',
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}

export default MessageInput;
