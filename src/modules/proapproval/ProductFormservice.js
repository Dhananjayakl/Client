import axios from "src/utils/AxiosInstance";

function getService(service) {
  switch (service) {
    case "getRegionData":
      return "/util/getRegionData?";
      break;
    case "getForms":
      return "/util/getForms";
    case "viewdata":
      return "/viewdata";
      break;

    default:
      break;
  }
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

export function getRegionData(service, objectId, formName) {
  const API_BASE_URL = getService(service);

  const param = "objectId=" + objectId + "&formName=" + formName;
  return axios.get(API_BASE_URL + param);
}

export function getroduedates(
  service,
  schStartDate,
  schDueByDays,
  onWorkingDay,
  onCalendarDay
) {
  const API_BASE_URL = getService(service);
  const param =
    "/" +
    schStartDate +
    "/" +
    schDueByDays +
    "/" +
    onWorkingDay +
    "/" +
    onCalendarDay;
  return axios.get(API_BASE_URL + param);
}
