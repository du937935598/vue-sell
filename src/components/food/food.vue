<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <v-cartcontrol :food="food"></v-cartcontrol>
                    </div>
                    <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                </div>
                <v-split v-show="food.info"></v-split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <v-split></v-split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <v-ratingselect :select-type="selectType" :only-countent="onlyCountent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
                    <div class="rating-wrapper">
                        <ul class="rating-main" v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings  || !food.ratings.length">暂时没有更多评论</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import {formatDate} from '../../common/js/date.js'
  import bus from '../eventBus.js'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  // 定义3个常量
  // 正向常量
  // const POSITIVE = 0
  // 负面常量
  // const NEGATIVE = 1
  // 全部的常量
  const ALL = 2
  export default {
    props: {
      food: {
        type: Object
      }
    },
    // 重复初始化，是因为他被多个页面使用
    data () {
      return {
        showFlag: false,
        // 对数据的初始化
        selectType: ALL,
        onlyCountent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    // v-on:ratingselects="ratingtypeselect1" v-on:contenttoggle="contenttoggle1"
    created () {
      // bus传递的事件，这里是为了接收
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
      show () {
        this.showFlag = true
        // 始终保持初始化
        this.selectType = ALL
        this.onlyCountent = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      // 隐藏弹出层
      hide () {
        this.showFlag = false
      },
      // 点击加入购物车
      addFirst (event) {
        // 阻止多次点击
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          // 初始化值要使用Vue.set
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 兄弟之间事件的传递，$emit传本文使用的是bus方法
        bus.$emit('cartadd', event.target)
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
    // 时间格式化
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    // 这个是header模板
    components: {
      'v-cartcontrol': cartcontrol,
      bus,
      'v-split': split,
      'v-ratingselect': ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.food
    position fixed
    left 0
    top 0
    bottom(48)
    z-index 30
    width 100%
    background #fff
    &.move-enter-active,&.move-leave-active
        transition all 1s
        opacity 1
        transform translate3d(0,0,0)
    &.move-enter,&.move-leave-active
        opacity 0
        transform translate3d(100%,0,0)
    .image-header
        position relative
        width 100%
        height 0
        padding-top 100%
        img
            position absolute
            left 0
            top 0
            width 100%
            height 100%
        .back
            position absolute
            top(10)
            left 0
            .icon-arrow_lift
                fs(20)
                display block
                paddings(10,10,10,10)
                color #fff
    .content
        paddings(18,18,18,18)
        position relative
        .title
            lh(14)
            mb(8)
            fs(14)
            font-weight 700
            color rgb(7,17,27)
        .detail
            mb(18)
            lh(10)
            fs(0)
            h(10)
            .sell-count,.rating
                fs(10)
                color rgb(147,153,159)
            .sell-count
                mr(12)
        .price
            font-weight 700
            lh(24)
            .now
                mr(8)
                fs(14)
                color rgb(240,20,20)
            .old
                text-decoration line-through
                fs(10)
                color rgb(147,153,159)
        .cartcontrol-wrapper
            position absolute
            right(12)
            bottom(12)
        .buy
            position: absolute
            right(18)
            bottom(18)
            z-index: 10
            h(24)
            lh(24)
            paddings(0,12,0,12)
            box-sizing border-box
            fs(10)
            bor(12)
            color #fff
            b(rgb(0,160,220))
    .info
        paddings(18,18,18,18)
        .title
            fs(14)
            font-weight 700
            lh(14)
            mb(6)
            color rgb(7,17,27)
        .text
            fs(12)
            lh(24)
            paddings(0,8,0,8)
            color rgb(77,85,93)
    .rating
        pt(18)
        .title
            fs(14)
            lh(14)
            ml(18)
            font-weight 700
            color rgb(7,17,27)
        .rating-wrapper
            paddings(0,18,0,18)
            .rating-main
                .rating-item
                    position relative
                    paddings(16,0,16,0)
                    border-1px(rgba(7,17,27,0.1))
                    .user
                        position absolute
                        right(0)
                        top(16)
                        lh(12)
                        fs(0)
                        .name
                            display inline-block
                            mr(6)
                            vertical-align top
                            fs(10)
                            color rgb(147,153,159)
                        .avatar
                            w(12)
                            h(12)
                            border-radius 50%
                    .time
                        mb(6)
                        fs(10)
                        lh(12)
                        color rgb(147,153,159)
                    .text
                        lh(16)
                        fs(12)
                        color rgb(7,17,27)
                        .icon-thumb_up, .icon-thumb_down
                            mr(4)
                            lh(16)
                            fs(12)
                        .icon-thumb_up
                            color rgb(0,160,220)
                        .icon-thumb_down
                            color rgb(147,153,159)
            .no-rating
                paddings(16,0,16,0)
                fs(12)
                color rgb(147,153,159)
</style>
