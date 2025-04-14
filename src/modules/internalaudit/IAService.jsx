import axios from "src/utils/AxiosInstance";

function getService(service) {
  switch (service) {
    case "getObjectInfo":
      return "/util/getObjectInfo?";
    case "viewdata":
      return "/viewdata";
    case "getObjectCount":
      return "/util/getObjectCount";
    case "downloadAlldocument":
      return "/util/downloadDocuments";
    case "sendForReviewButton":
      return "/workflow/stageActionTrigger";
    case "InternalAuditFramework":
      return "/api/audit-framework";
    default:
      break;
  }
}
export function getFormData(service, action, objectId, formService) {
  const API_BASE_URL = getService(service);
  const param =
    "?action=" + action + "&objectId=" + objectId + "&formApi=" + formService;
  return axios.put(API_BASE_URL + param);
}
export function getInternalAuditFrameworkData(service, objectId) {
  const API_BASE_URL = getService(service);
  const param = "?objectId=" + objectId;
  return axios.get(API_BASE_URL + param);
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
export function downloadAlldocument(service, auditId, config) {
  const API_BASE_URL = getService(service);
  const param = "/" + auditId;
  return axios.get(API_BASE_URL + param, {
    ...config,
    responseType: "arraybuffer",
  });
}
