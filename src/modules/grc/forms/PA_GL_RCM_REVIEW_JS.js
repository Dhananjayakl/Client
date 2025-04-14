const JSHook = (form, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    console.log("process Rahul", formMethods.getValues("process"));
  };

  form.onLoad();

  return form;
};

export default JSHook;
