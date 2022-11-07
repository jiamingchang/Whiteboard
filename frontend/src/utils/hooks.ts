import store from "@/store";

export function useAnimationPageWidth() {
  return () => {
    const w = store.state.pageWidth;
    if (w === 0) {
      store.commit("changePageWidth", 330);
    } else {
      store.commit("changePageWidth", 0);
    }
  };
}
