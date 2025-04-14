import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function RichText() {
  const [editorHtml, setEditorHtml] = useState("");
  const [selectFinal, setSelectFinal] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  const quillRef = useRef();

  useEffect(() => {
    const editor = quillRef.current.getEditor();

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          console.log('Content added to the editor:', mutation.addedNodes);
          
        }
      }
    });

    observer.observe(editor.root, {
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const range = quillRef.current.getEditor().getSelection(true);
      const tabCharacter = "\u00A0\u00A0\u00A0\u00A0"; 
      quillRef.current.getEditor().insertText(range.index, tabCharacter);
      quillRef.current
        .getEditor()
        .setSelection(range.index + tabCharacter.length);
    } else if (e.key === " ") {
      e.preventDefault();
      const range = quillRef.current.getEditor().getSelection(true);
      quillRef.current.getEditor().insertText(range.index, "\u00A0"); 
      quillRef.current.getEditor().setSelection(range.index + 1); 
    }
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image", "video"],
      ],
    },
  };

  const handleInsertText = () => {
    if (selectFinal) {
      const formattedText = selectFinal.value;
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const selection = quill.getSelection();

        if (selection) {
          const cursorPos = selection.index;
          quill.insertText(cursorPos, formattedText);
          quill.setSelection(cursorPos + formattedText.length);
        }
      }
    }
  };

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={editorHtml}
        onChange={setEditorHtml}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}

export default RichText;
