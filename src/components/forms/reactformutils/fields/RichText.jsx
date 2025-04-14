import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import FieldDom from "./FieldDom";
import ReactQuill from "react-quill";
import { getServiceData } from "src/components/server/service";

const handleKeyDown = (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const range = ref.current.getEditor().getSelection(true);
    const tabCharacter =
      "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"; // Four spaces for a tab
    ref.current.getEditor().insertText(range.index, tabCharacter);
    ref.current.getEditor().setSelection(range.index + tabCharacter.length);
  } else if (e.key === " ") {
    e.preventDefault();
    const range = ref.current.getEditor().getSelection(true);
    ref.current.getEditor().insertText(range.index, "\u00A0"); // Insert non-breaking space character
    ref.current.getEditor().setSelection(range.index + 1); // Move cursor past inserted non-breaking space
  } else {
    onKeyDown(e);
  }
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "script",
  "sub",
  "super",
  "indent",
  "direction",
  "size",
  "color",
  "background",
  "font",
  "align",
  "link",
  "image",
  "video",
];

function RichText(props) {
  const {
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    fieldDef,
    workflowId,
    formId,
    control,
    editable,
    field_title,
    isMulti,
    ...rest
  } = props;
  const [editorHtml, setEditorHtml] = useState("");
  const [finalvalues, setFinalValues] = useState([]);
  const [selectFinal, setSelectFinal] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  const { setValue, getValues } = props.formMethods;
  const quillRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServiceData("Dforms", props.formId);
        const json = response.data;
        const resultArray = json.map((item) => {
          const [displayColumn, fieldTitle] = item
            .split(",")
            .map((value) => value.trim());
          return { displayColumn, fieldTitle };
        });

        const dropdownOptions = resultArray.map((options) => ({
          label: options.fieldTitle,
          value: "${" + options.displayColumn + "}",
        }));

        setFinalValues(dropdownOptions);
        setEditorHtml(json.content || "");
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [props.formId]);

  // useEffect(() => {
  //   getFieldsService("Dforms", 0, formId)
  //     .then((response) => {
  //       console.log("getForms response", response.data);

  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [formId]);

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
        } else if (cursorPosition !== null) {
          quill.insertText(cursorPosition, formattedText);
          quill.setSelection(cursorPosition + formattedText.length);
        }
      }
    }
  };

  const handleSelectionChange = (range) => {
    setCursorPosition(range.index);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },
      }}
      render={({ field, fieldState }) => (
        <>
          <Row className="mt-2 ">
            <Col>
              <Select
                style={{ height: "32px", margin: "2px", padding: "0px 5px" }}
                value={selectFinal}
                onChange={(value) => {
                  setSelectFinal(value);
                }}
                options={finalvalues}
              />
            </Col>
            <Col>
              <Button type="button" onClick={handleInsertText}>
                Insert
              </Button>
            </Col>
          </Row>
          <FieldDom {...props} {...fieldState}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              value={editorHtml || field.value}
              style={{ height: "300px", marginBottom: "18px" }}
              onChange={(e) => {
                field.onChange(e);
                setEditorHtml(e);
                setValue(name, e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const range = quillRef.current.getEditor().getSelection(true);
                  const tabCharacter = "\u00A0\u00A0\u00A0\u00A0"; // Four spaces for a tab
                  quillRef.current
                    .getEditor()
                    .insertText(range.index, tabCharacter);
                  quillRef.current
                    .getEditor()
                    .setSelection(range.index + tabCharacter.length);
                } else if (e.key === " ") {
                  e.preventDefault();
                  const range = quillRef.current.getEditor().getSelection(true);
                  quillRef.current
                    .getEditor()
                    .insertText(range.index, "\u00A0"); // Insert non-breaking space character
                  quillRef.current.getEditor().setSelection(range.index + 1); // Move cursor past inserted non-breaking space
                }
              }}
            />
          </FieldDom>
        </>
      )}
    />
  );
}

export default RichText;
