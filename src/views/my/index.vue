<template>
  <div class="my-container">
    <van-cell-group v-if="user"
                    class="my-info">

      <van-cell class="base-info"
                center
                :border="false">
        <van-image class="avatar"
                   slot="icon"
                   round
                   fit="cover"
                   src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="name"
             slot="title">{{this.currentUser.name}}</div>
        <van-button class="update-btn"
                    size="small"
                    round>编辑资料</van-button>
      </van-cell>

      <van-grid class="data-info"
                :border="false">
        <van-grid-item class="data-info-item">
          <div slot="text"
               class="text-wrap">
            <div class="count">{{this.currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text"
               class="text-wrap">
            <div class="count">{{this.currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text"
               class="text-wrap">
            <div class="count">{{this.currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap"
               slot="text">
            <div class="count">{{this.currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else
         class="not-login">
      <div @click="$router.push('/login')">
        <img class="mobile"
             src="/imgs/phone.png">
      </div>
      <div class="text">点击登陆</div>
    </div>

    <van-grid class="nav-grid mb-4"
              :column-num="2">
      <van-grid-item class="nav-grid-item"
                     icon-prefix="toutiao"
                     icon="shoucang"
                     text="收藏" />
      <van-grid-item class="nav-grid-item"
                     icon-prefix="toutiao"
                     icon="lishi"
                     text="历史" />
    </van-grid>

    <van-cell title="消息通知"
              v-if="user"
              is-link
              to="/" />
    <van-cell class="mb-4"
              title="小智同学"
              is-link
              to="/" />
    <van-cell class="logout-cell"
              v-if="user"
              title="退出登录"
              @click="backLogin" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GetUserInfo } from '@/api/user'
export default {
  name: 'my',
  data() {
    return {
      currentUser: {} // 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登陆
    backLogin() {
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出吗？'
        })
        .then(() => {
          // 确定退出 从 vuex 中将user的值 赋值为空
          this.$store.commit('setUser', null)
          this.$router.push('/login')
        })
        .catch(() => {
          console.log('取消退出登陆')
        })
    },

    async getUserInfo() {
      let { data } = await GetUserInfo()
      this.currentUser = data
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.my-container {
  .my-info {
    background: url('/imgs/banner.png') no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 30px;
        font-size: 10px;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url('/imgs/banner.png') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>