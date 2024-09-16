/*
 * @Date: 2024-09-12 00:56:29
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\stores\auth.js
 * @Description: 保存user和token数据
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";

const USER_KEY = "OA_USER_KEY";
const TOKEN_KEY = "OA_TOKEN_KEY";

export const useAuthStore = defineStore("auth", () => {
  // 私有变量
  let _user = ref({});
  let _token = ref("");

  function setUserToken(user, token) {
    // 保存到对象上(内存中)
    _user.value = user;
    _token.value = token;

    // 保存到浏览器中的localStorage(硬盘中)
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearUserToken() {
    // 清空内存中的数据
    _user.value = {};
    _token.value = "";

    // 清空localStorage中的数据
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  // 计算属性
  let user = computed(() => {
    // 注意: 在js中,
    // 1. 空对象{}: 用if判断会返回true
    // 2. 空字符串"": 用if判断会返回false
    // 如果内存中_user.value不存在，就从硬盘中读取
    if (Object.keys(_user.value).length === 0) {
      let user_str = localStorage.getItem(USER_KEY);
      if (user_str) {
        _user.value = JSON.parse(user_str);
      }
    }
    return _user.value;
  });

  let token = computed(() => {
    if (!_token.value) {
      let token_str = localStorage.getItem(TOKEN_KEY);
      if (token_str) {
        _token.value = token_str;
      }
    }
    return _token.value;
  });

  // 登录状态
  let is_logined = computed(() => {
    if (Object.keys(user.value).length > 0 && token.value) {
      return true;
    }
    return false;
  });

  return { setUserToken, clearUserToken, user, token, is_logined };
});
