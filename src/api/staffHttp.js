/*
 * @Date: 2024-09-29 01:17:16
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\staffHttp.js
 * @Description: 员工部门相关接口
 */

import http from "./http";

const getAllDepartment = () => {
  // 获取所有部门
  const path = "/staff/departments";
  return http.get(path);
};

export default {
  getAllDepartment,
};
