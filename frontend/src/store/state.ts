// state类型的数据
import { guid } from "@/utils/guid";
export interface pageListType {}

export interface allPageType {
  pageId: String;
  currpageData: Array<Partial<pageListType>>;
}

export interface RootStateType {
  pageWidth: Number;
  selectPage: String;
  pageList: Array<allPageType>;
}

export default {
  pageWidth: 0,
  selectPage: "",
  pageList: [
    {
      pageId: guid(),
      currpageData: [],
    },
    {
      pageId: guid(),
      currpageData: [],
    },
  ],
};
