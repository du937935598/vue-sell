<template>
  <div class="ratings" ref="ratings">
  	<div class="ratings-content">
  		<div class="overview">
            <div class="overview-left">
                <h1 class="score">{{seller.score}}</h1>
                <div class="title">综合评分</div>
                <div class="rank">高于周围商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
                <div class="score-wrapper">
                    <span class="title">服务态度</span>
                    <v-star class="star" :size="36" :score="seller.serviceScore"></v-star>
                    <span class="score">{{seller.serviceScore}}</span>
                </div>
                <div class="score-wrapper">
                    <span class="title">商品评分</span>
                    <v-star class="star" :size="36" :score="seller.foodScore"></v-star>
                    <span class="score">{{seller.foodScore}}</span>
                </div>
                <div class="delivery-wrapper">
                    <span class="title">送达时间</span>
                    <span class="delivery">{{seller.deliveryTime}}分钟</span>
                </div>
            </div>
        </div>
        <v-split></v-split>
        <v-ratingselect :select-type="selectType" :only-countent="onlyCountent" :ratings="ratings"></v-ratingselect>
        <div class="rating-wrapper">
            <ul class="rating-ui">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
                    <div class="avatar">
                        <img :src="rating.avatar">
                    </div>
                    <div class="content">
                        <h1 class="name">{{rating.username}}</h1>
                        <div class="star-wrapper">
                            <v-star :size="24" :score="rating.score"></v-star>
                            <span class="delivery" v-show="rating.recommend || rating.recommend.length">{{rating.deliveryTime}}</span>
                        </div>
                        <p class="text">{{rating.text}}</p>
                        <div class="recommend" v-show="rating.recommend.length">
                            <span class="icon-thumb_up"></span>
                            <span class="item" v-for="item in rating.recommend">{{item}}</span>
                        </div>
                        <div class="time">{{rating.rateTime | formatDate}}</div>
                    </div>
                </li>
            </ul>
        </div>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import star from '../star/star.vue'
import bus from '../eventBus.js'
import split from '../split/split.vue'
import {formatDate} from '../../common/js/date.js'
import ratingselect from '../ratingselect/ratingselect.vue'
// 创建一个常量
const ERR_OK = 0
const ALL = 2

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: [],
      showFlag: false,
      // 对数据的跟踪
      selectType: ALL,
      onlyCountent: true
    }
  },
  // 创建获取数据
  created () {
    this.$http.get('/api/ratings').then((response) => {
      // 数据初始化
      response = response.body
      if (response.errno === ERR_OK) {
        this.ratings = response.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    })
    bus.$on('ratingselects', this.ratingtypeselect1)
    bus.$on('contenttoggle', this.contenttoggle1)
  },
  methods: {
    ratingtypeselect1: function (val) {
      this.selectType = val
      // 这里调用刷新滚动条有问题，需要使用nextTick
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    contenttoggle1: function (boolean) {
      this.onlyCountent = boolean
      // 这里调用刷新滚动条有问题，需要使用nextTick
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      // 判断onlyCountent选中为真并且有文本的
      if (this.onlyCountent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  // 模版引入注册
  components: {
    'v-star': star,
    'v-split': split,
    'v-ratingselect': ratingselect
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.ratings
    position absolute
    top(174)
    bottom 0
    width 100%
    overflow hidden
    .overview
        display flex
        paddings(18,0,18,0)
        .overview-left
            flex 0 0 unit(137/37.5,rem)
            w(137)
            paddings(6,0,6,0)
            border-right 1px solid rgba(7,17,27,0.1)
            text-align center
            .score
                mb(6)
                lh(28)
                fs(24)
                color rgb(255,153,0)
            .title
                lh(12)
                fs(12)
                color rgb(7,17,27)
                mb(8)
            .rank
                lh(20)
                fs(10)
                color rgb(147,153,159)
        .overview-right
            flex 1
            paddings(6,0,6,24)
            .score-wrapper
                mb(8)
                fs(0)
                .title
                    display inline-block
                    fs(12)
                    lh(18)
                    color rgb(7,17,27)
                .star
                    display inline-block
                    margins(0,12,0,12)
                    vertical-align top
                .score
                    display inline-block
                    fs(12)
                    lh(18)
                    vertical-align top
                    color rgb(255,153,0)
            .delivery-wrapper
                fs(0)
                .title
                    lh(18)
                    fs(12)
                    color rgb(7,17,27)
                .delivery
                    ml(12)
                    fs(12)
                    color rgb(147,153,159)
    .rating-wrapper
        paddings(0,18,0,18)
        .rating-ui
            .rating-item
                display flex
                paddings(18,0,18,0)
                border-1px(rgba(7,17,27,0.1))
                .avatar
                    flex 0 0 unit(40/37.5,rem)
                    w(28)
                    img
                        w(28)
                        h(28)
                        border-radius 50%
                .content
                    position relative
                    flex 1
                    .name
                        mb(4)
                        lh(12)
                        fs(10)
                        color rgb(7,17,27)
                    .star-wrapper
                        mb(6)
                        fs(0)
                        .star
                            display inline-block
                            mr(6)
                            fs(12)
                            vertical-align top
                        .delivery
                            display inline-block
                            vertical-align top
                            fs(12)
                            color rgb(147,153,159)
                    .text
                        lh(18)
                        fs(12)
                        mb(8)
                        color rgb(7,17,27)
                    .recommend
                        lh(16)
                        fs(0)
                        .icon-thumb_up, .item
                            display inline-block
                            margins(0,8,4,0)
                            fs(10)
                        .icon-thumb_up
                            color rgb(0,160,220)
                        .item
                            paddings(0,6,0,6)
                            border 1px solid rgba(7,17,27,0.1)
                            border-radius 1px
                            color rgb(147,153,159)
                            background #fff
                    .time
                        position absolute
                        top(0)
                        right(0)
                        lh(12)
                        fs(10)
                        color rgb(147,153,159)
</style>
