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
    }
  },
  addPage(state: RootStateType) {
    const pageId = guid();
    state.pageList.push({
      pageId,
      currpageData: {
        canvasString: "",
      },
    });
  },
  deletePage(state: RootStateType, idx: number) {
    if (state.page >= state.pageList.length - 1) {
      state.page = state.pageList.length - 2;
    }
    console.log("当前page:", state.page);
    state.pageList.splice(idx, 1);
  },
  changeCurrentType(state: RootStateType, type: string) {
    state.currentType = type;
  },
  changeCanvas(state: RootStateType, canvasString: string) {
    const page = state.page;
    state.pageList[page].currpageData.canvasString = canvasString;
  },
  changePageList(state: RootStateType, newPageList: any) {
    console.log("改变当前页面，wsxxxx");
    state.pageList = [...newPageList];
  },
};
