// 1.开发环境，生产环境，是2套不同的环境
// 开发环境需要console.log使用
// 生产环境不需要console.log使用
// 让一套代码，在2个环境自动生效
// nodejs打包时执行main.js代码时，node内全局内置变量process(固定)
// console.log(process.env)
// 2.服务器根目录下，可以新建环境变量配置文件(文件名固定)
// 脚手架环境webpack内置配好的，文件名(可以修改的但是要改配置-自行百度)
// .env.development
// .env.production
// 3.环境变量文件中，定义变量名NODE_ENV(固定)，BASE_URL(固定)，自定义变量名VUE_APP_开头(规定)
// key名必须一致，写代码一套代码.key名，会自动匹配环境变量值
// 4.yarn serve启动项目，.env.development内变量挂载到process.env属性上
// yarn build打包项目，.env.production内变量挂载到process.env属性上
if (process.env.NODE_ENV === 'production') {
  console.log = function() {} // 覆盖所有打印语句
  console.warning = function() {}
  console.dir = function() {}
  console.error = function() {}
}
