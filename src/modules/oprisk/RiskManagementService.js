import axios from "src/utils/AxiosInstance";

function getServicequery(service) {
  return queries[service];
}

function getService(service) {
  switch (service) {
    case "getpagesinfo":
      return "/navigation/getpagesinfo";
    case "getUserInfo":
      return "/util/getUserInfo";
    case "getModuleInfo":
      return "/util/getModuleInfo";
    case "getPrivilegeInfo":
      return "/util/getPrivilegeInfo";
    case "getForms":
      return "/util/getForms";
    case "viewdata":
      return "/viewdata";
    case "getFormFields":
      return "/util/getFormFields";
    case "getTaskInfo":
      return "/util/getTaskInfo";
    case "getManager":
      return "/util/getManager";
    case "manager":
      return "/user/manager";
    case "configurationsetup":
      return "/configurationsetup";
    case "objectinfo":
      return "/util/getFormData";
    case "objectdetails":
      return "/form";
    case "tableinfo":
      return "/relationship/relationshipbyprocess";
    case "businessinfo":
      return "/relationship/getBusinessResilienceByProcessId/";
    case "getProcessInfo":
      return "/form/process";
    case "deleteObject":
      return "/relationship/deleteRecordRcsa";
    case "insertObject":
      return "/relationship/insertRecordRcsa";
    case "deleteBusiness":
      return "businessResFramework/deleteBusResFramewok";
    case "insertBusiness":
      return "businessResFramework/updateRecord";
    case "uploadIds":
      return "util/getformIdAndModuleId?apiHandler";
    case "regulatoryCompliance":
      return "/risk/getRegulatoryCompliance";
    case "getRiskFrameworkData":
      return "/rcsa/relationship/framework/1";
    case "deleteRegulatoryData":
      return "/regulatoryRelationship/deleteRegulatory?";
    case "insertRegulatoryData":
      return "/regulatoryRelationship/insertRegulatory?";
    case "kriData":
      return "/kri/kridetail";
    case "getAuditData":
      return "/relationship/relationshipbyauditableentity";
    case "deleteAuditData":
      return "/relationship/deleteRecordFromAuditableEntity";
    case "insertAudit":
      return "/relationship/insertRecordToAuditableEntity";
    case "processComInfo":
      return "/relationship/processComplienceInfo/";
    case "kriTask":
      return "/relationship/totalTasks";
    case "grcTotalData":
      return "/grc/getActiveCount";
    case "buCount":
      return "util/countofquartely";
    case "AverageSummary":
      return "/kri/averagethreashold";
    case "AverageRiskTrend":
      return "/risk/getRiskAssessmentData";
    case "totalAssessedLastQuaterCount":
      return "/grc/countoflastquarted";
    case "lossData":
      return "/glloss/totalloss";
    case "BusinessResilienceData":
      return "/businessresilienceByBuId/getActiveCountByUserId";
    case "MultipleData":
      return "util/getFormObjectInfo";
    case "CheckExistRecord":
      return "relationship/checkExistsRecordRcsa";
    case "CheckExistBusiness":
      return "relationship/checkExistsBusinessResiliance";
    case "CheckExistAudit":
      return "relationship/checkExistsAuditableEntity";
    case "CheckExistRegulatory":
      return "relationship/checkExistsRegulatoryCompliance";
    case "AiGenerateDynamicRating":
      return "dynamic-risk-rating/get-risk-ratings";
    case "getroduedate":
      return "/ctduedatecalculation/duedate";
    default:
      break;
  }
}

export function getLossData(service, id, startFY, endFY) {
  const API_BASE_URL = getService(service);
  const param = "/" + id + "/" + startFY + "/" + endFY;
  const url = API_BASE_URL + param;
  return axios.get(url);
}

export function getBusinessCountByFinancialYear(
  service,
  orgId,
  startFY,
  endFY
) {
  const API_BASE_URL = getService(service);
  const param =
    "?" + "orgId=" + orgId + "&startFY=" + startFY + "&endFY=" + endFY;
  return axios.get(API_BASE_URL + param);
}

export function getAiGenerateDynamicRatingValues(service, userId) {
  const API_BASE_URL = getService(service);
  const param = "/" + userId;
  const url = API_BASE_URL + param;
  return axios.get(url);
}

export function getCountoflastquarted(service, id, startFY, endFY) {
  const API_BASE_URL = getService(service);
  const param = "?orgId=" + id + "&endFY=" + endFY;
  const url = API_BASE_URL + param;
  return axios.get(url);
}

export function getCountByFiscalyear(service, id, endFY) {
  const API_BASE_URL = getService(service);
  const param = "?orgId=" + id + "&year=" + endFY;
  const url = API_BASE_URL + param;
  return axios.get(url);
}

export function getTrensRiskData(service, parentriskId) {
  let API_BASE_URL = getService(service);
  if (parentriskId) {
    API_BASE_URL = API_BASE_URL + "/" + parentriskId;
  }
  return axios.get(API_BASE_URL);
}

export function getQueryData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getBusinessData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getAverageData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getBusinessCountData(service) {
  let API_BASE_URL = getService(service);
  return axios.get(API_BASE_URL);
}

