import Vue from 'vue'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 定义全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})
