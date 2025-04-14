import axios from "src/utils/AxiosInstance";

function getServicequery(service) {
  return queries[service];
}

function getService(service) {
  switch (service) {
    case "getRiskRelationshipData":
      return "/info/getRiskInfo";

    case "getControlRelationshipData":
      return "/info/getControlInfo";

    case "getRange":
      return "/rcsa/relationship/framework/1";

    case "getRequirementInfo":
      return "/risk/getRequirementInfo";

    case "getRequirementRelationshipData":
      return "/risk/getRegCompInfo";

    case "getroduedate":
      return "/ctduedatecalculation/duedate";

    default:
      break;
  }
}

export function getQueryData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
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

export function getObjectData(service, id) {
  const API_BASE_URL = getService(service);
  const param = id ? "/" + id : "";
  console.log("final url", axios.get(API_BASE_URL + param));
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
  console.log("Filter Expression", entity.filterExpression);

  console.log("Filter Expression1", filterExpression);

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
