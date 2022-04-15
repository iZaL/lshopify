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
  richText?: boolean
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
  richText,
  autocomplete,
  name,
  style,
  ...props
}: TextAreaProps) {

  if(!richText) {
    return (
      <div className="mt-1 flex rounded-md shadow-sm">
        <textarea
          name={name}
          id={name}
          autoComplete={autocomplete ? autocomplete : ''}
          placeholder={placeholder}
          onChange={onChange}
          className={`block w-full rounded-md border border-gray-300 py-2 px-4 shadow-sm sm:text-sm ${style}`}
          {...props}
        />
      </div>
    )
  }

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
