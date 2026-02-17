import { config } from "@/config";

const pythonWsBase = config.PYTHON_API_URL?.replace(/^http/, "ws");

export const URLS = {
  employeeDetail: "/staffio/employee/search/",
  allChiefs: "/staffio/employee/all_chiefs/",
  passRequest: "api/passes",
  allRequests: "api/passes/chief",
  employee: "staffio/employee/",
  approveRequest: "api/passes/approve",
  owner: "api/passes",
  employeeRequests: "api/passes/employee",
  passesWs: `${pythonWsBase}/api/passes/ws`,
};
