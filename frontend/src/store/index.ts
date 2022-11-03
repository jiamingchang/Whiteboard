import { createStore } from "vuex";

import modules from "./modules";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

// 全局引入的类型
import state, { RootStateType } from "./state";

export default createStore<RootStateType>({
  state,
  mutations,
  actions,
  getters,
  modules,
});
