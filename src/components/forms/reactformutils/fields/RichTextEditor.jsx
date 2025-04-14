import React, { useState, useEffect, useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import { Jodit } from "jodit-react";
import Template from "../../../../assets/img/avatars/templates.png";
import { Row, Col, Button } from "react-bootstrap";
import FieldDom from "./FieldDom";
function RichTextEditor(props) {
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

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const { setValue, getValues } = props.formMethods;
  const lowerBar = document.getElementsByClassName("jodit-status-bar-link");
  // lowerBar?.[0].innerText=""
  console.log(lowerBar, "lower bars");
  useEffect(() => {
    if (lowerBar[0].innerText) {
      lowerBar[0].innerText = "";
    }
  }, [lowerBar?.[0]?.innerText]);
  const config = {
    extraButtons: [
      {
        name: "Template",
        iconURL: Template,
        list: {
          option1: "Leave Approval",
          option2: "Asset Approval",
          option3: "Task Assigment",
        },
        exec: (editor, t, { control }) => {
          console.log(
            editor,
            "editor",
            t,
            "t",
            control,
            "control",
            "editor events"
          );

          console.log(event.target.textContent, "event of edit");
          editor.value = "";
          const selectedOption = event.target.textContent;
          if (selectedOption === "Leave Approval") {
            editor.s.insertHTML(`<html lang="en">
<head>

   
    <title>Leave Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
 
        .header {
            background-color: #4CAF50;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Leave Request</h1>
        </div>
        <div class="content">
            <p>Dear [Manager's Name],</p>
            <p>I am writing to request leave from [Start Date] to [End Date]. I will be returning to work on [Return Date].</p>
            <p>The reason for my leave is [brief explanation of the reason, e.g., personal reasons, medical issues, family emergency, etc.]. I have ensured that all my current tasks are up to date and have delegated any pending work to [Colleague's Name].</p>
            <p>Please let me know if you need any further information or if you would like to discuss this in more detail.</p>
            <p>Thank you for considering my request.</p>
            <p>Sincerely,<br>[Your Name]</p>
        </div>
        <div class="footer">
            <p>This email is intended for [Manager's Name]. If you have received this email in error, please delete it immediately.</p>
        </div>
    </div>
</body>
</html>`);
          } else if (selectedOption === "Asset Approval") {
            editor.s.insertHTML(`
<html lang="en">
<head>

    <title>Asset Approval Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
    
        .header {
            background-color: #007BFF;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
        .asset-details {
            margin-top: 20px;
        }
        .asset-details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Asset Approval Request</h1>
        </div>
        <div class="content">
            <p>Dear [Manager's Name],</p>
            <p>I am writing to request approval for the following asset:</p>
            <div class="asset-details">
                <p><strong>Asset Name:</strong> [Asset Name]</p>
                <p><strong>Description:</strong> [Asset Description]</p>
                <p><strong>Cost:</strong> [Asset Cost]</p>
                <p><strong>Justification:</strong> [Brief justification for the asset]</p>
            </div>
            <p>This asset is essential for [Project/Department Name] and will greatly contribute to our ongoing efforts. I have reviewed the costs and benefits, and believe that this acquisition is necessary for our success.</p>
            <p>Please let me know if you require any additional information or if you would like to discuss this further.</p>
            <p>Thank you for considering my request.</p>
            <p>Sincerely,<br>[Your Name]</p>
        </div>
        <div class="footer">
            <p>This email is intended for [Manager's Name]. If you have received this email in error, please delete it immediately.</p>
        </div>
    </div>
</body>
</html>
`);
          } else if (selectedOption === "Task Assigment") {
            editor.s.insertHTML(`
<html lang="en">
<head>
   
    <title>Task Assignment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
       
        .header {
            background-color: #FF9800;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
        .task-details {
            margin-top: 20px;
        }
        .task-details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Task Assignment</h1>
        </div>
        <div class="content">
            <p>Dear [Employee's Name],</p>
            <p>I am assigning you the following task:</p>
            <div class="task-details">
                <p><strong>Task Name:</strong> [Task Name]</p>
                <p><strong>Description:</strong> [Task Description]</p>
                <p><strong>Due Date:</strong> [Due Date]</p>
                <p><strong>Priority:</strong> [Priority Level]</p>
            </div>
            <p>Please ensure that this task is completed by the due date. If you have any questions or require any additional resources, feel free to reach out to me.</p>
            <p>Thank you for your attention to this matter.</p>
            <p>Sincerely,<br>[Your Name]</p>
        </div>
        <div class="footer">
            <p>This email is intended for [Employee's Name]. If you have received this email in error, please delete it immediately.</p>
        </div>
    </div>
</body>
</html>
`);
          }
        },
        tooltip: "Templates",
      },
    ],
     readonly:true,
     activeButtonsInReadOnly: ["preview"],
    // disablePlugins: [
    //   "file",
    //   "about",
    //   "image",
    //   "print",
    //   "ai-assistant",
    //   "class-span",
    //   "speech-recognize",
    // ],
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
      render={({ field, fieldState }) => {
        console.log(field.value, "jodit field value");
        return (
          <>
            <Row className="mt-2 ">
              <Col></Col>
            </Row>
            <FieldDom {...props} {...fieldState}>
              <JoditEditor
                ref={editor}
                value={field.value}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => field.onChange(newContent)}
              />
            </FieldDom>
          </>
        );
      }}
    />
  );
}

export default RichTextEditor;
