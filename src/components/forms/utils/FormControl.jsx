import React from "react";
import Input from "./Input";
import Textarea from "./Textarea.jsx";
import Select from "./Select.jsx";
import Attach from "./Attach.jsx";
import MAttach from "./MAttach.jsx";
import RadioButtons from "./RadioButtons.jsx";
import Checkbox from "./Checkbox.jsx";
import CheckBoxes from "./Checkboxes.jsx";
import DatePicker from "./DatePicker.jsx";
import PhoneNUmber from "./PhoneNumber.jsx";
import Switch from "./Switch";
import Email from "./email";
import Password from "./Password";
import Number from "./Number";
import RichText from "./RichText";
import DateChange from "./DateChange";

const FormControl = (props) => {
  console.log(props);
  let { control, formmetadata, ...rest } = props;
  let { name } = props;
  // console.log(name);
  let fieldProps = rest;
  // console.log(formmetadata);

  if (formmetadata) {
    let fieldDef = formmetadata.fields[name];
    // fieldProps = {...fieldDef,...fieldProps};
    fieldProps.fieldDef = fieldDef;
    if (fieldDef && fieldDef.is_picklist && fieldDef.picklist) {
      fieldProps.options = formmetadata.resources[fieldDef.picklist];
    }
  }

  // fieldProps.fieldAttributes = {
  //   // disabled : fieldProps.disabled==true?true:false || fieldProps.editable==true?false:true,
  //   onChange:fieldProps.onChange,
  //   // value:fieldProps.value,
  // };
  // console.log(fieldProps.fieldAttributes.disabled);
  switch (control) {
    case "input": {
      return <Input {...fieldProps} upperCase={props.upperCase} />;
    }
    case "richtext": {
      return <RichText {...fieldProps} />;
    }
    case "textarea": {
      return <Textarea {...fieldProps} />;
    }
    case "select": {
      return <Select {...fieldProps} />;
    }
    case "date": {
      return <DatePicker {...fieldProps} />;
    }
    case "singleattach": {
      return <Attach {...fieldProps} />;
    }
    case "multiattach": {
      return <MAttach {...fieldProps} />;
    }
    case "radio": {
      return <RadioButtons {...fieldProps} />;
    }
    case "check": {
      return <Checkbox {...fieldProps} />;
    }
    case "checkboxes": {
      return <CheckBoxes {...fieldProps} />;
    }
    case "number": {
      return <Number {...fieldProps} />;
    }
    case "phonenumber": {
      return <PhoneNUmber {...fieldProps} />;
    }
    case "user": {
      return <Input {...fieldProps} />;
    }
    case "switch": {
      return <Switch {...fieldProps} />;
    }
    case "email": {
      return <Email {...fieldProps} />;
    }
    case "password": {
      return <Password {...fieldProps} />;
    }
    case "datepick": {
      return <DateChange {...fieldProps} />;
    }
    default:
      return null;
  }
};

export default FormControl;
