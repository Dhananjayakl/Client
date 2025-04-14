import axios from "axios";

const AxiosInstance = axios.create({
   baseURL: "https://rndstg.progrec.com:8088/progrecapps/api/v1",
  withCredentials: true,
});

AxiosInstance.interceptors.request.use((config) => {
  return config;
});

export default AxiosInstance;
