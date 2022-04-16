import Vue from 'vue'
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell,
  List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage,
  Divider, Tag, CellGroup, Dialog, DatetimePicker, Loading, Lazyload
} from 'vant'

Vue.use(Lazyload, {
  preLoad: 0.8, // 屏幕高度的范围百分比0-1，预加载范围
  error: 'https://img2.baidu.com/it/u=3881557087,3108449835&fm=253&fmt=auto&app=138&f=JPEG?w=548&h=500' // 懒加载图片失败，使用错误提示图片
})
Vue.use(Loading)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(CellGroup)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
