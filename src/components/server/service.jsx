import axios from "src/utils/AxiosInstance";
import * as queries from "./queries";

function getServicequery(service) {
  return queries[service];
}

function getService(service) {
  switch (service) {
    case "getpagesinfo":
      return "/navigation/getpagesinfo";
      break;
    case "getUserInfo":
      return "/util/getUserInfo";
      break;
    case "getModuleInfo":
      return "/util/getModuleInfo";
      break;
    case "getPrivilegeInfo":
      return "/util/getPrivilegeInfo";
      break;
    case "getForms":
      return "/util/getForms";
      break;
    case "getFormFields":
      return "/util/getFormFields";
      break;
    case "getTaskInfo":
      return "/util/getTaskInfo";
      break;
    case "getManager":
      return "/util/getManager";
      break;
    case "manager":
      return "/user/manager";
      break;
    case "ReportFilterMeta":
      return "/reportexport/getRepetedFilterReportMeta";
      break;
    case "exportAgain":
      return "/reportexport/exportAgain";
      break;
    case "profileUpdate":
      return "/attachment/profileUpdate";
      break;
    case "uploadImg":
      return "/attachment/uploadImg?";
      break;
    case "profileDelete":
      return "/attachment/profileDelete";
      break;
    case "Dforms":
      return "/Dforms";
      break;
    case "DBfields":
      return "/DBfields";
      break;

    case "getTaskInfo":
      return "/util/getTaskInfo";
      break;
    case "getTaskForms":
      return "/util/getTaskForms";
      break;
    case "getTaskFilters":
      return "/util/getTaskInfo?";
      break;
    case "postbookmark":
      return "/bookmark/save";
      break;
    case "deletebookmark":
      return "/bookmark/delete";
      break;
    case "getbookmark":
      return "/bookmark/getrecords";
      break;
    case "exitsbookmark":
      return "/bookmark/exists";
      break;

    case "formobjectlock":
      return "/form/formObjectLock";
      break;
    case "formobjectunlock":
      return "/form/formObjectUnlock";
      break;
    case "notificationinfo":
      return "/util/notificationinfo";
      break;
    case "moduleForms":
      return "/util/getForms";
      break;
    case "viewdata":
      return "/viewdata";
      break;
    default:
      break;
  }
}

export function getQueryData(service) {
  const API_BASE_URL = "/getdatabyquery";
  const param = "?query=" + getServicequery(service);
  return axios.get(API_BASE_URL + param);
}

/*
 * @Service - Mandatory Parameter
 * @id - Optional Parameter which will be passed to Query parameter
 *
 *
 *
 */
export function getServiceData(service, id) {
  let API_BASE_URL = getService(service);
  if (id) {
    API_BASE_URL = API_BASE_URL + "/" + id;
  }
  return axios.get(API_BASE_URL);
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
  // return axios.get(API_BASE_URL + "?entity=" + entity + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&sortField=" + sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + orderExpression + "&filterExpression=" + filterExpression);
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

export function getReportMeta(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getTaskInfo(service, pageNumber, pageSize) {
  let API_BASE_URL = getService(service);
  API_BASE_URL =
    API_BASE_URL +
    "?pageNumber" +
    "=" +
    pageNumber +
    " &pageSize" +
    "=" +
    pageSize;
  return axios.get(API_BASE_URL);
}

export function getTaskForms(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getModuleForms(service, orderBy, moduleId) {
  let API_BASE_URL = getService(service);
  API_BASE_URL = API_BASE_URL + "?orderBy=" + orderBy + "&moduleId=" + moduleId;
  return axios.get(API_BASE_URL);
}

export function getTaskFilters(
  service,
  pageNumber,
  formId,
  taskTitle,
  formDate,
  toDate,
  pageSize,
  sortby,
  sortbyValue
) {
  if (sortbyValue == undefined) {
    sortbyValue = "";
  }
  if (pageSize == 0) {
    pageSize = 10;
  }
  let API_BASE_URL = getService(service);
  // let param = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&formId=' + formId + '&formDate=' + formDate + '&toDate=' + toDate + '&taskTitle=' + taskTitle + '&sortBy=' + sortby + '&sortOrder=' + sortbyValue
  let param =
    "pageNumber=" +
    pageNumber +
    "&pageSize=" +
    pageSize +
    "&formId=" +
    formId +
    "&fromDate=" +
    formDate +
    "&toDate=" +
    toDate +
    "&taskTitle=" +
    taskTitle +
    "&sortBy=" +
    sortby +
    "&sortOrder=" +
    sortbyValue;
  return axios.get(API_BASE_URL + param);
}

export function postBookMark(service, formid, objectid, userid, moduleid) {
  const API_BASE_URL = getService(service);
  const param =
    "?formId=" +
    formid +
    "&objectId=" +
    objectid +
    "&userId=" +
    userid +
    "&moduleId=" +
    moduleid;

  return axios.post(API_BASE_URL + param);
}
export function deleteBookMark(service, userid, bookmarkid, formid) {
  const API_BASE_URL = getService(service);
  const param =
    "?userId=" + userid + "&bookmarkId=" + bookmarkid + "&formId=" + formid;
  return axios.delete(API_BASE_URL + param);
}
export function getBookMark(service, formid, objectid, userid) {
  const API_BASE_URL = getService(service);
  const param =
    "?formId=" + formid + "&userId=" + userid + "&objectId=" + objectid;
  return axios.get(API_BASE_URL + param);
}
export function existsBookMark(service, formid, objectid, userid) {
  const API_BASE_URL = getService(service);
  const param =
    "?formId=" + formid + "&objectId=" + objectid + "&userId=" + userid;
  return axios.get(API_BASE_URL + param);
}

export function postComments(service, comment) {}

export function formObjectUnlock(service, objectid, formid) {
  const API_BASE_URL = getService(service);
  const param = "?objectId=" + objectid + "&formId=" + formid;
  return axios.delete(API_BASE_URL + param);
}
export function formObjectLock(service, objectid, formid) {
  const API_BASE_URL = getService(service);
  const param = "?objectId=" + objectid + "&formId=" + formid;
  return axios.post(API_BASE_URL + param);
}
export function formObjectExtendTime(service, objectid, formid, isextended) {
  const API_BASE_URL = getService(service);
  const param =
    "?objectId=" + objectid + "&formId=" + formid + "&isExtended=" + isextended;
  return axios.put(API_BASE_URL + param);
}

export function getNotifications(service, userId) {
  let API_BASE_URL = getService(service);
  API_BASE_URL = API_BASE_URL + "?userId" + "=" + userId;
  return axios.get(API_BASE_URL);
}
