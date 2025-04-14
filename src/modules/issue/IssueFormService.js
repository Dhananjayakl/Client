import axios from "src/utils/AxiosInstance";


function getService(service) {
    switch (service) {
        case "viewdata":
            return "/viewdata";
            break;
        default:
            break;
    }
}

export function getObjectData(service, id) {
    const API_BASE_URL = getService(service);
    const param = id ? "/" + id : "";
    console.log("final url", axios.get(API_BASE_URL + param))
    return axios.get(API_BASE_URL + param);
}
export function createObject(service, record) {
    const API_BASE_URL = getService(service);
    return axios.post(API_BASE_URL, record);
}

export function updateObjectData(service, record, objectid) {
    const API_BASE_URL = getService(service);
    return axios.put(API_BASE_URL + "/" + objectid, record);
}
export function deleteObject(service, objectid) {
    const API_BASE_URL = getService(service);
    return axios.delete(API_BASE_URL + "/" + objectid);
}

export function getviewData(entity, pageNumber, pageSize, sortField, sortOrder, orderExpression, filterExpression) {
    const API_BASE_URL = getService("viewdata");
    if (pageNumber === undefined) pageNumber = 0;
    if (pageSize === undefined) pageSize = 0;
    if (sortField === undefined) sortField = "";
    if (sortOrder === undefined) sortOrder = "";
    if (orderExpression === undefined) orderExpression = "";
    if (filterExpression === undefined) filterExpression = "";
    console.log("Filter Expression", entity.filterExpression);
    console.log("Filter Expression1", filterExpression);
    return axios.get(API_BASE_URL + "?entity=" + entity.viewName + "&pageNumber=" + entity.pageNumber + "&pageSize=" + entity.pageSize + "&sortField=" + entity.sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + entity.orderExpression + "&filterExpression=" + entity.filterExpression);
}

export function getChartData(entity, pageNumber, pageSize, sortField, sortOrder, orderExpression, filterExpression) {

    const API_BASE_URL = getService("viewdata");
    if (pageNumber === undefined) pageNumber = 0;
    if (pageSize === undefined) pageSize = 0;
    if (sortField === undefined) sortField = "";
    if (sortOrder === undefined) sortOrder = "";
    if (orderExpression === undefined) orderExpression = "";
    if (filterExpression === undefined) filterExpression = "";

    return axios.get(API_BASE_URL + "?entity=" + entity + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&sortField=" + sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + orderExpression + "&filterExpression=" + filterExpression);
}