export function getServiceData(service, id) {
  let API_BASE_URL = getService(service);
  if (id) {
    API_BASE_URL = API_BASE_URL + "/" + id;
  }
  return axios.get(API_BASE_URL);
}
export function getServiceMultiData(service, formService, objectids) {
  let API_BASE_URL = getService(service);
  const param = "?formService=" + formService + "&objectIds=" + objectids;
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

export function getObjects(service, formname) {
  const API_BASE_URL = getService(service);
  const param = "/" + formname;
  return axios.get(API_BASE_URL + param);
}
export function getObjectsInfo(service, formname, objectid) {
  const API_BASE_URL = getService(service);
  const param = "/" + formname + "/" + objectid;
  return axios.get(API_BASE_URL + param);
}
export function getTableDetails(service, processid) {
  const API_BASE_URL = getService(service);
  const param = "?processId=" + processid;
  return axios.get(API_BASE_URL + param);
}
export function getTableDetail(service, auditid) {
  const API_BASE_URL = getService(service);
  const param = "?auditId=" + auditid;
  return axios.get(API_BASE_URL + param);
}
export function getBusinessDetails(service, processid) {
  const API_BASE_URL = getService(service);
  const param = processid;
  return axios.get(API_BASE_URL + param);
}

export function deleteObjects(
  service,
  processid,
  businessentityid,
  riskid,
  controlid,
  testprocedureid
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businessEntityId=" +
    businessentityid +
    "&riskId=" +
    riskid +
    "&controlId=" +
    controlid +
    "&testProcedureId=" +
    testprocedureid;
  return axios.delete(API_BASE_URL + param);
}
export function insertObjects(
  service,
  processid,
  businessunit,
  riskids,
  controlids,
  testprocedureids
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businessUnit=" +
    businessunit +
    "&riskIds=" +
    riskids +
    "&controlIds=" +
    controlids +
    "&testProcedureIds=" +
    testprocedureids;
  return axios.post(API_BASE_URL + param);
}
export function checkData(
  service,
  processid,
  businessunit,
  riskids,
  controlids,
  testProcedureids
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businessUnit=" +
    businessunit +
    "&riskIds=" +
    riskids +
    "&controlIds=" +
    controlids +
    "&testProcedureIds=" +
    testProcedureids;

  return axios.get(API_BASE_URL + param);
}
export function checkBuisnessData(
  service,
  processid,
  businessunit,
  objecttype
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businessUnit=" +
    businessunit +
    "&objectType=" +
    objecttype;

  return axios.get(API_BASE_URL + param);
}
export function checkRegulatoryData(
  service,
  regulatoryBody,
  areaofcompliance,
  requirement,
  objecttype
) {
  const API_BASE_URL = getService(service);
  const param =
    "?regulatoryBody=" +
    regulatoryBody +
    "&areaOfCompliance=" +
    areaofcompliance +
    "&requirement=" +
    requirement +
    "&objectType=" +
    objecttype;

  return axios.get(API_BASE_URL + param);
}
export function deleteBusiness(
  service,
  processid,
  businesunitid,
  objecttype,
  objectname
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businesUnitId=" +
    businesunitid +
    "&objectType=" +
    objecttype +
    "&objectName=" +
    objectname;

  return axios.delete(API_BASE_URL + param);
}
export function insertBusiness(
  service,
  processid,
  businessunitid,
  objecttypeid,
  objectnameids
) {
  const API_BASE_URL = getService(service);
  const param =
    "?processId=" +
    processid +
    "&businessUnitId=" +
    businessunitid +
    "&objectTypeId=" +
    objecttypeid +
    "&objectNameIds=" +
    objectnameids;
  return axios.post(API_BASE_URL + param);
}
export function getUploadIds(service, formname) {
  const API_BASE_URL = getService(service);
  const param = "=" + formname;
  return axios.get(API_BASE_URL + param);
}
export function deleteRegulatory(
  service,
  regulatoryBody,
  areaOfCompliance,
  requirement,
  objectType,
  objectName
) {
  const API_BASE_URL = getService(service);
  const param =
    "regulatoryBody=" +
    regulatoryBody +
    "&areaOfCompliance=" +
    areaOfCompliance +
    "&requirement=" +
    requirement +
    "&objectType=" +
    objectType +
    "&objectName=" +
    objectName;
  return axios.delete(API_BASE_URL + param);
}
export function insertRegulatory(
  service,
  regulatoryBody,
  areaOfCompliance,
  requirement,
  objectType,
  objectName
) {
  const API_BASE_URL = getService(service);
  const param =
    "regulatoryBody=" +
    regulatoryBody +
    "&areaOfCompliance=" +
    areaOfCompliance +
    "&requirement=" +
    requirement +
    "&objectType=" +
    objectType +
    "&objectName=" +
    objectName;
  return axios.post(API_BASE_URL + param);
}
export function deleteAudits(
  service,
  auditableentity,
  businessunit,
  riskid,
  controlid,
  testprocedureid
) {
  const API_BASE_URL = getService(service);
  const param =
    "?auditableEntity=" +
    auditableentity +
    "&businessUnit=" +
    businessunit +
    "&riskId=" +
    riskid +
    "&controlId=" +
    controlid +
    "&testProcedureId=" +
    testprocedureid;
  return axios.delete(API_BASE_URL + param);
}
export function insertAuditData(
  service,
  auditableentity,
  businessunit,
  riskids,
  controlids,
  testprocedureids
) {
  const API_BASE_URL = getService(service);
  const param =
    "?auditableEntity=" +
    auditableentity +
    "&businessUnit=" +
    businessunit +
    "&riskIds=" +
    riskids +
    "&controlIds=" +
    controlids +
    "&testProcedureIds=" +
    testprocedureids;
  return axios.post(API_BASE_URL + param);
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
