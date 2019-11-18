<!-- 排行榜歌单组件 -->

<template>
  <div class='ranking'>
  	<div class='scrollerCon'>
	  	<scroller class='scroller':on-refresh="refresh">
		    <div class='songList'>
		        <ul>
		          <li class='list' v-for='(item, i) in songList' :key='item.id' @click='savePlay(item.id)'>
		          	<span class='num'>{{i + 1}}</span>
		            <img class='songI' v-lazy="item.picUrl">
		            <div class='info'>
		              <p class='nameS'>{{item.name}}</p>
		              <p class='nameP'>{{item.singer}}</p>
		            </div>
		          </li>
		        </ul>
		    </div>
	    </scroller>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getRank, getUrl, getSongDetail, getsongLrc} from '../../api/index.js'

export default {
  data () {
  	return {
  		
  	}
  },
  methods: {
    refresh (done) {
      // 重新获取recommend
      this.getRank(done)
    },
    async getRank (done) {
      // 发送获取推荐歌曲请求
      let result = await getRank(15)
      if (result.code == 200) {
        // 准备一个空数组
        let songList = []
        // 遍历recommend
        result.playlist.tracks.forEach(item => {
          let obj = {}
          obj.id = item.id
          obj.name = item.name
          obj.picUrl = item.al.picUrl
          obj.singer = item.ar[0].name
          songList.push(obj)
        })
        // 把songList数组存到store中
        this.$store.commit('saveSongList', songList)
        if (done) {
          done()
        }
      } else {
        console.log(result.message)
      }
    },
  	async savePlay (id) {
      // 准备一个空对象
      let play = {}
      // 获取歌曲url
      let resultUrl = await getUrl(id)
      play.url = resultUrl.data[0].url
      // 获取歌曲详情
      let resultDet = await getSongDetail(id)
      play.name = resultDet.songs[0].name
      play.picUrl = resultDet.songs[0].al.picUrl
      play.singer = resultDet.songs[0].ar[0].name

      let resultLrc = await getsongLrc(id)

      play.lrc = resultLrc.lrc.lyric
      
      // 把play保存到store中
      this.$store.commit('savePlay', play) 
    }
  },
  created () {
    this.getRank()
  },
  computed: {
  	...mapState(['songList']),
  }
}
</script>

<style lang='less' scoped>
  .ranking {
  	.scrollerCon {
      width: 100%;
      height: 84%;
      position: absolute;
	  	.scroller {
	      height: 100%;
	      .songList {
		      width: 100%;
		      height: 100%;
		      padding: 3px;
		      margin-top: 3px;
		      .list {
		        height: 54px;
		        box-shadow: 0px 0px 2px 2px #ccc;
		        margin-bottom: 5px;
		        padding: 2px;
		        position: relative;
		        .num {
    				  position: absolute;
    				  width: 20px;
    				  height: 20px;
    				  color: white;
    				  text-align: center;
    				  line-height: 20px;
    				  left: 7px;
    				  top: 15px;
    				  border-radius: 50%;
    				  background-color: #d60825;
		        }
		        .songI {
		          width: 50px;
		          height: 50px;
		          margin-left: 35px;
		        }
		        .info {
		          position: absolute;
		          left: 100px;
		          top: 0px;
		          .nameS {
		            font-size: 18px;
		            font-weight: 550;
		            margin-bottom: 5px;
		          }
		          .nameP {
		            font-size: 12px;
		            font-weight: 550;
		          }
		        }
		      } 
		    }
	    }
	  }
  }
</style>