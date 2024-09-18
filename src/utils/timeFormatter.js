/*
 * @Date: 2024-09-19 00:30:21
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\utils\timeFormatter.js
 * @Description: 时间格式化工具, 用于将Date对象转换成更友好的时间格式
 */

// 只包含日期, 不包含时间, 格式为"YYYY-MM-DD"
const stringFromDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

// 包含日期和时间, 格式为"YYYY-MM-DD HH:mm:ss"
const stringFromDateTime = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedDate;
};

export default {
  stringFromDate: stringFromDate,
  stringFromDateTime,
};
