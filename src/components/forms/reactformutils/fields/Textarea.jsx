import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import FieldDom from "./FieldDom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

function Textarea(props) {
  const {
    label,
    name,
    control,
    // formMetaData,
    options,
    helptext,
    tooltip,
    required,
    visible,
    editable,
    fieldDef,
    formMethods,
    field_title,
    textColor,
    fieldProps,
    isMulti,
    ...rest
  } = props;
 const { t } = useTranslation("common");
  const [inputvalue, setinputvalue] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [lengthflag, setLengthFlag] = useState(false);
  const [adjustedStringlength, setAdjustedStringLength] = useState(0);
  let inputMessage = false;
  let fieldsize;

  if (fieldDef) {
    fieldsize = fieldDef.field_size;
  }

  if (!fieldsize) {
    fieldsize = 4000;
  }

  if (inputvalue && inputvalue?.length > 0 && inputvalue.length > fieldsize) {
    // console.log("limit exceeded error message");
    inputMessage = true;

    // Set a timeout to change inputMessage to false after 3 seconds
    setTimeout(() => {
      inputMessage = false;
      console.log("Input message reset to false");
    }, 3000); // 3000 milliseconds = 3 seconds
  }
  // console.log(inputMessage, inputvalue.length, "input message");
  console.log(adjustedStringlength, "adjusted string length");

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };
  console.log(name, required, editable, "bmw");

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        //inputValueRef.current = field.value;
        setinputvalue(field.value);
        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        console.log(inputMessage, "input message is here");

        return (
          <FieldDom {...props} {...fieldState} fieldProps={fieldProps}>
            <div className="position-relative">
              {inputMessage && (
                <FontAwesomeIcon
                  className="p-3 text-danger position-absolute translate-middle fs-1"
                  icon={faWarning}
                />
              )}
              {editable && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="lg"
                  maxLength={fieldsize}
                  // type="textarea"
                  className={`${
                    inputMessage == true
                      ? "textarea-error"
                      : editable && required
                      ? "mandatory"
                      : ""
                  }`}
                  isInvalid={message && required && !field.value ? true : false}
                  {...field}
                  {...rest}
                  onChange={(e) => {
                    const rawData = e.target.value;
                    console.log(rawData.length, "raws length");
                    const adjustedText = rawData.replace(/\n/g, "\r\n");
                    console.log(adjustedText.length, "adjusted lengthsq");
                    const adjustedLength = adjustedText.length;
                    setAdjustedStringLength(adjustedLength);
                    setinputvalue(adjustedText.slice(0, fieldsize - 1));
                    field.onChange(adjustedText.slice(0, fieldsize - 1));
                    props.form?.change.forEach((element) => {
                      element(
                        adjustedText.slice(0, fieldsize - 1),
                        e.target.name.split(".")[1]
                      );
                    });
                    if (adjustedLength >= fieldsize) {
                      setLengthFlag(true);
                      setTimeout(() => {
                        setLengthFlag(false);
                      }, 2000);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter" && adjustedStringlength < fieldsize) {
                      console.log("stop propagation");
                      e.stopPropagation();
                    }
                    if (e.key == "Enter" && adjustedStringlength >= fieldsize) {
                      setLengthFlag(true);
                      setTimeout(() => {
                        setLengthFlag(false);
                      }, 2000);
                    }
                  }}
                  // isInvalid={Boolean(fieldState.isTouched[name] && fieldState.errors[name])}
                />
              )}
              {!editable && field.value && field?.value?.length >= 300 && (
                <div
                  style={{
                    color: "rgb(108, 117, 125)",
                    "white-space": "pre-wrap",
                  }}
                >
                  {field.value.substring(0, 300)}
                  <Modal
                    size="lg"
                    show={showMore}
                    onHide={() => setShowMore(false)}
                  >
                    <Modal.Header closeButton>
                      <ModalTitle className="ms-2">{field_title} </ModalTitle>
                    </Modal.Header>
                    <ModalBody>
                      <div
                        style={{
                          overflowY: "auto",
                          // maxHeight: "400px",
                          color: "rgb(108, 117, 125)",
                          "white-space": "pre-wrap",
                        }}
                      >
                        {field.value}
                      </div>
                    </ModalBody>
                    {/* <ModalFooter>
                      <Button onClick={() => setShowMore(false)}>Close</Button>
                    </ModalFooter> */}
                  </Modal>

                  {field.value && field.value.length >= 300 && (
                    <a onClick={handleToggle} className="ms-2" size="lg">
                      {showMore ? "less" : "more"}
                    </a>
                  )}
                </div>
              )}
              {!editable && field?.value?.length < 300 && (
                <div
                  style={{
                    color: "rgb(108, 117, 125)",
                    "white-space": "pre-wrap",
                  }}
                >
                  {field.value}
                </div>
              )}
              {!editable && !field?.value && (
                <div style={{ color: "rgb(108, 117, 125)" }}>--</div>
              )}

              <Form.Control.Feedback type="invalid">
                {fieldState.error && fieldState.error.message}
              </Form.Control.Feedback>
              {editable && lengthflag && (
                <span className="text-danger ps-3 mt-1 pt-1">
                  Maximum Character Length Reached.
                </span>
              )}
              {editable && (
                <span
                  className={lengthflag ? "float-end text-danger" : "float-end"}
                >
                  {adjustedStringlength && adjustedStringlength > fieldsize
                    ? fieldsize
                    : adjustedStringlength
                    ? adjustedStringlength
                    : 0}
                  /{fieldsize}
                </span>
              )}
            </div>
          </FieldDom>
        );
      }}
    />
  );
}

export default Textarea;
