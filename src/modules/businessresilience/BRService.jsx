import axios from "src/utils/AxiosInstance";

function getService(service) {
  switch (service) {
    case "getObjectInfo":
      return "/util/getObjectInfo?";

    case "viewdata":
      return "/viewdata";

    case "checkObjectStatus":
      return "/util/checkObjectStatus";

    case "getObjectCount":
      return "/util/getObjectCount";

    case "getBusinessDataCount":
      return "/businessresilence/getActiveCount";

    default:
      break;
  }
}

export function getObjectInfo(service, objectId, formName, columnName) {
  const API_BASE_URL = getService(service);

  const param =
    "objectId=" +
    objectId +
    "&formName=" +
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
  console.log("Base Url", API_BASE_URL);
  console.log("Entity Value", entity);

  pageNumber = pageNumber || 0;
  pageSize = pageSize || 0;
  sortField = sortField || "";
  sortOrder = sortOrder || "";
  orderExpression = orderExpression || "";
  filterExpression = filterExpression || "";

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

export function getStatus(service, formName, exerciseId) {
  const API_BASE_URL = getService(service);
  const param = "?" + "formName=" + formName + "&exerciseId=" + exerciseId;
  return axios.get(API_BASE_URL + param);
}

export function getObjectCount(service, tableName, filterExpression) {
  const API_BASE_URL = getService(service);
  const param =
    "?" + "tableName=" + tableName + "&filterExpression=" + filterExpression;
  return axios.get(API_BASE_URL + param);
}

export function getBusinessCount(service, userId, startFY) {
  const API_BASE_URL = getService(service);
  const param = "?" + "orgId=" + userId + "&year=" + startFY;
  return axios.get(API_BASE_URL + param);
}
export function getBusinessCountByFinancialYear(service, userId, year) {
  const API_BASE_URL = getService(service);
  const param = "?" + "orgId=" + userId + "&year=" + year;
  return axios.get(API_BASE_URL + param);
}
