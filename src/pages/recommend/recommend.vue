<!-- 推荐歌单组件 -->

<template>
  <div class='recommend'>
    <div class='scrollerCon'>
      <scroller class='scroller' :on-refresh="refresh">
        <div>
          <!-- 轮播图 -->
          <swiper class='swiper-container' :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide>
              <img src="../../assets/images/1.jpg">
            </swiper-slide>
            <swiper-slide>
              <img src="../../assets/images/2.jpg">
            </swiper-slide>
            <swiper-slide>
              <img src="../../assets/images/3.jpg">
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>

          <!-- 推荐title -->
          <mu-appbar color='primary' style="width: 100%;"><span class='title'>歌曲</span></mu-appbar>

          <!-- 推荐歌曲列表 -->
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
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {recommend, getUrl, getSongDetail, getsongLrc} from '../../api/index.js'

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  data () {
    return {
      swiperOption: {
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        },
        lazy: {
          loadPrevNext: true,
        },
        loop : true
      }
    }
  },
  methods: {
    refresh (done) {
      // 重新获取recommend
      this.getRecommend(done)
    },
    async getRecommend (done) {
      // 发送获取推荐歌曲请求
      let result = await recommend()
      if (result.code == 200) {
        // 准备一个空数组
        let songList = []
        // 遍历recommend
        result.recommend.forEach(item => {
          let obj = {}
          obj.id = item.privilege.id
          obj.name = item.name
          obj.picUrl = item.album.picUrl
          obj.singer = item.album.artists[0].name
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
    this.getRecommend()
  },
  computed: {
    // 将state的songList映射到组件的computed属性
    ...mapState(['songList']),
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang='less' scoped>
  .recommend {
    .scrollerCon {
      width: 100%;
      height: 84%;
      position: absolute;
      .scroller {
        height: 100%;
        .swiper-container {
          width: 100%;
          height: 170px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .mu-appbar {
          height: 40px;
          .title {
            color: black;
            font-size: 16px;
          }
        }
        .songList {
          width: 100%;
          height: 100%;
          padding: 3px;
          margin-top: 3px;
          .laoding {
            width: 100%;
            height: 100%;
          }
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

