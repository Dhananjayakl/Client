// import React, { useState, useRef, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";
// import {
//   SketchPicker,
//   ChromePicker,
//   CompactPicker,
//   SliderPicker,
//   SwatchesPicker,
//   CirclePicker,
//   AlphaPicker,
// } from "react-color";
// import FieldDom from "./FieldDom";
// import { Controller } from "react-hook-form";
// import { Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useForm } from "react-hook-form";
// import {
//   faPalette,
//   faFill,
//   faPaintBrush,
// } from "@fortawesome/free-solid-svg-icons";

// const ColorPicker = (props) => {
//   const {
//     name,
//     label,
//     control,
//     options,
//     helptext,
//     tooltip,
//     required,
//     visible,
//     formMethods,
//     form,
//     editable,
//     field_title,
//     isMulti,
//     ...rest
//   } = props;
//   const formMethods1 = useForm({});

//   console.log(formMethods, formMethods1, name, "methods are here");

//   let inputRef = useRef(null);
//   console.log(inputRef, "pickers");

//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [selectedColor, setSelectedColor] = useState();
//   console.log(selectedColor, name, "color props");
//   // useEffect(() => {
//   //   if (selectedColor && formMethods) {
//   //     formMethods.setValue(name, selectedColor);
//   //   }
//   //   // if (selectedColor && formMethods1) {
//   //   //   console.log("second condition");
//   //   //   formMethods1.setValue(name, selectedColor);
//   //   // }
//   // }, [selectedColor]);
//   const handleColorChange = (color) => {
//     field.onChange(color.hex);
//     setSelectedColor(color.hex);

//     onChange(selectedColor);
//   };

//   const toggleColorPicker = () => {
//     setShowColorPicker(!showColorPicker);
//   };
//   // useEffect(() => {
//   //   if (inputRef?.current) {
//   //     console.log(inputRef, "refer");
//   //     // inputRef.current.value = selectedColor;
//   //     console.log(inputRef.current.Onchange, "onner");
//   //   }
//   // }, [selectedColor]);
//   console.log("inside color picker");
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{
//         required: {
//           value: required && editable,
//           message: `${field_title} is required!`,
//         },
//       }}
//       render={({ field, fieldState, formState }) => {
//         console.log(field.value, "color field");
//         let message;
//         if (fieldState) {
//           message = fieldState.error;
//         }

//         return (
//           <FieldDom {...props} {...fieldState}>
//             <>
//               {showColorPicker && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     zIndex: 5, // Adjust as needed
//                   }}
//                 >
//                   <SketchPicker
//                     disableAlpha={true}
//                     width={150}
//                     onChangeComplete={() =>
//                       setShowColorPicker(!showColorPicker)
//                     }
//                     color={selectedColor}
//                     presetColors={[
//                       "#73A154",
//                       "#28ab5a",
//                       "#4C9679",
//                       "#FFFF33",
//                       "#FFCC00",
//                       "#FFBF00",
//                       "#af6628",
//                       "#A46F19",
//                       "#D2691E",
//                       "#a61a06",
//                       "#B53737",
//                     ]}
//                     onChange={(color) => {
//                       field.value = color.hex;
//                       field.onChange(color.hex);
//                       setSelectedColor(color.hex);
//                       onChange(selectedColor);
//                     }}
//                   />
//                 </div>
//               )}

//               <Col className="m-0 p-0 ms-1">
//                 <div
//                   style={{
//                     position: "relative",
//                     display: "inline-block",
//                     width: "100%",
//                   }}
//                 >
//                   <Form.Control
//                     size="lg"
//                     type="input"
//                     onBlur={() => setShowColorPicker(false)}
//                     onFocus={() => setShowColorPicker(true)}
//                     // onMouseMove={()=>setShowColorPicker(false)}

//                     {...field}
//                     {...rest}
//                     ref={inputRef}
//                     // Adjust padding to make room for the button
//                     onChange={(e) => {
//                       props.form?.change.forEach((element) => {
//                         element(e.target.value);
//                       });
//                     }}
//                   />
//                   <Button
//                     variant="link"
//                     style={{
//                       position: "absolute",
//                       right: "10px", // Distance from the right edge of the input field
//                       top: "50%",
//                       transform: "translateY(-50%)", // Vertically center the button
//                     }}
//                     onClick={toggleColorPicker}
//                   >
//                     <FontAwesomeIcon
//                       style={{
//                         color: selectedColor,
//                         padding: "3px",
//                       }}
//                       className="text-primary"
//                       icon={faPaintBrush}
//                     />
//                   </Button>
//                 </div>
//               </Col>
//             </>
//           </FieldDom>
//         );
//       }}
//     />
//   );
// };

// export default ColorPicker;

import React, { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  SketchPicker,
  ChromePicker,
  CompactPicker,
  SliderPicker,
  SwatchesPicker,
  CirclePicker,
  AlphaPicker,
} from "react-color";
import FieldDom from "./FieldDom";
import { Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import {
  faPalette,
  faFill,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";

const ColorPicker = (props) => {
  const {
    name,
    label,
    control,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    form,
    editable,
    field_title,
    isMulti,
    ...rest
  } = props;
  const formMethods1 = useForm({});

  let inputRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState();
  // useEffect(() => {
  //   if (selectedColor && formMethods) {
  //     formMethods.setValue(name, selectedColor);
  //   }
  //   // if (selectedColor && formMethods1) {
  //   //   console.log("second condition");
  //   //   formMethods1.setValue(name, selectedColor);
  //   // }
  // }, [selectedColor]);
  const handleColorChange = (color, field) => {
    field.onChange(color.hex);
    setSelectedColor(color.hex);
    setTimeout(() => {
      setShowColorPicker(false);
    }, 100);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  // useEffect(() => {
  //   if (inputRef?.current) {
  //     console.log(inputRef, "refer");
  //     // inputRef.current.value = selectedColor;
  //     console.log(inputRef.current.Onchange, "onner");
  //   }
  // }, [selectedColor]);
  console.log("inside color picker");
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
        const message = fieldState?.error?.message;

        return (
          <FieldDom {...props} {...fieldState}>
            {" "}
            {/* Wrapping everything in FieldDom */}
            <>
              <Col className="m-0 p-0 ms-1">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <Form.Control
                    size="lg"
                    type="input"
                    value={selectedColor || field.value || ""}
                    onBlur={() => setShowColorPicker(false)}
                    {...field}
                    {...rest}
                    ref={inputRef}
                    onChange={(e) => {
                      const color = e.target.value;
                      field.onChange(color);
                      setSelectedColor(color);
                    }}
                  />

                  <Button
                    variant="link"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    onClick={toggleColorPicker}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: selectedColor || "#000",
                        padding: "3px",
                      }}
                      className="text-primary"
                      icon={faPaintBrush}
                    />
                  </Button>

                  {showColorPicker && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 5,
                        top: "100%",
                        left: 0,
                      }}
                    >
                      <SketchPicker
                        color={selectedColor || field.value || ""}
                        onChange={(color) => handleColorChange(color, field)}
                        disableAlpha={true}
                        presetColors={[
                          "#73A154",
                          "#28ab5a",
                          "#4C9679",
                          "#FFFF33",
                          "#FFCC00",
                          "#FFBF00",
                          "#af6628",
                          "#A46F19",
                          "#D2691E",
                          "#a61a06",
                          "#B53737",
                        ]}
                      />
                    </div>
                  )}
                </div>
              </Col>
              {message && <p className="text-danger">{message}</p>}
            </>
          </FieldDom>
        );
      }}
    />
  );
};

export default ColorPicker;
