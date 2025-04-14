import axios from "src/utils/AxiosInstance";

function getService(service) {
  switch (service) {
    case "getObjectInfo":
      return "/util/getObjectInfo?";
      break;
    case "viewdata":
      return "/viewdata";
      break;
      case "getObjectCount":
        return "/util/getObjectCount";
        break;
    default:
      break;
  }
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
  // const   service='viewdata';
  if (pageNumber === undefined) pageNumber = 0;
  if (pageSize === undefined) pageSize = 0;
  if (sortField === undefined) sortField = "";
  if (sortOrder === undefined) sortOrder = "";
  if (orderExpression === undefined) orderExpression = "";
  if (filterExpression === undefined) filterExpression = "";
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

export function getObjectCount(service, tableName, filterExpression) {
  const API_BASE_URL = getService(service);
  const param =
    "?" + "tableName=" + tableName + "&filterExpression=" + filterExpression;
  return axios.get(API_BASE_URL + param);
}
