import { RootStateType } from "./state";
export default {
  changePageWidth(state: RootStateType, width: Number) {
    console.log(width);
    state.pageWidth = width;
    return state;
  },
};
