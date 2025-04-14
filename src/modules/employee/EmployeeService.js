import axios from "src/utils/AxiosInstance";

// const API_BASE_URL = "/forms";

function getService(service) {
    switch (service) {
        case "personaldetails":
            return "/personalDetails";
            break;
        case "users":
            return "/user";
            break;
        case "bankdetails":
            return "/bankdetails";
            break;
        case "skills":
            return "/skillsdetails";
            break;
        case "separationRequest":
            return "/separationrequest";
            break;
        case "references":
            return "/references";
            break;
        case "jobHistory":
            return "/jobhistory";
            break;
        case "familyDetails":
            return "/familydetails";
            break;
        case "educationalDeails":
            return "/educationaldetails";
            break;
        case "certification":
            return "/certifications";
            break;
        case "emergencyContactDetails":
            return "/econtactdetails";
            break;
        case "documents":
            return "/documents";
            break;
        case "contactDetails":
            return "/contactdetails";
            break;
        case "viewdata":
            return "/viewdata";
            break;
        case "getUsersForHrmsAdmin":
            return "/getUsersForHrmsAdmin";
            break;
        case "checkEmployeeCode":
            return "/util/checkEmployeeCode";
            break;
        case "updateBuStatus":
            return "/util/updateBuStatus";
            break;
        case "getFiscalYear":
            return "/util/getFiscalYear";
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

export function getYear(service) {
    const API_BASE_URL = getService(service);
    return axios.get(API_BASE_URL);
}

export function getHrAdmin(service) {
    const API_BASE_URL = getService(service);
    return axios.get(API_BASE_URL);
}

export function createObject(service, Object) {
    const API_BASE_URL = getService(service);
    return axios.post(API_BASE_URL, Object);
}

export function updateObjectData(service, Object, objectid) {
    const API_BASE_URL = getService(service);
    return axios.put(API_BASE_URL + "/" + objectid, Object);
}
export function deleteObject(service, objectid) {
    const API_BASE_URL = getService(service);
    return axios.delete(API_BASE_URL + "/" + objectid);
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
    return axios.get(API_BASE_URL + "?entity=" + entity.viewName + "&pageNumber=" + entity.pageNumber + "&pageSize=" + entity.pageSize + "&sortField=" + entity.sortField + "&sortOrder=" + sortOrder + "&OrderExpression=" + entity.orderExpression + "&filterExpression=" + entity.filterExpression);
}

export function checkEmployeeCode(service, employeeCode) {
    const API_BASE_URL = getService(service);
    const param = "?" + "&employeeCode=" + employeeCode;
    return axios.get(API_BASE_URL + param);
}


// updateBuStatus?skillId=4
export function updateBuStatus(service, skillId) {
    const API_BASE_URL = getService(service);
    const param = "?" + "&skillId=" + skillId;
    return axios.get(API_BASE_URL + param);
}