import { request, tokenRequest } from "./request";

interface LoginReq {
  name: string;
  password: string;
}

interface RegisterReq extends LoginReq {
  true_name: string;
}

interface JoinRoomReq {
  uid: number;
}

interface CreateRoomReq {
  read_only: number
}

export const Login = (data: LoginReq) => request.post("/wb/login", data);

export const Register = (data: RegisterReq) => request.post("/wb/addUser", data);

export const JoinRoom = (data:  JoinRoomReq) => tokenRequest.post("/wb/joinRoom", data);

export const CreateRoom = (data: CreateRoomReq) => tokenRequest.post("/wb/createRoom", data);

export const DeleteUser = () => tokenRequest.delete("/wb/deleteUser");
