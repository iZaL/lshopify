import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  convertFromHTML,
  ContentState,
  EditorState,
} from 'draft-js'
import {stateToHTML} from 'draft-js-export-html';

interface TextAreaProps {
  name: string;
  autocomplete?: string;
  placeholder?: string;
  style?: string;
  onChange: (value: any) => void;
  value?: string;
}

export default function TextArea({
  placeholder,
  onChange,
  value,
}: TextAreaProps) {

  const html = convertFromHTML(value ? value : '');
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(html.contentBlocks, html.entityMap)));

  const onEditorStateChange = (content:EditorState) => {
    const htmlContent = stateToHTML(content.getCurrentContent());
    const currentContentState = editorState.getCurrentContent();
    const newContentState = content.getCurrentContent();
    if (currentContentState !== newContentState) {
      onChange(htmlContent);
    }
    setEditorState(content);
  };

  return (
    <div className="z-30 mt-1 flex border border-gray-300 rounded-md shadow-sm">
      <Editor
        placeholder={placeholder}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}
