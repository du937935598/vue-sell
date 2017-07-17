/**
 * 时间格式化插件
 * @date  传入时间戳
 * @fmt  传入时间格式
 * @return {[type]}      [description]
 */
export function formatDate (date, fmt) {
  // 判断是否有年，有的话执行
  if (/(y+)/.test(fmt)) {
    // RegExp.$1第一对象，date.getFullYear()时间俩面的年，RegExp.$1.length年是几位数
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      // 变量，获得是几位数
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
