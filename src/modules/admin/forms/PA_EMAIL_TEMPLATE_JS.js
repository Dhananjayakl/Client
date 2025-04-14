let JSHook = (form, formMethods) => {
    console.log("Props from JS Hook:", form, formMethods);
    form.formId.onChange(function (value) {
        console.log('Selected Value', value);
    });
    return form;

}

export default JSHook;



