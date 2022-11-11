// state类型的数据
import { guid } from "@/utils/guid";
import { User } from "@/utils/types";

export const enum StorageKey {
  TOKEN = "TOKEN",
  USER_NAME = "USER_NAME",
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
}

// 接口定义对象类型
export interface GlobalState {
  token?: string;
  userInfo?: Partial<User>;
  isLogin: boolean;
}

export default {
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
