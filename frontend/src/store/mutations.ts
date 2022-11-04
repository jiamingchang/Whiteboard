import { RootStateType } from "./state";
import { guid } from "@/utils/guid";
export default {
  changePageWidth(state: RootStateType, width: number) {
    console.log(width);
    state.pageWidth = width;
    return state;
  },
  selectCurrPage(state: RootStateType, pageId: String) {
    const page = state.pageList.findIndex((item) => item.pageId === pageId);
    if (page !== -1) {
      state.page = page;
    } else {
      state.page = -1;
    }
  },
  addPage(state: RootStateType) {
    const pageId = guid();
    state.pageList.push({
      pageId,
      currpageData: [],
    });
    state.page = state.pageList.length - 1;
  },
};
