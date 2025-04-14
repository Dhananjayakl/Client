import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Field } from "formik";
import FieldDom from "./FieldDom";
import ReactQuill from 'react-quill';
import Select from 'react-select'
import { getServiceData } from "src/components/server/service";

const CustomQuillEditor = React.forwardRef((props, ref) => {
  const { onKeyDown, ...rest } = props;
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const range = ref.current.getEditor().getSelection(true);
      const tabCharacter = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'; // Four spaces for a tab
      ref.current.getEditor().insertText(range.index, tabCharacter);
      ref.current.getEditor().setSelection(range.index + tabCharacter.length);
    } else if (e.key === ' ') {
      e.preventDefault();
      const range = ref.current.getEditor().getSelection(true);
      ref.current.getEditor().insertText(range.index, '\u00A0'); // Insert non-breaking space character
      ref.current.getEditor().setSelection(range.index + 1); // Move cursor past inserted non-breaking space
    } else {
      onKeyDown(e);
    }
  };
  return <ReactQuill ref={ref} onKeyDown={handleKeyDown} {...rest} />;
}
);
function RichText(props) {

  const { label, name, options, helptext, tooltip, required, visible, fieldDef, setFieldValue, workflowId, formId,dynamic, ...rest } = props;
  console.log("RichText Props", props.dynamic);



  const [editorContent, setEditorContent] = useState();
  const [editorHtml, setEditorHtml] = useState('');
  const [finalvalues, setFinalValues] = useState([]);
  const [selectFinal, setSelectFinal] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  let [Response, setResponse] = useState(0);
  const quillRef = useRef();
  console.log("saved content1", editorHtml);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("props.for", props.dynamic);
        
        if (props.dynamic == 1) {
          
           Response = await getServiceData("DBfields", props.formId);
           setResponse(Response.data);
          
        } else {
          
           Response = await getServiceData("Dforms", props.formId);
            setResponse(Response.data);
          console.log("resultsssss", Response.data);
        }
        
        const json = Response.data;
        console.log("see json", json);
        const resultArray = [];
        json.forEach((json, index) => {
          const values = json.split(",");
          const displayColumn = values[0].trim();
          const fieldTitle = values[1].trim();
          console.log(
            `Element ${index}: Display Column - ${displayColumn}, Field Title - ${fieldTitle}`
          );

          // Push the values into the resultArray
          resultArray.push({ displayColumn, fieldTitle });
        });

        console.log("resultArray see", resultArray);

        const dropdownOptions = resultArray.map((options) => ({
          label: options.fieldTitle,
          value: "${" + options.displayColumn + "}",
        }));

        setFinalValues(dropdownOptions);
        setEditorHtml(json.content || ""); // Set the initial content
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [props.workflowId, props.formId, props.dynamic]);

  const modules = {
    toolbar: {
      container: [
        // Custom dropdown options from JSON data

        ['bold', 'italic', 'underline', 'strike'], // Basic text formatting
        ['blockquote', 'code-block'], // Blockquote and code block
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header size options
        [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
        [{ script: 'sub' }, { script: 'super' }], // Subscript and superscript
        [{ indent: '-1' }, { indent: '+1' }], // Indentation options
        [{ direction: 'rtl' }], // Right-to-left text direction
        // Text size and color options
        [{ size: ['small', false, 'large', 'huge'] }], // Text size options
        [{ color: [] }, { background: [] }], // Text and background color
        [{ font: [] }], // Font family options
        // Text alignment options
        [{ align: [] }], // Text alignment (left, center, right, justify)
        ['clean'],
        ['link','image'] // Remove formatting
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
          console.log("checkkkkkkkk", cursorPos);
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
    <div>
      {/* <h3>React</h3> */}
      <div id="div_editor3"></div>


      <Row>
        <Field name={name}>
          {({ field, form: { touched, errors }, meta }) => {
            console.log("RichText Fields", field);
            return (
              <FieldDom {...props} {...meta} >
                <CustomQuillEditor
                  ref={quillRef}
                  theme="snow"
                  // modules={modules}
                  // formats={formats}
                  modules={modules}
                  // {...field}
                  {...rest}
                  value={editorHtml || field.value}
                  // onChange={  field.onChange(field.name)}
                  style={{ height: '300px' }}



                  onChange={e => {
                    console.log("quill.root.innerHTML2: ", e);
                    setFieldValue(field.name, e);
                    setEditorHtml(e);
                  }}
                  onSelectionChange={handleSelectionChange}


                />
              </FieldDom>
            );
          }}
        </Field>
      </Row>
      <Row className="mt-4 "><Col>
        <Select
          style={{ height: '32px', margin: '2px', padding: '0px 5px' }}
          value={selectFinal}
          onChange={(value) => {
            setSelectFinal(value);
          }}
          options={finalvalues}
        >
        </Select></Col><Col>
          <Button type="button" onClick={handleInsertText}>Insert</Button>
        </Col> </Row>
    </div>
  )
}

export default RichText;