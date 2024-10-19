/*
 * @Date: 2024-09-11 01:25:53
 * @Author: Poco Ray
 * @FilePath: \oafront\src\router\index.js
 * @Description: 页面-路由导航映射
 */
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import frame_routes from "@/router/frame"; // 引入主页面路由导航
import login_routes from "@/router/login"; // 引入登录页面路由导航

// 创建并配置路由导航的映射关系
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: frame_routes.concat(login_routes), // 合并主页面路由导航和登录页面路由导航
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
