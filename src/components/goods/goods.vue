<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuwrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
					<span class="text">
						<span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodswrapper">
			<ul>
				<li v-for="(item,index) in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" class="food-item">
							<div class="icon">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cartcontrol :food="food"></v-cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<v-shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
		<v-food :food="selectedFood" ref="food"></v-food>
	</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart.vue'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import food from '../food/food.vue'

// 创建一个常量
const ERR_OK = 0

export default {
  // 传递参数为Object
  props: {
    seller: {
      type: Object
    }
  },
  // 创建默认值，初始化
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  // 计算属性
  // 获取区间值的值，或者不等于最后一个值
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  // 获取数据,创建数据
  // 获取数据
  // $nextTick
  created () {
    this.classMap = ['decrease', 'discount', 'gurantee', 'invoice', 'special']
    this.$http.get('/api/goods').then(response => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  // 定义方法
  // 点击方法，点击跳楼事件
  methods: {
    selectMenu (index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook')
      let ref = foodList[index]
      this.foodsScroll.scrollToElement(ref, 300)
      console.log(index)
    },
    // 传递详情页面
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      console.log(food)
      this.selectedFood = food
      // 获取到dom元素，调用其方法
      this.$refs.food.show()
    },
    // 这是下拉方法
    _initScroll () {
      this.meunScroll = new BScroll(this.$refs.menuwrapper, {
        click: true
      })
      // 传递插件BScroll里面的值probeType
      this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
        click: true,
        probeType: 3
      })
      // 这是获取这个值传出来的y的值
      // Math.round因为是小数需要转换一下Math.round
      // 同时需要转换为正值Math.abs,因为Y轴下滚为负值
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 这是计算高度值得方法
    _calculateHeight () {
      let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  // 这个是header模板
  components: {
    'v-shopcart': shopcart,
    'v-cartcontrol': cartcontrol,
    'v-food': food
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.goods
	display flex
	position absolute
	top(178)
	bottom(46)
	width 100%
	overflow hidden
	.menu-wrapper
		flex 0 0 unit(80/37.5,rem)
		w(80)
		background #f3f5f7
		.menu-item
			display table
			h(74)
			w(56)
			lh(14)
			paddings(0,12,0,12)
			&.current
				background #fff
				mt(-1)
				font-weight 700
				.text
					border none
			.icon
				display inline-block
				w(16)
				h(16)
				mr(4)
				vertical-align top
				background-size 100% 100%
				background-repeat no-repeat
				&.decrease
					bg-image('decrease_3')
				&.discount
					bg-image('discount_3')
				&.gurantee
					bg-image('guarantee_3')
				&.invoice
					bg-image('invoice_3')
				&.special
					bg-image('special_3')
			.text
				display table-cell
				w(56)
				vertical-align middle
				border-1px(rgba(7,27,37,.1))
				fs(12)
				lh(18)
	.foods-wrapper
		flex 1
		fs(0)
		.title
			pl(14)
			h(26)
			lh(26)
			border-left 2px solid #d9dde1
			fs(12)
			color rgb(147,153,159)
			b(#f3f5f7)
		.food-item
			display flex
			margins(18,18,18,18)
			border-1px(rgba(7,17,27,.1))
			&:last-child
				border none
				mb(0)
			.icon
				w(57)
				h(57)
				flex 0 0 unit(57/37.5,rem)
				mr(10)
				img
					width 100%
					height 100%
			.content
				flex 1
				.name
					margins(2,0,8,0)
					fs(14)
					h(14)
					lh(14)
					color rgb(7,17,27)
				.desc, .extra
					fs(12)
					lh(12)
					color rgb(147,153,159)
				.desc
					mb(10)
					lh(12)
				.extra
					.count
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
					position: absolute
					right 0
					bottom(0)
</style>
