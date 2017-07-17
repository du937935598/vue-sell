<template>
  <div class="">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- click.stop.prevent点击阻止冒泡 -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-for="(ball,index) in balls" :key="ball.id">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-headder">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listcontent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="mask">
      <div class="list-mask" v-show="listShow" @click="hidemask"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../eventBus.js'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import BScroll from 'better-scroll'
  export default {
    // 数据接收
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        // 小球飞的效果
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 赋值空数组
        dropBalls: [],
        fold: true
      }
    },
    //  计算值
    computed: {
      // 总价
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      // 总数
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      // 付钱文案
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      // 付钱样式
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      // 折叠的列表
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return
        }
        let show = !this.fold
        if (show) {
          // 如果显示就执行接下来方法($nextTick)
          // 判断是否滚动条
          // 如果是就舒心滚动条，否者就无关
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listcontent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      drop (el) {
        for (let i = 0, l = this.balls.length; i < l; i++) {
          // 得到第i个
          let ball = this.balls[i]
          // 第i个没显示，就变为显示，并且附一个监听事件
          // 然后push到ball上面
          if (!ball.show) {
            ball.show = true
            ball.el = el
            // 向dropBalls,push当前的状态
            this.dropBalls.push(ball)
            return
          }
        }
      },
      // 点击清单的显示隐藏
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      // 动画开始
      beforeEnter (el) {
        // 数组长度
        let count = this.balls.length
        // 一直执行，执行到0
        while (count--) {
          // 一次执行，重balls.length到0
          let ball = this.balls[count]
          if (ball.show) {
            // 获取到当前元素
            let rect = ball.el.getBoundingClientRect()
            // css样式当前元素向左偏移
            let x = rect.left - 32
            // css样式当前元素向下偏移
            let y = -(window.innerHeight - rect.top - 22)
            // 默认样式
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.querySelector('.inner-hook')
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter (el) {
        el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.querySelector('.inner-hook')
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      // 弹出列表点击背景隐藏弹出层
      hidemask () {
        this.fold = true
      },
      // 清空点击事件
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        // bus.$emit('paymoney', event.target)
        console.log(`支付${this.totalPrice}元`)
        window.alert(`支付${this.totalPrice}元`)
      }
    },
    // 兄弟之间传值，此处用bus.js当作桥梁传递了一个cartadd的方法过来
    // 然后传递的是点击事件
    // 然后将传递的时间赋予一个方法，以便此模块调用使用
    created () {
      bus.$on('cartadd', this.drop)
    },
    // 这个是header模板注册
    components: {
      'v-cartcontrol': cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.shopcart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  h(48)
  b(#000)
  .content
    display flex
    b(#141d27)
    fs(0)
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        position relative
        top(-10)
        margins(0,12,0,12)
        paddings(6,6,6,6)
        w(56)
        h(56)
        box-sizing border-box
        border-radius 50%
        b(#141d27)
        .logo
          width 100%
          height 100%
          border-radius 50%
          text-align center
          b(#2b343c)
          &.highlight
            b(rgb(0,160,220))
          .icon-shopping_cart
            fs(24)
            color #80858a
            lh(44)
            &.highlight
              color #fff
        .num
          position absolute
          top 0
          right 0
          w(24)
          h(16)
          fs(9)
          font-weight 700
          lh(16)
          color #fff
          text-align center
          b(rgb(240,20,20))
          border-radius unit(16/37.5,rem)
          box-shadow 0 unit(4/37.5,rem) unit(8/37.5,rem) 0 rgba(0,0,0,.4)
      .price
        display inline-block
        vertical-align top
        mt(12)
        lh(24)
        pr(12)
        fs(16)
        font-weight 700
        box-sizing border-box
        color rgba(255,255,255,0.4)
        border-right 1px solid rgba(255,255,255,0.1)
        &.highlight
          color #fff
      .desc
        display inline-block
        vertical-align top
        lh(24)
        ml(12)
        color rgba(255,255,255,0.4)
        margins(12,0,0,12)
        fs(10)
    .content-right
      flex 0 0 unit(105/37.5,rem)
      w(105)
      .pay
        fs(12)
        h(48)
        lh(48)
        font-weight 700
        text-align center
        color rgba(255,255,255,0.4)
        &.not-enough
          b(#2b333b)
        &.enough
          b(#00b43c)
          color #fff
  .ball-container
    b(rgba(7,17,27,0))
    .ball
      position fixed
      left(32)
      bottom(22)
      z-index 200
      &.drop-enter,&.drop-enter-active
        transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          w(16)
          h(16)
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
  .shopcart-list
    position absolute
    left 0
    top 0
    fs(0)
    z-index -1
    width 100%
    transform translate3d(0,-100%,0)
    &.fold-enter-active, &.fold-leave-active
      transition all 0.5s
    &.fold-enter,&.fold-leave-active
      transform translate3d(0,0,0)
    .list-headder
      h(40)
      lh(40)
      paddings(0,18,0,18)
      background #f3f5f7
      border-bottom 1px solid rgba(7,17,27,0.1)
      .title
        float left
        fs(14)
        color rgb(7,17,27)
      .empty
        float right
        fs(12)
        color rgb(0,160,220)
    .list-content
      paddings(0,18,0,18)
      max-height unit(217/37.5,rem)
      overflow hidden
      background #fff
      .food
        position relative
        paddings(12,0,12,0)
        box-sizing border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          fs(14)
          lh(24)
          color rgb(7,17,27)
        .price
          fs(12)
          position absolute
          right(90)
          bottom(12)
          lh(24)
          fs(14)
          font-weight 700
          color rgb(240,20,20)
        .cartcontrol-wrapper
          fs(12)
          position absolute
          right(0)
          bottom(6)
.mask-enter-active
  transition all .5s
  opacity 1
.mask-leave-active
  transition: all .5s
  b(rgba(7,17,27,0.6))
.mask-enter, .mask-leave-active
  opacity 0
  b(rgba(7,17,27,0))
.list-mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 40
  b(rgba(7,17,27,0.8))
  background-filter blur(10px)
</style>
