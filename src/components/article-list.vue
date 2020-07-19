<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading"
                      :success-text="refreshSuccessText"
                      @refresh="onRefresh">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">

        <!-- 文章列表项组件开始 -->
        <article-item v-for="(article,index) in articleList"
                      :key="index"
                      :article="article"></article-item>
        <!-- <van-cell v-for="(item,index) in articleList"
                  :key="index"
                  :title="item.title" /> -->
        <!-- 文章列表项组件结束 -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { GetArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item/index'
export default {
  name: 'ArticleList',
  data() {
    return {
      articleList: [], // 文章列表数据
      loading: false,
      finished: false,
      timestamp: null,
      isRefreshLoading: false, // 下拉刷新的 loading 状态
      refreshSuccessText: '' // 下拉刷新成功的提示文本
    }
  },
  methods: {
    // 上拉加载
    async onLoad() {
      let params = {
        channel_id: this.channel.id, // 频道 ID

        // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
        timestamp: this.timestamp || Date.now(),

        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      }
      try {
        // 1. 获取数据
        const { data } = await GetArticleList(params)

        // 2. 将数据添加到list列表中
        const { results } = data // results 对象数组
        this.articleList.push(...results)

        // 3. 设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
        this.loading = false

        // 4. 数据全部加载完成
        if (results.length) {
          // 更新获取下一页数据的页码
          this.timestamp = data.pre_timestamp
        } else {
          // 没有数据了，把加载状态设置结束，不再触发加载更多
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('加载失败')
      }
    },

    // 下拉刷新
    async onRefresh() {
      let params = {
        channel_id: this.channel.id, // 频道 ID
        timestamp: Date.now(),
        with_top: 1
      }
      try {
        const { data } = await GetArticleList(params)
        const { results } = data

        this.articleList.unshift(...results) // 将刷新的数据添加到最顶端

        this.isRefreshLoading = false // 关闭刷新的状态 loading
        this.refreshSuccessText = `更新了${results.length}条数据`
      } catch (error) {
        console.log(error)
        this.$toast.fail('刷新失败')
        this.isRefreshLoading = false
      }
    }
  },
  props: {
    channel: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>