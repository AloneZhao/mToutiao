<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title"
           class="title-wrap">
        <span class="title">我的频道</span>
        <span class="tip">点击进入频道</span>
      </div>
      <van-button size="mini"
                  round
                  type="danger"
                  plain
                  @click="isEdit = !isEdit"
                  color="#e5615b">
        {{isEdit ? '完成' : '编辑'}}
      </van-button>
    </van-cell>

    <!-- 个人频道列表 -->
    <van-grid :gutter="10"
              clickable>
      <van-grid-item class="channel-item"
                     v-for="(channel,index) in userChannels"
                     :key="channel.id"
                     @click="onUserChannelClick(channel,index)">
        <div slot="text"
             class="text-wrap">
          <span :class="{ active: index === activeIndex}">{{ channel.name }}</span>
          <!-- 我的频道中添加删除图标 -->
          <van-icon v-show="isEdit && channel.name !== '推荐' "
                    class="close-icon"
                    name="close" />
        </div>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title"
           class="title-wrap">
        <span class="title">频道推荐</span>
        <span class="tip">点击添加频道</span>
      </div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item class="channel-item"
                     v-for="channel in recommendChannels"
                     :key="channel.id"
                     @click="addUserChannel(channel)">
        <div slot="text"
             class="text-wrap">
          <van-icon name="plus"></van-icon>
          <span>{{ channel.name }}</span>
        </div>
      </van-grid-item>
    </van-grid>

  </div>
</template>

<script>
import { GetAllChannels, DelChannelsItem, AddUserChannels } from '@/api/article'
import { SetItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'channel-edit',
  data() {
    return {
      allChannels: [],
      isEdit: false // 控制编辑状态值 编辑 ==> 删除 非编辑 ==> 切换频道
    }
  },
  methods: {
    // 获取所有频道列表
    async getAllChannels() {
      try {
        const { data } = await GetAllChannels()
        this.allChannels = data.channels
      } catch (error) {
        console.log('error', error)
        this.$toast('获取所有类型数据失败')
      }
    },

    /**
     * 给推荐频道列表中每一项注册点击事件
     * 获取点击的频道项 将频道项添加到我的频道中
     */
    async addUserChannel(channels) {
      try {
        this.userChannels.push(channels)
        if (this.user) {
          await AddUserChannels([
            {
              id: channels.id, // 频道id
              seq: this.userChannels.length // 频道序号
            }
          ])
        } else {
          SetItem('channels', this.userChannels)
        }
      } catch (error) {
        this.$toast('频道添加失败')
      }
    },

    // 非编辑状态下切换频道
    onUserChannelClick(channel, index) {
      if (this.isEdit) {
        if (channel.name === '推荐') {
          return
        }
        if (index <= this.activeIndex) {
          this.$emit('update:active-index', this.activeIndex - 1)
        }
        this.userChannels.splice(index, 1)
        this.deleteChannel(channel)
      } else {
        // 子组件给父组件传值
        this.$emit('update:active-index', index)
        this.$emit('close-popup')
      }
    },

    // 删除频道
    async deleteChannel(channel) {
      try {
        if (this.user) {
          await DelChannelsItem(channel.id)
        } else {
          // 未登陆 将数据存到本地
          SetItem('channels', this.userChannels)
        }
      } catch (error) {
        console.log('error', error)
        this.$toast('删除频道失败,稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    /**
     * 思路: 所有频道列表(allChannels) - 个人频道(userChannels) = 推荐频道
     * 利用数组的filter ==> 根据数组的返回值决定是否收集遍历项
     * 返回值: 一个数组 所有条件为 true 的元素
     */
    recommendChannels() {
      return this.allChannels.filter(item => {
        return (
          this.userChannels.findIndex(userItem => userItem.id === item.id) ===
          -1
        )
      })
    }
  },
  props: {
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  created() {
    this.getAllChannels()
  }
}
</script>

<style lang="scss" scoped>
.text-wrap {
  font-size: 10px !important;
}
.title-wrap {
  .title {
    margin-right: 10px;
    font-size: 16px;
  }
  .tip {
    font-size: 12px;
    color: #ccc;
  }
}
.channel-edit {
  padding-top: 35px;
  .channel-item {
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 28px;
      }
    }
  }
}

.active {
  color: #e5615b;
}

.close-icon {
  position: absolute;
  font-size: 15px;
  right: -3px;
  top: -4px;
}
</style>