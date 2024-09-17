/*
 * @Date: 2024-09-17 23:55:27
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\absentHttp.js
 * @Description: 封装与考勤相关的HTTP请求
 */
import http from "./http";

const getAbsentTypes = () => {
  const path = "/absent/type";
  return http.get(path);
};

const getResponder = () => {
  const path = "/absent/responder";
  return http.get(path);
};

export default {
  getAbsentTypes,
  getResponder,
};
