<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />
    <div>
      <van-form @submit="onSubmit">
        <van-field v-model="user.mobile" required name="mobile" label="手机号" placeholder="请输入11位手机号" :rules="[{ required: true, message: '请填写手机号', pattern: /^1[3-9]\d{9}$/ }]" />
        <van-field v-model="user.code" required type="password" name="code" label="密码" placeholder="请输入6位密码" :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]" />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit" :loading="isLoading" :disabled="isLoading" loading-text="正在登陆ing...">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { setToken } from '@/utils/token.js'
import Notify from '@/ui/Notify.js'
import { setStorage } from '@/utils/storage.js'

export default {
  data() {
    return {
      user: {
        mobile: '13888888888', // 手机号
        code: '246810' // 验证码（密码-必须是246810后台规定死的，无论手机号是什么）
      },
      isLoading: false // 登录按钮-加载状态
    }
  },
  methods: {
    async onSubmit(values) {
      console.log('submit', values)
      console.log(this.user)

      // 状态设置为true
      this.isLoading = true

      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登陆成功啦!!!' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定要写在最后->尽量最后执行
        // location.href -> 当前浏览器地址和要跳转的地址一样（不包含#锚点信息）-> 不会刷新网页
        // 地址改变，就会导致网页刷新
        // location.href = "http://localhost:8080/a/b/c/#/layout/home"
        // this.$router.push() 压栈(会产生历史记录，可以回退)，this.$router.replace() 替换(不会产生历史记录，不能后退)
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (err) {
        // Promise内ajax抛出错误，直接进入这里
        Notify({ type: 'danger', message: '账号或密码错误' })
      }

      this.isLoading = false // 网络请求完成无论成功/报错，把状态关掉
    }
  }
}
</script>

<style scoped lang="less">
/* 此类名是van-nav-bar组件内根标签 */
// .van-nav-bar {
//   background-color: #007bff;
// }
/* 此选择器名字是 van-nav-bar 组件内标签
scoped 尝试把此选择器后属性选择器匹配当前页面标签(选不中组件内部的)
*/
// lang="less" 当前style标签内是less语法
// 用/deep/就不会被vscode标记红线
// /deep/ 会把属性选择器加到前面（用后代选择器的方式往里找匹配的类名）
// 结论：要修改组件内样式，如果你用了 scoped，就需要在选择器前/deep/即可
// /deep/ .van-nav-bar__title {
//   color: #fff;
// }
</style>
