
const JSHook = (form, fields, formMethods, formMetaData) => {
  form.onSubmit = function (actionName) {
    alert("stopr");
  };
};

export default JSHook;
