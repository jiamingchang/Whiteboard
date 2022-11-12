import { createStore, Store } from "vuex";

import modules from "./modules";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

import state, { RootStateType } from "./state";

// 导出类型为一个含有value属性的对象，且赋值value值为null
export const instance: {
  value: null | Store<RootStateType>;
} = {
  value: null,
};

export default createStore<RootStateType>({
  state,
  mutations,
  actions,
  getters,
  modules,
});
