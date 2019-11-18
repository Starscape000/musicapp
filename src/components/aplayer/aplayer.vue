<!-- 播放器组件 -->

<template>
  <div>
    <aplayer ref='aplayer' :lrcType="1" :showlrc='true' @loadeddata='handlePlay' :music="{
      title: play? play.name:'',
      author: play? play.singer:'',
      url: play? play.url:'',
      pic: play? play.picUrl:'',
      lrc: play? play.lrc:''
    }">
    </aplayer>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import {mapState} from 'vuex'

export default {
  methods: {
    handlePlay () {
      // 获取播放器的控制方法
      let aplayer = this.$refs.aplayer
      // 播放歌曲
      aplayer.play()
    }
  },
  computed: {
    ...mapState(['play', 'songList'])
  },
  components: {
    Aplayer
  }
}
</script>

<style lang='less' scoped>
  .aplayer {
    width: 100%;
    height: 90px;
    margin: 0;
    position: fixed;
    bottom: 0;
    z-index: 888;
  }
</style>