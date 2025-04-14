import axios from "src/utils/AxiosInstance";

// const API_BASE_URL = "/forms";

function getService(service) {
  switch (service) {
    case "leaveRequest":
      return "/leaveRequest";
      // return "form/leaverequest";
      break;
    case "setupholiday":
      return "/HolidaySetup";
      break;
    case "leaveConfiguration":
      return "/leaveConfiguration";
      break;
    case "viewdata":
      return "/viewdata";
      break;
    case "leaveLedgerDetails":
      return "/leaveLedgerDetails";
      break;
    case "leaveCount":
      return "/leaveRequest";
      break;
    case "checkYearandRegion":
      return "/leaveConfiguration/checkYearAndRegion";
      break;
    case "getFiscalYear":
      return "/util/getFiscalYear";
      break;
    case "getManager":
      return "/util/getManager";
      break;
    case "manager":
      return "/user/manager";
      break;
    default:
      break;
  }
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
export function getServiceData(service, id) {
  let API_BASE_URL = getService(service);
  if (id) {
    API_BASE_URL = API_BASE_URL + "/" + id;
  }
  return axios.get(API_BASE_URL);
}
export function updateObjectData(service, Object, objectid) {
  const API_BASE_URL = getService(service);
  return axios.put(API_BASE_URL + "/" + objectid, Object);
}
export function deleteObject(service, objectid) {
  const API_BASE_URL = getService(service);
  return axios.delete(API_BASE_URL + "/" + objectid);
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

export function getChartData(
  entity,
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
  orderExpression,
  filterExpression
) {
  const API_BASE_URL = getService("viewdata");
  if (pageNumber === undefined) pageNumber = 0;
  if (pageSize === undefined) pageSize = 0;
  if (sortField === undefined) sortField = "";
  if (sortOrder === undefined) sortOrder = "";
  if (orderExpression === undefined) orderExpression = "";
  if (filterExpression === undefined) filterExpression = "";

  return axios.get(
    API_BASE_URL +
      "?entity=" +
      entity +
      "&pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize +
      "&sortField=" +
      sortField +
      "&sortOrder=" +
      sortOrder +
      "&OrderExpression=" +
      orderExpression +
      "&filterExpression=" +
      filterExpression
  );
}

export function getYearandRegion(service, year, region) {
  const API_BASE_URL = getService(service);
  const param = "/" + year + "/" + region;
  return axios.get(API_BASE_URL + param);
}
