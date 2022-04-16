import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login/index.vue'
// import Layout from '@/views/Layout/index.vue'
// import Home from '@/views/Home/index.vue'
// import User from '@/views/User/index.vue'
// import Search from '@/views/Search/index.vue'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail/index.vue'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/index.vue'
import { getToken } from '@/utils/token.js'

// 总结：
// 路由懒加载：为了让你一个页面，加载的app.js小一点，打开网页快一点
// 思路：把组件对应js，分成若干个.js，路由切换到哪个页面，才去加载对应的.js文件
// 原因：webpack分析入口时，发现router里上来就import所有页面，所以直接打包进app.js->很大
// 解决：当路由路径匹配规则时，才现去import引入对应的组件js文件
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示layout和layout下首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/index.vue'),
    // 路由独享守卫
    beforeEnter(to, from, next) {
      if (getToken()?.length > 0) {
        // next(false) // 留在原地/什么都不写
        // 想要进登录页不留在原地了，而是返回首页
        next('/layout/home')
        // 手机App里没有地址栏，你是不能破坏跳转的过程的
      } else {
        next() // 其他情况通通放行
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/index.vue'),
        meta: {
          scrollT: 0 // 保存首页离开时，滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User/index.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/index.vue')
  },
  {
    // 搜索结果页
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    // 文章详情页
    path: '/detail',
    component: () => import(/* webpackChunkName: "Detail" */ '@/views/ArticleDetail/index.vue')
  },
  {
    // 用户编辑页面
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  {
    // 聊天页面
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   // 需求：如果你已经登陆了，不要切换到登录页面
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next(false) // 留在原地/什么都不写
//     next('/layout/home')
//   } else {
//     next() // 其他情况通通放行
//   }
// })

export default router
