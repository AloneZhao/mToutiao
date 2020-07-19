import service from "@/utils/request"

/**
 * 登陆
 */
function Login(data) {
  return service.request({
    method: "post",
    url: "/app/v1_0/authorizations",
    data
  })
}

/**
 * 验证码
 */
function SendCode(mobile) {
  return service.request({
    method: "get",
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户信息
 */
function GetUserInfo() {
  return service.request({
    method: "get",
    url: "/app/v1_0/user"
  })
}

/**
 * 获取频道列表
 */
function GetUserChannels() {
  return service.request({
    method: "get",
    url: "/app/v1_0/user/channels"
  })
}


export {
  Login,
  SendCode,
  GetUserInfo,
  GetUserChannels
}
