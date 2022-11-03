import store from "@/store";

//
export function useChangePageWidth() {
  return function changePageWidth(width: Number) {
    store.commit("changePageWidth", width);
  };
}
