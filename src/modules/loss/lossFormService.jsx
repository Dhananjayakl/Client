import axios from "src/utils/AxiosInstance";

// const API_BASE_URL = "/forms";

function getService(service) {
  switch (service) {
    case "viewdata":
      return "/viewdata";
      break;
    case "getActionCode":
      return "/util/getActionCode";
      break;
  }

}

export function getActionCode(service, stage, workflowId, actionTitle) {
  const API_BASE_URL = getService(service);
  return axios.get(
    API_BASE_URL +
      "?" +
      "stageCode" +
      "=" +
      stage +
      "&workFlowId" +
      "=" +
      workflowId +
      "&actionTitle" +
      "=" +
      actionTitle
  );
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
  console.log("Filter Expression", entity.filterExpression);
  // filterExpression = encodeURIComponent(entity.filterExpression);
  console.log("Filter Expression1", filterExpression);
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


