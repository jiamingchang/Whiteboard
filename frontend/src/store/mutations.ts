import { StorageKey } from "@/utils/constant";
import { User } from "@/utils/types";
import { MutationTree } from "vuex";
import { MutationKeys } from "./mutation-type";
import { GlobalState } from "./state";

export type MapMutatione = MutationTree<GlobalState>;

const mutation: MapMutatione = {
  [MutationKeys.LOG_OUT](state: GlobalState) {
    state.token = undefined;
    state.userInfo = undefined;
    state.isLogin = false;
    localStorage.removeItem(StorageKey.TOKEN);
    localStorage.removeItem(StorageKey.USER_INFO);
  },
  [MutationKeys.LOG_IN](
    state: GlobalState,
    { userInfo, token }: { userInfo: Partial<User>; token: string }
  ) {
    state.token = token;
    state.isLogin = true;
    state.userInfo = userInfo;
    localStorage.setItem(StorageKey.TOKEN, token);
    localStorage.setItem(StorageKey.USER_INFO, JSON.stringify(userInfo));
  },
};

export default mutation;
