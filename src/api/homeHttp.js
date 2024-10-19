/*
 * @Date: 2024-10-08 23:30:08
 * @Author: Poco Ray
 * @FilePath: \oafront\src\api\homeHttp.js
 * @Description: 首页相关的API
 */
import http from "./http";

const getDepartmentStaffCount = () => {
  // 员工数量统计
  const path = "/home/department/staff/count";
  return http.get(path);
};

const getLatestInforms = () => {
  // 最新通知
  const path = "/home/latest/inform";
  return http.get(path);
};

const getLatestAbsents = () => {
  // 最新请假
  const path = "/home/latest/absent";
  return http.get(path);
};

export default {
  getDepartmentStaffCount,
  getLatestInforms,
  getLatestAbsents,
};
