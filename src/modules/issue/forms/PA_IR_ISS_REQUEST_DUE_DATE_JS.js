
const JSHook = (form, fields, formMethods, formMetaData) => {
  form.onSubmit = function (actionName) {
    formMetaData.fields.comments.required = true;
    formMetaData.fields.comments.editable = true;

    if(actionName=="Submit"){
      return 'skip';
    }
    return actionName;
  };
};

export default JSHook;
