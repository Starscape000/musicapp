<!-- 首页组件 -->

<template>
  <div class='home'>
    <!-- 首页head部分 -->
    <mu-appbar style="width: 100%;" color="primary">
      <img src='../../assets/logo.png' alt='' />
      <span class='title'>音乐盒</span>
      <mu-menu slot="right">
        <mu-button flat>
          <div class='info'>
            <img class='avatar' :src="this.user.avatarUrl">
            <p class='nickname'>{{this.user.nickname}}</p>
          </div>
        </mu-button>
        <mu-list slot="content">
          <mu-list-item @click='logout' button>
            <mu-list-item-content>
              <mu-list-item-title>退出登录</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-menu>
      <!-- <i class="material-icons search">search</i> -->
    </mu-appbar>

    <!-- 首页tab部分 -->
    <div class='tab'>
      <div class='tabs'>
        <mu-tabs :value.sync="active" color="white" indicator-color="primary" full-width>
          <mu-tab to='/home/recommend' value='/home/recommend'><span>推荐</span></mu-tab>
          <mu-tab to='/home/ranking' value='/home/ranking'><span>排行榜</span></mu-tab>
          <mu-tab to='/home/playList' value='/home/playList'><span>歌单</span></mu-tab>
          <mu-tab to='/home/search' value='/home/search'><span>搜索</span></mu-tab>
        </mu-tabs>
      </div>
      <router-view></router-view>
    </div>
    
    <!-- 播放器 -->
    <aplayer></aplayer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import aplayer from '../../components/aplayer/aplayer.vue'

export default {
  data () {
    return {
      active: this.$route.path,
      user: {}
    }
  },
  methods: {
    logout () {
      // 清除所有cookie
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
      for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
      // 清除user
      localStorage.removeItem("user")
      // 回到登录界面
      this.$router.replace('/login')
    }
  },
  created () {
    // 判断用户是否登录
    if (document.cookie) {
      // 从localStorage中去user
      let user = JSON.parse(localStorage.getItem('user'))
      // 将user赋值给组件
      this.user = user
    } else {
      // 回到登录界面
      this.$router.replace('/login')
    }
  },
  components: {
    aplayer
  }
}
</script>

<style lang='less' scoped>
.home {
  .mu-appbar {
    position: fixed;
    z-index: 1000;
    img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: black;
    }
    .info {
      width: 60px;
      height: 54px;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-left: 10px;
      }
      .nickname {
        color: black;
        font-size: 8px;
      }
    }
    .search {
      color: black;
      font-size: 28px;
      position: absolute;
      right: 20px;
      top: 15px;
    }
  }
  .tab {
    padding-top: 56px;
    .tabs {
      height: 48px;
    }
    .mu-tabs {
      position: fixed;
    }
    .demo-text {
      padding: 16px;
      background: #fff;
      p {
        margin: 8px 0;
      }
    }
    span {
      color: black;
    }
  }
}
</style>
