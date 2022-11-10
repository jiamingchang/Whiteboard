// state类型的数据
import { guid } from "@/utils/guid";
import { User } from "@/utils/types";

export const enum StorageKey {
  TOKEN = "TOKEN",
  USER_INFO = "USER_INFO",
  IS_LOGIN = "IS_LOGIN",
}

export interface AllElementType {}

export interface pageListType {
  canvasString: string;
}

export interface allPageType {
  pageId: string;
  currpageData: pageListType;
}

export interface RootStateType {
  ctx: any;
  currentType: string;
  pageWidth: number;
  page: number;
  pageList: Array<allPageType>;
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
  userInfo?: Partial<User>;
  isLogin: boolean;
}

export default {
  ctx: null,
  currentType: "selection",
  pageWidth: 0,
  page: 0,
  pageList: [
    {
      pageId: guid(),
      currpageData: {
        canvasString: "",
      },
    },
    {
      pageId: guid(),
      currpageData: {
        canvasString: "",
      },
    },
  ],
};
