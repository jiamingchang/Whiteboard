// state类型的数据
import { guid } from "@/utils/guid";
export interface pageListType {}

export interface allPageType {
  pageId: String;
  currpageData: Array<Partial<pageListType>>;
}

export interface RootStateType {
  pageWidth: number;
  page: number;
  pageList: Array<allPageType>;
}

export default {
  pageWidth: 0,
  page: 0,
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
