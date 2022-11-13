import { request } from "./request";

interface LoginReq {
  name: string;
  password: string;
}

interface RegisterReq extends LoginReq {
  true_name: string;
}

export const Login = (data: LoginReq) =>
  request({
    url: "/wb/login",
    method: "POST",
    data,
  });

export const Register = (data: RegisterReq) =>
  request({
    url: "/wb/addUser",
    method: "POST",
    data,
  });

export const JoinRoom = (data: any) =>
  request({
    url: "/wb/joinRoom",
    method: "POST",
    data,
  });

export const CreateRoom = (data: any) =>
  request({
    url: "/wb/createRoom",
    method: "POST",
    data,
  });

export const getUser = (data: any) =>
  request({
    url: "/wb/getUser",
    method: "GET",
  });

export const DeleteUser = (data: any) =>
  request({
    url: "/wb/deleteUser",
    method: "DELETE",
    data,
  });

export const exitRoom = (data: any) =>
  request({ url: "/wb/exitRoom", method: "POST", data });

export const GetUserRoom = (data: any) =>
  request({
    url: "/wb/getUserRoom",
    method: "GET",
  });

export const GetRoomer = (data: any) =>
  request({
    url: "/wb/getRoomer",
    method: "GET",
  });

export const AskRoom = (data: any) =>
  request({
    url: "/wb/askRoom",
    method: "POST",
    data,
  });

export const getRoom = (uid: string) =>
  request({
    url: "/wb/getRoom?uid=" + uid,
    method: "GET",
  });

export const updateRoom = (data = {}) =>
  request({
    url: "/wb/updateRoom",
    method: "POST",
    data,
  });
