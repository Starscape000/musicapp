<!-- 歌单组件 -->

<template>
	<div class='scrollerCon'>
		<scroller class='scroller'
	      :on-refresh="refresh" :on-infinite="infinite" noDataText='没有更多数据' ref='scroller'>
		    <div class='songList'>
		        <ul class='content'>
		          <li class='list' v-for='item in playList' :key='item.id' @click='getDetail(item.id)'>
		            <img class='listImg' v-lazy="item.picUrl">
		            <div class='info'>
		              <p class='title'>{{item.name}}</p>
		              <p class='signature'>{{item.description}}</p>
		            </div>
		          </li>
		        </ul>
		    </div>
	    </scroller>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getPlayList} from '../../../api/index.js'

export default {
  data () {
  	return {
  		
  	}
  },
  methods: {
  	refresh (done) {
  	  // 把playList清空
  	  let playList = []
  	  this.$store.commit('savePlayList', playList)
      // 重新获取recommend
      this.getPlayList(done, 0)
    },
    infinite (done) {

      if (this.playList.length) {
      	
      	// 上拉加载更多
        let before = this.playList[this.playList.length - 1].updateTime

        this.getPlayList(done, before)
      }
      // 加载结束
	    let finishInfinite = this.$refs.scroller.finishInfinite
	    finishInfinite(true)    
    },
    async getPlayList (done, before) {
      // 准备一个空对象
      let data = {}
      data.limit = 20
      data.before = before
      // 发送获取推荐歌曲请求
      let result = await getPlayList(data)
      if (result.code == 200 && result.playlists.length) {
        // 准备一个空数组
        let playList = []
        // 遍历recommend
        result.playlists.forEach(item => {
          let obj = {}
          obj.id = item.id
          obj.name = item.name
          obj.updateTime = item.updateTime
          obj.picUrl = item.coverImgUrl
          obj.description = item.description
          playList.push(obj)
        })
        // 把songList数组存到store中
        this.$store.commit('savePlayList', playList)
        if (done) {
          done(true)
        }
      } else {
        // done(true)
      }
    },
    async getDetail (id) {
      // 清空detail的数据
      let detail = {}
      this.$store.commit('saveDatil', detail)
      let songList = []
      this.$store.commit('saveSongList', songList)
      // 路由跳转
      this.$router.push('/home/playList/detail?id=' + id)
    }
  },
  created () {
    // 先清空playList
    let playList = []
    this.$store.commit('savePlayList', playList)
    
  	this.getPlayList(null, 0)
  },
  computed: {
  	...mapState(['playList']),
  },
}
</script>

<style lang='less' scoped>
  .scrollerCon {
      width: 100%;
      height: 91%;
      position: absolute;
  	.scroller {
  	  height: 100%;
  	  .songList {
  	  	height: 100%;
  		  	.content {
  		  	display: flex;
  		  	flex-wrap: wrap;
  		  	justify-content: space-between;
  		  	padding: 5px;
  		  	.list {
  			  width: 49.2%;
  			  height: 180px;
  			  margin-bottom: 5px;
  			  position: relative;
  			  box-shadow: 0px 0px 5px 5px #eee;
  			  .listImg {
  				width: 100%;
  				height: 100%;
  			  }
  			  .info {
  			  	width: 100%;
  			  	height: 100%;
  			  	position: absolute;
  			  	padding: 3px;
  			  	top: 0;
  			  	z-index: 666;
  			  	.title {
  			  	  color: white;
  			  	  font-size: 16px;
  				  margin-bottom: 105px;
  				  background: rgba(0, 0, 0, .3);
  			  	}
  			  	.signature {
  			  	  color: white;
  			  	  white-space: nowrap;
  			  	  overflow: hidden;
  			  	  text-overflow: ellipsis;
  			  	  font-size: 12px;
  			  	  height: 20px;
  			  	  background: rgba(0, 0, 0, .3);
  			  	}
  			  }
  		  	}
  		  }
  	  }  
  	}
  }
</style>
