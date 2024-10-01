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

export default {
  publishInform,
};
