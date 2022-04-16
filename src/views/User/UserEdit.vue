<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.photo" @click="imageClickFn" />
          <!-- file 选择框 -->
          <!-- 视觉上隐藏，标签还在DOM树上，还可以触发功能 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="nameClickFn" />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayClickFn"/>
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-fofo v-model="inputUserName">
    </van-dialog>

    <!-- Popup 弹出层 -->
    <van-popup round v-model="dateTimePickerShow" position="bottom" :style="{ height: '50%' }">
       <!-- 时间选择器 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancelFn"
        @confirm="dateConfirmFn"
      />
    </van-popup>

  </div>
</template>

<script>
import { userProfileAPI, updateUserPhotoAPI, updateUserProfileAPI } from '@/api/index.js'
import Notify from '@/ui/Notify.js'
import { formatDate } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {}, // 用户基本资料
      show: false, // 控制姓名修改输入框出现/隐藏
      inputUserName: '', // 修改名字-弹出框输入框绑定值
      minDate: new Date(1920, 0, 1), // 最小范围
      maxDate: new Date(), // 最大范围（默认获取系统日期-今日）
      currentDate: new Date(), // 当前时间
      dateTimePickerShow: false // 日期选择器-弹出层显示/隐藏
    }
  },
  async created () {
    const res = await userProfileAPI()
    console.log(res)
    this.profileObj = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    // 文件选择改变 - 事件
    // 先选一个从无到有(input[type=file])那个标签本身
    // 再次打开不选直接取消，从有到无触发change事件
    async onFileChange (e) {
      if (e.target.files.length === 0) return // 用户可能没有选择图片文件组织代码往下执行
      console.log(e.target.files[0]) // （用户选中的文件对象）数组其实是一个特殊的对象
      // 创建FormData对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 请求体里加入一对参数名和值

      const res = await updateUserPhotoAPI(theFd)
      console.log(res)
      this.profileObj.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo) // 更新成功后，同步到vuex中
    },
    // 图片 - 点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // JS模拟标签的事件触发，为了让input[file]文件选择窗口出现
    },
    // 姓名 - 点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 姓名 - 确认框 - 关闭之前回调函数
    async beforeCloseFn (action, done) {
      // console.log(action)
      if (action === 'confirm') {
        // 证明用户点的确定按钮
        // 计算机中，对字符(文字)有多种编码方式
        // 计算机眼中只有0和1, -> 编码成一种表现形式
        // utf-8 编码成我们认识的中文字符
        // url 编码 %E4%BB%8A%E6%99%9A
        // unicode 编码 \u4eca\u665a
        // \u4e00 一
        // \u9fa5 龥 yu(4声)
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName // 更新成功 - 回显到页面上
          this.SET_USERNAME(this.inputUserName) // 更新成功后，同步到vuex中
          done() // 让弹窗关闭
        } else {
          // 没通过校验，给用户一个提示
          Notify({ type: 'warning', message: '用户名只能是1-7位中英文数字组合' })
          done(false) // 不让弹窗关闭
        }
      } else {
        // 证明用户点的取消按钮
        done() // 让弹窗关闭
      }
    },
    // 生日单元格 - 点击事件
    birthdayClickFn () {
      this.dateTimePickerShow = true // 时间选择器出现
      // 数据和页面显示 -> 年-月-日 格式的字符串
      // dateTimePicker组件 -> 日期对象
      this.currentDate = new Date(this.profileObj.birthday) // 组件显示默认生日
    },
    // 日期选择器 - 取消事件
    dateCancelFn () {
      this.dateTimePickerShow = false
    },
    // 日期选择器 - 确认事件
    async dateConfirmFn () {
      // 日期选择器组件里currentDate是日期对象，而后端要的是年-月-日字符串
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.dateTimePickerShow = false
      this.profileObj.birthday = formatDate(this.currentDate) // 单元格同步 - 日期回显
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

// 姓名修改输入框居中
// ::v-deep 等同于 /deep/
::v-deep .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
