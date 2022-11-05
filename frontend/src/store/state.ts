// state类型的数据
import { guid } from "@/utils/guid";
export interface pageListType {}

export interface allPageType {
  pageId: string;
  currpageData: Array<Partial<pageListType>>;
}

export interface RootStateType {
  ctx: any;
  currentType: string;
  pageWidth: number;
  page: number;
  pageList: Array<allPageType>;
}

export default {
  ctx: null,
  currentType: "selection",
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
