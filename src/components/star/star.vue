<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default{
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  // 计算方法
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      // 创建空值
      let result = []
      // 计算值，转换值
      let score = Math.floor(this.score * 2) / 2
      // 判断是否为真
      let hasDecimal = score % 1 !== 0
      // 值转换
      let integer = Math.floor(score)
      // 得到整数有效
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      // 得到整数半有效
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      // 得到无效
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mimin.styl"
.star
  fs(0)
  .star-item
    display inline-block
    background-repeat no-repeat
  &.star-48
    .star-item
      w(20)
      h(20)
      mr(22)
      background-size 100% 100%
      &:last-child
        mr(0)
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
  &.star-36
    .star-item
      w(14)
      h(14)
      mr(5)
      background-size 100% 100%
      &:last-child
        mr(0)
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .star-item
      w(10)
      h(10)
      mr(4)
      background-size 100% 100%
      &:last-child
        mr(0)
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
</style>
