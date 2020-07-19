<template>
  <div class="home-container">
    <!-- 头部开始 -->
    <van-nav-bar class="app-nav-bar">
      <van-button slot="title"
                  class="search-btn"
                  icon="search"
                  type="info"
                  round
                  size="small">搜索</van-button>
    </van-nav-bar>
    <!-- 头部结束 -->

    <!-- 导航开始 -->
    <van-tabs v-model="active"
              class="fixed-tabs">
      <van-tab v-for="channel in channels"
               :key="channel.id"
               :title="channel.name">

        <!-- 文章列表组件开始 -->
        <article-list :channel="channel"></article-list>
        <!-- 文章列表组件结束 -->
      </van-tab>
      <div slot="nav-right"
           class="van-tab"
           style="flex: 0 0 8%;">
        <van-icon slot="nav-right"
                  class="wap-nav"
                  name="wap-nav"
                  @click="isChannelEditShow = true" />
      </div>
    </van-tabs>
    <!-- 导航结束 -->

    <!-- 频道编辑弹窗 -->
    <van-popup v-model="isChannelEditShow"
               position="bottom"
               class="channel-edit-popup"
               closeable
               close-icon-position="top-left"
               get-container="body"
               style="height: 100%">
      <!-- 频道编辑组件 -->
      <channel-edit :user-channels="channels"
                    :active-index.sync="active"
                    @close-popup="isChannelEditShow = false" />
    </van-popup>
  </div>
</template>

<script>
import { GetUserChannels } from '@/api/user'
import ArticleList from '@/components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { GetItem } from '@/utils/storage'
export default {
  name: 'home',
  data() {
    return {
      active: 0, // 被控制激活的标签下标
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  methods: {
    async loadChannerls() {
      try {
        let channels = []
        if (this.user) {
          // 已登陆
          const { data } = await GetUserChannels()
          channels = data.channels
        } else {
          const localChannels = GetItem('channels')
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有本地频道数据 则请求获取默认推荐的频道列表
            const { data } = await GetUserChannels()
            channels = data.channels
          }
        }
        // 将数据更新到组件中
        this.channels = channels
      } catch (error) {
        console.log(error)
        this.$toast('获取数据失败')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created() {
    this.loadChannerls()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar__title {
  max-width: none;
}
.search-btn {
  width: 277px;
  height: 32px;
  background: #5babfb;
  border: none;
  .van-icon {
    font-size: 16px;
  }
}
.van-button_text {
  font-size: 14px;
}

.fixed-tabs {
  padding-top: 44px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    right: 0;
    left: 0;
    z-index: 2;
  }
  .wap-nav {
    position: fixed;
    right: 0;
    background-color: #fff;
    opacity: 0.8;
    font-size: 26px;
    line-height: 43px;
  }
}

/deep/ .van-tabs {
  .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  .van-tabs__line {
    width: 15px !important;
    background-color: #3296fa;
    bottom: 20px;
  }
}

.article-list {
  min-height: 80vh;
}
</style>