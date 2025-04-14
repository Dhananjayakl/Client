// import axios from "src/utils/AxiosInstance";

// export function partialupdateObjectData(service, objectid, Object) {
//   console.log("incoming data", Object, objectid, service);
//   const API_BASE_URL = "/form/" + service;
//   return axios.patch(API_BASE_URL + "/" + objectid, Object);
// }

import axios from "src/utils/AxiosInstance";

export const partialupdateObjectData = (service, objectId, data) => {
  const API_BASE_URL = `/form/${service}`;
  return axios.patch(`${API_BASE_URL}/${objectId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
