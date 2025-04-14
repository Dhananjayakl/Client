// import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// // import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useState, useEffect } from "react";
// import { Field } from "formik";
// import { Form } from "react-bootstrap";
// import FieldDom from "./FieldDom";
// import { createObject, getObjectData, updateObjectData, getviewData, } from "../../../modules/leave/LeaveService";
// import { string } from 'yup';
// import '../../../../src/assets/scss/datepicker-wrapper.scss'

// const service = "setupholiday";

// function DateChange(props) {

//     const { selectedDate, onDateChange, name, setClear, disableDates, leaveType, gender, ...rest } = props;
//     // if (props !== undefined) {
//     //     formatDate(props.selectedDate);
//     // }
//     console.log("Property Values.......", props);
//     const [startDate, setStartDate] = useState(false);
//     const [valid, setValid] = useState(true);
//     const customDates = [];
//     const HigltedDates = [];
//     // const [selectedDate, setSelectedDate] = useState(null);
//     // const onDateChange = (date) => {

//     //     //var dateformatvalue = dateValue.toISOString();
//     //     setSelectedDate(date);
//     // };

//     const current_year = new Date().getFullYear();
//     const filterExpr = ":USER_ID=USER_ID";
//     const viewParams = {
//         viewName: "pa_lm_generate_leaves_v",
//         pageNumber: 0,
//         pageSize: 0,
//         sortField: "",
//         sortOrder: "",
//         orderExpression: "",
//         filterExpression: filterExpr
//     }

//     useEffect(() => {
//         getObjectData(service)
//             .then((response) => {
//                 console.log("get Holiday Dates", response.data);

//                 for (let i = 0; i < response.data.length; i++) {
//                     customDates.push(new Date(response.data[i].holidayDate));
//                     HigltedDates.push({
//                         id: new Date(response.data[i].holidayDate),
//                         name: response.data[i].occasion
//                     });
//                 }
//                 //  console.log("get Holiday Dates single", new Date(response.data[i].holidayDate));

//                 // console.log("get Hildated Dates", HigltedDates.length);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });

//     },);

//     useEffect(() => {
//         var log_user_id = JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id;
//         getviewData(viewParams)
//             .then((leavedata) => {
//                 for (let i = 0; i < leavedata.data.data.length; i++) {
//                     if (leavedata.data.data[i].user_id = log_user_id) {
//                         customDates.push(new Date(leavedata.data.data[i].generated_date));
//                         HigltedDates.push({
//                             id: new Date(leavedata.data.data[i].generated_date),
//                             name: leavedata.data.data[i].reason_details
//                         });
//                     }
//                 }
//                 console.log("both holiday Dates and applied leaves", HigltedDates);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });

//     },);

//     // const highdates = (args) => {
//     //     args = new Date('10/10/2023');
//     //     /*Date need to be customized*/
//     //     if (args.date.getDate() === 10) {
//     //         specialDate(args, "Birthday");
//     //     }
//     //     if (args.date.getDate() === 15) {
//     //         specialDate(args, "Farewell");
//     //     }
//     //     if (args.date.getDate() === 25) {
//     //         specialDate(args, "Vacation");
//     //     }
//     // }

//     // const specialDate = (args, value) => {
//     //     let span = document.createElement('span');
//     //     span.setAttribute('class', 'e-icons highlight');
//     //     args.element.firstElementChild.setAttribute('title', value + '!');
//     //     addClass([args.element], ['e-day', 'special', value.toLowerCase()]);
//     //     // args.element.setAttribute('data-val', value + '!');
//     //     // args.element.setAttribute('title', value + '!');
//     //     args.element.appendChild(span);
//     // };

//     const isWeekday = (date) => {
//         /* this code is written for hide Weekend Days */

//         const day = date.getDay();
//         if (leaveType === "3" && gender === 2) {
//             return true;
//         } else {
//             return day !== 0 && day !== 6;
//         }

