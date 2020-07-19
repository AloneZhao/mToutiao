import service from "@/utils/request"

/**
 * 根据不同文章类型 ID 获取对应的文章列表
 */
function GetArticleList(params) {
  return service.request({
    method: "get",
    url: "/app/v1_1/articles",
    params
  })
}

/**
 * 获取所有频道
 */
function GetAllChannels() {
  return service.request({
    method: "get",
    url: "/app/v1_0/channels"
  })
}

/**
 * 添加用户频道
 */
function AddUserChannels(channels) {
  return service.request({
    method: "patch",
    url: "/app/v1_0/user/channels",
    data: {
      channels
    }
  })
}

/**
 * 删除用户频道
 */
function DelChannelsItem(channelId) {
  return service.request({
    method: "delete",
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

export {
  GetArticleList,
  GetAllChannels,
  AddUserChannels,
  DelChannelsItem
}
