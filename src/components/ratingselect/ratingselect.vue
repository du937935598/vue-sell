<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent($event)" class="switch" :class="{'on':onlyCountent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
  import bus from '../eventBus.js'
  // 定义3个常量
  // 正面常量
  const POSITIVE = 0
  // 负面常量
  const NEGATIVE = 1
  // 全部的常量
  const ALL = 2

  export default {
    // 定义两个传递值props，用来接受值
    props: {
      // 传进来的
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      // 选中的是哪一个
      selectType: {
        type: Number,
        // 默认值
        default: ALL
      },
      // 只显示有内容的评价的事件
      onlyCountent: {
        type: Boolean,
        default: false
      },
      // 选项卡的文字
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives () {
        // 数组方法，filter过滤
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negatives () {
        // 数组方法，filter过滤
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return
        }
        this.selectType = type
        // 通知调用页面，这个值的改变
        bus.$emit('ratingselects', type)
      },
      toggleContent (event) {
        if (!event._constructed) {
          return
        }
        this.onlyCountent = !this.onlyCountent
        // 通知调用页面，这个值的改变
        bus.$emit('contenttoggle', this.onlyCountent)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.ratingselect
	.rating-type
		paddings(18,0,18,0)
		margins(0,18,0,18)
		border-1px(rgba(7,17,27,0.2))
		fs(0)
		.block
			display inline-block
			paddings(8,17,8,17)
			bor(2)
			mr(8)
			text-align center
			fs(12)
			color rgb(77,85,93)
			lh(16)
			&.active
				color #fff
			.count
				ml(2)
				fs(8)
			&.positive
				b(rgba(0,160,220,0.2))
				&.active
					b(rgba(0,160,220,1))
			&.negative
				b(rgba(77,85,93,0.2))
				&.active
					b(rgba(77,85,93,1))
	.switch
		paddings(12,18,12,18)
		lh(24)
		border-bottom 1px solid rgba(7,17,27,0.1)
		color rgb(147,153,159)
		fs(0)
		&.on
			color rgb(10,133,180)
		.icon-check_circle
			display inline-block
			mr(4)
			fs(24)
			vertical-align top
		.text
			fs(12)
</style>
