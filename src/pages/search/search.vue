<!-- 搜索组件 -->

<template>
  <div class='search'>
    <div class='searchCon'>
      <div class='search-box'>
        <input type="text" class='text' placeholder='请输入关键字' ref='keyword'>
        <span class='spa' @click='getSongs'><mu-icon value="search"></mu-icon></span>
      </div>
    </div>
	
  	<!-- 搜索歌曲列表 -->
    <div class='scrollerCon'>
    	<scroller class='scroller' v-show='isShow' noDataText='加载更多' ref='scroller'
        :on-infinite="infinite">
        <div class='songList'>
            <ul>
              <li class='list' v-for='item in songList' :key='item.id' @click='savePlay(item.id)'>
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
import {search, getUrl, getSongDetail, getsongLrc} from '../../api/index.js'

export default {
  data () {
  	return {
  	  isShow: false,
      offset: 0
  	}
  },
  methods: {
    infinite (done) {
      // 判断songList是否搜索后得到的
      if (this.songList.length >= 20) {
        // 上拉加载更多
        this.offset = this.offset + 22
        this.getSearch(done, this.offset)
      }
      // 加载结束
      let finishInfinite = this.$refs.scroller.finishInfinite
      finishInfinite(true)  
    },
    getSongs () {
      // 搜索之前先清空songList
      let songList = []
      this.$store.commit('saveSongList', songList)
      this.isShow = true
      this.getSearch(null, 0)
    },
  	async getSearch (done, offset) {
  	  if (this.$refs.keyword.value) {
        // 准备一个空对象
        let data = {}
        data.keywords = this.$refs.keyword.value
        data.limit = 20
        data.offset = offset
        // 发送获取搜索歌曲请求
        let result = await search(data)
        if (result.code == 200) {
          // 准备一个空数组
          let songList = []
          // 遍历songs数组
          result.result.songs.forEach(async item => {
            let obj = {}
            obj.id = item.id
            obj.name = item.name
            let result = await getSongDetail(item.id)
            obj.picUrl = result.songs[0].al.picUrl
            obj.singer = item.artists[0].name
            songList.push(obj)
          })
          songList = this.$store.state.songList.concat(songList)
          // 把songList数组存到store中
          this.$store.commit('saveSongList', songList)
          if (done) {
            done()
          }
        } else {
          // console.log(result.message)
        }
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
  computed: {
    // 将state的songList映射到组件的computed属性
    ...mapState(['songList']),
  },
  beforeCreate () {
    // 准备一个空数组
    let songList = []
    // 进搜索页面应该把数组清空
    this.$store.commit('saveSongList', songList)
  }
}
</script>

<style lang='less' scoped>
  .search {
    .searchCon {
      height: 55px;
      .search-box {
        width: 100%;
        height: 55px;
        background-color: #d60825;
        position: fixed;
        z-index: 888;
        .text {
          width: 300px;
          height: 25px;
          margin-left: 10px;
          margin-top: 15px;
          padding-left: 5px;
        }
        .spa {
          width: 55px;
          height: 25px;
          background-color: green;
          color: white;
          text-align: center;
          position: absolute;
          top: 15px;
        }
      }
    }
    .scrollerCon {
      width: 100%;
      height: 70%;
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
  	        .songI {
  	          width: 50px;
  	          height: 50px;
  	        }
  	        .info {
  	          position: absolute;
  	          left: 65px;
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