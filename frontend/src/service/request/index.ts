//二次封装axios
import axios from "axios";
import { BASE_URL, TIME_OUT } from "./config";

//创建一个实例
const request = axios.create({
  baseURL: `${BASE_URL}`, //基础路径
  timeout: TIME_OUT, //请求超时时间
});

//拦截器
request.interceptors.request.use(
  (config) => {
    //每次请求携带token、前面、时间戳
    let token = localStorage.getItem('token');
    config.headers['authorzation'] = token;
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

export default request;
