/*
 * @Date: 2024-09-12 21:46:26
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\authHttp.js
 * @Description: 二次封装与授权相关的HTTP请求
 */
import http from "./http";

const login = (email, password) => {
  // 登录接口
  const path = "/auth/login";
  return http.post(path, { email, password });
};

export default {
  login,
};
