import moment from "moment";

export function getCurrentUser() {
  const currentUser = JSON.parse(localStorage.current_logged_User)[0]
    .user_details.data[0];
  return {
    id: currentUser.user_id,
    name: currentUser.user_name,
    fullName: `${currentUser.first_name} ${
      currentUser.middle_name ? currentUser.middle_name + " " : ""
    }${currentUser.last_name}`,
    email: currentUser.email_address,
    privileges: currentUser.privilege_name,
  };
}

export function hideField(formMetaData, field, value) {
  return formMetaData;
}

export function getCurrentDate() {
  return moment().format("LL");
}
export function getFullCurrentDate() {
  return moment().format("LLLL");
}

export function getFormattedDate(inputDate) {
  return moment(inputDate).format("LL");
}

export function getQuarter(inputDate) {
  return moment(inputDate).quarter();
}

export function getFullFormattedDate(inputDate) {
  if (inputDate) return moment(inputDate).format("LLLL");
  else return null;
}

export function getRelativeTime(inputDate) {
  if (inputDate) return moment(inputDate).fromNow();
  else return null;
}

export function getMinutesDifffromCurrentDate(inputDate, format) {
  if (inputDate) {
    const momentInputDate = format
      ? moment(inputDate, format)
      : moment(inputDate);
    const duration = moment.duration(moment().diff(momentInputDate));
    return duration.asMinutes();
  } else {
    return 0;
  }
}

export function getPickListObject(value, formMetaData, field) {
  let picklistName = formMetaData.fields[field].picklist;
  let valueList = formMetaData.resources[picklistName];

  let result = valueList.filter((obj) => {
    return obj.key === value;
  });

  if (result) return result[0];
  else return;
}

export function getFieldTitle(name, formMetaData) {
  let title = formMetaData.fields[name].field_title;
  return title;
}

export function getRegionTitle(name, formMetaData) {
  let title = formMetaData.regions[name].region_title;
  return title;
}

export function formatDateTimeStamp(inputDate, datatimeformat) {
  let formattedFormat = datatimeformat
    .replace(/dd/g, "DD")
    .replace(/EEEE/g, "dddd")
    .replace(/E/g, "ddd");

  return inputDate ? moment(inputDate).format(formattedFormat) : "";
}

export function formatDate(inputDate, dataformat) {
  let formattedFormat = dataformat
    .replace(/dd/g, "DD")
    .replace(/EEEE/g, "dddd")
    .replace(/E/g, "ddd");
  //   const defaultFormat = "YYYY-MM-DD";

  return inputDate ? moment(inputDate).format(formattedFormat) : "";
}

export function getFiscalYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const fiscalYearStartMonth = 3;
  const fiscalYear =
    now.getMonth() >= fiscalYearStartMonth
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;
  return fiscalYear;
}

export function getNormalYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  return currentYear;
}

export function dateFormat(jsonDate) {
  if (jsonDate === undefined || jsonDate == "") return "";
  const date = new Date(jsonDate);

  const getYear = date.toLocaleDateString("default", {
    year: "numeric",
  });
  const getMonth = date.toLocaleDateString("default", {
    month: "2-digit",
  });
  const getDay = date.toLocaleDateString("default", { day: "2-digit" });
  const formattedDate = getYear + "-" + getMonth + "-" + getDay;
  return formattedDate;
}
