import React from "react";
import Input from "./fields/Input";
import DatePicker from "./fields/Datepicker";
import Textarea from "./fields/Textarea.jsx";
import Select from "./fields/Select.jsx";
import Attach from "./fields/Attach.jsx";
import RadioButtons from "./fields/RadioButtons.jsx";
import Checkbox from "./fields/Checkbox.jsx";
import Switch from "./fields/Switch";
import CheckBoxes from "./fields/Checkboxes.jsx";
import PhoneNUmber from "./fields/PhoneNumber.jsx";
import SSelect from "./fields/SSelect.jsx";
import TimePicker from "./fields/TimePicker.jsx";
import RichText from "./fields/RichText";
import MAttach from "./fields/MAttach";
import Number from "./fields/Number";
import DateChange from "./fields/DateChange";
import PicklistSelect from "./fields/PicklistSelect";
import FlatPicker from "./fields/FlatPicker";
import ReadOnly from "./fields/ReadOnly";
import { useWatch } from "react-hook-form";
import ControlledObjectName from "./fields/ControlledObjectName";
import ColorPicker from "./fields/ColorPicker";
import Rating from "./fields/Rating";
import Range from "./fields/Range";
import RichTextEditor from "./fields/RichTextEditor";
import TreeDropdown from "./fields/TreeDropdown";
import UsersDropdown from "./fields/UsersDropdown";
import Password from "./fields/Password";
import { useTranslation } from "react-i18next";

