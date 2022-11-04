import { User } from "@/utils/types";

// state类型的数据
export interface RootStateType {
  token?: string;
  // 内置的Partial<T> 将类型的属性变成可选
  // user类型的userInfo属性
  userInfo?: Partial<User>;
  isLogin: boolean;
}

// 接口定义对象类型
export interface GlobalState {
  token?: string;
  // 内置的Partial<T> 将类型的属性变成可选
  // user类型的userInfo属性
  userInfo?: Partial<User>;
  isLogin: boolean;
}

export default {};
