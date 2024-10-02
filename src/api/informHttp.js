/*
 * @Date: 2024-10-01 20:43:05
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\informHttp.js
 * @Description: 通知管理模块接口
 */

import http from "./http";

// 发布通知表单提交
const publishInform = (data) => {
  const path = "/inform/inform";
  return http.post(path, data);
};

// 获取通知列表
const getInformList = (page = 1) => {
  const path = "/inform/inform?page=" + page;
  return http.get(path);
};

// 删除通知
const deleteInform = (pk) => {
  const path = "/inform/inform/" + pk;
  return http.delete(path);
};

// 获取通知详情
const getInformDetail = (pk) => {
  const path = "/inform/inform/" + pk;
  return http.get(path);
};

const readInform = (inform_pk) => {
  const path = "/inform/inform/read";
  return http.post(path, { inform_pk });
};

export default {
  publishInform,
  getInformList,
  deleteInform,
  getInformDetail,
  readInform,
};
