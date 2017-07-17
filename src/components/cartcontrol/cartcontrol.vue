<template>
	<div class="cartcontrol">
    <transition name="fade">
  		<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
      </div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>

<script type="text/ecmascript-6">
  // 给一个没有值的赋一个值，需要使用import Vue from 'vue'===> Vue.set(this.food,'count',1)
  import Vue from 'vue'
  import bus from '../eventBus.js'
  export default {
    // 接收属性
    props: {
      food: {
        type: Object
      }
    },
    created () {
      // console.log(this.food)
    },
    methods: {
      addCart (event) {
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
      decreaseCart (event) {
        // 阻止多次点击
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    },
    // 这个是header模板
    components: {
      bus
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.cartcontrol
  fs(0)
  .fade-enter-active
    transition all .5s
    opacity 1
  .fade-leave-active
    transition: all .5s;
    b(rgba(7,17,27,0))
  .fade-enter, .fade-leave-active
    opacity 0
    b(rgba(7,17,27,0))  
	.cart-decrease,.cart-add
		display inline-block
		paddings(6,6,6,6)
		fs(24)
		lh(24)
		color rgb(0,166,220)
	.cart-count
		display inline-block
		vertical-align top
		w(12)
		pt(6)
		lh(24)
		text-align center
		fs(10)
		color rgb(147,153,159)
	.cart-add
		display inline-block
</style>
