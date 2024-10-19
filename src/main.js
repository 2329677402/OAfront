/*
 * @Date: 2024-09-11 01:25:53
 * @Author: Poco Ray
 * @FilePath: \oafront\src\main.js
 * @Description: Vue3入口文件, 将组件挂载到#app
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia()); // 注册Pinia状态管理器
app.use(router); // 注册路由
app.use(ElementPlus, {
  locale: zhCn, // 设置ElementPlus的语言为中文, 更改时间选择器的语言
}); // 注册ElementPlus组件

// 注册ElementPlus所有的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
