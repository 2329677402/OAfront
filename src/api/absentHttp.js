/*
 * @Date: 2024-09-17 23:55:27
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\absentHttp.js
 * @Description: 封装与考勤相关的HTTP请求
 */
import http from "./http";

// 获取考勤类型接口
const getAbsentTypes = () => {
  const path = "/absent/type";
  return http.get(path);
};

// 获取审批人接口
const getResponder = () => {
  const path = "/absent/responder";
  return http.get(path);
};

// 员工考勤接口
const applyAbsent = (data) => {
  const path = "/absent/absent";
  return http.post(path, data);
};

// 用户考勤列表接口
const getMyAbsents = (page = 1) => {
  const path = "/absent/absent?who=my&page=" + page;
  return http.get(path);
};
export default {
  getAbsentTypes,
  getResponder,
  applyAbsent,
  getMyAbsents,
};