const FormControl = (props) => {
  //console.log("formcontrol properties", props, props.name);
  console.log(props, "form--control--props");
  const { t } = useTranslation("common");
  //console.log(props.textColor, "properties of control");
  let { formMetaData, watchFor, ...rest } = props;
  let { name, type, FieldValue } = props;
  let fieldProps = rest;
  let formId;
  if (!props.control) {
    fieldProps.control = props?.formMethods?.control;
  }
  // console.log(formMetaData, "control metadata");

  if (formMetaData) {
    fieldProps.systemConfig = formMetaData.systemConfig;
    let origObject = formMetaData?.fields?.[name];
    if (name.includes(".")) {
      name = name.substr(name.lastIndexOf(".") + 1);
      if (origObject?.editable != undefined)
        formMetaData.fields[name].editable = origObject?.editable;
      if (origObject?.required != undefined)
        formMetaData.fields[name].required = origObject?.required;
      // if(origObject?.visible!=undefined)
      //   formMetaData.fields[name].visible=origObject?.visible;
    }
    let fieldDef = formMetaData?.fields?.[name];
    fieldProps.fieldDef = fieldDef;
    if (fieldDef) {
      formId = formMetaData.formmeta.form_id;
      if (fieldDef.display_type) {
        type = fieldDef.display_type;
      }

      if (fieldDef.is_picklist && fieldDef.picklist) {
        fieldProps.options = formMetaData.resources[fieldDef.picklist];
      }

      if (props.isMulti == undefined || props.isMulti == null) {
        fieldProps.isMulti = fieldDef.is_multi_select
          ? fieldDef.is_multi_select
          : false;
      }

      if (props.required == undefined) {
        fieldProps.required = fieldDef.required;
      }
      if (props.placeholder == undefined) {
        fieldProps.placeholder = t(fieldDef.place_holder);
      }
      if (props.field_title == undefined) {
        fieldProps.field_title = fieldDef.field_title;
      }
      if (props.visible == undefined) {
        fieldProps.visible = fieldDef.visible;
      }
      if (props.tooltip == undefined) {
        fieldProps.tooltip = t(fieldDef.tooltip);
      }
      if (props.help_text == undefined) {
        fieldProps.help_text = fieldDef.help_text;
      }
      if (props.disabled == undefined) {
        fieldProps.disabled = !fieldDef.editable;
        fieldProps.editable = fieldDef.editable;
      } else {
        fieldProps.editable = !props.disabled;
      }
      if (props.field_title == undefined) {
        fieldProps.field_title = fieldDef.field_title;
      }
    }
    try {
      fieldProps.form = formMetaData.form[name];
    } catch (e) {}
  } else {
    fieldProps.editable = true;
  }

  if (props.watchFor) {
    let value = useWatch({
      control: props.control,
      // name: props.id,
      name: props.watchFor,
    });
  }

  switch (type) {
    case "email":
    // case "password":
    case "input": {
      return (
        <Input
          trimmedValue={props.trimmedValue}
          {...fieldProps}
          textColor={props.textColor}
          size={props.size}
          fieldProps={props}
        />
      );
    }
    case "password": {
      return <Password {...fieldProps} />;
    }
    case "number": {
      return (
        <Number
          {...fieldProps}
          textColor={props.textColor}
          fieldProps={props}
        />
      );
    }
    case "colorPicker": {
      return <ColorPicker {...fieldProps} fieldProps={props} />;
    }
    case "date": {
      return (
        <FlatPicker
          {...fieldProps}
          textColor={props.textColor}
          fieldProps={props}
        />
      );
      // return <DatePicker {...fieldProps} />;
    }
    case "textarea": {
      return (
        <Textarea
          {...fieldProps}
          textColor={props.textColor}
          fieldProps={props}
        />
      );
    }
    case "select": {
      return (
        <Select
          {...fieldProps}
          field
          textColor={props.textColor}
          fieldProps={props}
        />
      );
    }
    case "SSelect": {
      return (
        <SSelect
          isMulti={false}
          {...fieldProps}
          formid={formMetaData.formmeta.form_id}
          colum={formMetaData.fields[name].field_name}
          dropDownFlag={props.dropDownFlag}
          formMetaData={formMetaData}
          FieldValue={FieldValue}
          autoDisplay={props.autoDisplay}
          trimmedValue={props.trimmedValue}
          FilteredOptions={props.disabledoptions}
          customChange={props.customchange}
          textColor={props.textColor}
          closeButton={props.closeButton}
          fieldProps={props}
        />
      );
    }
    case "user": {
      return (
        <UsersDropdown
          isMulti={false}
          {...fieldProps}
          formid={formMetaData.formmeta.form_id}
          colum={formMetaData.fields[name].field_name}
          dropDownFlag={props.dropDownFlag}
          formMetaData={formMetaData}
          FieldValue={FieldValue}
          autoDisplay={props.autoDisplay}
          trimmedValue={props.trimmedValue}
          FilteredOptions={props.disabledoptions}
          customChange={props.customchange}
          textColor={props.textColor}
          closeButton={props.closeButton}
          fieldProps={props}
        />
      );
    }
    case "treeDropdown": {
      return (
        <TreeDropdown
          {...fieldProps}
          colum={formMetaData.fields[name].field_name}
          formid={formMetaData.formmeta.form_id}
          formMetaData={formMetaData}
          fieldProps={props}
        />
      );
    }
    case "PicklistSelect": {
      return (
        <PicklistSelect
          isMulti={false}
          {...fieldProps}
          formid={formMetaData.formmeta.form_id}
          colum={formMetaData.fields[name].field_name}
          formMetaData={formMetaData}
          textColor={props.textColor}
          fieldProps={props}
        />
      );
    }
    case "richtext": {
      return <RichText {...fieldProps} />;
    }

    case "richtexteditor": {
      return <RichTextEditor {...fieldProps} />;
    }
    // case "date": {
    //   return <DatePicker {...fieldProps} />;
    // }
    case "multiattach": {
      return (
        <MAttach
          isMulti={true}
          {...fieldProps}
          formMethod={props.formMethods}
          formMetaData={formMetaData}
          fieldProps={props}
        />
      );
    }
    case "singleattach": {
      return (
        <MAttach
          isMulti={false}
          {...fieldProps}
          formMethod={props.formMethods}
          formMetaData={formMetaData}
          fieldProps={props}
          setformdata={props.setformdata}
        />
      );
    }
    // case "multiattach": {
    //   return <MAttach {...fieldProps} />;
    // }
    case "radio": {
      return <RadioButtons {...fieldProps} fieldProps={props} />;
    }
    case "check": {
      return <Checkbox {...fieldProps} fieldProps={props} />;
    }
    case "checkboxes": {
      return <CheckBoxes {...fieldProps} fieldProps={props} />;
    }
    // case "number": {
    //   return <Number {...fieldProps} />;
    // }
    case "phonenumber": {
      return <PhoneNUmber {...fieldProps} />;
    }
    // case "user": {
    //   return <Input {...fieldProps} />;
    // }
    case "switch": {
      return (
        <Switch {...fieldProps} readOnly={props.readOnly} fieldProps={props} />
      );
    }
    case "timepicker": {
      //console.log("time called");
      return <TimePicker {...fieldProps} />;
    }
    case "datepick": {
      return <DateChange {...fieldProps} fieldProps={props} />;
    }
    case "flatpick": {
      return (
        <FlatPicker
          {...fieldProps}
          enableFieldData={props.enableFieldData}
          modal={props?.modal ? true : false}
          // systemConfig={formMetaData?.systemConfig}
        />
      );
    }
    // case "email": {
    //   return <Email {...fieldProps} />;
    // }
    // case "password": {
    //   return <Password {...fieldProps} />;
    // }
    case "readonly": {
      return <ReadOnly {...props}></ReadOnly>;
    }
    case "readonlyoneline": {
      return <ReadOnly {...props}></ReadOnly>;
    }
    case "controlledObjectName": {
      return (
        <ControlledObjectName
          formMetaData={formMetaData}
          {...fieldProps}
          runtimeParams={props.runtimeParams}
          fieldProps={props}
        />
      );
    }
    case "rating": {
      return <Rating {...fieldProps} />;
    }

    case "range": {
      return <Range {...fieldProps} />;
    }
    default:
      return null;
  }
};

export default FormControl;
