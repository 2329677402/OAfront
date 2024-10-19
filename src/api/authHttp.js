/*
 * @Date: 2024-09-12 21:46:26
 * @Author: Poco Ray
 * @FilePath: \oafront\src\api\authHttp.js
 * @Description: 二次封装与授权相关的HTTP请求
 */
import http from "./http";

const login = (email, password) => {
  // 登录接口
  const path = "/auth/login";
  return http.post(path, { email, password });
};

const resetPwd = (old_pwd, new_pwd, confirm_pwd) => {
  // 修改密码接口
  const path = "/auth/resetpwd";
  return http.post(path, { old_pwd, new_pwd, confirm_pwd });
};

export default {
  login,
  resetPwd,
};
