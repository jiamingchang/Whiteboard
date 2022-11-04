import { RootStateType } from "./state";
import { guid } from "@/utils/guid";
export default {
  changePageWidth(state: RootStateType, width: Number) {
    console.log(width);
    state.pageWidth = width;
    return state;
  },
  selectCurrPage(state: RootStateType, pageId: String) {
    state.selectPage = pageId;
  },
  addPage(state: RootStateType) {
    const pageId = guid();
    state.pageList.push({
      pageId,
      currpageData: [],
    });
    state.selectPage = pageId;
  },
};
