<template>
  <div class="login-container">
    <van-nav-bar class="app-nav-bar"
                 title="注册/登录"
                 left-arrow
                 @click-left="$router.back(-1)" />

    <!-- 登录表单 -->
    <van-form :show-error="false"
              :show-error-message="false"
              @failed="onFailed"
              @submit="onSubmit"
              ref="loginForm">
      <van-field v-model="user.mobile"
                 clearable
                 icon-prefix="toutiao"
                 left-icon="shouji"
                 placeholder="请输入手机号"
                 name="mobile"
                 :rules="[{validator: mobileValidator,required: true, message: '请填写正确手机号'}]" />
      <van-field v-model="user.code"
                 clearable
                 icon-prefix="toutiao"
                 left-icon="yanzhengma"
                 placeholder="请输入验证码"
                 name="code"
                 :rules="[{ required: true,message: '请填写验证码'}]">
        <template #button>
          <van-count-down v-if="isCountDown"
                          :time="1000 * 60"
                          format="ss s"
                          @finish="isCountDown = false" />
          <van-button size="small"
                      v-else
                      class="send-btn"
                      type="primary"
                      round
                      @click.prevent="sendCode"
                      :loading="isLoading">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button type="info"
                    block
                    native-type="submit">登录</van-button>
      </div>
    </van-form>

    <!-- /登录表单 -->
  </div>
</template>

<script>
import { Login, SendCode } from '@/api/user'
export default {
  name: 'loginIndex',
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isLoading: false,
      isCountDown: false
    }
  },
  methods: {
    // 函数校验规则
    mobileValidator(val) {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/
      return reg.test(val)
    },

    // 提交表单且验证通过触发
    // vant表单内置事件 values就是所填的数据
    async onSubmit(values) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '登陆中...'
      })
      try {
        const { data } = await Login(values)
        console.log('登陆成功', data)
        this.$toast.success('登陆成功')
        this.$router.push('/my')

        // 将返回的用户登陆状态数据存到vuex中
        this.$store.commit('setUser', data)
      } catch (err) {
        if (err.response.status === 400) {
          console.log('登录失败', err)
        }
        this.$toast.fail('登陆失败')
      }
    },

    // 提交表单验证不通过时触发
    onFailed(err) {
      // 这里的err是内置回调方法的参数，主要是包括没通过验证的相关信息
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: 'top' // 防止手机键盘遮挡提示框
        })
      }
    },

    /**
     * 发送验证码
     *   ==> 发送验证码前需要验证手机号是否正确
     *      需要验证 利用表单的ref属性，来进行单一文本框的验证而不是验证整个表单
     *   由于 Form 中的任何按钮点击都会触发表单的默认提交行为，所以这里使用 .prevent 修饰符阻止默认行为
     */
    async sendCode() {
      try {
        // 验证手机号是否正确
        await this.$refs.loginForm.validate('mobile')

        // 手机号验证正确改变按钮状态
        this.isLoading = true

        // 验证手机号正确后发送验证码
        await SendCode(this.user.mobile)

        // 验证码发送成功后显示倒计时
        this.isCountDown = true
      } catch (err) {
        // try中的错误都会进入这里
        let message = ''

        // 发送短信失败的错误提示
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  .send-btn {
    width: 80px;
    height: 23px;
    .van-button__text {
      font-size: 11px;
      color: #fff;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 10px;
      }
    }
  }
}
</style>