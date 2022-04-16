<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
      >
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @disLikeEV="disLikeFn"
          @reportEV="reportFn"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api/index.js'
import Notify from '@/ui/Notify.js'

// 问题1：网页刚打开，created里请求和onLoad里请求同时发送，请求的都是最新的数据
// onLoad中，2次一样的数据合并，数据重复，key重复了
// 原因：van-list组件，组件挂载时，默认就会判定一次是否触底
// 第一页数据也是网络请求回来的，标签先挂载了，数据回来更新DOM，所以标签没有高度，list的load事件上来就触发
// 解决方案1：list组件添加 :immediate-check="false" 上来初始化时不要判定
// 解决方案2：onLoad第一行，写数组长度的判断
export default {
  props: {
    // list: Array // 文章列表数组
    channelId: Number // 频道ID
  },
  data () {
    return {
      list: [], // 文章列表数组
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 用于分页
      isLoading: false // 顶部加载状态
    }
  },
  components: {
    ArticleItem
  },
  created () {
    this.getArticleListFn()
  },
  methods: {
    // 专门负责发送请求
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId, // 先默认请求推荐频道数据
        timestamp: this.theTime
      })
      console.log(res)
      // created()上来第一次list是空数组，合并数组没问题
      // onLoad()触底加载更多，2个数组合并更没问题
      this.list = [...this.list, ...res.data.data.results]
      // pre_timestamp
      // 下一段开头的那篇文章时间戳
      // 第一次 系统时间(timestamp) -> 后台 返回0-9条数据 -> 携带第10条pre_timestamp值返回
      // 第二次（timestamp）- 上一次pre_timestamp（代表告诉后，从指定的时间戳再往后找10个）10-19条，20条pre_timestamp返回
      // ......
      this.theTime = res.data.data.pre_timestamp

      // created()上来走一次，loading没触底本身就是false，但是我给false也没问题
      // 为了一会儿onLoad()调用时，才有用
      this.loading = false // 如果不关闭，底部一直是加载中状态，下次触底不会再触发onLoad
      if (res.data.data.pre_timestamp === null) { // 本次回来的数据是最后的，没有下一段数据了
        this.finished = true
      }

      // 顶部加载状态改为false
      this.isLoading = false
    },
    // 底部加载的事件方法
    onLoad () {
      // immediate-check：内部不要进行判断而已，监听滚动事件的代码还在
      // 第一个频道滚动到底部，再切换第二个频道的时候(新建-内容没有那么高)，滚动会从底部滚动回到顶部
      // 这个时候发生了滚动,所以滚动事件还是触发了,immediate-check判断无效

      if (this.list.length === 0) {
        this.loading = false // 第一次上面还是判定触底(触发onLoad方法时loading自动改true)
        // 如果不改回来，下次触底就不再执行onLoad方法
        return // 如果页面没有数据，没有高度，让本次onLoad逻辑代码不往下执行
      }
      this.getArticleListFn()
    },
    // 顶部-刷新数据事件方法
    onRefresh () {
      // 目标：list数组清空，来一份新的数据
      this.list = []
      this.theTime = new Date().getTime()

      this.getArticleListFn()
    },
    // 反馈-不感兴趣
    async disLikeFn (id) {
      // 如果用try+catch自己处理错误，内部throw就不会向控制台抛出打印错误，而是交给你的catch
      // 内来自定义错误处理
      // try+catch捕获同步代码的异常
      try {
        await dislikeArticleAPI({
          artId: id
        })
        // res里没有什么有用的信息，所以await往下放行，
        // 就证明请求和响应成功的，反馈成功
        Notify({ type: 'success', message: '反馈成功' })
        console.log('成功了')
      } catch (err) {
        console.log('失败了')
      }
    },
    // 反馈-垃圾内容
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    },
    // 文章单元格-点击事件
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style></style>
