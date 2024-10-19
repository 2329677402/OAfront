/*
 * @Date: 2024-09-12 00:56:29
 * @Author: Poco Ray
 * @FilePath: \oafront\src\stores\auth.js
 * @Description: 保存user和token数据
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";

const USER_KEY = "OA_USER_KEY";
const TOKEN_KEY = "OA_TOKEN_KEY";

export const PermissionChoices = {
  // 权限选项, 用于可访问的模块
  All: 0b111, // 管理员权限, 7
  Staff: 0b000, // 普通员工权限, 0
  Boarder: 0b001, // 董事会权限, 1
  Leader: 0b010, // 部门leader权限, 2
};

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

  // Tips: 对于或运算 | , 如果两个对位都为0,则结果为0, 否则结果为1
  // 对于且运算 & , 如果两个对位都为1,则结果为1, 否则结果为0
  let own_permissions = computed(() => {
    let _permissions = PermissionChoices.Staff; // 默认普通员工权限 0b000

    if (is_logined.value) {
      // 判断是否是董事会成员
      if (user.value.department.name == "董事会") {
        _permissions |= PermissionChoices.Boarder; // 0b000 | 0b001 = 0b001
      }
      // 判断是否是部门leader
      if (user.value.department.leader_id == user.value.uid) {
        _permissions |= PermissionChoices.Leader;
      }
      console.log(_permissions);
      return _permissions;
    }
  });

  // 判断当前用户是否拥有某个权限
  function has_permission(permissions, opt = "|") {
    // opt[可选,默认为|]: 或运算 |, 且运算 &
    // own_permissions: 0b001
    // permissions: [0b001, 0b010]
    // map函数: 对permissions数组中的每一个元素执行一次回调函数, 返回一个新的数组
    let results = permissions.map(
      (permission) => (permission & own_permissions.value) == permission
    );
    // results: [true, false]

    if (opt == "|") {
      if (results.indexOf(true) >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (results.indexOf(false) >= 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  return {
    setUserToken,
    clearUserToken,
    user,
    token,
    is_logined,
    has_permission,
  };
});
