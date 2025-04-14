import axios from "src/utils/AxiosInstance";
// import * as queries from "./queries";

function getServicequery(service) {
  // console.log("queries",queries.NaviagationList);
  // console.log(queries[service]);
  return queries[service];
}

function getService(service) {
  switch (service) {

    case "getRiskRelationshipData":
      return "/info/getRiskInfo";
      break;
    case "getControlRelationshipData":
      return "/info/getControlInfo";
      break;
    case "getRange":
      return "/rcsa/relationship/framework/1";
      break;
    default:
      break;
    case "getTicketId":
      return "/util/ticket-sequence"
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
    API_BASE_URL = API_BASE_URL + '/' + id;
  }
  return axios.get(API_BASE_URL);
}

export function getObjectData(service, id) {
  const API_BASE_URL = getService(service);
  const param = id ? "/" + id : "";
  console.log("final url", axios.get(API_BASE_URL + param))
  return axios.get(API_BASE_URL + param);
}


export function getviewData(entity, pageNumber, pageSize, sortField, sortOrder, orderExpression, filterExpression) {
  const API_BASE_URL = getService("viewdata");
  // const   service='viewdata';
  if (pageNumber === undefined) pageNumber = 0;
  if (pageSize === undefined) pageSize = 0;
  if (sortField === undefined) sortField = "";
  if (sortOrder === undefined) sortOrder = "";
  if (orderExpression === undefined) orderExpression = "";
  if (filterExpression === undefined) filterExpression = "";
  console.log("Filter Expression", entity.filterExpression);
  // filterExpression = encodeURIComponent(entity.filterExpression);
  console.log("Filter Expression1", filterExpression);
  // return axios.get(API_BASE_URL + "?entity=" + entity + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&sortField=" + sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + orderExpression + "&filterExpression=" + filterExpression);
  return axios.get(API_BASE_URL + "?entity=" + entity.viewName + "&pageNumber=" + entity.pageNumber + "&pageSize=" + entity.pageSize + "&sortField=" + entity.sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + entity.orderExpression + "&filterExpression=" + entity.filterExpression);
}