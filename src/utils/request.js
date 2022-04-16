// 基于 axios 封装网络请求
import theAxios from 'axios'
import router from '@/router/index.js'
// import { Notify } from 'vant'
import { getToken, removeToken } from '@/utils/token.js'
// import { getNewTokenAPI } from '@/api/index.js'

const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net', // 根地址
  timeout: 20000 // 20秒超时事件(请求20秒无响应直接判定超时)
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 目标：统一携带token
    // 判断本地有token再携带，判断具体api/index.js里如果没有携带Authorization，我再添加上去
    // 未定义叫undefined，null具体的值你得赋予才叫空
    // ?. 可选链操作符，如果前面对象里没有length，整个表达式原地返回undefined
    // 如果getToken()在原地有值token字符串，才能调用length获取长度
    if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
// 本质：就是一个函数
axios.interceptors.response.use(
  function (response) {
    // http响应状态码为2xx，3xx就进入这里
    // 对响应数据做点什么
    return response
  },
  async function (error) {
    // http响应状态码为4xx，5xx报错进入这里
    // 对响应错误做点什么
    console.dir(error)
    // console.log(this) // undefined
    // 只有401才代表身份过期，才需要跳转登录页
    if (error.response.status === 401) {
      // 不能使用this.$router（因为this不是vue组件对象无法调用$router）
      // 解决：this.$router为了拿到router路由对象，所以直接去上面引入@/router下router对象
      // Notify({ type: 'warning', message: '身份已过期' })

      removeToken() // 先清除token，才能让路由守卫判断失效，放行我去登录页
      // 方式1：强制跳转到登录页，用户有感知
      // router.currentRoute 相当于 在vue文件内this.$route -> 当前路由对象信息
      // fullPath，路由对象里完整路由路径#后面的一切
      router.replace(`/login?path=${router.currentRoute.fullPath}`)
    }

    // 方式2：使用refresh_token换回新的token再继续使用，JS代码实现，用户无感知(效果好)
    //   const res = await getNewTokenAPI()

    //   // 新的token回来之后，我们要做什么
    //   // 1.更新token在本地
    //   setToken(res.data.data.token)
    //   // 2.更新新的token在请求头里
    //   error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    //   // 3.未完成这次请求，再一次发起
    //   // error.config就是上一次请求的配置对象
    //   // 结果我们要return回原本逻辑页面调用地方-还是return回去一个Promise对象
    //   return axios(error.config)
    // } else if (error.response.status === 500 && error.config.url ===
    // '/v1_0/authorizations' && error.config.method === 'put') {
    //   // 刷新的refresh_token也过期了
    //   localStorage.clear() // 清除了localStorage里所有值
    //   Notify({ type: 'warning', message: '身份已过期' })
    //   router.replace('/login')
    // }
    return Promise.reject(error)
  }
)
// 目标：token讲解
// 1. 手动修改localStorage里geek那个token改错(模拟过期)
// 2. 点击反馈/其他需要表明身份的接口
// 3. 反馈不感兴趣，这次请求返回状态为 401，进入错误响应拦截器

// 代码解决401问题
// 方式1：清除token，强制跳转回登录页面，有感知重新登录，拿到新的token替换到本地
// 需要重新点击反馈按钮，再次反馈 -> 感觉特别不好
// 方式2：刷新token，使用登录时保存的refresh_token，调用另外一个接口，换回来
// 新的token值，替换到本地，再次完成本次未完成的请求 -> 用户无感知体验好
// 1. 登录页面，localStorage.setItem('refresh_token'，存入refresh_token)
// 2. 401中，注释掉跳转login的代码，引入刷新token的api方法调用
// 3. 替换保存到本地新的token
// 4. error错误对象里headers替换成新的token
// 5. axios再次发起这次未完成请求，返回Promise对象到最开始发请求的逻辑页面

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })

  // return new Promise((resolve, reject) => {
  //   // 判断如果params有值,需要自己写js代码,把params对象里key和value拼接到url上
  //   $.ajax({
  //     url,
  //     data,
  //     headers,
  //     type: method,
  //     success: (res) => {
  //       resolve(res)
  //     },
  //     error: (err) => {
  //       reject(err)
  //     }
  //   })
  // })
}

// 但是上面有局限性
// 导出的axios方法在使用时
// 我在逻辑页面调用时,传入的这5个配置名字
/*
  axios({
    url: '请求地址',
    method: '请求方式',
    params: {},
    data: {},
    headers: {}
  })
*/

// 问题来了,万一将来我要更新request.js里封装网络请求的工具
// 把axios换成jquery的$.ajax
// import $ from 'jquery'
// export default $.ajax
/*
  $.ajax({
    url: '请求地址',
    type: '请求方式',
    data: {}, // 没有 params
    headers: {}
  })
*/
