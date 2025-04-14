import axios from "src/utils/AxiosInstance";

// const API_BASE_URL = "/forms";

function getService(service) {
  switch (service) {
    case "forms":
      return "/forms";
      break;
    case "pages":
      return "/pages";
      break;
    case "modules":
      return "/module";
      break;
    case "roles":
      return "/role";
      break;
    case "users":
      return "/user";
      break;
    case "privilege":
      return "/privilege";
      break;
    case "picklistvalues":
      return "/picklistvalues";
      break;
    case "picklist":
      return "/picklist";
      break;
    case "viewdata":
      return "/viewdata";
      break;
    case "designWorkflow":
      return "/designWorkflow";
      break;
    case "businessentity":
      return "/businessentity";
      break;
    case "reportdesigner":
      return "/reportdesigner";
      break;
    case "reportByForm":
      return "/reportdesigner/form";
      break;
    case "password":
      return "/user/updatePassword";
      break;
    case "changePassword":
      return "/user/changePassword";
      break;
    case "unlock":
      return "/user/unlock";
      break;
    case "checkUsername":
      return "/user/checkUserName";
      break;
    case "generateExcel":
      return "/excel/generate-excel";
      break;
    case "attachmentId":
      return "/attachment";
      break;
    case "getObjectInfo":
      return "/util/getObjectInfo?";
      break;
    case "chartdesigner":
      return "/chartdesigner";
      break;
    case "getFormsByModule":
      return "/util/getFormsByModule";
      break;
    case "checkExistence":
      return "/util/checkExistence";
      break;

    case "video":
      return "/video";
      break;
    case "sendotp":
      return "/auth/send-OTP";
      break;
    case "resetpassword":
      return "/auth/reset-password";
      break;
    case "multifactorauth":
      return "/auth/otp-login";
      break;
    case "moduleforminfo":
      return "/moduleforminfo";
      break;
    case "formdatainfo":
      return "/formdatainfo";
      break;
    case "data-export":
      return "/data-export";
      break;
    case "uploadIds":
      return "util/getformIdAndModuleId?apiHandler";
      break;
    case "getPrimaryKeyByFormName":
      return "/util/getPrimaryKeyByFormName";
      break;
    default:
      break;
  }
}

export function getReportColumnsBySource(form, dataSource) {
  let service = "reportByForm";
  const API_BASE_URL = getService(service);
  const param =
    "?formName=" +
    (form ? form : "") +
    "&datasource=" +
    (dataSource ? dataSource : "");
  return axios.get(API_BASE_URL + param);
}

export function getObjectData(service, id) {
  const API_BASE_URL = getService(service);
  const param = id ? "/" + id : "";
  return axios.get(API_BASE_URL + param);
}
export function createObject(service, Object) {
  const API_BASE_URL = getService(service);
  return axios.post(API_BASE_URL, Object);
}

export function updateObjectData(service, Object, objectid) {
  const API_BASE_URL = getService(service);
  return axios.put(API_BASE_URL + "/" + objectid, Object);
}
export function deleteObject(service, objectid) {
  const API_BASE_URL = getService(service);
  return axios.delete(API_BASE_URL + "/" + objectid);
}

