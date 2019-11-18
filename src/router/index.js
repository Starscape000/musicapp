import Vue from 'vue'
import Router from 'vue-router'

// 导入对应路由组件
import home from '../pages/home/home.vue'
import recommend from '../pages/recommend/recommend.vue'
import ranking from '../pages/ranking/ranking.vue'
import playList from '../pages/playList/playList.vue'
import playListD from '../pages/playList/components/playListD.vue'
import detail from '../pages/playList/components/detail.vue'
import search from '../pages/search/search.vue'
import login from '../pages/login/login.vue'
import register from '../pages/register/register.vue'

// 挂在路由
Vue.use(Router)

export default new Router({
  // 配置路由规则
  routes: [
  	{path: '/', redirect: '/home'},
  	{
  		path: '/home', 
  		component: home,
  		redirect: '/home/recommend',
  		children: [
  		  {
  		  	path: 'recommend',
  		  	component: recommend
  		  },
  		  {
  		  	path: 'ranking',
  		  	component: ranking
  		  },
  		  {
  		  	path: 'playList',
  		  	component: playList,
          children: [
            {
              path: '',
              component: playListD
            },
            {
              path: 'detail',
              component: detail
            }
          ]
  		  },
        {
          path: 'search',
          component: search
        }
  		]
  	},
    {path: '/login', component: login},
    {path: '/register', component: register}
  ]
})
