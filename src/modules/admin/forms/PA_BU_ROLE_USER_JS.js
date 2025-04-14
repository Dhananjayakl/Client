// // 

// import { useState, useEffect } from "react";

// let JSHook = (form, formMethods, fields, formMetaData, formValues) => {
//     if(formValues.objectId!==undefined){
//         formMetaData.fields.businessUnit.editable = false;
//         formMetaData.fields.role.editable = false;
//     }
// };

// export default JSHook;


// 

import { useState, useEffect } from "react";

let JSHook = (form, formMethods, fields, formMetaData, formValues) => {
    if(formValues.objectId!==undefined){
        formMetaData.fields.businessUnitName.editable = false;
        formMetaData.fields.roleName.editable = false;
    }
};

export default JSHook;

