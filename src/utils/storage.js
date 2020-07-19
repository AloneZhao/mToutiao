/**
 * 本地存储封装
 */
function GetItem(name) {
  const data = window.localStorage.getItem(name)

  /**
   * 为什么把 JSON.parse 放到 try-catch 中？
   *  ==> 因为 data 可能不是 JSON 格式字符串
   */
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

function SetItem(name, value) {
  // 如果value 是对象 就转换JSON格式字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

function RemoveItem(name) {
  window.localStorage.removeItem(name)
}

export {
  GetItem,
  SetItem,
  RemoveItem
}
