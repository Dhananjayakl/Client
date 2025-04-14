
import { useEffect, useState } from "react";
import * as Yup from 'yup';

let JSHook = (form,
    formMethods,
    fields,
    runtimeParams,
    formMetaData,
    showAlert,
    newAssigneeCallback) => {
    console.log("Props from JS Hook1:", form, formMethods);

    form.newAssigner.onChange(function (value) {
        newAssigneeCallback(value);
    });
    useEffect(() => {
        const updatedButton = document.querySelector(".disbutton");
        if (updatedButton) {
            updatedButton.textContent = "ReAssign";
        }
    }, [form, formMethods, fields, formMetaData]);


    const disabledButton = document.querySelector(".disbutton");
    if (disabledButton != null || disabledButton != undefined) {
        if (showAlert) {
            disabledButton.hidden = true;
        } else {
            disabledButton.hidden = false;
        }
    }

    return form;
};

export default JSHook;
