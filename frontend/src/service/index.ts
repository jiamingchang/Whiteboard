import request from "./request";

export const adminLoginApi = (data: any) => request.post("/admin/login", data);
