<!-- 歌单歌曲列表 -->

<template>
	<div class='detail'>
		<div class='head'>
			<mu-appbar class='bar' style="width: 100%;">
				<mu-icon class='icon' value='arrow_back' @click='goBack'></mu-icon>
				<span class='title'>歌单</span>
			</mu-appbar>
			<div class='show'>
				<img class='bigP' v-lazy="detail.picUrl">
				<div class='info'>
					<p class='title'>{{detail.name}}</p>
					<p class='signature'>{{detail.description}}</p>
				</div>
			</div>
			<mu-appbar class='foot' style="width: 100%;"><span class='title'>歌曲</span></mu-appbar>
		</div>

		<!-- 歌曲列表 -->
		<div class='scrollerCon'>
			<scroller class='scroller'
		      :on-refresh="refresh">
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
import {getDetail, getSongDetail, getUrl, getsongLrc} from '../../../api/index.js'

export default {
	data () {
	  return {
	  	
	  }
	},
	methods: {
	  async getDetSon () {
		// 发送获取歌单详情请求
		let id = this.$route.query.id
		let result = await getDetail(id)
		if (result.code == 200) {
		  // 准备一个空对象
		  let detail = {}
		  detail.name = result.playlist.name
		  detail.picUrl = result.playlist.coverImgUrl
		  detail.description = result.playlist.description
		  // 把detail对象存到store中
		  this.$store.commit('saveDatil', detail)

		  // 准备一个空数组
		  let songList = []
	      // 遍历recommend
	      result.privileges.forEach(async item => {
	      	let result = await getSongDetail(item.id)
	        let obj = {}
	        obj.id = result.songs[0].id
	        obj.name = result.songs[0].al.name
	        obj.picUrl = result.songs[0].al.picUrl
	        obj.singer = result.songs[0].ar[0].name
	        songList.push(obj)
	      })
	      // 把songList数组存到store中
	      this.$store.commit('saveSongList', songList)
		} else {
		  console.log(result.message)
		}
	  },
	  goBack () {
	  	// 清空playList数据
	  	let playList = []
	  	this.$store.commit('savePlayList', playList)
	  	// 返回playList页面
	  	history.back()
	  },
	  refresh (done) {
	    done()
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
  	  ...mapState(['detail', 'songList']),
    },
    created () {
      this.getDetSon()
    }
}
</script>

<style lang='less' scoped>
	.detail {
		.head {
			position: fixed;
			z-index: 999;
			width: 100%;
			.bar {
				height: 50px;
				background-color: #d60825;
				position: relative;
				.icon {
					position: absolute;
					font-size: 22px;
					top: 14px;
				}
				.title {
					font-size: 20px;
					margin-left: 40px;
				}
			}
			.show {
				background-color: white;
				position: relative;
				z-index: 999;
				.bigP {
					width: 180px;
					height: 180px;
					vertical-align: middle;
				}
				.info {
					position: absolute;
					left: 185px;
					top: 5px;
					padding: 5px;
					.title {
						font-size: 16px;
						margin-bottom: 10px;
					}
					.signature {
						height: 110px;
						font-size: 12px;
						overflow: hidden;
					}
				}
			}
			.foot {
				height: 40px;
				background-color: #d60825;
				position: relative;
				.title {
					font-size: 18px;
				}
			}
		}
		.scrollerCon {
	      width: 100%;
	      height: 51%;
	      position: absolute;
	      margin-top: 270px;
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
			          left: 60px;
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