//         /* this code enable the particular date */
//         // const disabledDates = customDates;
//         // return disabledDates.some(disabledDate =>
//         //     date.getDate() === disabledDate.getDate() &&
//         //     date.getMonth() === disabledDate.getMonth() &&
//         //     date.getFullYear() === disabledDate.getFullYear()
//         // );
//     };

//     function formatDay(jsonDate) {
//         const date = new Date(jsonDate);
//         const getDay = date.toLocaleDateString("default", { day: "2-digit" });
//         return getDay;
//     }

//     // const renderDayContents = (day, date) => {
//     //     const tooltipText = `Tooltip for date`;

//     //     const shouldShowTooltip = date.getDate() === 10 || date.getDate() === 15;
//     //     return <span title={shouldShowTooltip ? tooltipText : ''}>{formatDay(date)}</span>;
//     // };
//     function formatDate(jsonDate) {
//         // alert(jsonDate);
//         if (jsonDate === undefined || jsonDate == "")
//             return '';
//         const date = new Date(jsonDate);

//         const getYear = date.toLocaleDateString("default", { year: "numeric" });
//         const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
//         const getDay = date.toLocaleDateString("default", { day: "2-digit" });
//         const formattedDate = getYear + "-" + getMonth + "-" + getDay;
//         console.log("formatted Date Value", formattedDate);
//         return formattedDate;
//     }

//     const renderDayContents = (day, date) => {

//         //   const tooltipText = `Tooltip for date`;
//         //  console.log('Date:', date);

//         const shouldShowTooltip = HigltedDates.some(
//             (specificDate) =>

//                 specificDate.id.toDateString() === date.toDateString()
//             //  formatDay(specificDate.id) === date.toLocaleDateString("default", { day: "2-digit" })
//         );

//         var colordate;
//         const tooltipText = HigltedDates.find(
//             (specificDate) =>

//                 specificDate.id.toDateString() === date.toDateString(),
//             //  colordate = specificDate.id.toDateString()
//             //  formatDay(specificDate.id) === date.toLocaleDateString('default', { day: '2-digit' })
//         )?.name;

//         // const coloredTooltip = tooltipText ? (
//         //     <span className='tooltip-content'>{tooltipText}</span>
//         // ) : null;

//         return <span title={shouldShowTooltip ? tooltipText : ''}
//             className={shouldShowTooltip ? 'tooltip-content' : ''}
//         //  style={{ color: '#FF0000' }}

//         >{formatDay(date)}</span>;
//     };

//     const handleDateMouseEnter = (date) => {
//         const hoveredDateDescription = HigltedDates.find(
//             (HigltedDates) => HigltedDates.id.getTime() === date.getTime()
//         )?.description;
//         setDescription(hoveredDateDescription || "");
//     };
//     return (
//         <Field name={name}>
//             {({
//                 field, // { name, value, onChange, onBlur }
//                 form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
//                 meta,
//             }) => {
//                 console.log("Additional Date Field1:", field.value);
//                 console.log("Additional Date Field2:", props);

//                 field.value = formatDate(field.value);
//                 // alert(field.value);
//                 return (
//                     <FieldDom {...props} {...meta} >

//                         <div>
//                             <DatePicker
//                                 showIcon
//                                 // value={dateValue}
//                                 // renderDayCell={highdates.bind(this)}
//                                 // selected={selectedDate}
//                                 selected={field.value ? selectedDate : undefined}
//                                 onChange={onDateChange}
//                                 wrapperClassName="custom-datepicker-wrapper"
//                                 type=""
//                                 // id="datepicker"
//                                 //  isInvalid={Boolean(touched[name] && errors[name])}
//                                 dateFormat="dd-MM-yyyy"
//                                 excludeDates={gender === 2 && leaveType === '3' ? '' : customDates}
//                                 // onMouseOver={handleDateMouseEnter}
//                                 filterDate={isWeekday}
//                                 showYearDropdown
//                                 showMonthDropdown
//                                 //minDate={new Date()}
//                                 minDate={new Date(disableDates)}
//                                 renderDayContents={renderDayContents}
//                                 isClearable={setClear}
//                                 calendarStartDay={1}
//                                 placeholderText="dd-mm-yyyy"
//                                 className="mandatory form-control"
//                                 // {...field}
//                                 {...rest}
//                             >

