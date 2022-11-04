import store from "@/store";

export function useAnimationPageWidth() {
  return () => {
    const width = store.state.pageWidth;
    if (width === 0) {
      store.commit("changePageWidth", 330);
    } else {
      store.commit("changePageWidth", 0);
    }
  };
}
