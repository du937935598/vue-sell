/**
* 解析url参数
* @example ?id=123456&a=b
* @return Object {id:12345,a:b}
 */
export function urlParse () {
  // ?id=123456&a=b
  let url = window.location.search
  // 赋值为空对象
  let obj = {}
  // 正则匹配
  let reg = /[?&][^?&]+=[^?&]+/g
  // 匹配
  let arr = url.match(reg)
  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
