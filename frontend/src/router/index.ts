import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/pages/Login/index.vue"),
  },
  {
    path: "/whiteboard",
    component: () => import("@/pages/Whiteboard/index.vue"),
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
