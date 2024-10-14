/*
 * @Author: Poco Ray
 * @Date: 2024-09-11 01:25:53
 * @FilePath: \OAfront\vite.config.js
 * @Description:
 */
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import { createHtmlPlugin } from "vite-plugin-html";
import { defineConfig, loadEnv } from "vite";

// 用于获取Vite中的环境变量
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      VueDevTools(),
      VueSetupExtend(),
      // 标签页title配置
      createHtmlPlugin({
        inject: {
          data: {
            title: getViteEnv(mode, "VITE_APP_TITLE"),
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};
