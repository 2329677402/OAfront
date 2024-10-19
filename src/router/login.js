/*
 * @Date: 2024-10-09 23:41:35
 * @Author: Poco Ray
 * @FilePath: \oafront\src\router\login.js
 * @Description: 登录页面路由导航
 */

import login from "@/views/login/login.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
];

export default routes;
