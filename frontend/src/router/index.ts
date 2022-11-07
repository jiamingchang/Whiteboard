import store from "@/store";
import { ElMessage } from "element-plus";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";

export const enum Paths {
  LOGIN = '/',
  WHITEBOARD = '/whiteboard',
}

const routes: Array<RouteRecordRaw> = [
  {
    path: Paths.LOGIN,
    component: () => import("@/pages/Login/index.vue"),
  },
  {
    path: Paths.WHITEBOARD,
    component: () => import("@/pages/Whiteboard/index.vue"),
  },
  {
    path: "/:catchAll(.*)", // 其他路由
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 对除了登录页外的进行全局守卫
// router.beforeEach(async (to, from, next) => {
//   if (to.path !== "/login") {
//     let { isLogin } = store.state;
//     if (!isLogin) {
//       ElMessage.error("还未登录哦");
//       next("/login");
//     } else return;
//   }
//   next();
// });

export default router;
