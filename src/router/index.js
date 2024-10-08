/*
 * @Date: 2024-09-11 01:25:53
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\router\index.js
 * @Description: 页面-路由导航映射
 */
import { createRouter, createWebHashHistory } from "vue-router";
import login from "@/views/login/login.vue";
import frame from "@/views/main/frame.vue";
import myabsent from "@/views/absent/my.vue";
import subabsent from "@/views/absent/sub.vue";
import inform_publish from "@/views/inform/publish.vue";
import inform_list from "@/views/inform/list.vue";
import inform_detail from "@/views/inform/detail.vue";
import { useAuthStore } from "@/stores/auth";
import staffadd from "@/views/staff/add.vue";
import stafflist from "@/views/staff/list.vue";
import home from "@/views/home/home.vue";

// 创建并配置路由导航的映射关系
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "frame",
      component: frame,
      children: [
        { path: "/", name: "home", component: home },
        { path: "/absent/my", name: "myabsent", component: myabsent },
        { path: "/absent/sub", name: "subabsent", component: subabsent },
        { path: "/inform/publish", name: "inform_publish", component: inform_publish },
        { path: "/inform/list", name: "inform_list", component: inform_list },
        { path: "/inform/detail/:pk", name: "inform_detail", component: inform_detail },
        { path: "/staff/add", name: "staff_add", component: staffadd},
        { path: "/staff/list", name: "staff_list", component: stafflist},
      ],
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
  ],
});

// 设置全局导航守卫, 只有登录后才能访问其他页面
router.beforeEach((to, from) => {
  // 判断是否登录, 如果没有登录, 并且访问的不是登录页面, 就跳转到登录页面
  const authStore = useAuthStore();
  if (!authStore.is_logined && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
