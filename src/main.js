// 项目入口文件

import Vue from 'vue'
import App from './App'
import router from './router'
import Toast from 'muse-ui-toast'
import Vuex from 'vuex'

import '../static/css/reset.css'
import './assets/css/material-icons.css'
import 'muse-ui-message/dist/muse-ui-message.css'

import store from './store/index.js'

// 按需导入muse-ui组件
import 'muse-ui/lib/styles/base.less'
import {
  AppBar,
  Tabs,
  TextField,
  Form,
  Button,
  Checkbox,
  Dialog,
  Snackbar,
  Icon,
  Menu,
  List,
  Progress,
  Helpers
}
from 'muse-ui'
import 'muse-ui/lib/styles/theme.less'

import 'muse-ui-loading/dist/muse-ui-loading.css'
import Loading from 'muse-ui-loading'

import Message from 'muse-ui-message'

import VueScroller from 'vue-scroller'

import VueLazyload from 'vue-lazyload'

// 更改muse-ui主题色
import theme from 'muse-ui/lib/theme'
theme.add('teal', {
  primary: '#d60825',
}, 'light');

theme.use('teal')

Vue.use(AppBar)
Vue.use(Tabs)
Vue.use(Form)
Vue.use(TextField)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Dialog)
Vue.use(Message)
Vue.use(Toast)
Vue.use(Snackbar)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(List)
Vue.use(Helpers)
Vue.use(Progress)
Vue.use(Loading)
Vue.use(VueScroller)
Vue.use(VueLazyload, {
    loading: require("./assets/images/loading.jpg")
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
