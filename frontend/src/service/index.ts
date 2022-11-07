import { request, tokenRequest } from "./request";

interface LoginReq {
  name: string;
  password: string;
}

interface RegisterReq extends LoginReq {
  true_name: string;
}

export const Login = (data: LoginReq) => request.post("/wb/login", data);

export const Register = (data: RegisterReq) => request.post("/wb/addUser", data);

export const JoinRoom = (data: LoginReq) => tokenRequest.post("/wb/joinRoom", data);

export const CreateRoom = (data: LoginReq) => tokenRequest.post("/wb/createRoom", data);