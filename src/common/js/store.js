/**
* 解析url参数
* @example ?id=123456&a=b
* @return Object {id:12345,a:b}
 */

// 存储数据
export function saveToLocaL (id, key, value) {
  // 创建缓存名称
  let seller = window.localStorage._seller_
  // 判断是否有这个名称
  // 没有就走if，否则就走else
  if (!seller) {
    // 创建空对象名称
    seller = {}
    // 创建空id
    seller[id] = {}
    // 创建空key值
    seller[id][key] = value
  } else {
    // JSON.parse解析json字符串
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // JSON.stringify从一个对象解析出字符串
  window.localStorage._seller_ = JSON.stringify(seller)
}

// 读取数据
export function loadFromLocal (id, key, def) {
  // 读取缓存名称
  let seller = window.localStorage._seller_
  // 如果没有seller就返回空对象
  if (!seller) {
    return def
  }
  // 如果有seller，就读取seller中的id
  seller = JSON.parse(seller)[id]
  // 如果取不到值就返回默认值
  if (!seller) {
    return def
  }
  // 如果取到值就查看是否有key
  let ret = seller[key]
  // 如果有key就返回key，如果没有就返回默认值
  return ret || def
}
