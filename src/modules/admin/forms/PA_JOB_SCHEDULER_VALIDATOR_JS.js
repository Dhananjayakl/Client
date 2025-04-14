import * as yup from 'yup';
export default function createValidationSchema(formMetaData) {
  console.log(formMetaData ,"meta in validator")
  // let schema = yup.object().shape({
  //    employeeName: yup.string().required('Employee Name is Required'),
  // });
  //   schema = schema.shape({
  //     from: yup.string().required('From Date is Required'),
  // // from: yup .date() .required('From Date is Required').test('is-future-date', 'From Date must be a future date', function (value) {
  // //     if (!value) {
  // //       return false;
  // //     }
  // //     const now = new Date();
  // //     return value > now;
  // //   }),
  //   });
  //   schema = schema.shape({
  //     futureRegularization: yup.string().required('Future Regularization is Required').nullable(),

  //   });
  //   schema = schema.shape({
  //     until: yup.string().required('Until Date is Required').test('from-to', 'Until Date must be greater than From Date', function (untilDate) {const fromDate = this.parent.from;
  //       if (!fromDate || !untilDate) {
  //         return true;
  //       }
  //       return untilDate >= fromDate;
  //     }),

  //   });
  //   schema = schema.shape({
  //     reason:yup.string().required("Reason is Required") , 

  //   });
  //   schema = schema.shape({
  //     manager:yup.string().required("Reporting Manager is Required") , 


  //   });
    
//  if(formMetaData.actions[1].action ===
//   "Reject" ){
//       schema = schema.shape({
//         comments:yup.string().required("comments is Required"),
//       });
//     }
//     else{
//       if((formMetaData.actions[0].action ===
//         "Approve")||(formMetaData.actions[2].action ===
//         "Require Clarification"))
//       schema = schema.shape({
//         comments: yup.string().nullable(),
//       });
//     }
    
  return schema;
}