import { User } from "@/utils/types";

export const enum StorageKey {
  TOKEN = "TOKEN",
  USER_INFO = "USER_INFO",
  IS_LOGIN = "IS_LOGIN"
}

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

function state(): RootStateType {
  let userInfo = JSON.parse(localStorage.getItem(StorageKey.USER_INFO) || "{}");
  return {
    token: localStorage.getItem(StorageKey.TOKEN) || undefined,
    userInfo: userInfo,
    // !!有内容转换成true
    isLogin: !!localStorage.getItem(StorageKey.IS_LOGIN),
  };
}
export default state;
