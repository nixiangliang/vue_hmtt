import '@/utils/console.js' // 去掉打印语句
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import 'amfe-flexible' // 引入 flexible.js 设置根标签字体大小(移动端适配)
import directiveObj from './utils/directive'
import './VueComponent.js' // vant组件注册，单独的分离成一个js文件，让main.js更清晰
import axios from 'axios'

Vue.use(directiveObj)// 执行目标对象里install方法并传入Vue类

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 下面是知识点讲解
// 1. 大数字问题
// 模拟后端返回的JSON字符串响应数据
const str = '[{"id": 1302900300041101987}, {"id": 1205340366642205763}, {"id": 7689021398237123422}]'
const arr = JSON.parse(str) // 数字
console.log(arr)
// 问题1：转成数组类型，数字发现精度丢失(后4位不准确)
// 问题2：如果把丢失精度的，文章id传给后台，后台是找不到对应文章的
// 原因1：后端的id生成算法，和前端不同，产生19位数字
// 原因2：js有效安全数字是有范围的
// Number.MAX_SAFE_INTEGER -> 最大安全数字范围 9007199254740991
// 解决：json-bigint第三方包
// 内部，把数字JSON字符串拆分，分成对象的形式/字符串形式
const jsonBig = require('json-bigint')({ storeAsString: true }) // 转换时以字符串存储，不要BigNumber对象
// webpack+nodejs环境执行main.js，所以在这里是可以用require，和import导入的东西一样
console.log(jsonBig.parse(str)) // BigNumber自定义类的对象
// const theArr = jsonBig.parse(str)
// const obj = theArr[0]
// console.log(obj.id.toString())

// 2.webpack开发服务器 -> 做代理转发
// 例如：直接请求,会报跨域错误
axios({
  // url: '/api/nc/article/headline/T1348647853363/0-40.html'
  url: 'http://c.m.163.com/nc/article/headline/T1348647853363/0-40.html'
}).then(res => {
  console.log(res)
})
// 原因：前端->后端接口跨域问题，但是后端既不支持jsonp也不开启cors，前端无法直接请求
// 解决：跨域解决方案第三种，用代理服务器
// 使用：还好webpack开发服务器，默认就支持代理转发的功能，但是需要你配置代理转发的地址
// (1)：在vue.config.js中，设置devServer服务器配置项
// (2)：axios请求，要请求本地开发服务器相对地址开头
// (3)：改完配置重启服务器

// 3.知识点 - 项目打包
// (1)：运行yarn build 打包命令，产生dist文件夹->src下跟main.js有引入关系的打包输出到dist下
// (2)：尝试用vscode中LiveServer网页运行插件(内置启动：5500网页浏览器)
// LiveServer插件会把工作区(vscode编辑器根目录当做服务器根目录)
// 问题：打开的index.html网页空白，控制台全是404错误
// 原因：打包时，webpack在index.html中引入其他的打包文件路径全是/服务器根路径请求
// 运行时，是在5500端口下运行，服务器根目录没有css和js文件夹，而是在index.html文件的隔壁（相对路径）
// 解决：让webpack打包时，引入其他文件要以./开头，而不能以/开头
// 在vue.config.js配置项目中，加入publicPath: './' 重新打包
// 打包后观察index.html中，其实./被省略了
// 最后，只需要把dist文件，发给后端/运维工程师(专门管服务器的)->上线部署

// 打包后产物介绍
// 名字对应的.vue中js和css代表，懒加载所以分散打包
// js中有.map文件：记录了你打包之前代码的行数和列数
// 原因：线上环境报错，因为运行的js压缩成了1行，报错在第一行
// 无法寻找代码打包之前的位置，无法定位代码错误行数
// .map文件作用 辅助你查找代码报错的行数和列数（灵魂地图）

// 打包后跨域问题
// 情况1：后端直接开启了cors（黑马头条就是这样）
// 开发环境，生产打包环境(以后部署)，都可以直接访问接口，无需考虑跨域问题
// 隐患：后端接口暴露了，任何人找到都可以直接请求(有风险)
// 解决：需要登录(页面登录)+token调用接口

// 情况2：后端不开启cors（网易云音乐/网易新闻/以后我公司后台接口）
// 开发环境：webpack开发服务器做，代理转发(yarn serve)
// 开发环境：nodejs+express在本地搭建一个服务器，代理转发

// 生产环境(yarn build)打包dist文件，和webpack开发服务器环境，无任何关系了，没有人给你转发了
// 解决方案1：把你自己搭建的nodejs+webpack在本地搭建的代理服务器和dist一起部署到一个云服务器上
// 前端dist -> nodejs+express服务器地址(http-server包) -> 请求真正的后台接口
// 解决方案2：dist和你公司的后台接口服务，直接放在一个云服务器上(避免跨域访问)
