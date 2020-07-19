import axios from "axios"
import jsonBig from "json-bigint"
import store from "@/store"
import router from '@/router'

const BASE = process.env.NODE_ENV === "production" ? "" : "http://ttapi.research.itcast.cn/";

const service = axios.create({
  baseURL: BASE,
  timeout: 300000 // 设置响应时间
})

/**
 * 配置处理后端返回数据中超出js安全整数范围问题
 */
service.defaults.transformResponse = [(data) => {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return {}
  }
}]

/**
 * 在axios的拦截器中加入token刷新逻辑
 * 当用户token过期时，去向服务器请求新的 token
 * 然后继续用户当前的请求
 */

service.interceptors.request.use(
  // 请求之前做的操作
  function (config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败做的事情
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  // 响应做的事情
  function (response) {
    let {
      data
    } = response
    return data
  },
  async function (error) {
    // 响应失败
    if (error.response && error.response.status === 401) {

      // 校验是否有 refresh_token
      const user = store.state.user

      // 如果没有refresh_token 将跳到login 重新获取
      if (!user || !user.refresh_token) {
        router.push("/login")
        return
      }
    }

    // 如果有refresh_token 则重新获取新的token
    try {
      const res = await axios({
        method: "put",
        url: "app/v1_0/authorizations",
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 如果获取成功 则把新的token更新到vuex容器中
      store.commit("setUser", {
        token: res.data.token,
        refresh_token: user.refresh_token // 还是原来的 refresh_token
      })

      // 把之前失败的用户请求继续发出去
      // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
      // return 把 service 的请求结果继续返回给发请求的具体位置
      return service.request(error.config)

    } catch (err) {
      router.push("/login")
    }
    return Promise.reject(error)
  }
)

export default service
