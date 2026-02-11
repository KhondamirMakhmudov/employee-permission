import axios from "axios";
import { config } from "@/config";

const requestPython = axios.create({
  baseURL: config.PYTHON_API_URL,
  params: {},
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  },
});

requestPython.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const requestGeneralAuth = axios.create({
  baseURL: config.GENERAL_AUTH_URL,
  params: {},
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  },
});

requestGeneralAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const requestEmployeeDetail = axios.create({
  baseURL: `${config.GENERAL_AUTH_URL}`,
  params: {},
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  },
});

requestEmployeeDetail.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { requestPython, requestGeneralAuth, requestEmployeeDetail };
