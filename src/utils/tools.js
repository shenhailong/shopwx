/*
 * @Description: 格式化日期
 * @Version: 1.0.0
 * @Author: Dragon
 * @Date: 2020-09-04 09:31:02
 * @LastEditors: Dragon
 * @LastEditTime: 2020-10-28 14:16:39
 */
function getDate(value, date = false) {
  var now = new Date(value),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  if(date){
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' '
  }
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8);
}

export { getDate }