//                             </DatePicker>
//                             <div>{Boolean(touched[name] && errors[name]) && (<div className='validation'>{errors.leaveFrom}</div>)}</div>
//                         </div>

//                     </FieldDom>
//                 )
//             }
//             }
//         </Field>
//     );
// };
// export default DateChange;

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldDom from "./FieldDom";
import {
  createObject,
  getObjectData,
  updateObjectData,
  getviewData,
} from "../../../modules/admin/AdminService";
import { string } from "yup";
import "../../../../src/assets/scss/datepicker-wrapper.scss";

const service = "setupholiday";

function DateChange(props) {
  const {
    selectedDate,
    onDateChange,
    name,
    setClear,
    disableDates,
    setValue,
    leaveType,
    gender,
    empType,
    ...rest
  } = props;
  // if (props !== undefined) {
  //     formatDate(props.selectedDate);
  // }
  console.log("Property Values.......", props);
  const [startDate, setStartDate] = useState(false);
  const [valid, setValid] = useState(true);
  const customDates = [];
  const HigltedDates = [];
  // const [selectedDate, setSelectedDate] = useState(null);
  // const onDateChange = (date) => {

  //     //var dateformatvalue = dateValue.toISOString();
  //     setSelectedDate(date);
  // };

  const current_year = new Date().getFullYear();
  const filterExpr = ":USER_ID=USER_ID";
  const viewParams = {
    viewName: "pa_lm_generate_leaves_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpr,
  };

  useEffect(() => {
    getObjectData(service)
      .then((response) => {
        console.log("get Holiday Dates", response.data);

        for (let i = 0; i < response.data.length; i++) {
          customDates.push(new Date(response.data[i].holidayDate));
          HigltedDates.push({
            id: new Date(response.data[i].holidayDate),
            name: response.data[i].occasion,
          });
        }
        //  console.log("get Holiday Dates single", new Date(response.data[i].holidayDate));

        // console.log("get Hildated Dates", HigltedDates.length);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    var log_user_id = JSON.parse(localStorage.current_logged_User)[0]
      .user_details.data[0].user_id;
    getviewData(viewParams)
      .then((leavedata) => {
        for (let i = 0; i < leavedata.data.data.length; i++) {
          if ((leavedata.data.data[i].user_id = log_user_id)) {
            customDates.push(new Date(leavedata.data.data[i].generated_date));
            HigltedDates.push({
              id: new Date(leavedata.data.data[i].generated_date),
              name: leavedata.data.data[i].reason_details,
            });
          }
        }
        console.log("both holiday Dates and applied leaves", HigltedDates);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // const highdates = (args) => {
  //     args = new Date('10/10/2023');
  //     /*Date need to be customized*/
  //     if (args.date.getDate() === 10) {
  //         specialDate(args, "Birthday");
  //     }
  //     if (args.date.getDate() === 15) {
  //         specialDate(args, "Farewell");
  //     }
  //     if (args.date.getDate() === 25) {
  //         specialDate(args, "Vacation");
  //     }
  // }

  // const specialDate = (args, value) => {
  //     let span = document.createElement('span');
  //     span.setAttribute('class', 'e-icons highlight');
  //     args.element.firstElementChild.setAttribute('title', value + '!');
  //     addClass([args.element], ['e-day', 'special', value.toLowerCase()]);
  //     // args.element.setAttribute('data-val', value + '!');
  //     // args.element.setAttribute('title', value + '!');
  //     args.element.appendChild(span);
  // };

  const isWeekday = (date) => {
    /* this code is written for hide Weekend Days */
    console.log("empType", empType);
    const day = date.getDay();
    if (leaveType === "3" && gender === 2) {
      return true;
    } else if (empType === 1 || empType === 2) {
      return day !== 0 && day !== 6;
    } else if (empType === 3 || empType === 4) {
      return day !== 0;
    } else {
      return day !== 0 && day !== 6;
    }

    /* this code enable the particular date */
    // const disabledDates = customDates;
    // return disabledDates.some(disabledDate =>
    //     date.getDate() === disabledDate.getDate() &&
    //     date.getMonth() === disabledDate.getMonth() &&
    //     date.getFullYear() === disabledDate.getFullYear()
    // );
  };

  function formatDay(jsonDate) {
    const date = new Date(jsonDate);
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    return getDay;
  }

  // const renderDayContents = (day, date) => {
  //     const tooltipText = `Tooltip for date`;

  //     const shouldShowTooltip = date.getDate() === 10 || date.getDate() === 15;
  //     return <span title={shouldShowTooltip ? tooltipText : ''}>{formatDay(date)}</span>;
  // };
  function formatDate(jsonDate) {
    // alert(jsonDate);
    if (jsonDate === undefined || jsonDate == "") return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });

    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    // ((pagePath==='/leave/leaverequest') ? formattedDate = getDay + "-" + getMonth + "-" + getYear:formattedDate = getYear + "-" + getMonth + "-" + getDay);

    console.log("formatted Date Value", formattedDate);
    return formattedDate;
  }

  const renderDayContents = (day, date) => {
    //   const tooltipText = `Tooltip for date`;
    //  console.log('Date:', date);

    const shouldShowTooltip = HigltedDates.some(
      (specificDate) => specificDate.id.toDateString() === date.toDateString()
      //  formatDay(specificDate.id) === date.toLocaleDateString("default", { day: "2-digit" })
    );

    var colordate;
    const tooltipText = HigltedDates.find(
      (specificDate) => specificDate.id.toDateString() === date.toDateString()
      //  colordate = specificDate.id.toDateString()
      //  formatDay(specificDate.id) === date.toLocaleDateString('default', { day: '2-digit' })
    )?.name;

    // const coloredTooltip = tooltipText ? (
    //     <span className='tooltip-content'>{tooltipText}</span>
    // ) : null;

    return (
      <span
        title={shouldShowTooltip ? tooltipText : ""}
        className={shouldShowTooltip ? "tooltip-content" : ""}
        //  style={{ color: '#FF0000' }}
      >
        {formatDay(date)}
      </span>
    );
  };

  const handleDateMouseEnter = (date) => {
    const hoveredDateDescription = HigltedDates.find(
      (HigltedDates) => HigltedDates.id.getTime() === date.getTime()
    )?.description;
    setDescription(hoveredDateDescription || "");
  };
  const pagePath = window.parent.location.pathname;
  return (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
        // setFieldValue
      }) => {
        console.log("Additional Date Field1:", field.value);
        console.log("Additional Date Field2:", props);
        console.log("Additional Date Field3:", field);

        field.value = formatDate(field.value);
        // alert(field.value);
        return (
          <FieldDom {...props} {...meta}>
            <div>
              <DatePicker
                showIcon
                // value={dateValue}
                // renderDayCell={highdates.bind(this)}
                // selected={selectedDate}
                selected={field.value ? selectedDate : undefined}
                onChange={onDateChange}
                wrapperClassName="custom-datepicker-wrapper"
                type=""
                value={
                  pagePath == "/leave/leaverequest" && formatDate(field.value)
                }
                // id="datepicker"
                //  isInvalid={Boolean(touched[name] && errors[name])}
                dateFormat="dd-MM-yyyy"
                excludeDates={
                  gender === 2 && leaveType === "3" ? "" : customDates
                }
                // onMouseOver={handleDateMouseEnter}
                filterDate={isWeekday}
                showYearDropdown
                showMonthDropdown
                //minDate={new Date()}
                minDate={new Date(disableDates)}
                renderDayContents={renderDayContents}
                isClearable={setClear}
                calendarStartDay={1}
                placeholderText="dd-mm-yyyy"
                className="mandatory form-control"
                // {...field}
                {...rest}
              ></DatePicker>
              <div>
                {Boolean(touched[name] && errors[name]) && (
                  <div className="validation">{errors.leaveFrom}</div>
                )}
              </div>
            </div>
          </FieldDom>
        );
      }}
    </Field>
  );
}
export default DateChange;
