<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
        <div class="overview">
            <h1 class="title">{{seller.name}}</h1>
            <div class="descs">
                <v-star class="star" :size="36" :score="seller.score"></v-star>
                <span class="text">({{seller.ratingCount}})</span>
                <span class="text">月售{{seller.sellCount}}单</span>
            </div>
            <ul class="remark">
                <li class="block">
                    <h2 class="name">起送价</h2>
                    <div class="content">
                        <span class="stress">{{seller.minPrice}}</span>元
                    </div>
                </li>
                <li class="block">
                    <h2 class="name">商家配送</h2>
                    <div class="content">
                        <span class="stress">{{seller.deliveryPrice}}</span>元
                    </div>
                </li>
                <li class="block">
                    <h2 class="name">平均配送时间</h2>
                    <div class="content">
                        <span class="stress">{{seller.deliveryTime}}</span>分钟
                    </div>
                </li>
            </ul>
            <div class="favorite" @click="toggleFavorite($event)">
                <span class="icon-favorite" :class="{'active':favorite}"></span>
                <span class="text">{{favoriteText}}</span>
            </div>
        </div>
        <v-split></v-split>
        <div class="bulletin">
            <h1 class="title">公告与活动</h1>
            <div class="content-wrapper">
                <p class="content">{{seller.bulletin}}</p>
            </div>
            <ul v-if="seller.supports" class="supports">
                <li class="supports-item" v-for="(item,index) in seller.supports">
                    <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                    <span class="text">{{seller.supports[index].description}}</span>
                </li>
            </ul>
        </div>
        <v-split></v-split>
        <div class="pics">
            <h1 class="title">公告与活动</h1>
            <div class="pic-wrapper" ref="picWrapper">
                <ul class="pic-list" ref="picList">
                    <li class="pic-item" v-for="pic in seller.pics">
                        <img class="pic-img" :src="pic">
                    </li>
                </ul>
            </div>
        </div>
        <v-split></v-split>
        <div class="info">
            <h1 class="title">商家信息</h1>
            <ul class="info-list">
                <li class="info-item" v-for="info in seller.infos">{{info}}</li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {saveToLocaL, loadFromLocal} from '../../common/js/store.js'
import star from '../star/star.vue'
import split from '../split/split.vue'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      // 初始化读取缓存查看是否有保存，初始化值是false
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  // 计算属性
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  // 创建数据
  created () {
    this.classMap = ['decre ase', 'discount', 'gurantee', 'invoice', 'special']
  },
  // 监听数据变化执行方法
  watch: {
    'seller' () {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    }
  },
  // mounted在这发起后端请求，拿回数据，配合路由钩子做一些事情
  // created是在请求之前就会直接创建钩子
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
      this._initPics()
    })
  },
  methods: {
    _initScroll () {
      // 判断是否有滚动条
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPics () {
      // 判断是否有图片
      if (this.seller.pics) {
        // 宽度
        let picWidth = 120
        // margin
        let margin = 6
        // 获取到总宽度
        let width = (picWidth + margin) * this.seller.pics.length - margin
        // 赋值给dom元素
        this.$refs.picList.style.width = width + 'px'
        // 然后判断是否超出，然后很想滚动
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      // 不能用localStorage
      // localStorage.favorite = this.favorite
      saveToLocaL(this.seller.id, 'favorite', this.favorite)
    }
  },
  // 模版引入注册
  components: {
    'v-star': star,
    'v-split': split
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.seller
    position absolute
    top(174)
    bottom 0
    left(0)
    width 100%
    overflow hidden
    .seller-content
        .overview
            position relative
            paddings(18,18,18,18)
            .title
                mb(8)
                lh(14)
                color rgb(7,17,27)
                fs(14)
            .descs
                pb(18)
                lh(18)
                border-1px(rgba(7,17,27,0.1))
                fs(0)
                .star
                    display inline-block
                    mr(8)
                    vertical-align bottom
                .text
                    display inline-block
                    mr(12)
                    lh(18)
                    vertical-align top
                    fs(10)
                    color rgb(77,85,93)
            .remark
                display flex
                pt(18)
                .block
                    flex 1
                    text-align center
                    border-right 1px solid rgba(7,17,27,0.1)
                    &:last-child
                        border none
                    .name
                        mb(4)
                        lh(10)
                        fs(10)
                        color rgb(147,153,159)
                    .content
                        lh(24)
                        fs(10)
                        color rgb(7,17,27)
                        .stress
                            fs(24)
            .favorite
                position absolute
                top(18)
                right(10)
                text-align center
                fs(0)
                w(50)
                .icon-favorite
                    display block
                    mb(4)
                    lh(24)
                    fs(24)
                    color #d4d6d9
                    &.active
                        color rgb(240,20,20)
                .text
                    lh(10)
                    fs(10)
                    color rgb(77,85,93)
        .bulletin
            paddings(18,18,0,18)
            .title
                mb(8)
                lh(14)
                color rgb(7,17,27)
                fs(14)
            .content-wrapper
                paddings(0,12,16,12)
                border-1px(rgba(7,17,27,0.1))
                .content
                    lh(24)
                    fs(12)
                    color rgb(240,20,20)
            .supports
                .supports-item
                    border-1px(rgba(7,17,27,0.1))
                    paddings(16,12,16,12)
                    fs(0)
                    &:last-child
                        border none
                    .icon
                        display inline-block
                        w(16)
                        h(16)
                        mr(6)
                        vertical-align top
                        background-size 100% 100%
                        background-repeat no-repeat
                        &.decrease
                            bg-image('decrease_4')
                        &.discount
                            bg-image('discount_4')
                        &.gurantee
                            bg-image('guarantee_4')
                        &.invoice
                            bg-image('invoice_4')
                        &.special
                            bg-image('special_4')
                    .text
                        display inline-block
                        fs(12)
                        lh(16)
        .pics
            paddings(18,18,18,18)
            .title
                mb(8)
                lh(14)
                color rgb(7,17,27)
                fs(14)
            .pic-wrapper
                width 100%
                overflow hidden
                white-space nowrap
                .pic-list
                    fs(0)
                    .pic-item
                        display inline-block
                        mr(6)
                        w(120)
                        h(90)
                        &:last-child
                            mr(0)
                        .pic-img
                            w(120)
                            h(90)
        .info
            paddings(18,18,0,18)
            color rgb(7,17,27)
            .title
                pb(12)
                lh(14)
                border-1px(rgba(7,17,27,0.1))
                fs(14)
            .info-list
                .info-item
                    paddings(16,12,16,12)
                    lh(16)
                    border-1px(rgba(7,17,27,0.1))
                    fs(12)
                    &:last-child
                        border none
</style>