export function checkExistence(service, objectId, formName, columnName) {
  const API_BASE_URL = getService(service);

  const param =
    "?columnValue=" +
    objectId +
    "&formId=" +
    formName +
    "&columnName=" +
    columnName;
  return axios.get(API_BASE_URL + param);
}
export function getviewData(
  entity,
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
  orderExpression,
  filterExpression
) {
  const API_BASE_URL = getService("viewdata");
  // const   service='viewdata';
  if (pageNumber === undefined) pageNumber = 0;
  if (pageSize === undefined) pageSize = 0;
  if (sortField === undefined) sortField = "";
  if (sortOrder === undefined) sortOrder = "";
  if (orderExpression === undefined) orderExpression = "";
  if (filterExpression === undefined) filterExpression = "";

  // filterExpression = encodeURIComponent(entity.filterExpression);

  // return axios.get(
  //   API_BASE_URL +
  //     "?entity=" +
  //     entity +
  //     "&pageNumber=" +
  //     pageNumber +
  //     "&pageSize=" +
  //     pageSize +
  //     "&sortField=" +
  //     sortField +
  //     "&sortOrder=" +
  //     sortOrder +
  //     "&OrderExpression=" +
  //     orderExpression +
  //     "&filterExpression=" +
  //     filterExpression
  // );

  return axios.get(
    API_BASE_URL +
      "?entity=" +
      entity.viewName +
      "&pageNumber=" +
      entity.pageNumber +
      "&pageSize=" +
      entity.pageSize +
      "&sortField=" +
      entity.sortField +
      "&sortOrder=" +
      sortOrder +
      "&OrderExpression=" +
      entity.orderExpression +
      "&filterExpression=" +
      entity.filterExpression
  );
}

export function changePassword(service, Object) {
  const API_BASE_URL = getService(service);
  return axios.put(API_BASE_URL, Object);
}

export function updatePassword(service, Object) {
  const API_BASE_URL = getService(service);
  return axios.put(API_BASE_URL, Object);
}
export function unLocked(service, userid) {
  const API_BASE_URL = getService(service);
  const param = "?userId=" + userid;
  return axios.post(API_BASE_URL + param);
}

export function checkUsername(service, userName) {
  const API_BASE_URL = getService(service);
  const param = "/" + userName;
  return axios.get(API_BASE_URL + param);
}

export function getExcel(service, Object) {
  const API_BASE_URL = getService(service);
  const param = "/" + Object;
  return axios.get(API_BASE_URL + param);
}
export function getObjectInfo(service, objectId, formName, columnName) {
  const API_BASE_URL = getService(service);
  // const param = "?objectId=" + 572 + '&formName=' + 'ISSUE_MANAGEMENT' + '&columnName=' + 'issue_id'

  const param =
    "objectId=" +
    objectId +
    "&formName=" +
    formName +
    "&columnName=" +
    columnName;

  // const param = id ? "/" + objectId : "" ;
  return axios.get(API_BASE_URL + param);
}

// export function getLandingPages(service) {
//   const API_BASE_URL = getService(service);
//   return axios.get(API_BASE_URL, Object);
// }

export function getVideos(service, videoName) {
  if (videoName) {
    const API_BASE_URL = getService(service);
    const param = "?videoName=" + videoName;
    return axios.get(API_BASE_URL + param, { responseType: "blob" });
  } else {
    const API_BASE_URL = getService(service);
    return axios.get(API_BASE_URL);
  }
}

export function sendOtp(service, username) {
  const API_BASE_URL = getService(service);
  const param = "?username=" + username;
  return axios.post(API_BASE_URL + param);
}
export function resetPassword(service, Object) {
  const API_BASE_URL = getService(service);
  return axios.put(API_BASE_URL, Object);
}
export function multiFactorAuth(service, username, otp) {
  const API_BASE_URL = getService(service);
  const param = "?username=" + username + "&otp=" + otp;
  return axios.post(API_BASE_URL + param);
}

export function getModulesData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getSpecificModuleInfo(service, id) {
  let API_BASE_URL = getService(service);
  API_BASE_URL = API_BASE_URL + "?moduleId=" + id;
  return axios.get(API_BASE_URL);
}

export function getPrimaryKeyByFormName(service, name, regionCode) {
  const API_BASE_URL = getService(service);
  const param = "?formId=" + name + "&regionCode=" + regionCode;

  return axios.get(API_BASE_URL + param);
}
export function getUploadIds(service, formname) {
  const API_BASE_URL = getService(service);
  const param = "=" + formname;
  return axios.get(API_BASE_URL + param);
}
