import { instance } from "@/store";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { BASE_URL, TIME_OUT } from "./config";

//创建一个实例
const request = axios.create({
  baseURL: `${BASE_URL}`, //基础路径
  timeout: TIME_OUT, //请求超时时间
});

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

request.interceptors.response.use(
  (result) => {
    return result.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const tokenRequest = axios.create({
  baseURL: `${BASE_URL}`, //基础路径
  timeout: TIME_OUT, //请求超时时间
});

//携带token的拦截器
tokenRequest.interceptors.request.use(
  (config) => {
    //每次请求携带token、前面、时间戳
    let token = localStorage.getItem("token");
    config.headers["authorzation"] = token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

tokenRequest.interceptors.response.use(
  (result) => {
    return result.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { request, tokenRequest };
