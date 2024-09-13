/*
 * @Date: 2024-09-12 21:35:16
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\api\http.js
 * @Description: 封装axios, 方便批量处理HTTP请求
 */
import axios from "axios";

class Http {
  //constructor: 构造函数, 使用类初始对象的时候自动执行
  constructor() {
    this.instance = axios.create({
      // 通过.env文件配置, 由命令自动决定开发环境和生产环境的baseURL,
      // 如果运行npm run dev, baseURL为开发环境的地址
      // 如果运行npm run build, baseURL为生产环境的地址
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 6000,
    });
  }

  post(path, data) {
    /*     path: /auth/login
    url: http://localhost:8000/auth/login
    data: { email: 'xxx', password: 'xxx' }
    return this.instance.post(path, data); */

    // 为了方便调试, 这里返回一个Promise对象
    return new Promise(async (resolve, reject) => {
      // await: 等待异步操作(发送网络请求 -> 线程挂起等待 -> 接收网络数据)完成, 然后再执行后面的代码
      // 注意: 如果在某个函数中使用await, 那么这个函数必须定义为async函数
      // 注意: axios底层也是用的Promise对象, 在响应状态码不是2xx时, 会自动reject, 抛出异常, 这里需要使用try-catch捕获异常
      try {
        let result = await this.instance.post(path, data);
        resolve(result.data);
      } catch (err) {
        let detail = err.response.data.detail;
        reject(detail);
      }
    });
  }

  get(path, params) {
    return this.instance.get(path, { params });
  }
}

export default new Http();
