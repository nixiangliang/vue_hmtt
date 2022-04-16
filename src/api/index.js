// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面,导入这个接口方法,就能发请求咯
// 好处: 请求url路径,可以在这里统一管理
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'

// 既引入也同时向外按需导出，所有进入过来的方法（中转）
export * from './ArticleDetail.js'

// 登录 - 登录接口
// axios内部，会把参数对象转成json字符串格式发给后台
// axios内部，会自动携带请求参数(headers)里
// Content-Type: 'application/json' 帮你添加好
export const loginAPI = ({ mobile, code }) =>
  request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })

// 用户 - 刷新token
export const getNewTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      // 请求拦截器统一携带的是token，而这次请求需要带的是refresh_token
      // 所以在axios请求拦截器里判断，就是为了这种情况准备的
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }
  })

// 用户 - 获取个人资料(编辑页面使用)
export const userProfileAPI = () =>
  request({
    url: '/v1_0/user/profile',
    method: 'GET'
  })

// 用户 - 更新头像
export const updateUserPhotoAPI = (fd) =>
  request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fd // fd外面一会儿传进来的new FormDate() 表单对象

    // 如果你的请求体直接是FormData表单对象，你也不用自己添加
    // Content-Type，axios发现数据请求体是表单对象，它也不会转换成json字符串
    // 也不会携带Content-Type：application/json，而是交给浏览器，浏览器发现请求体是FormData会自己携带Content-Type

    // Content-Type：application/json；axios携带的，前提：data请求体是对象 -> json字符串 -> 发给后台
    // Content-Type：multipart/form-data；浏览器携带的，前提：data请求体必须FormData类型对象
  })

// 用户 - 更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  // 判断，有值才带参数名给后台，无值参数名不携带
  // 写法1：解构赋值，4个判断，往空对象上添加有值的加上去
  // 写法2：外面想传几对key+value，就直接传入交给后台
  // 写法3：上面写法不够语义化，我看不出obj里有什么
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }

  for (const prop in obj) {
    // 遍历参数对象里每个key
    if (dataObj[prop] === undefined) {
      // 用key去外面传入的参数对象匹配，如果没有找到(证明外面没传这个参数)
      delete obj[prop] // 从obj身上移除这对属性和值
    } else {
      obj[prop] = dataObj[prop] // 如果使用了，就从外面对象取出对应key值，保存到obj上
    }
  }

  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH', // PATCH 局部更新 -> PUT 全都更新
    data: obj
    // { // data不会忽略值为null的那对key+value，params遇到null值会忽略不携带次对参数和值给后台
    //   name, // 昵称
    //   gender, // 性别0：男，1：女
    //   birthday, // 生日(要求格式：年-月-日 字符串)
    //   intro // 个人介绍
    // }
  })
}

// 用户 - 获取基本信息(我的页面显示数据)
export const getUserInfoAPI = () =>
  request({
    url: '/v1_0/user',
    method: 'GET'
  })

// 频道 - 获取所有频道
export const getAllChannelsAPI = () =>
  request({
    url: '/v1_0/channels',
    method: 'GET'
  })

// 频道 - 获取用户选择的频道
// 注意：用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () =>
  request({
    url: '/v1_0/user/channels'
  })

// 频道 - 更新覆盖频道
export const updateChannelsAPI = ({ channels }) =>
  request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels // 用户已选整个频道数组
    }
  })

// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) =>
  request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
  })

// 文章 - 获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) =>
  request({
    url: '/v1_0/articles',
    method: 'GET',
    params: {
      // 这里的参数，axios会帮你拼接在url？后面（查询字符串）
      channel_id,
      timestamp
    }
  })

// 文章 - 反馈 - 不感兴趣
export const dislikeArticleAPI = ({ artId }) =>
  request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: artId
    }
  })

// 文章 - 反馈 - 反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) =>
  request({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: artId,
      type: type,
      remark: '如果你想写，你可以逻辑页面判断下，如果点击类型是0，再给一个弹出框输入框输入其他问题，传参到这里'
    }
  })

// 搜索 - 联想菜单列表
export const suggestListAPI = ({ keywords }) =>
  request({
    url: '/v1_0/suggestion',
    params: {
      q: keywords
    }
  })

// 搜索 - 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) =>
  request({
    url: '/v1_0/search',
    method: 'GET',
    params: {
      page,
      per_page,
      q
    }
  })
