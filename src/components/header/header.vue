<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" alt="">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="supports-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bullentin-wrapper" @click="showDetail">
			<span class="bullentin-title"></span>
			<span class="bullentin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<p class="name">{{seller.name}}</p>
						<div class="star-wrapper">
							<v-star :size="48" :score="seller.score"></v-star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
						    <li class="supports-item" v-for="(item,index) in seller.supports">
						    	<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						    	<span class="text">{{seller.supports[index].description}}</span>
						    </li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star.vue'
export default {
  // 传递参数为Object
  props: {
    seller: {
      type: Object
    }
  },
  // 数据默认值
  data () {
    return {
      detailShow: false
    }
  },
  // 创建方法
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  // 创建数据
  created () {
    this.classMap = ['decrease', 'discount', 'gurantee', 'invoice', 'special']
  },
  // 这个是header模板
  components: {
    'v-star': star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"

.header
	color #fff
	bg-image('seller_avatar')
	background-repeat no-repeat
	background-size 100% 100%
	.content-wrapper
		pt(24)
		pr(12)
		pb(18)
		pl(24)
		b(rgba(0,0,0,0.5))
		overflow hidden
		position relative
		.avatar
			float left
			img
				w(64)
				h(64)
			display inline-block
		.content
			ml(16)
			float left
			display inline-block
			fs(14)
			.title
				mt(2)
				mr(0)
				mb(8)
				ml(0)
				.brand
					display inline-block
					vertical-align top
					w(30)
					h(18)
					bg-image('brand')
					bor(2)
					background-size 100% 100%
					background-repeat no-repeat
				.name
					ml(6)
					fs(16)
					color #fff
					lh(18)
					font-weight bold
			.description
				fs(12)
				lh(12)
				mb(10)
			.supports
				.icon
					display inline-block
					w(12)
					h(12)
					vertical-align middle
					mr(4)
					background-size 100% 100%
					background-repeat no-repeat
					&.decrease
						bg-image('decrease_1')
					&.discount
						bg-image('discount_1')
					&.gurantee
						bg-image('guarantee_1')
					&.invoice
						bg-image('invoice_1')
					&.special
						bg-image('special_1')
				.text
					fs(12)
					lh(12)
		.supports-count
			position absolute
			right(12)
			bottom(18)
			pl(8)
			pr(8)
			b(rgba(60,60,60,0.4))
			bor(14)
			fs(0)
			text-align center
			.count
				fs(10)
				lh(24)
				w(24)
				h(24)
			.icon-keyboard_arrow_right
				lh(24)
				fs(12)
				ml(2)
				vertical-align top
	.bullentin-wrapper
		position relative
		b(rgba(0,0,0,0.7))
		h(28)
		lh(28)
		pl(12)
		pr(22)
		fs(12)
		overflow hidden
		white-space nowrap
		text-overflow ellipsis
		.bullentin-title
			display inline-block
			w(22)
			h(12)
			bg-image('bulletin')
			background-size 100% auto
			background-repeat no-repeat
		.bullentin-text
			fs(12)
			ml(4)
		.icon-keyboard_arrow_right
			fs(12)
			position absolute
			right(12)
			top(8)
	.fade-enter-active
		transition all .5s
		opacity 1
	.fade-leave-active
		transition: all .5s;
		b(rgba(7,17,27,0))
	.fade-enter, .fade-leave-active
		opacity 0
		b(rgba(7,17,27,0))
	.detail
		position fixed
		z-index 100
		width 100%
		height 100%
		top 0
		left 0
		right 0
		bottom 0
		transition all .5
		b(rgba(7,17,27,0.8))
		overflow auto
		.detail-wrapper
			width 100%
			min-height 100%
			.detail-main
				mt(64)
				pb(64)
				fs(14)
				lh(20)
				.name
					lh(16)
					text-align center
					fs(16)
					font-weight 700
				.star-wrapper
					mt(18)
					paddings(12,0,12,0)
					text-align center
				.title
					width 80%
					display flex
					mt(28)
					mb(24)
					margin-left auto
					margin-right auto
					.line
						flex 1
						position relative
						top(-8)
						border-bottom 1px solid rgba(255,255,255,0.2)
					.text
						paddings(0,12,0,12)
						fs(14)
						font-weight 700
				.supports
					width 80%
					margin 0 auto
					.supports-item
						paddings(0,12,0,12)
						mb(12)
						fs(0)
						&:last
							mb(0)
						.icon
							display inline-block
							w(16)
							h(16)
							mr(6)
							vertical-align top
							background-size 100% 100%
							background-repeat no-repeat
							&.decrease
								bg-image('decrease_2')
							&.discount
								bg-image('discount_2')
							&.gurantee
								bg-image('guarantee_2')
							&.invoice
								bg-image('invoice_2')
							&.special
								bg-image('special_2')
						.text
							fs(12)
							lh(16)
				.bulletin
					width 80%
					margin 0 auto
					.content
						paddings(0,12,0,12)
						lh(24)
						fs(12)
		.detail-close
			position relative
			w(32)
			h(32)
			mt(-64)
			mb(0)
			margin-left auto
			margin-right auto
			clear both
			fs(32)
</style>
